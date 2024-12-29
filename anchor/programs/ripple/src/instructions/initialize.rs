// File: src/instructions/initialize.rs
use anchor_lang::prelude::*;
use crate::{ constants::{ MAX_NAME_LENGTH, USER_SEED }, errors::RipplError, state::* };

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + User::INIT_SPACE,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, name: String) -> Result<()> {
    require!(name.len() <= MAX_NAME_LENGTH, RipplError::NameTooLong);

    let user = &mut ctx.accounts.user;
    user.authority = ctx.accounts.authority.key();
    user.name = name;
    user.wallet_address = ctx.accounts.authority.key();
    user.total_donations = 0;
    user.campaigns_supported = 0;
    user.impact_metrics = ImpactMetrics::default();
    user.badges = Vec::new();
    user.rank = 0;
    user.bump = ctx.bumps.user;

    Ok(())
}
