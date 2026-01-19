import mediapipe as mp
import os
import io
import json
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Literal, Tuple, Optional
import sentry_sdk # 追加
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from PIL import Image
from supabase import create_client, Client
import httpx
from logger_config import setup_logger

# 設定・型定義

logger = setup_logger()

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"), # 環境変数から読み込む設定にする
    environment=os.getenv("SENTRY_ENVIRONMENT", "production"),
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

app = FastAPI(title="Face Type API")

Gender = Literal["man", "woman"]

NUMERIC_KEYS = [
    "eye_size",
    "face_length",
    "jaw_roundness",
    "brow_curve",
    "contrast_level",
    "warmth",
]

# "local" or "supabase"
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")

# local 保存用
MEDIA_ROOT = Path(os.getenv("MEDIA_ROOT", "media")).absolute()
MEDIA_BASE_URL = os.getenv("MEDIA_BASE_URL", "http://localhost:8000/media")

# Supabase 設定（Storage + DB 共通）
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET_NAME = os.getenv("SUPABASE_BUCKET_NAME", "face-uploads")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# 詳細ページ用のフロントエンド URL
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")

# ======================================
# Supabase クライアント
# ======================================

supabase_client: Optional[Client] = None

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
elif STORAGE_BACKEND == "supabase":
    raise RuntimeError(
        "STORAGE_BACKEND=supabase なのに SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です"
    )

# ======================================
# MediaPipe 解析
# ======================================

class FaceAnalyzer:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.static_image_mode = True
        self.max_num_faces = 1
        self.min_detection_confidence = 0.5

    def _calc_dist(self, p1, p2, w, h):
        """2点間のユークリッド距離"""
        x1, y1 = p1.x * w, p1.y * h
        x2, y2 = p2.x * w, p2.y * h
        return np.sqrt((x1 - x2)**2 + (y1 - y2)**2)

    def _normalize(self, value, min_v, max_v):
        """値を0.0〜1.0に正規化してクリップ"""
        return float(np.clip((value - min_v) / (max_v - min_v), 0.0, 1.0))

    def _dist_point_to_line(self, p_pt, p_start, p_end, w, h):
        """点から直線への距離"""
        px, py = p_pt.x * w, p_pt.y * h
        sx, sy = p_start.x * w, p_start.y * h
        ex, ey = p_end.x * w, p_end.y * h
        
        line_len = np.sqrt((ex - sx)**2 + (ey - sy)**2)
        if line_len == 0: return 0
        cross_prod = abs((ex - sx)*(sy - py) - (sx - px)*(ey - sy))
        return cross_prod / line_len

    def analyze(self, pil_image: Image.Image) -> Tuple[bool, Dict[str, float]]:
        """PIL画像を受け取り、0.0-1.0のパラメータ辞書を返す"""
        
        # PIL -> OpenCV (BGR) 変換
        img_np = np.array(pil_image)
        if img_np.shape[-1] == 4:
            img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2RGB)
        
        if len(img_np.shape) == 2:
            img_rgb = cv2.cvtColor(img_np, cv2.COLOR_GRAY2RGB)
            img_bgr = img_rgb
        else:
            img_rgb = img_np
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        h, w, _ = img_rgb.shape

        # デフォルト値
        result = {k: 0.5 for k in NUMERIC_KEYS}

        with self.mp_face_mesh.FaceMesh(
            static_image_mode=self.static_image_mode,
            max_num_faces=self.max_num_faces,
            refine_landmarks=True,
            min_detection_confidence=self.min_detection_confidence
        ) as face_mesh:
            
            mp_results = face_mesh.process(img_rgb)

            if not mp_results.multi_face_landmarks:
                logger.warning("Face not detected in the provided image.") 
                return False, result

            lm = mp_results.multi_face_landmarks[0].landmark

            # 1. Contrast Level
            cx_min, cx_max = int(lm[234].x * w), int(lm[454].x * w)
            cy_min, cy_max = int(lm[10].y * h), int(lm[152].y * h)
            cx_min, cx_max = max(0, cx_min), min(w, cx_max)
            cy_min, cy_max = max(0, cy_min), min(h, cy_max)

            if cx_max > cx_min and cy_max > cy_min:
                face_roi = img_bgr[cy_min:cy_max, cx_min:cx_max]
                gray_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                sobel_x = cv2.Sobel(gray_roi, cv2.CV_64F, 1, 0, ksize=3)
                sobel_y = cv2.Sobel(gray_roi, cv2.CV_64F, 0, 1, ksize=3)
                edge_magnitude = np.mean(np.sqrt(sobel_x**2 + sobel_y**2))
                result["contrast_level"] = self._normalize(edge_magnitude, 22.8109, 59.5370)

            # 2. Warmth
            mouth_corner_avg_y = (lm[61].y + lm[291].y) / 2
            mouth_center_y = lm[0].y
            smile_val = (mouth_center_y - mouth_corner_avg_y) * h 
            eye_slant = (lm[33].y - lm[133].y) + (lm[263].y - lm[362].y) 
            eye_slant_val = eye_slant * h
            warmth_score = (smile_val * 0.8) + (eye_slant_val * 0.5)
            result["warmth"] = self._normalize(warmth_score, -30.2837, -3.1193)

            # 3. Face Length
            face_h = self._calc_dist(lm[10], lm[152], w, h)
            face_w = self._calc_dist(lm[234], lm[454], w, h)
            if face_w > 0:
                aspect_ratio = face_h / face_w
                result["face_length"] = self._normalize(aspect_ratio, 1.1100, 1.5309)

            # 4. Eye Size
            left_eye_h = self._calc_dist(lm[159], lm[145], w, h)
            right_eye_h = self._calc_dist(lm[386], lm[374], w, h)
            avg_eye_h = (left_eye_h + right_eye_h) / 2
            eye_ratio = avg_eye_h / face_h if face_h > 0 else 0
            result["eye_size"] = self._normalize(eye_ratio, 0.0406, 0.0775)

            # 5. Jaw Roundness
            jaw_w = self._calc_dist(lm[132], lm[361], w, h)
            chin_w = self._calc_dist(lm[172], lm[397], w, h)
            if jaw_w > 0:
                jaw_ratio = chin_w / jaw_w
                result["jaw_roundness"] = self._normalize(jaw_ratio, 0.8077, 0.8590)

            # 6. Brow Curve
            brow_h_left = self._dist_point_to_line(lm[105], lm[46], lm[70], w, h)
            brow_h_right = self._dist_point_to_line(lm[334], lm[276], lm[300], w, h)
            avg_brow_h = (brow_h_left + brow_h_right) / 2
            brow_ratio = avg_brow_h / face_h if face_h > 0 else 0
            result["brow_curve"] = self._normalize(brow_ratio, 0.0571, 0.1138)

            return True, result

