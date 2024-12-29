// File: src/instructions/donate.rs
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::constants::BRONZE_THRESHOLD;
use crate::constants::CHAMPION_THRESHOLD;
use crate::constants::DONATION_SEED;
use crate::constants::GOLD_THRESHOLD;
use crate::constants::MIN_DONATION_AMOUNT;
use crate::constants::SILVER_THRESHOLD;
use crate::constants::SUSTAINED_SUPPORTER_MIN_DONATIONS;
use crate::state::*;
use crate::errors::*;
use crate::constants::CAMPAIGN_SEED;
use crate::constants::USER_SEED;

// #[derive(Accounts)]
// #[instruction(amount: u64, payment_method: PaymentMethod, lol: String)]
// pub struct Donate<'info> {
//     #[account(mut)]
//     pub donor: Signer<'info>,

//     #[account(
//         mut,
//         seeds = [USER_SEED, donor.key().as_ref()],
//         bump = user.bump
//     )]
//     pub user: Account<'info, User>,

//     #[account(
//         mut,
//         seeds = [
//             CAMPAIGN_SEED,
//             campaign.title.as_bytes(),
//             campaign.authority.as_ref(),
//         ],
//         bump = campaign.bump
//     )]
//     pub campaign: Account<'info, Campaign>,

//     #[account(
//         init,
//         payer = donor,
//         space = 8 + std::mem::size_of::<Donation>(),
//         seeds = [
//             DONATION_SEED,
//             campaign.key().as_ref(),
//             donor.key().as_ref(),
//             lol.as_bytes(),
//             // &campaign.donors_count.to_le_bytes(),
//         ],
//         bump
//     )]
//     pub donation: Account<'info, Donation>,

//     /// CHECK: This is the campaign vault that will receive the donation
//     #[account(mut)]
//     pub campaign_vault: AccountInfo<'info>,

//     pub system_program: Program<'info, System>,
// }

// pub fn handler(
//     ctx: Context<Donate>,
//     amount: u64,
//     payment_method: PaymentMethod,
//     _lol: String
// ) -> Result<()> {
//     let clock = Clock::get()?;

//     // Validate campaign status
//     require!(ctx.accounts.campaign.status == CampaignStatus::Active, RipplError::CampaignNotActive);
//     require!(ctx.accounts.campaign.end_date > clock.unix_timestamp, RipplError::CampaignEnded);
//     require!(amount >= MIN_DONATION_AMOUNT, RipplError::DonationTooLow);

//     // Transfer funds from donor to campaign vault
//     system_program::transfer(
//         CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer {
//             from: ctx.accounts.donor.to_account_info(),
//             to: ctx.accounts.campaign_vault.to_account_info(),
//         }),
//         amount
//     )?;

//     // Update campaign stats
//     let campaign = &mut ctx.accounts.campaign;
//     campaign.raised_amount = campaign.raised_amount
//         .checked_add(amount)
//         .ok_or(error!(RipplError::InsufficientFunds))?;
//     campaign.donors_count = campaign.donors_count
//         .checked_add(1)
//         .ok_or(error!(RipplError::InsufficientFunds))?;

//     // Create donation record
//     let donation = &mut ctx.accounts.donation;
//     donation.donor = ctx.accounts.donor.key();
//     donation.campaign = ctx.accounts.campaign.key();
//     donation.amount = amount;
//     donation.timestamp = clock.unix_timestamp;
//     donation.status = DonationStatus::Completed;
//     donation.payment_method = payment_method;
//     donation.bump = ctx.bumps.donation;

//     // Update user stats
//     let user = &mut ctx.accounts.user;
//     user.total_donations = user.total_donations
//         .checked_add(amount)
//         .ok_or(error!(RipplError::InsufficientFunds))?;
//     user.campaigns_supported = user.campaigns_supported
//         .checked_add(1)
//         .ok_or(error!(RipplError::InsufficientFunds))?;

//     // Update user badges based on total donations
//     update_user_badges(user, amount)?;

//     Ok(())
// }

