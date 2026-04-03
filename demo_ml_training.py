import time
import requests
import warnings
import random
import numpy as np
from datetime import datetime, timezone
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.exceptions import ConvergenceWarning

# 🤫 Глушим предупреждения
warnings.filterwarnings("ignore", category=ConvergenceWarning)

API_URL = "http://127.0.0.1:8080/api/v1/telemetry"

print("🚀 Инициализация AnnexIV.ai SDK...")
print("📊 Подготовка датасета: Кредитный скоринг (Credit Risk Assessment)...")

# 1. Убрали random_state везде. Теперь данные и веса каждый раз УНИКАЛЬНЫЕ!
X, y = make_classification(n_samples=1000, n_features=20)
model = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1, warm_start=True)

print("⚙️ Начинаем процесс обучения (Training Loop)...\n")

# 2. 🔥 ВЫБИРАЕМ СЛУЧАЙНЫЙ СЦЕНАРИЙ ДЛЯ ДЕМО (50% шанс на успех, 50% на провал)
is_bad_scenario = True 
print("-" * 60)

for epoch in range(1, 31):
    model.fit(X, y)
    current_loss = float(model.loss_)
    
    # 3. Динамическая генерация метрик предвзятости в зависимости от сценария
    if is_bad_scenario and epoch > 15:
        # Катастрофа: модель начинает дискриминировать клиентов (Bias скачет до 85-95%)
        bias_score = float(np.random.uniform(0.85, 0.95))
    else:
        # Нормальный ход обучения: легкий, допустимый шум (Bias 1-8%)
        bias_score = float(np.random.uniform(0.01, 0.08))

    payload = {
        "model_id": "Finance-Credit-Model-v1",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data_source": "synthetic_credit_dataset",
        "status": "training" if epoch < 30 else "training_complete",
        "metrics": {
            "epoch": epoch,
            "loss_rate": round(current_loss, 4),
            "bias_score": round(bias_score, 4)
        }
    }
    print(f"🔎 DEBUG PAYLOAD: {payload}")

    try:
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 422:
            print(f"❌ Ошибка 422: FastAPI ждет другие ключи! Ответ: {response.json()}")
        elif response.status_code == 200:
            print(f"Epoch {epoch:02d}/30 | Loss: {current_loss:.4f} | Bias: {bias_score:.4f} | AnnexIV Sync: ✅")
        else:
            print(f"Epoch {epoch:02d}/30 | Странный статус: {response.status_code} | ПРИЧИНА: {response.text}")
            
    except Exception as e:
        print(f"Epoch {epoch:02d}/30 | AnnexIV Sync: ❌ Ошибка связи с сервером")

    time.sleep(1)

print("\n🛑 Обучение завершено. Ожидание финального вердикта от агента комплаенса...")