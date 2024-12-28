// File: /contexts/AppProviders.tsx
import { ReactNode } from "react";
import { SolanaProviders } from "./SolanaProviders";
import { ProgramProvider } from "./ProgramProvider";
import { UserProvider } from "./UserProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SolanaProviders>
      <ProgramProvider>
        <UserProvider>
          <WalletProvider>{children}</WalletProvider>
        </UserProvider>
      </ProgramProvider>
    </SolanaProviders>
  );
};
