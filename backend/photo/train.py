import os
import json
import numpy as np
from PIL import Image
from main import analyzer, NUMERIC_KEYS

# ==========================================
# 設定: フォルダとJSONのパス
# ==========================================
CONFIG = [
    {
        "gender": "man",
        "image_dir": "./output_16types_man",
        "base_json": "./output_16types_man/face_type_params.json",
        "output_json": "trained_params_man.json",
        "json_type": "type_key"  # 男性のjsonファイルのキーが "YCSW" などの形式
    },
    {
        "gender": "woman",
        "image_dir": "./output_16types_woman",
        "base_json": "./output_16types_woman/face_type_params.json",
        "output_json": "trained_params_woman.json",
        "json_type": "img_key"   # 女性のjsonファイルのキーが "img_001" などの形式
    }
]

def get_type_code_from_axes(axes):  # axesオブジェクトからタイプコードを生成
    return f"{axes['age']}{axes['line']}{axes['contrast']}{axes['vibe']}"

def train_gender_data(config):
    gender = config["gender"]
    img_dir = config["image_dir"]
    base_json_path = config["base_json"]
    output_path = config["output_json"]
    json_type = config.get("json_type", "type_key")

    print(f"\n=== Training for {gender.upper()} ===")

    if not os.path.exists(base_json_path):
        print(f"Error: {base_json_path} が見つかりません。")
        return

    with open(base_json_path, "r", encoding="utf-8") as f:
        base_data = json.load(f)

    if not os.path.exists(img_dir):
        print(f"Error: {img_dir} が見つかりません。")
        return

    # タイプごとの集計用辞書
    # { "YCSW": { "meta": {...}, "params_list": { "eye_size": [], ... } }, ... }
    type_aggregation = {}

    # -------------------------------------------------
    # 1. JSONを走査して解析対象をリストアップ
    # -------------------------------------------------
    
    # 処理すべきアイテムのリスト (type_code, filename, meta_data)
    tasks = []

    if json_type == "type_key":
        # 男性パターン: キーが "YCSW" など
        # 画像ファイルはフォルダ内から type_code を含むものを探す
        all_files = os.listdir(img_dir)
        for type_code, meta in base_data.items():
            # type_code を含むファイルをすべて対象にする
            target_files = [f for f in all_files if type_code in f]
            for fname in target_files:
                tasks.append({
                    "type_code": type_code,
                    "filename": fname,
                    "meta": meta
                })

    elif json_type == "img_key":
        # 女性パターン: キーが "img_001" など
        for key, item in base_data.items():
            # axes から type_code を復元
            if "axes" not in item:
                continue
            type_code = get_type_code_from_axes(item["axes"])
            filename = item.get("filename")
            
            if filename:
                tasks.append({
                    "type_code": type_code,
                    "filename": filename,
                    "meta": item # 必要なメタデータを含んでいる
                })

    print(f"解析対象ファイル数: {len(tasks)}")

    # -------------------------------------------------
    # 2. 画像解析と集計
    # -------------------------------------------------
    for task in tasks:
        type_code = task["type_code"]
        filename = task["filename"]
        meta = task["meta"]

        # 集計用辞書の初期化
        if type_code not in type_aggregation:
            type_aggregation[type_code] = {
                # メタデータは最初の1つを採用（promptなどが含まれていれば使う）
                # img_key形式の場合は numeric_params が理想値として入っているが、
                # それは学習後に上書きされるので枠だけ確保
                "meta": {
                    "index": meta.get("index", 0),
                    "axes": meta.get("axes", {}),
                    "prompt": meta.get("prompt", ""),
                    # numeric_params は後で計算した平均値を入れる
                    "numeric_params": {} 
                },
                "params_list": {k: [] for k in NUMERIC_KEYS},
                "count": 0
            }

        file_path = os.path.join(img_dir, filename)
        if not os.path.exists(file_path):
            print(f"  [Skip] File not found: {filename}")
            continue

        try:
            img = Image.open(file_path)
            result = analyzer.analyze(img)
            
            # 数値をリストに追加
            for k in NUMERIC_KEYS:
                type_aggregation[type_code]["params_list"][k].append(result[k])
            
            type_aggregation[type_code]["count"] += 1
            # print(f"  OK: {filename} -> {type_code}") # ログが多い場合はコメントアウト

        except Exception as e:
            print(f"  Error analyzing {filename}: {e}")

    # -------------------------------------------------
    # 3. 平均値を計算して最終データを作成
    # -------------------------------------------------
    final_trained_data = {}

    for type_code, data in type_aggregation.items():
        count = data["count"]
        if count == 0:
            print(f"[{type_code}] 有効な画像がありませんでした。")
            continue

        averaged_params = {}
        for k in NUMERIC_KEYS:
            values = data["params_list"][k]
            averaged_params[k] = sum(values) / len(values)

        # 最終的なエントリを作成
        entry = data["meta"].copy()
        entry["numeric_params"] = averaged_params
        
        # promptなどが空なら元のJSONから補完するロジックを入れても良い
        
        final_trained_data[type_code] = entry
        print(f"[{type_code}] Updated with average of {count} images.")

    # -------------------------------------------------
    # 4. 保存
    # -------------------------------------------------
    if final_trained_data:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(final_trained_data, f, indent=2, ensure_ascii=False)
        print(f"Saved training data to {output_path}")
    else:
        print("No data processed.")

if __name__ == "__main__":
    for conf in CONFIG:
        train_gender_data(conf)