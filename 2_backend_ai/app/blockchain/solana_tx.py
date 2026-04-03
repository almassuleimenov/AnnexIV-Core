import asyncio
import json
from pathlib import Path
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from anchorpy import Program, Provider, Wallet, Context, Idl
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts

# Твой Program ID из логов терминала
PROGRAM_ID = Pubkey.from_string("H8Jq46Saqk5EGmFGiCDuzbZr27i2nZuxbPkFvZx59kXp")


async def send_audit_record(model_id: str, trust_score: int, decision: str):
    # 1. Подключаемся к твоей локальной сети Solana (которую ты поднял)
    client = AsyncClient("http://172.21.123.177:8899", commitment=Confirmed)

    # 2. Загружаем твой кошелек (payer), который будет платить комиссию
    wallet_path = Path(__file__).resolve().parent.parent.parent / "id.json"
    with open(wallet_path, "r") as f:
        secret = json.load(f)
    payer_keypair = Keypair.from_bytes(bytes(secret))
    wallet = Wallet(payer_keypair)

    provider = Provider(client, wallet, opts=TxOpts(preflight_commitment=Confirmed))

    # 3. Загружаем IDL (JSON-описание контракта, которое сгенерировал Anchor)
    # Убедись, что путь к папке 1_solana_program указан верно относительно этого скрипта
    # Вычисляем абсолютный путь до корня проекта (AnnexIV.ai)
    current_dir = Path(__file__).resolve().parent  # Это папка blockchain
    root_dir = (
        current_dir.parent.parent.parent
    )  # Поднимаемся на 3 уровня вверх до корня

    # Собираем точный путь к IDL
    idl_path = (
        root_dir / "1_solana_program" / "target" / "idl" / "annex_iv_registry.json"
    )
    # Читаем файл как сырую строку (это нужно для нового anchorpy)
    with open(idl_path, "r") as f:
        raw_idl = f.read()

    # Парсим IDL через класс Idl и инициализируем программу
    idl = Idl.from_json(raw_idl)
    program = Program(idl, PROGRAM_ID, provider)

    # 4. Генерируем новый уникальный аккаунт для ЭТОЙ записи (наш Audit Trail)
    record_keypair = Keypair()

    print(f"Отправляем данные в блокчейн для модели: {model_id}...")

    # 5. Вызываем функцию record_status из нашего смарт-контракта
    try:
        tx_sig = await program.rpc["record_status"](
            model_id,
            trust_score,
            decision,
            ctx=Context(
                accounts={
                    "compliance_record": record_keypair.pubkey(),
                    "authority": wallet.public_key,
                    "system_program": Pubkey.from_string(
                        "11111111111111111111111111111111"
                    ),
                },
                signers=[payer_keypair, record_keypair],
            ),
        )

        print(f"✅ Успех! Транзакция подтверждена: {tx_sig}")
        print(f"📄 Адрес аккаунта с записью: {record_keypair.pubkey()}")

        return str(tx_sig), str(record_keypair.pubkey())

    except Exception as e:
        import traceback
        print(f"❌ Ошибка при отправке транзакции:")
        print(traceback.format_exc())
    finally:
        await client.close()


# Блок для проверки: если запустить скрипт напрямую, он отправит тестовую запись
if __name__ == "__main__":
    # Эмулируем вердикт от ИИ-судьи
    asyncio.run(
        send_audit_record(
            model_id="GPT-4-Finance-Bot", trust_score=85, decision="Approved for MVP"
        )
    )
