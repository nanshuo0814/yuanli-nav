import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { GlobalShortcuts } from "@/components/global-shortcuts";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { PwaRegister } from "@/components/pwa-register";
import { siteConfig } from "@/lib/site-config";
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
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "源力导航 - 全网优质资源聚合",
    template: "%s | 源力导航",
  },
  description:
    "源力导航是一个干净、现代的全网资源聚合导航站，覆盖编程、AI、音乐、影视、软件、生活、设计、学习、热点、工具等分类。",
  keywords: [
    "导航站",
    "资源聚合",
    "编程",
    "AI",
    "设计",
    "工具",
    "源力导航",
  ],
  openGraph: {
    title: "源力导航 - 全网优质资源聚合",
    description: "发现优质网络资源，编程、AI、设计、工具、生活一站直达",
    type: "website",
    locale: "zh_CN",
    url: siteConfig.siteUrl,
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
};

/** 根布局：主题、导航、SEO */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 防止主题闪烁：在 hydration 前应用主题 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('yuanli-nav-theme') || 'system';
                  var resolved = theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.classList.add(resolved);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <GlobalShortcuts />
          <Analytics />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
