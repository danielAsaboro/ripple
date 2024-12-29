// File: src/errors.rs
use anchor_lang::prelude::*;

#[error_code]
pub enum RipplError {
    #[msg("The provided title is too long")]
    TitleTooLong,

    #[msg("The provided description is too long")]
    DescriptionTooLong,

    #[msg("The provided organization name is too long")]
    OrganizationNameTooLong,

    #[msg("The provided image URL is too long")]
    ImageUrlTooLong,

    #[msg("Campaign duration is too short")]
    CampaignDurationTooShort,

    #[msg("Campaign duration is too long")]
    CampaignDurationTooLong,

    #[msg("Campaign target amount is too low")]
    TargetAmountTooLow,

    #[msg("Campaign has already ended")]
    CampaignEnded,

    #[msg("Campaign is not active")]
    CampaignNotActive,

    #[msg("Donation amount is too low")]
    DonationTooLow,

    #[msg("Invalid authority")]
    InvalidAuthority,

    #[msg("Invalid campaign status transition")]
    InvalidStatusTransition,

    #[msg("Insufficient funds")]
    InsufficientFunds,

    #[msg("Maximum name length exceeded")]
    NameTooLong,

    #[msg("Maximum email length exceeded")]
    EmailTooLong,

    #[msg("Invalid email format")]
    InvalidEmailFormat,

    #[msg("Maximum transaction hash length exceeded")]
    TransactionHashTooLong,

    #[msg("Maximum impact description length exceeded")]
    ImpactDescriptionTooLong,

    #[msg("Maximum number of badges reached")]
    MaxBadgesReached,
}
