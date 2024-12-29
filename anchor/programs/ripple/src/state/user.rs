// File: src/state/user.rs
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
#[derive(InitSpace)]
pub struct User {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    pub wallet_address: Pubkey,
    #[max_len(100)]
    pub email: String,
    #[max_len(200)]
    pub avatar_url: String,
    pub total_donations: u64,
    pub campaigns_supported: u32,
    pub impact_metrics: ImpactMetrics,
    #[max_len(5)]
    pub badges: Vec<Badge>,
    pub rank: u32,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
#[derive(InitSpace)]
pub struct ImpactMetrics {
    pub meals_provided: u32,
    pub children_educated: u32,
    pub families_housed: u32,
    pub trees_planted: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
#[derive(InitSpace)]
pub struct Badge {
    pub badge_type: BadgeType,
    #[max_len(200)]
    pub description: String,
    #[max_len(200)]
    pub image_url: String,
    pub date_earned: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
#[derive(InitSpace)]
pub enum BadgeType {
    Gold,
    Silver,
    Bronze,
    ChampionOfChange,
    SustainedSupporter,
}
