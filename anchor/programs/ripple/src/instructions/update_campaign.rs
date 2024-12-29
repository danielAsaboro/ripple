// File: src/instructions/update_campaign.rs
use anchor_lang::prelude::*;
use crate::constants::CAMPAIGN_SEED;
use crate::constants::MAX_CAMPAIGN_DURATION;
use crate::constants::MAX_DESCRIPTION_LENGTH;
use crate::constants::MAX_IMAGE_URL_LENGTH;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct UpdateCampaign<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED, 
            campaign.title.as_bytes(), 
            authority.key().as_ref()
        ],
        bump = campaign.bump,
        constraint = campaign.authority == authority.key() @ RipplError::InvalidAuthority
    )]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateCampaignParams {
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub end_date: Option<i64>,
    pub status: Option<CampaignStatus>,
    pub is_urgent: Option<bool>,
}

pub fn handler(ctx: Context<UpdateCampaign>, params: UpdateCampaignParams) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let clock = Clock::get()?;

    // Validate campaign is not expired
    require!(campaign.end_date > clock.unix_timestamp, RipplError::CampaignEnded);

    // Update description if provided
    if let Some(description) = params.description {
        require!(description.len() <= MAX_DESCRIPTION_LENGTH, RipplError::DescriptionTooLong);
        campaign.description = description;
    }

    // Update image URL if provided
    if let Some(image_url) = params.image_url {
        require!(image_url.len() <= MAX_IMAGE_URL_LENGTH, RipplError::ImageUrlTooLong);
        campaign.image_url = image_url;
    }

    // Update end date if provided
    if let Some(new_end_date) = params.end_date {
        require!(new_end_date > clock.unix_timestamp, RipplError::CampaignDurationTooShort);
        require!(
            new_end_date - campaign.start_date <= MAX_CAMPAIGN_DURATION,
            RipplError::CampaignDurationTooLong
        );
        campaign.end_date = new_end_date;
    }

    // Update status if provided
    if let Some(new_status) = params.status {
        // Validate status transition
        match (&campaign.status, &new_status) {
            // Valid transitions
            | (CampaignStatus::Active, CampaignStatus::InProgress)
            | (CampaignStatus::InProgress, CampaignStatus::Completed)
            | (CampaignStatus::Active, CampaignStatus::Expired) => {
                campaign.status = new_status;
            }
            // Invalid transitions
            _ => {
                return Err(error!(RipplError::InvalidStatusTransition));
            }
        }
    }

    // Update urgency if provided
    if let Some(is_urgent) = params.is_urgent {
        campaign.is_urgent = is_urgent;
    }

    Ok(())
}