# MediaPipe解析器のインスタンス化
analyzer = FaceAnalyzer()


# ======================================
# 学習済みデータ (JSON) のロード
# ======================================

def load_face_params(json_path: str, fallback_path: str) -> Dict[str, Dict]:
    """学習済みJSONがあればロード、なければ元JSONをロード"""
    target_path = json_path if os.path.exists(json_path) else fallback_path
    
    if os.path.exists(target_path):
        try:
            with open(target_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                logger.info(f"Loaded face params from: {target_path}")
                return data
        except Exception as e:
            logger.error(f"Failed to load {target_path}: {e}")
            return {}
    else:
        logger.warning(f"No face param files found for {json_path}")
        return {}

FACE_TYPE_META_MAN = load_face_params(
    "trained_params_man.json", 
    "./photo/output_16types_man/face_type_params.json"
)

FACE_TYPE_META_WOMAN = load_face_params(
    "trained_params_woman.json",
    "./photo/output_16types_woman/face_type_params.json"
)


# ======================================
# 分類ロジック
# ======================================

def classify_face(numeric_params: Dict[str, float], gender: Gender) -> str:
    """
    入力パラメータと基準データのユークリッド距離を計算し、
    最も近いタイプコードを返す
    """
    input_vec = np.array([numeric_params[k] for k in NUMERIC_KEYS], dtype=float)

    # 性別で参照データを切り替え
    if gender == "man":
        meta_map = FACE_TYPE_META_MAN
    else:
        meta_map = FACE_TYPE_META_WOMAN

    if not meta_map:
        return "UNKNOWN"

    best_code: Optional[str] = None
    best_dist: float = float('inf')

    for code, meta in meta_map.items():
        # JSON内の基準値ベクトル
        target_vec = np.array(
            [meta["numeric_params"][k] for k in NUMERIC_KEYS],
            dtype=float,
        )
        
        # 距離計算 (小さいほど似ている)
        dist = np.linalg.norm(input_vec - target_vec)
        
        if dist < best_dist:
            best_dist = dist
            best_code = code

    return best_code or "UNKNOWN"


# ======================================
# Supabase Auth: JWT からユーザー取得
# ======================================

class AuthedUser(BaseModel):
    id: str
    email: Optional[str] = None


async def fetch_user_from_token(access_token: str) -> AuthedUser:
    if not SUPABASE_URL:
        raise HTTPException(status_code=500, detail="SUPABASE_URL が設定されていません。")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "apikey": SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY or "",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{SUPABASE_URL.rstrip('/')}/auth/v1/user", headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="トークンが無効です。")

    data = resp.json()
    return AuthedUser(id=data["id"], email=data.get("email"))


async def get_current_user(authorization: str = Header(None)) -> AuthedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="認証が必要です。")
    token = authorization.split(" ", 1)[1].strip()
    return await fetch_user_from_token(token)


