import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Lang } from "../../lib/utils";
import "../app.css";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 动态生成元数据
export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; }>; }) {
  return {
    en: {
      title: "Say it in English",
      description: "let people say English in life scene",
      keywords: ["English", "say English", "Say it in English"],
    },
    zh: {
      title: "英语怎么说",
      description: "让人们在生活场景中开口说英语",
      keywords: ["英语", "说英语", "英语怎么说"],
    },
  }[(await params).lang];
}


export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Lang; }>;
}>) {
  return (
    <html lang={(await params).lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
