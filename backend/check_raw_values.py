import os
import cv2
import numpy as np
import mediapipe as mp
from PIL import Image

# 画像フォルダのパス (ここを自分の環境に合わせて確認)
DIRS = [
    "./photo/output_16types_man",
    "./photo/output_16types_woman"
]

# MediaPipe設定
mp_face_mesh = mp.solutions.face_mesh

def _calc_dist(p1, p2, w, h):
    return np.sqrt(((p1.x - p2.x) * w)**2 + ((p1.y - p2.y) * h)**2)

def _dist_point_to_line(p_pt, p_start, p_end, w, h):
    px, py = p_pt.x * w, p_pt.y * h
    sx, sy = p_start.x * w, p_start.y * h
    ex, ey = p_end.x * w, p_end.y * h
    line_len = np.sqrt((ex - sx)**2 + (ey - sy)**2)
    if line_len == 0: return 0
    cross_prod = abs((ex - sx)*(sy - py) - (sx - px)*(ey - sy))
    return cross_prod / line_len

def get_raw_values(pil_image):
    # OpenCV変換
    img_np = np.array(pil_image)
    if img_np.shape[-1] == 4:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2RGB)
    
    # RGB変換
    if len(img_np.shape) == 2:
        img_rgb = cv2.cvtColor(img_np, cv2.COLOR_GRAY2RGB)
        img_bgr = img_rgb
    else:
        img_rgb = img_np
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    h, w, _ = img_rgb.shape

    with mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5
    ) as face_mesh:
        
        mp_results = face_mesh.process(img_rgb)
        if not mp_results.multi_face_landmarks:
            return None

        lm = mp_results.multi_face_landmarks[0].landmark

        # --- 生データの計算 (正規化なし) ---
        
        # 1. Contrast (Edge Magnitude)
        cx_min, cx_max = int(lm[234].x * w), int(lm[454].x * w)
        cy_min, cy_max = int(lm[10].y * h), int(lm[152].y * h)
        cx_min, cx_max = max(0, cx_min), min(w, cx_max)
        cy_min, cy_max = max(0, cy_min), min(h, cy_max)
        
        contrast_val = 0
        if cx_max > cx_min and cy_max > cy_min:
            face_roi = img_bgr[cy_min:cy_max, cx_min:cx_max]
            gray_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
            sobel_x = cv2.Sobel(gray_roi, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray_roi, cv2.CV_64F, 0, 1, ksize=3)
            contrast_val = np.mean(np.sqrt(sobel_x**2 + sobel_y**2))

        # 2. Warmth (Smile + Eye Slant)
        mouth_corner_avg_y = (lm[61].y + lm[291].y) / 2
        mouth_center_y = lm[0].y
        smile_val = (mouth_center_y - mouth_corner_avg_y) * h 
        eye_slant = (lm[33].y - lm[133].y) + (lm[263].y - lm[362].y) 
        eye_slant_val = eye_slant * h
        warmth_val = (smile_val * 0.8) + (eye_slant_val * 0.5)

        # 3. Face Length (Ratio)
        face_h = _calc_dist(lm[10], lm[152], w, h)
        face_w = _calc_dist(lm[234], lm[454], w, h)
        face_len_val = face_h / face_w if face_w > 0 else 0

        # 4. Eye Size (Ratio)
        left_eye_h = _calc_dist(lm[159], lm[145], w, h)
        right_eye_h = _calc_dist(lm[386], lm[374], w, h)
        avg_eye_h = (left_eye_h + right_eye_h) / 2
        eye_size_val = avg_eye_h / face_h if face_h > 0 else 0

        # 5. Jaw Roundness (Ratio)
        jaw_w = _calc_dist(lm[132], lm[361], w, h)
        chin_w = _calc_dist(lm[172], lm[397], w, h)
        jaw_val = chin_w / jaw_w if jaw_w > 0 else 0

        # 6. Brow Curve (Ratio)
        brow_h_left = _dist_point_to_line(lm[105], lm[46], lm[70], w, h)
        brow_h_right = _dist_point_to_line(lm[334], lm[276], lm[300], w, h)
        avg_brow_h = (brow_h_left + brow_h_right) / 2
        brow_val = avg_brow_h / face_h if face_h > 0 else 0

        return {
            "contrast_level": contrast_val,
            "warmth": warmth_val,
            "face_length": face_len_val,
            "eye_size": eye_size_val,
            "jaw_roundness": jaw_val,
            "brow_curve": brow_val
        }

def analyze_all():
    stats = {k: [] for k in ["contrast_level", "warmth", "face_length", "eye_size", "jaw_roundness", "brow_curve"]}
    
    count = 0
    for d in DIRS:
        if not os.path.exists(d): continue
        files = [f for f in os.listdir(d) if f.lower().endswith(('jpg', 'png', 'jpeg'))]
        
        for f in files:
            path = os.path.join(d, f)
            try:
                img = Image.open(path)
                res = get_raw_values(img)
                if res:
                    for k, v in res.items():
                        stats[k].append(v)
                    count += 1
            except Exception as e:
                pass
    
    print(f"Total processed: {count} images\n")
    print("=== RECOMMENDED THRESHOLDS ===")
    print("(Copy these values to main.py)\n")
    
    for k, v_list in stats.items():
        if not v_list: continue
        v_min = min(v_list)
        v_max = max(v_list)
        v_mean = sum(v_list) / len(v_list)
        
        # 余裕を持たせるためのパディング
        padding = (v_max - v_min) * 0.1
        rec_min = v_min - padding
        rec_max = v_max + padding
        
        print(f"Key: {k}")
        print(f"  Raw Range: {v_min:.4f} ~ {v_max:.4f} (Mean: {v_mean:.4f})")
        print(f"  Recommend: min={rec_min:.4f}, max={rec_max:.4f}")
        print("-" * 30)

if __name__ == "__main__":
    analyze_all()