# FaceType16 - AI顔タイプ診断アプリケーション

![Project Banner]([アプリのトップ画やOGPの画像をここに貼る])

## 📖 概要
**「AIで、自分の顔の魅力を客観的に知る」**

ユーザーがアップロードした顔写真をAI（MediaPipe）が解析し、顔のパーツ配置や比率に基づいて16種類の顔タイプ（例: キュート、クール、フレッシュなど）に分類するWebアプリケーションです。

単なる画像処理だけでなく、ユーザーの診断結果を保存する履歴機能や、タイプ別の有名人レコメンド機能も実装しています。

### 🔗 デモ・リンク
- **App URL:** [https://facetype16.com]
- **API Documentation:** [https://backend-5csp.onrender.com]

---

## 🛠 技術スタック (Tech Stack)

モダンなWeb技術とAI技術を組み合わせ、スケーラビリティと保守性を意識した構成にしました。

| Category | Technology |
| --- | --- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS |
| **Backend** | Python 3.10, FastAPI |
| **AI / ML** | MediaPipe (Face Mesh), NumPy, OpenCV |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Infrastructure** | Docker, Render (Web Service), Vercel |
| **Monitoring** | Sentry |

---

## 🏗 システムアーキテクチャ



[Image of Architecture Diagram]

*(ここに draw.io などで作った構成図を貼るとベストです)*

### 特徴的な設計ポイント
1.  **MediaPipeによる高速な特徴点抽出**
    - 468点の顔ランドマークを取得し、「目の大きさ」「顔の縦横比」「顎の丸み」など6つの主要パラメータを数値化（正規化）しています。
2.  **ユークリッド距離によるクラス分類**
    - 事前に定義した16タイプの特徴量ベクトルと、ユーザーの特徴量ベクトルの「ユークリッド距離」を計算し、最も近いタイプを判定するNearest Neighborアルゴリズムを実装しました。
3.  **Dockerによるコンテナ運用**
    - `python:3.11-slim` をベースイメージに採用し、`libGL` などのシステムライブラリを適切に管理することで、環境差異のないデプロイを実現しています。

---

## 🔥 こだわったポイント・工夫した点

### 1. 独自のアルゴリズムによる「16タイプ分類」の実装
既存のAPIを使うだけでなく、顔の幾何学的特徴（フェイスラインの角度やパーツの配置）を独自に定義しました。
`backend/main.py` 内の `FaceAnalyzer` クラスにて、座標計算から数値化までのロジックを実装しています。

```python
# (コードの一部抜粋: ベクトル距離計算による分類ロジック)
dist = np.linalg.norm(input_vec - target_vec)
