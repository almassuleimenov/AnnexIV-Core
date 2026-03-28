import hashlib
import json
import os

def upload_to_decentralized_storage(logs_data: dict, model_id: str) -> str:
    """
    Эмулирует загрузку в Arweave/IPFS.
    Генерирует хеш и сохраняет файл локально в папку reports/, 
    чтобы мы могли его проверить.
    """
    print(f"📦 [Irys/Arweave] Подготовка данных модели {model_id} к загрузке...")
    
    # Превращаем словарь в красивый JSON с отступами
    data_str = json.dumps(logs_data, indent=4, ensure_ascii=False)
    
    # Генерируем SHA-256 хеш (тот самый Root Hash)
    cid = hashlib.sha256(data_str.encode('utf-8')).hexdigest()
    
    # --- СОХРАНЯЕМ ФАЙЛ ЛОКАЛЬНО ДЛЯ ПРОВЕРКИ ---
    # Создаем папку reports прямо внутри папки 2_backend_ai, если её нет
    reports_dir = os.path.join(os.getcwd(), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    file_path = os.path.join(reports_dir, f"{model_id}_{cid[:8]}.json")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(data_str)
        
    print(f"📁 Отчет успешно сохранен на диске: {file_path}")
    print(f"✅ [Irys/Arweave] Данные хешированы. CID: {cid}")
    
    return cid