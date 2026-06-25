import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pub Golf Tracker",
  description: "A mobile-first pub golf application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="navbar-brand">🍻 Pub Golf</Link>
          <div className="navbar-links">
            <Link href="/pubs">Timeline</Link>
            <Link href="/leaderboard">Leaderboard</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
