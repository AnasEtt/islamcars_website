import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Islamcars - Location de voitures à Agadir",
  description:
    "Location de voitures à Agadir avec réservation simple et paiement en espèces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
