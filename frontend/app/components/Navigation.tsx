// components/Navigation.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// ログイン前のアイコン（人型）
const LoginIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 20c0-2.76 3.13-4 7-4s7 1.24 7 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ログイン後のアイコン（スマイル/顔）
const MyPageIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ▼▼▼ メニュー項目の設定 ▼▼▼
const navItems = [
  { href: "/face-type", label: "顔タイプ診断" },
  { href: "/compatibility", label: "相性診断", disabled: true }, // ここを true に変更しました
  { href: "/ideal-type", label: "好みのタイプ診断", disabled: true },
  { href: "/#about", label: "概要" },
];
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

export default function Navigation({ className = "" }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 初回ロード時のユーザー取得
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // ログイン状態の変化を監視
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {/* メニュー項目 */}
      {navItems.map((item) =>
        (item as any).disabled ? (
          // disabled が true の場合（準備中）
          <span
            key={item.label}
            className="group relative hidden cursor-not-allowed md:inline-block px-3 py-1.5 text-[11px] font-medium text-slate-400"
          >
            {/* 通常時のラベル */}
            <span>{item.label}</span>
            <span className="ml-1 text-[10px] opacity-70">(準備中)</span>
            
            {/* ホバー時に出るツールチップ（お好みで） */}
            <span className="pointer-events-none absolute -bottom-8 left-1/2 min-w-max -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              近日公開予定
            </span>
          </span>
        ) : (
          // 有効なリンクの場合
          <Link
            key={item.label}
            href={item.href}
            className="hidden md:inline-block rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600"
          >
            {item.label}
          </Link>
        )
      )}

      {/* ログイン/マイページ切り替えボタン */}
      {user ? (
        // ログイン中：マイページへ
        <Link
          href="/mypage"
          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:scale-105 active:scale-95"
          aria-label="マイページ"
          title="マイページへ"
        >
          <MyPageIcon />
        </Link>
      ) : (
        // 未ログイン：ログインページへ
        <Link
          href="/login"
          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="ログイン"
          title="ログイン"
        >
          <LoginIcon />
        </Link>
      )}

      {/* スマホ用ログインボタン（未ログイン時のみ表示） */}
      {!user && (
        <Link
          href="/login"
          className="ml-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 md:hidden"
        >
          ログイン
        </Link>
      )}
    </nav>
  );
}