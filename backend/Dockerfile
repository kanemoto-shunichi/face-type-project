# 1. ベースイメージ: Python 3.11 (開発環境のバージョンに合わせて変更してください)
# "slim" は軽量版です。AWSのコスト削減とビルド時間短縮に効きます。
FROM python:3.10-slim

# 2. 環境変数の設定
# PYTHONDONTWRITEBYTECODE: .pycファイルを作らない（コンテナを汚さないため）
# PYTHONUNBUFFERED: ログをすぐにコンソールに出力する（AWS CloudWatchでログを見るために必須）
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3. 作業ディレクトリの設定
WORKDIR /app

# 【追加】 システムライブラリのインストール
# libGL.so.1 (libgl1) と libgthread (libglib2.0-0) を入れます
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. ライブラリのインストール
# 先にrequirements.txtだけコピーしてインストールすることで、
# コードを変更してもライブラリの再インストールが走らないようにする（キャッシュ利用）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. ソースコードをすべてコピー
COPY . .

# 6. ポートの開放（RenderやAWSに向けた宣言）
EXPOSE 8000

# 7. 起動コマンド（★ここを使っているフレームワークに合わせて選んでください）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
