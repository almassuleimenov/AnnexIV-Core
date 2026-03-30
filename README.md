# AnnexIV-Solana-Core: Автономный комплаенс и архитектура доверия для эры ИИ 🛡️
🌟 **[Pitch Deck (Презентация)](ссылка_на_pdf_в_репозитории)** | 🎥 **[Live Demo Video](ссылка_на_youtube_если_есть)** ```
[![Status](https://img.shields.io/badge/Status-Hackathon_MVP-blue?style=flat)](#)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-14F195?style=flat&logo=solana&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-AI_Core-009688?style=flat&logo=fastapi&logoColor=white)](#)
[![Go Version](https://img.shields.io/badge/Go-Sensor-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/)
[![Rust](https://img.shields.io/badge/Rust-Smart_Contract-000000?style=flat&logo=rust&logoColor=white)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices-orange?style=flat)](#)

## 1. Elevator Pitch 🚀
**AnnexIV-Solana-Core** — это инфраструктурный стандарт для автоматизации комплаенса в рамках EU AI Act. Мы используем высокопроизводительную сеть Solana для создания неизменяемого аудиторского следа процесса обучения и эксплуатации моделей ИИ. 

Наше решение трансформирует статические требования Annex IV в динамический процесс **Compliance-as-Code**. Система через мультиагентную RAG-архитектуру автономно анализирует телеметрию, выносит вердикт безопасности (Trust Score) и фиксирует статус соответствия on-chain. Это исключает риск человеческой ошибки и защищает бизнес от экзистенциальных штрафов до €35 млн. Проект обеспечивает прозрачность для регуляторов и высвобождает до 20% времени инженеров, ранее затрачиваемого на бюрократию. 

Мы создаем архитектуру доверия, где каждый шаг алгоритма верифицирован, прозрачен и юридически значим в цифровой экономике на базе Solana. Архитектурная реализация трансформации комплаенса переводит юридические требования из категории бюрократического бремени в формат автоматизированного конкурентного преимущества.

---

## 2. The Problem & Our Solution: От штрафов к Compliance-as-Code ⚖️
Современный рынок ИИ входит в эпоху правового детерминизма, где техническая документация становится обязательным условием легитимного существования бизнеса.

* **🔴 Проблема:** Согласно Статье 71 EU AI Act, компании сталкиваются с экзистенциальной угрозой: штрафы за несоблюдение требований могут достигать €35 млн или 7% от мирового годового оборота. Инженеры теряют до 20% времени на ручную документацию, что критически замедляет Time-to-Market.
* **🟢 Решение:** Концепция *Compliance-as-Code* превращает пассивную отчетность в активный процесс. AnnexIV-Solana-Core использует Solana как децентрализованный реестр. Мы фиксируем каждый этап жизненного цикла ИИ — от методологий обучения до метрик валидации — в виде неизменяемых транзакций.

**Результат:**
1. **Immutability:** Аудиторский след (Audit Trail) невозможно фальсифицировать.
2. **Transparency:** Стейкхолдеры получают on-chain доступ к верифицированным статусам в реальном времени.
3. **Automation:** Снижение операционных затрат за счет исключения человеческого фактора.

---

## 3. Реализация Case 2: Автономная цепочка принятия решений 🤖🔗
Автономность в смарт-контрактах Solana исключает посредников из процесса сертификации. Наш MVP реализует логику, где ИИ не просто консультирует, а инициирует изменение состояния системы:

1. **AI (Agentic RAG):** Мультиагентная система сопоставляет логи обучения с требованиями Annex IV (Article 11). Агент-аналитик проверяет соответствие "общей логике алгоритмов".
2. **Decision (Trust Score):** "Агент-судья" выносит вердикт. При Trust Score > 80% система автономно признает модель безопасной.
3. **On-chain Transaction:** Бэкенд через `solana-py` формирует и подписывает транзакцию, отправляя доказательство в сеть.
4. **Smart Contract State Change:** Программа на Rust обновляет состояние PDA (Program Derived Address), переводя статус модели из `Pending` в `Compliant_EU_Act`.

---

## 4. Архитектура и Технологический стек 🛠️
Модульная архитектура обеспечивает масштабируемость системы при сохранении высокой пропускной способности. Выбор Solana обусловлен экономической эффективностью: низкая стоимость транзакций делает высокочастотное логирование телеметрии ИИ рентабельным.

| Компонент | Стек технологий | Роль в системе |
| :--- | :--- | :--- |
| **Сенсор** (`4_sensor_go`) | Golang | Перехват телеметрии и эмуляция высокоскоростного потока данных обучения. |
| **Интеллект** (`2_backend_ai`) | Python / FastAPI / LangChain | RAG-анализ, логика "Аналитика" и "Судьи", принятие решений. |
| **Блокчейн** (`1_solana_program`) | Rust / Anchor | Реестр Annex VIII и неизменяемое хранилище статусов (PDA). |
| **Дашборд** (`3_frontend_dashboard`) | React / Next.js | Интерфейс комплаенс-офицера и визуализация Trust Score. |

---

## 5. Структура репозитория (Monorepo) 📁
Структура оптимизирована для быстрой итерации и синхронизации on-chain логики с AI-агентами.

```text
AnnexIV-Solana-Core/
├── 1_solana_program/     # БЛОКЧЕЙН: Rust/Anchor. Логика PDA-реестра статусов.
├── 2_backend_ai/         # ИНТЕЛЛЕКТ: Multi-agent RAG logic (Analyzer & Judge).
├── 3_frontend_dashboard/ # ДЕМО: Визуализация Trust Score и аудит-трейла.
├── 4_sensor_go/          # СЕНСОР: Высокоскоростной захват телеметрии (Golang).
└── README.md             # Техническая документация
```
## 6. Quick Start & Installation ⚙️
Развертывание системы автоматизированного комплаенса выполняется в четыре этапа:

1. Подготовка среды:

Bash
```
git clone https://github.com/almassuleimenov/AnnexIV-Core.git
cd AnnexIV-Core
```
2. Сборка смарт-контракта (Anchor):

Bash
```
cd 1_solana_program
anchor build
```
3. Инициализация ИИ-сервиса:

Bash
```
cd ../2_backend_ai
pip install -r requirements.txt
uvicorn main:app --reload
```
4. Запуск интерфейса:

Bash
```
cd ../3_frontend_dashboard
npm install
npm run dev
```
7. Compliance Standard: Соответствие Annex IV 🇪🇺
Проект напрямую реализует требования к технической документации, изложенные в Annex IV EU AI Act:

Пункт 2(b): RAG-агенты автоматически документируют "дизайн-спецификации системы, общую логику алгоритмов и ключевые допущения".

Пункт 2(g): Система фиксирует "метрики валидации и тестирования", создавая неизменяемый отчет.

Решение полностью готово к пилотированию в рамках Regulatory Sandboxes (Статья 57).


## 🗺️ Architecture: MVP vs. Roadmap (v2.0)

We believe in radical transparency. Here is the current state of our hackathon MVP vs our production roadmap:

| Feature | Hackathon MVP (Current) | Production Mainnet (v2.0) |
| :--- | :--- | :--- |
| **Data Ingestion** | Go-Sensor (Simulated ML pipeline integration) | TEE / Intel SGX Enclaves for Hardware-level ML signing |
| **Trust Evaluation** | Agentic RAG (Groq Llama 3.3) processing JSON | Agentic RAG with Data Provenance SDK & MLflow Webhooks |
| **On-Chain Storage** | Direct PDA state updates (Solana Devnet) | **Light Protocol ZK Compression** (Groth16 proofs) |
| **File Storage** | Arweave Mock (Local persistent JSON generation) | Irys / Arweave Mainnet upload for legal admissibility |

