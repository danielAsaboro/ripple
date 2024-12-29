// File: /utils/auth-cookies.ts
import Cookies from "js-cookie";

export const AUTH_COOKIES = {
  WALLET_CONNECTED: "wallet-connected",
  USER_INITIALIZED: "user-initialized",
} as const;

export const setWalletConnectionStatus = (isConnected: boolean) => {
  Cookies.set(AUTH_COOKIES.WALLET_CONNECTED, isConnected.toString(), {
    expires: 7, // Cookie expires in 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const setUserInitializationStatus = (isInitialized: boolean) => {
  Cookies.set(AUTH_COOKIES.USER_INITIALIZED, isInitialized.toString(), {
    expires: 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearAuthCookies = () => {
  Cookies.remove(AUTH_COOKIES.WALLET_CONNECTED);
  Cookies.remove(AUTH_COOKIES.USER_INITIALIZED);
};
