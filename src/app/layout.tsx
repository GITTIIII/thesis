import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Background from "@/components/background/background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ENGi PMIS",
  description: "Engineering Postgrad Management Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Background />
        <main className="w-full h-full absolute top-0 overflow-auto">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
