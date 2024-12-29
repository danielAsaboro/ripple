// // File: src/instructions/withdraw_funds.rs
// use anchor_lang::prelude::*;
// use crate::constants::CAMPAIGN_SEED;
// use crate::state::*;
// use crate::errors::*;

// #[derive(Accounts)]
// pub struct WithdrawFunds<'info> {
//     #[account(mut)]
//     pub authority: Signer<'info>,

//     #[account(
//         mut,
//         seeds = [
//             CAMPAIGN_SEED,
//             campaign.title.as_bytes(),
//             authority.key().as_ref()
//         ],
//         bump = campaign.bump,
//         constraint = campaign.authority == authority.key() @ RipplError::InvalidAuthority,
//         constraint = campaign.status == CampaignStatus::Completed @ RipplError::CampaignNotActive
//     )]
//     pub campaign: Account<'info, Campaign>,

//     /// CHECK: This is the campaign vault that holds the funds
//     #[account(mut)]
//     pub campaign_vault: AccountInfo<'info>,

//     /// CHECK: This is the recipient account that will receive the funds
//     #[account(mut)]
//     pub recipient: AccountInfo<'info>,

//     pub system_program: Program<'info, System>,
// }

// pub fn handler(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
//     let _campaign = &ctx.accounts.campaign;

//     // Ensure amount is available
//     let vault_balance = ctx.accounts.campaign_vault.lamports();
//     require!(vault_balance >= amount, RipplError::InsufficientFunds);

//     // Transfer funds from campaign vault to recipient
//     **ctx.accounts.campaign_vault.try_borrow_mut_lamports()? = vault_balance
//         .checked_sub(amount)
//         .ok_or(error!(RipplError::InsufficientFunds))?;

//     **ctx.accounts.recipient.try_borrow_mut_lamports()? = ctx.accounts.recipient
//         .lamports()
//         .checked_add(amount)
//         .ok_or(error!(RipplError::InsufficientFunds))?;

//     Ok(())
// }

// File: src/instructions/withdraw_funds.rs
use anchor_lang::prelude::*;
use crate::constants::CAMPAIGN_SEED;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED, 
            campaign.title.as_bytes(), 
            authority.key().as_ref()
        ],
        bump = campaign.bump,
        constraint = campaign.authority == authority.key() @ RipplError::InvalidAuthority,
        constraint = campaign.status == CampaignStatus::Completed @ RipplError::CampaignNotActive
    )]
    pub campaign: Account<'info, Campaign>,

    /// CHECK: This is a PDA owned by the program that serves as a vault for campaign donations.
    /// The seeds and constraints ensure it is the correct vault for this campaign, and only the
    /// campaign authority can withdraw from it when the campaign is completed.
    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED,
            campaign.title.as_bytes(),
            campaign.authority.as_ref(),
            b"vault"
        ],
        bump,
    )]
    pub campaign_vault: SystemAccount<'info>,

    /// CHECK: This is the recipient account that will receive the withdrawn funds.
    /// It can be any valid system account as specified by the campaign authority.
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
pub fn handler(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
    let campaign = &ctx.accounts.campaign;
    let vault_balance = ctx.accounts.campaign_vault.lamports();

    // Ensure amount is available
    require!(vault_balance >= amount, RipplError::InsufficientFunds);

    // Get campaign vault bump
    let vault_bump = ctx.bumps.campaign_vault;

    // Construct seeds for signing
    let vault_seeds = [
        CAMPAIGN_SEED,
        campaign.title.as_bytes(),
        campaign.authority.as_ref(),
        b"vault",
        &[vault_bump],
    ];

    // Transfer funds from vault to recipient using invoke_signed
    anchor_lang::solana_program::program::invoke_signed(
        &anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.campaign_vault.key(),
            &ctx.accounts.recipient.key(),
            amount
        ),
        &[
            ctx.accounts.campaign_vault.to_account_info(),
            ctx.accounts.recipient.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[&vault_seeds[..]]
    )?;

    Ok(())
}
