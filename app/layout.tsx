import type { Metadata } from "next";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Digital Heroes — Play Golf. Win Prizes. Change Lives.",
  description: "Subscription-driven golf performance tracking + charity fundraising + prize draw web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F5F0]">
        {children}
      </body>
    </html>
  );
}
