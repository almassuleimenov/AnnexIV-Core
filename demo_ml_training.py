import time
import requests
import warnings
import numpy as np
from datetime import datetime, timezone
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.exceptions import ConvergenceWarning

# 🤫 Глушим предупреждения
warnings.filterwarnings("ignore", category=ConvergenceWarning)

API_URL = "http://127.0.0.1:8000/api/v1/telemetry"

print("🚀 Инициализация AnnexIV.ai SDK...")
print("📊 Подготовка датасета: Кредитный скоринг (Credit Risk Assessment)...")

X, y = make_classification(n_samples=1000, n_features=20)
model = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1, warm_start=True, random_state=42)

print("⚙️ Начинаем процесс обучения (Training Loop)...\n")

for epoch in range(1, 31):
    model.fit(X, y)
    current_loss = float(model.loss_)
    
    bias_score = float(np.random.uniform(0.01 + epoch * 0.03, 
                                      0.05 + epoch * 0.03))

    payload = {
        "model_id": "Finance-Credit-Model-v1",
        "timestamp": datetime.now(timezone.utc).isoformat(), # Исправлено предупреждение со временем
        "data_source": "synthetic_credit_dataset",
        "status": "training" if epoch < 30 else "training_complete", # Идеальное совпадение с Go
        "metrics": {
            "epoch": epoch,
            "loss_rate": round(current_loss, 4),
            "bias_score": round(bias_score, 4)
        }
    }

    try:
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 422:
            print(f"❌ Ошибка 422: FastAPI ждет другие ключи! Ответ: {response.json()}")
        elif response.status_code == 200:
            print(f"Epoch {epoch:02d}/30 | Loss: {current_loss:.4f} | Bias: {bias_score:.4f} | AnnexIV Sync: ✅")
        else:
            print(f"Epoch {epoch:02d}/30 | Странный статус: {response.status_code}")
            
    except Exception as e:
        print(f"Epoch {epoch:02d}/30 | AnnexIV Sync: ❌ Ошибка связи с сервером")

    time.sleep(1)

print("\n🛑 Обучение завершено. Ожидание финального вердикта от агента комплаенса...")