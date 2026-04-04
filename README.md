# AnnexIV-Solana-Core: Autonomous Compliance & Trust Architecture for the AI Era 🛡️
<p align="center">
  <img src="assets/logo.jpg" alt="AnnexIV Logo" width="400">
</p>

<h1 align="center">AnnexIV-Solana-Core</h1>

<p align="center">
  <strong>The Infrastructure Standard for AI Compliance on Solana</strong>
</p>

🌟 **[Pitch Deck](https://drive.google.com/file/d/1UNBnv40CNOIQ_tS_JK6mNfTMwPVCEA65/view?usp=drive_link)** | 🎥 **[Live Demo Video](https://drive.google.com/file/d/1DJoDT-5bUZNyWlA0m7MRPHMoB8pVdF-r/view?usp=drive_link)**
[![Status](https://img.shields.io/badge/Status-Hackathon_MVP-blue?style=flat)](#)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-14F195?style=flat&logo=solana&logoColor=white)](#)
[![IPFS](https://img.shields.io/badge/IPFS-Web3_Storage-65C2CB?style=flat&logo=ipfs&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-AI_Core-009688?style=flat&logo=fastapi&logoColor=white)](#)
[![Go](https://img.shields.io/badge/Go-Telemetry_Parser-00ADD8?style=flat&logo=go&logoColor=white)](#)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=flat)](#)
[![Next.js](https://img.shields.io/badge/Next.js-Dashboard-000000?style=flat&logo=next.js&logoColor=white)](#)
[![Rust](https://img.shields.io/badge/Rust-Smart_Contract-000000?style=flat&logo=rust&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=flat&logo=docker&logoColor=white)](#)

## 1. Elevator Pitch 🚀
**AnnexIV-Solana-Core** is an infrastructure standard for automated regulatory compliance under the **EU AI Act**. We leverage the high-performance Solana network and decentralized IPFS storage to create an immutable audit trail for AI model training and deployment.

Our solution transforms the static legal requirements of Annex IV into a dynamic **Compliance-as-Code** pipeline. The system intercepts telemetry directly during neural network training (Loss/Bias), autonomously analyzes it via a multi-agent RAG architecture (Llama 3.3 70B), issues a safety verdict (Trust Score), and anchors the status on-chain.

This eliminates the risk of human error, protects businesses from existential fines of up to €35M, and allows compliance officers to generate a legally admissible PDF certificate for EU regulators with a single click.

---

## 2. Key Features (Hackathon MVP) 🔥
We didn't just build a concept; we shipped an End-to-End process:

1. 🧠 **Live ML Integration:** The adapter script (`demo_ml_training.py`) integrates directly into a real model's training pipeline (`scikit-learn` MLPClassifier) and streams bias metrics in real-time.
2. 🔗 **100% Web3 Proof:** No local mocks. All AI safety JSON reports are automatically hashed and uploaded to the global decentralized **IPFS network via Pinata**, returning a cryptographic CID.
3. 🛑 **System Lockdown (Red Alert):** The frontend dashboard reacts instantly to the AI judge's verdict. If the `Trust Score < 80` (discrimination detected), the system triggers a visual lockdown and records the failure on-chain.
4. 📄 **Legal PDF Generation:** The bridge between Web3 and compliance lawyers. The built-in generator allows officers to download a ready-made PDF report containing all cryptographic proofs (IPFS CID and Solana Tx) for EU regulatory bodies.

---

## 3. Architecture & Tech Stack 🛠️

| Component | Technology Stack | Role in the System |
| :--- | :--- | :--- |
| **Intelligence** (`2_backend_ai`) | Python, FastAPI, Groq (Llama 3.3) | RAG log analysis, "Analytics" & "Judge" logic, IPFS upload. |
| **ML Sensor** (SDK) | Python, `scikit-learn` | Integrates into the Data Scientist's pipeline, intercepting training epochs. |
| **Blockchain** (`1_solana_program`) | Rust, Anchor | Immutable storage for statuses (PDA) and Trust Scores. |
| **Dashboard** (`3_frontend_dashboard`) | React, Next.js, jsPDF | Real-time monitoring, UI alerts, PDF certificate rendering. |
| **Go Sensor** (`4_sensor_go`) | Golang | Alternative sidecar container for high-load telemetry streaming. |
---

## 4. Quick Start & Installation ⚙️

Deploying the automated compliance system:

**Step 1: Environment Setup**
```bash
git clone [https://github.com/almassuleimenov/AnnexIV-Core.git](https://github.com/almassuleimenov/AnnexIV-Core.git)
cd AnnexIV-Core
```
Create a .env file in the 2_backend_ai folder and add your keys:
```
GROQ_API_KEY=your_groq_key
API_KEY=your_pinata_api_key
SECRET_KEY=your_pinata_secret_key
```
**Step 2: Start Local Blockchain & Smart Contract (WSL/Linux)**
> ⚠️ Requires WSL2 on Windows or native Linux/macOS
```
cd 1_solana_program
solana-test-validator --reset --ledger ~/test-ledger
# In a new terminal tab:
solana program deploy target/deploy/annex_iv_registry.so
```
**Step 3: Start AI Backend**
```
cd 2_backend_ai
python -m venv venv
source venv/bin/activate  # Для Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
**Step 4: Start Frontend Dashboard**
```
cd 3_frontend_dashboard
npm install
npm run dev
```
**Step 5: LIVE DEMO (Machine Learning)**
Open the dashboard (http://localhost:3000). In a new terminal, start training the credit scoring model:
```
python demo_ml_training.py
```
Watch the telemetry stream to the dashboard. Around epoch 15, the model will simulate "bias drift," triggering the AI agent to slash the Trust Score and initiate a System Lockdown.

## 5. Compliance Standard: Соответствие Annex IV 🇪🇺
This project directly implements the technical documentation requirements outlined in Annex IV of the EU AI Act:

*Point 2(b): RAG agents automatically document the logic of algorithms and key assumptions.

*Point 2(g): The system captures "validation and testing metrics" (Loss/Bias) dynamically during the .fit() execution, generating an immutable audit trail.

## 🗺️ Architecture: MVP vs. Roadmap (v2.0)
We believe in radical transparency. Current project status (Decentrathon 5.0):

| Feature | Hackathon MVP (Current) | Production Mainnet (v2.0) |
| :--- | :--- | :--- |
| **Data Ingestion** | Live Python SDK (`scikit-learn`) + Go-Sensor | TEE / Intel SGX Enclaves for Hardware-level ML signing |
| **Trust Evaluation** | Agentic RAG (Groq Llama 3.3) JSON processing | MLflow Webhooks integration |
| **File Storage** | **IPFS (Pinata) Real Web3 Storage** | Irys / Arweave Mainnet upload for permanent persistence |
| **On-Chain Storage** | Direct PDA state updates (Solana Devnet) | Light Protocol ZK Compression (Groth16 proofs) |
| **Legal Output** | One-click PDF Certificate Generation | Integration with EU Regulatory Sandboxes APIs |
