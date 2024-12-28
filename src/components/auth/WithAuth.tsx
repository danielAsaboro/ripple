//File: /components/auth/withAuth.tsx
import { ComponentType } from "react";
import { UserRole } from "@/services/auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ConnectWalletPrompt } from "@/components/auth/ConnectWalletPrompt";
import { CreateUserPrompt } from "@/components/auth/CreateUserPrompt";
import { useAuth } from "@/contexts/AuthProvider";
import { useUser } from "@/contexts/UserProvider";

interface WithAuthOptions {
  roles?: UserRole[];
  requireInit?: boolean;
}

export const withAuth = (
  WrappedComponent: ComponentType<any>,
  options: WithAuthOptions = {}
) => {
  return function WithAuthWrapper(props: any) {
    const { isAuthenticated } = useAuth();
    const { initialized } = useUser();

    // Show wallet connection prompt if not connected
    if (!isAuthenticated) {
      return <ConnectWalletPrompt />;
    }

    // Show initialization prompt if required
    if (options.requireInit && !initialized) {
      return <CreateUserPrompt />;
    }

    // Check role requirements
    return (
      <RequireAuth roles={options.roles}>
        <WrappedComponent {...props} />
      </RequireAuth>
    );
  };
};
