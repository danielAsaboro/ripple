// File: /contexts/UserProvider.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { User } from "../types";
import { findUserPDA } from "../utils/pdas";
import { useProgram } from "@/hooks/useProgram";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage"; // We'll create this next

interface UserContextState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
  initialized: boolean;
  initializeUser: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextState>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  initialized: false,
  initializeUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { program } = useProgram();
  const { publicKey, connected } = useWallet();
  const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
    "ripple_user",
    null
  );

  const [state, setState] = useState<
    Omit<UserContextState, "refreshUser" | "initializeUser">
  >({
    user: cachedUser,
    loading: true,
    error: null,
    initialized: false,
  });

  const fetchUser = async () => {
    if (!program || !publicKey) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error("Program or wallet not ready"),
        initialized: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [userPDA] = await findUserPDA(publicKey);
      const userAccount = await program.account.user.fetch(userPDA);

      setState({
        user: userAccount as User,
        loading: false,
        error: null,
        initialized: true,
      });

      // Update cache
      setCachedUser(userAccount as User);
    } catch (error: any) {
      // Check if error is due to account not being initialized
      if (error.message?.includes("Account does not exist")) {
        setState({
          user: null,
          loading: false,
          error: null,
          initialized: false,
        });
        setCachedUser(null);
      } else {
        setState({
          user: null,
          loading: false,
          error: error as Error,
          initialized: false,
        });
        toast.error("Failed to load user profile");
      }
    }
  };

  // Initialize user account
  const initializeUser = async (name: string) => {
    if (!program || !publicKey) {
      throw new Error("Program or wallet not connected");
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [userPDA] = await findUserPDA(publicKey);

      const tx = await program.methods
        .initialize(name)
        .accounts({
          authority: publicKey,
          user: userPDA,
        })
        .rpc();

      await program.provider.connection.confirmTransaction(tx);
      toast.success("Profile created successfully!");

      // Fetch updated user data
      await fetchUser();
    } catch (error) {
      console.error("Error initializing user:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      toast.error("Failed to create profile");
      throw error;
    }
  };

  // Fetch user on wallet connection
  useEffect(() => {
    if (connected) {
      fetchUser();
    } else {
      setState({
        user: null,
        loading: false,
        error: null,
        initialized: false,
      });
      setCachedUser(null);
    }
  }, [connected, publicKey, program]);

  // Setup event listeners for user updates
  useEffect(() => {
    if (!program || !publicKey) return;

    const eventListener = program.addEventListener(
      "UserUpdated",
      async (event: any) => {
        if (event.authority.equals(publicKey)) {
          await fetchUser();
        }
      }
    );

    return () => {
      program.removeEventListener(eventListener);
    };
  }, [program, publicKey]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        refreshUser: fetchUser,
        initializeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook with type safety
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
