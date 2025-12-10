import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bourgo Arena - Emploi du Temps Sportif",
  description: "Système de gestion d'emploi du temps pour complexe sportif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