async def get_current_user_optional(authorization: str = Header(None)) -> Optional[AuthedUser]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    try:
        return await fetch_user_from_token(token)
    except HTTPException:
        return None


# ======================================
# FastAPI アプリ
# ======================================

app = FastAPI(title="Face Type API (MediaPipe Local)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if STORAGE_BACKEND == "local":
    MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
    app.mount("/media", StaticFiles(directory=str(MEDIA_ROOT), html=False), name="media")


# ======================================
# ストレージ保存ロジック
# ======================================

def save_file_local(content: bytes, original_filename: str, content_type: Optional[str] = None) -> Tuple[str, str]:
    from uuid import uuid4
    today = datetime.utcnow()
    subdir = Path(str(today.year), f"{today.month:02d}", f"{today.day:02d}")
    dir_path = MEDIA_ROOT / subdir
    dir_path.mkdir(parents=True, exist_ok=True)

    suffix = Path(original_filename).suffix or ".jpg"
    filename = f"{uuid4().hex}{suffix}"
    full_path = dir_path / filename
    full_path.write_bytes(content)

    relative_path = subdir / filename
    url = f"{MEDIA_BASE_URL}/{relative_path.as_posix()}"
    return str(full_path), url

def save_file_supabase(content: bytes, original_filename: str, content_type: Optional[str] = None) -> Tuple[str, str]:
    from uuid import uuid4
    if supabase_client is None:
        raise RuntimeError("Supabase クライアントが初期化されていません")

    today = datetime.utcnow()
    suffix = Path(original_filename).suffix or ".jpg"
    filename = f"{uuid4().hex}{suffix}"
    path_in_bucket = f"uploads/{today.year}/{today.month:02d}/{today.day:02d}/{filename}"

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    file_options = {"cache-control": "3600", "upsert": "false"}
    if content_type:
        file_options["content-type"] = content_type

    try:
        supabase_client.storage.from_(SUPABASE_BUCKET_NAME).upload(
            path_in_bucket, tmp_path, file_options=file_options,
        )
    except Exception as e:
        raise RuntimeError(f"Supabase Storage Upload Error: {e}")
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass

    public_url = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{SUPABASE_BUCKET_NAME}/{path_in_bucket}"
    return path_in_bucket, public_url

def save_upload_file(content: bytes, original_filename: str, content_type: Optional[str] = None) -> Tuple[str, str]:
    if STORAGE_BACKEND == "supabase":
        return save_file_supabase(content, original_filename, content_type)
    else:
        return save_file_local(content, original_filename, content_type)


# ======================================
# DB ヘルパー
# ======================================

class FaceTypeExample(BaseModel):
    name: str
    note: Optional[str] = None

def insert_face_result_to_db(gender: Gender, type_code: str, file_url: str, numeric_params: Dict[str, float], user_id: Optional[str] = None) -> Optional[int]:
    if supabase_client is None: return None
    row = {
        "gender": gender,
        "type_code": type_code,
        "file_url": file_url,
        "numeric_params": numeric_params,
    }
    if user_id: row["user_id"] = user_id

    try:
        resp = supabase_client.table("face_results").insert(row).execute()
        data = getattr(resp, "data", None) or []
        if data: return data[0].get("id")
    except Exception as e:
        logger.error(f"[DB] insert error: {e}")
    return None

def get_examples_for_type(gender: Gender, type_code: str, limit: int = 2) -> List[FaceTypeExample]:
    import random
    if supabase_client is None: return []
    try:
        resp = supabase_client.table("face_type_examples").select("name, note").eq("gender", gender).eq("type_code", type_code).execute()
        rows = getattr(resp, "data", None) or []
        if not rows: return []
        selected = rows if len(rows) <= limit else random.sample(rows, limit)
        return [FaceTypeExample(**r) for r in selected]
    except Exception as e:
        logger.error(f"[examples] query error: {e}")
        return []


# ======================================
# エンドポイント
# ======================================

class FaceTypeResponse(BaseModel):
    type_code: str
    numeric_params: Dict[str, float]
    fileUrl: str
    examples: List[FaceTypeExample]
    resultId: Optional[int] = None
    detailUrl: Optional[str] = None
    is_face_detected: bool

@app.post("/predict", response_model=FaceTypeResponse)
async def predict(
    gender: Gender = Form(...),
    file: UploadFile = File(...),
    current_user: Optional[AuthedUser] = Depends(get_current_user_optional),
):
    logger.info(f"Prediction request received. Gender: {gender}")

    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルをアップロードしてください。")

    try:
        raw = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="ファイルの読み込みに失敗しました。")
    
    if not raw:
        raise HTTPException(status_code=400, detail="空のファイルです。")

    # 画像処理 (MediaPipeがRGBを必要とするためRGB変換)
    try:
        image = await run_in_threadpool(lambda: Image.open(io.BytesIO(raw)).convert("RGB"))
    except Exception:
        raise HTTPException(status_code=400, detail="画像の解析に失敗しました。")

    # ファイル保存
    _, file_url = await run_in_threadpool(
        lambda: save_upload_file(raw, file.filename or "upload.jpg", file.content_type)
    )

    # 1. MediaPipeで特徴量抽出
    is_detected, numeric_params = await run_in_threadpool(lambda: analyzer.analyze(image))
    logger.debug(f"Numeric Params: {numeric_params}")

    # 2. Nearest Neighbor で分類
    type_code = classify_face(numeric_params, gender=gender)
    logger.debug(f"Classified type_code: {type_code}")

    # 3. DB保存
    result_id = await run_in_threadpool(
        lambda: insert_face_result_to_db(
            gender=gender,
            type_code=type_code,
            file_url=file_url,
            numeric_params=numeric_params,
            user_id=current_user.id if current_user else None,
        )
    )

    detail_url = f"{FRONTEND_BASE_URL.rstrip('/')}/results?id={result_id}" if result_id else None

    # 4. 有名人例取得
    examples = await run_in_threadpool(
        lambda: get_examples_for_type(gender=gender, type_code=type_code, limit=1)
    )

    return FaceTypeResponse(
        type_code=type_code,
        numeric_params=numeric_params,
        fileUrl=file_url,
        examples=examples,
        resultId=result_id,
        detailUrl=detail_url,
        is_face_detected=is_detected
    )

class FaceResultListItem(BaseModel):
    id: int
    created_at: datetime
    gender: Gender
    type_code: str
    fileUrl: str

class FaceResultListResponse(BaseModel):
    results: List[FaceResultListItem]

@app.get("/my/results", response_model=FaceResultListResponse)
async def list_my_results(
    current_user: AuthedUser = Depends(get_current_user),
    limit: int = 20,
):
    if supabase_client is None:
        raise HTTPException(status_code=500, detail="Supabase クライアントが未設定です。")

    try:
        resp = (
            supabase_client.table("face_results")
            .select("id, created_at, gender, type_code, file_url")
            .eq("user_id", current_user.id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
    except Exception as e:
        logger.error(f"[DB] list_my_results error: {e}")
        raise HTTPException(status_code=500, detail="診断履歴の取得に失敗しました。")

    rows = getattr(resp, "data", None) or []
    items = [
        FaceResultListItem(
            id=row["id"],
            created_at=datetime.fromisoformat(row["created_at"].replace("Z", "+00:00")),
            gender=row["gender"],
            type_code=row["type_code"],
            fileUrl=row["file_url"],
        )
        for row in rows
    ]
    return FaceResultListResponse(results=items)