// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/app/components/Navigation"; 
import "./globals.css";

export const viewport = { width: "device-width", initialScale: 1 };


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://facetype16.com"; 

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: "FaceType16 | AI顔タイプ診断",
  description: "顔写真からあなたの印象を16タイプに言語化。プロフェッショナルなAI診断ツール。",

  openGraph: {
    title: "FaceType16 | AI顔タイプ診断",
    description: "顔写真からあなたの印象を16タイプに言語化。プロフェッショナルなAI診断ツール。",
    url: siteUrl,
    siteName: "FaceType16",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://facetype16.com/api/og", 
        width: 1200,
        height: 630,
        alt: "FaceType16 AI診断結果",
      },
    ],
  },

  twitter: {
    card: "summary_large_image", 
    title: "FaceType16 | AI顔タイプ診断",
    description: "顔写真からあなたの印象を16タイプに言語化。プロフェッショナルなAI診断ツール。",
    images: ["https://facetype16.com/api/og"], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="icon" href="https://facetype16.com/favicon.ico" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3826860993891417"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white`}
      >
        {/* 背景の装飾 */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,#e0e7ff,transparent_50%)] opacity-60"></div>

        {/* ヘッダー */}
        <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
          <div className="relative flex h-14 items-center justify-between rounded-full border border-white/40 bg-white/70 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all md:px-6">
            {/* ロゴエリア */}
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm shadow-md transition-transform group-hover:scale-105">
                <span className="relative z-10 text-white">F</span>
              </div>
              <span className="font-bold tracking-tight text-slate-800">
                FaceType<span className="text-indigo-600">16</span>
              </span>
            </Link>

            {/* ナビゲーション（クライアントコンポーネント化） */}
            <div className="flex items-center gap-2">
              <Navigation />
              
              <div className="hidden h-4 w-px bg-slate-200 sm:block ml-2"></div>

              {/* 診断スタートボタン */}
              <Link
                href="/face-type"
                className="hidden rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:bg-slate-800 hover:scale-105 active:scale-95 sm:block"
              >
                診断スタート
              </Link>
            </div>
          </div>
        </header>

        {/* コンテンツ */}
        <main className="relative mx-auto w-full max-w-6xl px-4 py-10 lg:px-8 lg:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}