#[derive(Accounts)]
#[instruction(amount: u64, payment_method: PaymentMethod, count_in_string: String)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_SEED, donor.key().as_ref()],
        bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED, 
            campaign.title.as_bytes(), 
            campaign.authority.as_ref(),
        ],
        bump = campaign.bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = donor,
        space = 8 + std::mem::size_of::<Donation>(),
        seeds = [
            DONATION_SEED,
            campaign.key().as_ref(),
            donor.key().as_ref(),
            count_in_string.as_bytes(),
        ],
        bump
    )]
    pub donation: Account<'info, Donation>,

    /// CHECK: This is a PDA owned by the program that serves as a vault for campaign donations.
    /// The seeds and constraints ensure it is the correct vault for this campaign.
    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED,
            campaign.title.as_bytes(),
            campaign.authority.as_ref(),
            b"vault"
        ],
        bump
    )]
    pub campaign_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<Donate>,
    amount: u64,
    payment_method: PaymentMethod,
    _count_in_string: String
) -> Result<()> {
    let clock = Clock::get()?;

    // Validate campaign status
    require!(ctx.accounts.campaign.status == CampaignStatus::Active, RipplError::CampaignNotActive);
    require!(ctx.accounts.campaign.end_date > clock.unix_timestamp, RipplError::CampaignEnded);
    require!(amount >= MIN_DONATION_AMOUNT, RipplError::DonationTooLow);

    // Transfer funds from donor to campaign vault using system_program
    system_program::transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), system_program::Transfer {
            from: ctx.accounts.donor.to_account_info(),
            to: ctx.accounts.campaign_vault.to_account_info(),
        }),
        amount
    )?;

    // Rest of the handler remains the same...
    let campaign = &mut ctx.accounts.campaign;
    campaign.raised_amount = campaign.raised_amount
        .checked_add(amount)
        .ok_or(error!(RipplError::InsufficientFunds))?;
    campaign.donors_count = campaign.donors_count
        .checked_add(1)
        .ok_or(error!(RipplError::InsufficientFunds))?;

    // Create donation record
    let donation = &mut ctx.accounts.donation;
    donation.donor = ctx.accounts.donor.key();
    donation.campaign = ctx.accounts.campaign.key();
    donation.amount = amount;
    donation.timestamp = clock.unix_timestamp;
    donation.status = DonationStatus::Completed;
    donation.payment_method = payment_method;
    donation.bump = ctx.bumps.donation;

    // Update user stats
    let user = &mut ctx.accounts.user;
    user.total_donations = user.total_donations
        .checked_add(amount)
        .ok_or(error!(RipplError::InsufficientFunds))?;
    user.campaigns_supported = user.campaigns_supported
        .checked_add(1)
        .ok_or(error!(RipplError::InsufficientFunds))?;

    // Update user badges based on total donations
    update_user_badges(user, amount)?;

    Ok(())
}
fn update_user_badges(user: &mut User, amount: u64) -> Result<()> {
    let total_donated = user.total_donations;
    let clock = Clock::get()?;

    // Check for new badges in descending order of thresholds
    if total_donated >= CHAMPION_THRESHOLD && !has_badge(&user.badges, BadgeType::ChampionOfChange) {
        add_badge(user, Badge {
            badge_type: BadgeType::ChampionOfChange,
            description: String::from("Champion of Change - Awarded for exceptional generosity"),
            image_url: String::from("/badges/champion.png"),
            date_earned: clock.unix_timestamp,
        })?;
    } else if total_donated >= GOLD_THRESHOLD && !has_badge(&user.badges, BadgeType::Gold) {
        add_badge(user, Badge {
            badge_type: BadgeType::Gold,
            description: String::from("Gold Badge - Major contribution milestone reached"),
            image_url: String::from("/badges/gold.png"),
            date_earned: clock.unix_timestamp,
        })?;
    } else if total_donated >= SILVER_THRESHOLD && !has_badge(&user.badges, BadgeType::Silver) {
        add_badge(user, Badge {
            badge_type: BadgeType::Silver,
            description: String::from("Silver Badge - Significant support provided"),
            image_url: String::from("/badges/silver.png"),
            date_earned: clock.unix_timestamp,
        })?;
    } else if total_donated >= BRONZE_THRESHOLD && !has_badge(&user.badges, BadgeType::Bronze) {
        add_badge(user, Badge {
            badge_type: BadgeType::Bronze,
            description: String::from("Bronze Badge - First milestone achieved"),
            image_url: String::from("/badges/bronze.png"),
            date_earned: clock.unix_timestamp,
        })?;
    }

    // Check for sustained supporter separately
    if
        user.campaigns_supported >= SUSTAINED_SUPPORTER_MIN_DONATIONS &&
        !has_badge(&user.badges, BadgeType::SustainedSupporter)
    {
        add_badge(user, Badge {
            badge_type: BadgeType::SustainedSupporter,
            description: String::from("Sustained Supporter - Consistent and dedicated support"),
            image_url: String::from("/badges/sustained.png"),
            date_earned: clock.unix_timestamp,
        })?;
    }

    Ok(())
}

fn add_badge(user: &mut User, badge: Badge) -> Result<()> {
    require!(user.badges.len() < 5, RipplError::MaxBadgesReached);
    user.badges.push(badge);
    Ok(())
}

fn has_badge(badges: &Vec<Badge>, badge_type: BadgeType) -> bool {
    badges.iter().any(|badge| badge.badge_type == badge_type)
}
