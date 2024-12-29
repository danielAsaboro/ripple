// File: src/constants.rs
pub const CAMPAIGN_SEED: &[u8] = b"campaign";
pub const DONATION_SEED: &[u8] = b"donation";
pub const USER_SEED: &[u8] = b"user";

// String length constraints
pub const MAX_TITLE_LENGTH: usize = 100;
pub const MAX_DESCRIPTION_LENGTH: usize = 1000;
pub const MAX_ORGANIZATION_NAME_LENGTH: usize = 100;
pub const MAX_IMAGE_URL_LENGTH: usize = 200;
pub const MAX_NAME_LENGTH: usize = 50;
pub const MAX_EMAIL_LENGTH: usize = 100;
pub const MAX_TRANSACTION_HASH_LENGTH: usize = 100;
pub const MAX_IMPACT_DESCRIPTION_LENGTH: usize = 500;

// Campaign constraints
pub const MIN_CAMPAIGN_DURATION: i64 = 24 * 60 * 60; // 1 day in seconds
pub const MAX_CAMPAIGN_DURATION: i64 = 90 * 24 * 60 * 60; // 90 days in seconds
pub const MIN_CAMPAIGN_TARGET: u64 = 100_000_000; // 0.1 SOL (lamports)

// Donation constraints
pub const MIN_DONATION_AMOUNT: u64 = 1_000_000; // 0.001 SOL (lamports)

// Badge thresholds
pub const BRONZE_THRESHOLD: u64 = 1_000_000_000; // 1 SOL
pub const SILVER_THRESHOLD: u64 = 5_000_000_000; // 5 SOL
pub const GOLD_THRESHOLD: u64 = 10_000_000_000; // 10 SOL
pub const CHAMPION_THRESHOLD: u64 = 50_000_000_000; // 50 SOL
pub const SUSTAINED_SUPPORTER_MIN_DONATIONS: u32 = 10;
