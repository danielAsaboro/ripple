// File: /components/providers/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { SolanaProviders } from "@/contexts/SolanaProviders";
import { ProgramProvider } from "@/contexts/ProgramProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { ReactQueryProvider } from "@/app/react-query-provider";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProviders>
          <ProgramProvider>
            <UserProvider>{children}</UserProvider>
          </ProgramProvider>
        </SolanaProviders>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}
