import logging
import sys
import os

def setup_logger(name: str = "app"):
    """
    アプリケーション全体のロガー設定
    Renderなどのクラウド環境で見やすいフォーマットに統一する
    """
    logger = logging.getLogger(name)
    
    # 既存のハンドラがあればクリア（重複防止）
    if logger.handlers:
        logger.handlers.clear()

    # ログレベルの設定 (環境変数で制御可能に)
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(log_level)

    # 標準出力へのハンドラ作成
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)

    # フォーマット設定: [時間] [レベル] [ファイル名:行数] メッセージ
    formatter = logging.Formatter(
        '[%(asctime)s] [%(levelname)s] [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    
    # propagateをFalseにして、uvicornのルートロガーへの伝播を防ぐ（二重出力防止）
    logger.propagate = False
    
    return logger