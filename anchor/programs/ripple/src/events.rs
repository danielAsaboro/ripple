// File: src/events.rs
use anchor_lang::prelude::*;
use crate::state::*;

// Re-export events from lib.rs
pub use crate::{ CampaignCreated, DonationReceived, CampaignUpdated, FundsWithdrawn, BadgeAwarded };

// Helper functions to emit events
pub fn emit_campaign_created(
    campaign: Pubkey,
    authority: Pubkey,
    title: String,
    category: CampaignCategory,
    target_amount: u64
) {
    emit!(CampaignCreated {
        campaign,
        authority,
        title,
        category,
        target_amount,
    });
}

pub fn emit_donation_received(
    donation: Pubkey,
    campaign: Pubkey,
    donor: Pubkey,
    amount: u64,
    payment_method: PaymentMethod
) {
    emit!(DonationReceived {
        donation,
        campaign,
        donor,
        amount,
        payment_method,
    });
}

pub fn emit_campaign_updated(
    campaign: Pubkey,
    authority: Pubkey,
    new_status: Option<CampaignStatus>
) {
    emit!(CampaignUpdated {
        campaign,
        authority,
        new_status,
    });
}

pub fn emit_funds_withdrawn(campaign: Pubkey, recipient: Pubkey, amount: u64) {
    emit!(FundsWithdrawn {
        campaign,
        recipient,
        amount,
    });
}

pub fn emit_badge_awarded(user: Pubkey, badge_type: BadgeType, timestamp: i64) {
    emit!(BadgeAwarded {
        user,
        badge_type,
        timestamp,
    });
}
