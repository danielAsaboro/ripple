// src/contexts/UserProvider.tsx
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

interface UserContextState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextState>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [state, setState] = useState<Omit<UserContextState, "refreshUser">>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUser = async () => {
    if (!program || !publicKey) {
      setState({
        user: null,
        loading: false,
        error: new Error("Program or wallet not ready"),
      });
      return;
    }

    try {
      const [userPDA] = await findUserPDA(publicKey);
      const userAccount = await program.account.user.fetch(userPDA);

      setState({
        user: userAccount as User,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [program, publicKey]);

  return (
    <UserContext.Provider value={{ ...state, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
