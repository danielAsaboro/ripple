//File: /services/auth.ts
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

// Role definitions
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  CAMPAIGN_CREATOR = "CAMPAIGN_CREATOR",
}

interface AuthRules {
  minDonationsForCreator: number;
  minSolForCreator: number;
  adminPublicKeys: string[];
}

// Auth configuration
const AUTH_CONFIG: AuthRules = {
  minDonationsForCreator: 5,
  minSolForCreator: 1, // 1 SOL
  adminPublicKeys: [
    // Add admin public keys here
    "BHhjYYFgpQjUDx4RL7ge923gZeJ3vyQScHBwYDCFSkd7",
  ],
};

export class AuthService {
  // Check if user is admin
  static isAdmin(publicKey: PublicKey): boolean {
    return AUTH_CONFIG.adminPublicKeys.includes(publicKey.toString());
  }

  // Check if user can create campaigns
  static async canCreateCampaign(
    totalDonations: BN,
    donationCount: number
  ): Promise<boolean> {
    return (
      donationCount >= AUTH_CONFIG.minDonationsForCreator ||
      totalDonations.toNumber() >= AUTH_CONFIG.minSolForCreator * 1e9
    );
  }

  // Check if user can modify campaign
  static canModifyCampaign(
    campaignAuthority: PublicKey,
    userPublicKey: PublicKey
  ): boolean {
    return (
      campaignAuthority.equals(userPublicKey) || this.isAdmin(userPublicKey)
    );
  }

  // Check if user can withdraw funds
  static canWithdrawFunds(
    campaignAuthority: PublicKey,
    userPublicKey: PublicKey
  ): boolean {
    return (
      campaignAuthority.equals(userPublicKey) || this.isAdmin(userPublicKey)
    );
  }

  // Get user roles
  static async getUserRoles(
    publicKey: PublicKey,
    totalDonations: BN,
    donationCount: number
  ): Promise<UserRole[]> {
    const roles: UserRole[] = [UserRole.USER];

    if (this.isAdmin(publicKey)) {
      roles.push(UserRole.ADMIN);
    }

    if (await this.canCreateCampaign(totalDonations, donationCount)) {
      roles.push(UserRole.CAMPAIGN_CREATOR);
    }

    return roles;
  }
}
