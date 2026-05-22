import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SinLand-RP | Custom QBCore Roleplay",
  description: "Discord-whitelisted SinLand-RP website, community hub, and tier storefront."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
