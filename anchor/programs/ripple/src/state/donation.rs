// File: src/state/donation.rs
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
#[derive(InitSpace)]
pub struct Donation {
    pub donor: Pubkey,
    pub campaign: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub status: DonationStatus,
    pub payment_method: PaymentMethod,
    #[max_len(100)]
    pub transaction_hash: String, // 100 chars max
    #[max_len(500)]
    pub impact_description: String, // 500 chars max
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
#[derive(InitSpace)]
pub enum DonationStatus {
    Pending,
    Completed,
    Allocated,
    Spent,
}

impl Default for DonationStatus {
    fn default() -> Self {
        DonationStatus::Pending
    }
}

#[derive(InitSpace)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentMethod {
    CryptoWallet,
    Card,
}

impl Default for PaymentMethod {
    fn default() -> Self {
        PaymentMethod::CryptoWallet
    }
}
