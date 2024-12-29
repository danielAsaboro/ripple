// File: src/instructions/create_campaign.rs
use anchor_lang::prelude::*;
use crate::constants::CAMPAIGN_SEED;
use crate::constants::MAX_CAMPAIGN_DURATION;
use crate::constants::MAX_DESCRIPTION_LENGTH;
use crate::constants::MAX_IMAGE_URL_LENGTH;
use crate::constants::MAX_ORGANIZATION_NAME_LENGTH;
use crate::constants::MAX_TITLE_LENGTH;
use crate::constants::MIN_CAMPAIGN_DURATION;
use crate::constants::MIN_CAMPAIGN_TARGET;
use crate::constants::USER_SEED;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,

    #[account(
        init,
        payer = authority,
        space = 8 + Campaign::INIT_SPACE,
        seeds = [CAMPAIGN_SEED, title.as_bytes(), authority.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateCampaign>,
    title: String,
    description: String,
    category: CampaignCategory,
    organization_name: String,
    target_amount: u64,
    start_date: i64,
    end_date: i64,
    image_url: String,
    is_urgent: bool
) -> Result<()> {
    // Validate inputs
    require!(title.len() <= MAX_TITLE_LENGTH, RipplError::TitleTooLong);
    require!(description.len() <= MAX_DESCRIPTION_LENGTH, RipplError::DescriptionTooLong);
    require!(
        organization_name.len() <= MAX_ORGANIZATION_NAME_LENGTH,
        RipplError::OrganizationNameTooLong
    );
    require!(image_url.len() <= MAX_IMAGE_URL_LENGTH, RipplError::ImageUrlTooLong);
    require!(end_date - start_date >= MIN_CAMPAIGN_DURATION, RipplError::CampaignDurationTooShort);
    require!(end_date - start_date <= MAX_CAMPAIGN_DURATION, RipplError::CampaignDurationTooLong);
    require!(target_amount >= MIN_CAMPAIGN_TARGET, RipplError::TargetAmountTooLow);

    let campaign = &mut ctx.accounts.campaign;
    campaign.authority = ctx.accounts.authority.key();
    campaign.title = title;
    campaign.description = description;
    campaign.category = category;
    campaign.organization_name = organization_name;
    campaign.target_amount = target_amount;
    campaign.raised_amount = 0;
    campaign.donors_count = 0;
    campaign.start_date = start_date;
    campaign.end_date = end_date;
    campaign.status = CampaignStatus::Active;
    campaign.image_url = image_url;
    campaign.is_urgent = is_urgent;
    campaign.bump = ctx.bumps.campaign;

    Ok(())
}
