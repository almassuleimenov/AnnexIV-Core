from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.blockchain.solana_tx import send_audit_record

# Создаем приложение FastAPI
app = FastAPI(title="AnnexIV AI Compliance API")

# Описываем структуру данных, которую мы ждем (например, от Golang-сенсора)
class AuditRequest(BaseModel):
    model_id: str
    trust_score: int
    decision: str

# Простой эндпоинт для проверки, что сервер жив
@app.get("/")
def read_root():
    return {"status": "online", "system": "AnnexIV-Solana-Core Backend"}

# Главный эндпоинт: принимает данные и пишет их в блокчейн
@app.post("/api/record_decision")
async def record_decision(data: AuditRequest):
    try:
        # Вызываем твою рабочую функцию из solana_tx.py
        # Так как FastAPI работает асинхронно, используем await (asyncio.run тут не нужен)
        result = await send_audit_record(
            model_id=data.model_id,
            trust_score=data.trust_score,
            decision=data.decision
        )
        
        if result:
            tx_sig, account_pubkey = result
            return {
                "status": "success",
                "message": "Данные успешно записаны в блокчейн!",
                "transaction_signature": tx_sig,
                "record_account": account_pubkey
            }
        else:
            raise HTTPException(status_code=500, detail="Ошибка при записи в блокчейн. Проверьте консоль бэкенда.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))