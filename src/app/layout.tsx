// File: /app/layout.tsx
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { UiLayout } from "@/components/ui/ui-layout";

const links = [
  { label: "Account", path: "/account" },
  { label: "Clusters", path: "/clusters" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <UiLayout links={links}>{children}</UiLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
