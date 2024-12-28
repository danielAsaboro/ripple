//File: /components/auth/RequireAuth.tsx
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { UserRole } from "@/services/auth";

interface RequireAuthProps {
  children: ReactNode;
  roles?: UserRole[];
  fallback?: ReactNode;
}

export const RequireAuth = ({
  children,
  roles,
  fallback,
}: RequireAuthProps) => {
  const { isAuthenticated, roles: userRoles, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    router.push("/connect-wallet");
    return null;
  }

  if (roles && !roles.some((role) => userRoles.includes(role))) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400">
          You don&apos;t have permission to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
