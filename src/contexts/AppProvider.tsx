// src/contexts/AppProviders.tsx
import { ReactNode } from "react";
import { SolanaProviders } from "./SolanaProviders";
import { ProgramProvider } from "./ProgramProvider";
import { UserProvider } from "./UserProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <SolanaProviders>
      <ProgramProvider>
        <UserProvider>{children}</UserProvider>
      </ProgramProvider>
    </SolanaProviders>
  );
};
