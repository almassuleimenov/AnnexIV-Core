use anchor_lang::prelude::*;

// Временный ID программы. Замени его после выполнения команды `anchor keys list`
declare_id!("H8Jq46Saqk5EGmFGiCDuzbZr27i2nZuxbPkFvZx59kXp");

#[program]
pub mod annex_iv_registry {
    use super::*;

    pub fn record_status(
        ctx: Context<RecordStatus>,
        model_id: String,
        trust_score: u8,
        decision: String,
    ) -> Result<()> {
        // Получаем ссылку на наш новый аккаунт записи
        let record = &mut ctx.accounts.compliance_record;
        // Получаем текущее время сети блокчейна
        let clock = Clock::get()?;

        // Записываем данные в блокчейн
        record.model_id = model_id.clone();
        record.trust_score = trust_score;
        record.decision = decision.clone();
        record.timestamp = clock.unix_timestamp;
        record.authority = ctx.accounts.authority.key();

        // Логируем успешное действие (будет видно в Solana Explorer)
        msg!("Успешно! Записан статус для ИИ-модели: {}", model_id);
        msg!("Trust Score: {}, Решение: {}", trust_score, decision);

        Ok(())
    }
}

// Структура валидации аккаунтов для инструкции
#[derive(Accounts)]
pub struct RecordStatus<'info> {
    #[account(
        init, // Инициализируем новый аккаунт при каждом вызове (для аудиторского следа)
        payer = authority, // Тот, кто подписывает, платит за аренду памяти
        space = 8 + 4 + 50 + 1 + 4 + 100 + 8 + 32 // ~207 байт. Берем 256 для безопасности.
    )]
    pub compliance_record: Account<'info, ComplianceRecord>,
    
    #[account(mut)]
    pub authority: Signer<'info>, // Подписант транзакции (например, бэкенд FastAPI)
    
    pub system_program: Program<'info, System>,
}

// Структура данных, которая будет храниться в блокчейне
#[account]
pub struct ComplianceRecord {
    pub model_id: String,   // Идентификатор ИИ-модели
    pub trust_score: u8,    // Оценка доверия (0-100)
    pub decision: String,   // Вердикт (например, "Approved", "Requires Review")
    pub timestamp: i64,     // Время записи
    pub authority: Pubkey,  // Кто внес запись
}