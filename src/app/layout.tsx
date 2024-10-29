import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaYaima",
  description: "Buy products online with TaYaima",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <body className={`${inter.className}`}>
        {children}
        <Toaster closeButton duration={3000} richColors />
        </body>
      </html>
    )
}
