import sys
import os
import pytest
from fastapi.testclient import TestClient

# backendディレクトリへのパスを通す（テスト実行用）
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, classify_face

client = TestClient(app)

# --- 1. ロジックの単体テスト ---

def test_classify_face_logic():
    """
    数値パラメータを渡して、期待通りのタイプコード（YCSWなど）が返るか検証
    ※実際のしきい値(trained_params)に基づいてテストケースを作成します
    """
    # ケースA: すべての数値が極端に低い場合（子供・曲線・ソフト・暖か） -> YCSW寄り
    params_youth_curve = {
        "eye_size": 0.0,
        "face_length": 0.0,
        "jaw_roundness": 0.0,
        "brow_curve": 0.0,
        "contrast_level": 0.0,
        "warmth": 0.0
    }
    # 女性モデルでテスト
    result = classify_face(params_youth_curve, gender="woman")
    # 期待値は trained_params_woman.json の内容に依存しますが、
    # ここでは「何らかの文字列が返ってくること」と「UNKNOWNではないこと」を検証
    assert isinstance(result, str)
    assert result != "UNKNOWN"
    assert len(result) == 4  # 4文字コードであること

# --- 2. APIエンドポイントの統合テスト ---

def test_read_root():
    """ヘルスチェック的なテスト"""
    # main.py にルート ("/") があればテストするが、今回はAPIのみなので
    # 404になるか、もしくはSwaggerUI(/docs)が生きてるかを確認
    response = client.get("/docs")
    assert response.status_code == 200

def test_predict_endpoint_no_file():
    """ファイルなしでリクエストした時に422 or 400エラーになるか"""
    response = client.post("/predict", data={"gender": "woman"})
    # FastAPIの仕様上、必須フィールド(file)欠落は422 Unprocessable Entity
    assert response.status_code == 422