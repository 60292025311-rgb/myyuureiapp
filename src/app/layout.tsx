import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "爆弾：九つの尻尾",
  description: "心理サスペンスゲーム — Nine Tails",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#080808] min-h-screen">{children}</body>
    </html>
  );
}
