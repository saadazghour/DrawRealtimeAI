import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Draw Real Time AI",
  description:
    "Draw Real Time AI typically refers to an artificial intelligence app that can interpret, generate, or modify visual content in real-time. This can include tasks such as sketching, painting, or editing images as a human artist might, but done automatically and instantaneously by the AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
