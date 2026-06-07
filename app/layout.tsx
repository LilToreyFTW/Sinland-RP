import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sinland-RP | Server Hub",
  description: "Sinland-RP website with live server stack, vehicle catalog, Discord-gated storefront, and community forums."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
