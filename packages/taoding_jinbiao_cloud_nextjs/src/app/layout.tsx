import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "淘丁精标云",
  description: "淘丁精标云",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <Script src="https://tb.53kf.com/code/code/10180830/5" strategy="afterInteractive" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}  >
        {children}
      </body>
    </html>
  );
}
