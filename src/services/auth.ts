//File: /services/auth.ts
import { PublicKey } from "@solana/web3.js";

// Role definitions
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

interface AuthRules {
  adminPublicKeys: string[];
}

// Auth configuration
const AUTH_CONFIG: AuthRules = {
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
  static async getUserRoles(publicKey: PublicKey): Promise<UserRole[]> {
    const roles: UserRole[] = [UserRole.USER];

    if (this.isAdmin(publicKey)) {
      roles.push(UserRole.ADMIN);
    }

    return roles;
  }
}
