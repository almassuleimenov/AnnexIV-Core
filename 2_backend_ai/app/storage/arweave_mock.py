import hashlib
import json
from datetime import datetime

def upload_to_decentralized_storage(logs: list, model_id: str) -> str:
    """
    Эмулирует загрузку 100-страничного отчета и сырых логов в Arweave/IPFS.
    Возвращает неизменяемый SHA-256 хеш (Content Identifier - CID).
    """
    print(f"📦 [Irys/Arweave] Подготовка данных модели {model_id} к загрузке...")
    
    # Превращаем массив логов в строку
    data_str = json.dumps(logs, sort_keys=True)
    
    # Генерируем SHA-256 хеш (тот самый Root Hash)
    cid = hashlib.sha256(data_str.encode('utf-8')).hexdigest()
    
    print(f"✅ [Irys/Arweave] Данные сохранены навечно. CID: {cid}")
    return cid