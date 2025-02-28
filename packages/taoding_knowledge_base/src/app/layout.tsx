
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知识库",
  description: "淘丁知识库",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="zh-CN">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
