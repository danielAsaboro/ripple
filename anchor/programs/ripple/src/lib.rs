// File: src/lib.rs
use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("BHhjYYFgpQjUDx4RL7ge923gZeJ3vyQScHBwYDCFSkd7");

#[program]
pub mod ripple {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String) -> Result<()> {
        instructions::initialize::handler(ctx, name)
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        description: String,
        category: state::CampaignCategory,
        organization_name: String,
        target_amount: u64,
        start_date: i64,
        end_date: i64,
        image_url: String,
        is_urgent: bool
    ) -> Result<()> {
        instructions::create_campaign::handler(
            ctx,
            title,
            description,
            category,
            organization_name,
            target_amount,
            start_date,
            end_date,
            image_url,
            is_urgent
        )
    }

    pub fn donate(
        ctx: Context<Donate>,
        amount: u64,
        payment_method: state::PaymentMethod,
        count_in_string: String,
    ) -> Result<()> {
        instructions::donate::handler(ctx, amount, payment_method, count_in_string)
    }

    pub fn update_campaign(
        ctx: Context<UpdateCampaign>,
        params: instructions::update_campaign::UpdateCampaignParams
    ) -> Result<()> {
        instructions::update_campaign::handler(ctx, params)
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        instructions::withdraw_funds::handler(ctx, amount)
    }
}

// Event definitions
#[event]
pub struct CampaignCreated {
    pub campaign: Pubkey,
    pub authority: Pubkey,
    pub title: String,
    pub category: state::CampaignCategory,
    pub target_amount: u64,
}

#[event]
pub struct DonationReceived {
    pub donation: Pubkey,
    pub campaign: Pubkey,
    pub donor: Pubkey,
    pub amount: u64,
    pub payment_method: state::PaymentMethod,
}

#[event]
pub struct CampaignUpdated {
    pub campaign: Pubkey,
    pub authority: Pubkey,
    pub new_status: Option<state::CampaignStatus>,
}

#[event]
pub struct FundsWithdrawn {
    pub campaign: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BadgeAwarded {
    pub user: Pubkey,
    pub badge_type: state::BadgeType,
    pub timestamp: i64,
}
