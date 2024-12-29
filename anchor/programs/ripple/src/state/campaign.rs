// File: src/state/campaign.rs
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
#[derive(InitSpace)]
pub struct Campaign {
    pub authority: Pubkey,
    #[max_len(100)]
    pub title: String, // 100 chars max
    #[max_len(1000)]
    pub description: String, // 1000 chars max
    pub category: CampaignCategory,
    #[max_len(100)]
    pub organization_name: String, // 100 chars max
    pub target_amount: u64,
    pub raised_amount: u64,
    pub donors_count: u32,
    pub start_date: i64,
    pub end_date: i64,
    pub status: CampaignStatus,
    #[max_len(200)]
    pub image_url: String, // 200 chars max
    pub is_urgent: bool,
    pub bump: u8,
}

#[derive(InitSpace)]

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CampaignCategory {
    Healthcare,
    Education,
    FoodSupply,
    EmergencyRelief,
    Infrastructure,
    WaterSanitation,
}

impl Default for CampaignCategory {
    fn default() -> Self {
        CampaignCategory::Healthcare
    }
}
#[derive(InitSpace)]

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CampaignStatus {
    Active,
    InProgress,
    Completed,
    Expired,
}

impl Default for CampaignStatus {
    fn default() -> Self {
        CampaignStatus::Active
    }
}
