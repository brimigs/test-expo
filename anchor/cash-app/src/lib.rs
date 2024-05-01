use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

declare_id!("9p2rqGtDj27UL3oNPn8ZKJ56QS16jg1ujWLLxxMfxEwE");

#[program]
pub mod cash_app {
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let cash_account = &mut ctx.accounts.cash_account;
        cash_account.balance = 0;
        cash_account.owner = *ctx.accounts.user.key;
        cash_account.friends = Vec::new();
        Ok(())
    }

    pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let ix = system_instruction::transfer(

            &ctx.accounts.user.key(),
            ctx.accounts.cash_account.to_account_info().key,
            amount,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.user.clone(),
                ctx.accounts.cash_account.to_account_info(),
            ],
        )?;

        ctx.accounts.cash_account.balance = ctx
            .accounts
            .cash_account
            .balance
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        Ok(())
    }

    pub fn transfer_funds(ctx: Context<TransferFunds>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        let from_cash_account = &mut ctx.accounts.from_cash_account;
        let to_cash_account = &mut ctx.accounts.to_cash_account;

        if from_cash_account.balance < amount {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        from_cash_account.balance = from_cash_account
            .balance
            .checked_sub(amount)
            .ok_or(ErrorCode::Overflow)?;
        to_cash_account.balance = to_cash_account
            .balance
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        let cash_account = &mut ctx.accounts.cash_account;

        if cash_account.balance < amount {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        let ix = system_instruction::transfer(
            cash_account.to_account_info().key,
            &ctx.accounts.user.key(),
            amount,
        );

        invoke(
            &ix,
            &[cash_account.to_account_info(), ctx.accounts.user.clone()],
        )?;

        cash_account.balance = cash_account
            .balance
            .checked_sub(amount)
            .ok_or(ErrorCode::Overflow)?;
        Ok(())
    }

    pub fn add_friend(ctx: Context<AddFriend>, pubkey: Pubkey) -> Result<()> {
        let cash_account = &mut ctx.accounts.cash_account;
        cash_account.friends.push(pubkey);
        Ok(())
    }
}

#[account]
pub struct CashAccount {
    pub balance: u64,
    pub owner: Pubkey,
    pub friends: Vec<Pubkey>, 
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(
        init, 
        seeds = [user.key().as_ref()], 
        bump, 
        payer = user, 
        space = 8 + 8 + 32
    )]
    // '8' for the discriminator, '8' for the balance, '32' for the owner public key
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(mut)]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    /// CHECK: This account is only used to transfer SOL, not for data storage.
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddFriend<'info> {
    #[account(mut)]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    /// CHECK: This account is only used to transfer SOL, not for data storage.
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferFunds<'info> {
    #[account(mut)]
    pub from_cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    pub to_cash_account: Account<'info, CashAccount>,
    pub system_program: Program<'info, System>,
    // The owner of the from_cash_account must sign the transaction
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    /// CHECK: This account is only used to transfer SOL, not for data storage.
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    // The owner of the cash_account must sign the transaction
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(mut)]
    pub cash_account: Account<'info, CashAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided amount must be greater than zero.")]
    InvalidAmount,

    #[msg("Insufficient funds to perform the transfer.")]
    InsufficientFunds,

    #[msg("An overflow occurred in the balance calculation.")]
    Overflow,
    EscrowExpired,
    EscrowNotExpiredYet,
}