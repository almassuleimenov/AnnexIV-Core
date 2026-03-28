from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Импортируем наши новые модули
from app.blockchain.solana_tx import send_audit_record
from app.storage.arweave_mock import upload_to_decentralized_storage
from app.ai_agents.decision import evaluate_compliance

app = FastAPI(title="AnnexIV AI Compliance Core", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TelemetryLog(BaseModel):
    model_id: str
    timestamp: str
    metrics: dict
    data_source: str
    status: Optional[str] = "training"

session_buffers = {}
audit_history = []

@app.get("/api/history")
def get_history():
    return {"logs": audit_history[::-1]}

async def finalize_audit(model_id: str):
    logs = session_buffers.get(model_id, [])
    if not logs: return
        
    # 1. DATA AVAILABILITY
    cid_hash = upload_to_decentralized_storage(logs, model_id)
    
    # 2. AGENTIC RAG
    judgment = evaluate_compliance(logs, cid_hash)
    
    # 3. ZK COMPRESSION / SOLANA
    try:
        # ЗАЩИТА ОТ ОШИБКИ 3004: Обрезаем решение ИИ до 60 символов, чтобы влезло в память Rust
        short_decision = judgment['decision'][:60] 
        on_chain_decision = f"{short_decision} | CID:{cid_hash[:8]}"
        
        result = await send_audit_record(
            model_id=model_id,
            trust_score=judgment['trust_score'],
            decision=on_chain_decision
        )
        
        # ЗАЩИТА ОТ ОШИБКИ РАСПАКОВКИ: Проверяем, что result не пустой
        if result:
            tx_sig, account_pubkey = result
            audit_history.append({
                "time": datetime.now().strftime("%H:%M:%S"),
                "model_id": model_id,
                "trust_score": judgment['trust_score'],
                "decision": judgment['decision'], # На фронт отдаем полный текст
                "cid_hash": cid_hash, 
                "tx_sig": tx_sig
            })
            print(f"💎 АУДИТ ЗАВЕРШЕН. Solana Tx: {tx_sig}")
        else:
            print("❌ Транзакция в Solana не прошла (вернулся None).")
            
    except Exception as e:
        print(f"❌ Системная ошибка блокчейна: {e}")
        
    session_buffers[model_id] = []

@app.post("/api/v1/telemetry")
async def handle_telemetry(data: TelemetryLog, background_tasks: BackgroundTasks):
    if data.model_id not in session_buffers:
        session_buffers[data.model_id] = []
        
    session_buffers[data.model_id].append(data.model_dump())
    print(f"📥 [ИНТЕРЦЕПТОР] Лог перехвачен. Модель: {data.model_id}.")

    # Триггер: если сенсор прислал training_complete
    if data.status == "training_complete":
        print(f"🛑 [ТРИГГЕР] Обучение {data.model_id} завершено. Запуск конвейера комплаенса...")
        background_tasks.add_task(finalize_audit, data.model_id)
        return {"status": "audit_started"}

    return {"status": "buffered"}