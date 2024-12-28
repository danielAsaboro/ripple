//File: /contexts/AuthProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "./UserProvider";
import { AuthService, UserRole } from "@/services/auth";
import { toast } from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  roles: UserRole[];
  isAdmin: boolean;
  canCreateCampaigns: boolean;
  checkPermission: (
    permission: "createCampaign" | "modifyCampaign" | "withdrawFunds",
    publicKey?: string
  ) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitialized: false,
  roles: [],
  isAdmin: false,
  canCreateCampaigns: false,
  checkPermission: async () => false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, connected } = useWallet();
  const { user, initialized } = useUser();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const updateRoles = async () => {
      if (!connected || !publicKey || !user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const userRoles = await AuthService.getUserRoles(
          publicKey,
          user.totalDonations,
          user.campaignsSupported
        );
        setRoles(userRoles);
      } catch (error) {
        console.error("Error updating roles:", error);
        toast.error("Failed to update user permissions");
      } finally {
        setLoading(false);
      }
    };

    updateRoles();
  }, [connected, publicKey, user]);

  const checkPermission = async (
    permission: "createCampaign" | "modifyCampaign" | "withdrawFunds",
    targetPublicKey?: string
  ): Promise<boolean> => {
    if (!publicKey || !user) return false;

    switch (permission) {
      case "createCampaign":
        return AuthService.canCreateCampaign(
          user.totalDonations,
          user.campaignsSupported
        );

      case "modifyCampaign":
        if (!targetPublicKey) return false;
        return AuthService.canModifyCampaign(
          new PublicKey(targetPublicKey),
          publicKey
        );

      case "withdrawFunds":
        if (!targetPublicKey) return false;
        return AuthService.canWithdrawFunds(
          new PublicKey(targetPublicKey),
          publicKey
        );

      default:
        return false;
    }
  };

  const value = {
    isAuthenticated: connected && initialized,
    isInitialized: initialized,
    roles,
    isAdmin: roles.includes(UserRole.ADMIN),
    canCreateCampaigns: roles.includes(UserRole.CAMPAIGN_CREATOR),
    checkPermission,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
