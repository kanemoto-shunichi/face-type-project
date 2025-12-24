// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

type Mode = 'login' | 'signup';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      d="M21.6 12.227c0-.68-.055-1.36-.172-2.027H12v3.84h5.44a4.64 4.64 0 0 1-2.016 3.046v2.52h3.26c1.915-1.76 3.016-4.356 3.016-7.379Z"
      fill="#4285F4"
    />
    <path
      d="M12 22c2.73 0 5.023-.9 6.698-2.394l-3.26-2.52c-.905.61-2.07.96-3.433.96-2.64 0-4.876-1.781-5.676-4.173H2.96v2.62C4.664 19.98 8.077 22 12 22Z"
      fill="#34A853"
    />
    <path
      d="M6.324 13.873A5.81 5.81 0 0 1 6.02 12c0-.652.113-1.286.304-1.873V7.507H2.96A9.97 9.97 0 0 0 2 12c0 1.61.38 3.137 1.04 4.493l3.284-2.62Z"
      fill="#FBBC05"
    />
    <path
      d="M12 6.46c1.485 0 2.815.51 3.868 1.51l2.9-2.9C17.016 3.735 14.73 2.8 12 2.8 8.077 2.8 4.664 4.82 2.96 7.507l3.364 2.62C7.124 8.241 9.36 6.46 12 6.46Z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください。');
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        alert('アカウントを作成しました。メールをご確認の上、ログインしてください。');
        setMode('login');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (!data.session) {
          throw new Error('セッションを取得できませんでした。');
        }
        router.push('/mypage'); // ログイン後は診断ページへ
      }
    } catch (e: any) {
      setError(e.message ?? 'エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    setOauthLoading(true);
    setError(null);
    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/mypage`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
      // 成功すると Supabase 側で Google の画面にリダイレクトされる
    } catch (e: any) {
      setError(e.message ?? 'Googleログインでエラーが発生しました。');
      setOauthLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* 背景（トップページと似せた雰囲気） */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,#e0e7ff,transparent_50%)] opacity-60" />

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center px-4 py-10 lg:flex-row lg:gap-16">
        {/* 左側：ブランド・説明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[11px] font-medium text-indigo-600 shadow-sm">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Sign in to FaceType16
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            診断結果を、
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              保存・いつでも確認
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            ログインすると、過去の16タイプ診断結果をマイページでいつでも見返せます。
            有料プランで、詳細レポートや診断履歴の比較などの機能も確認できます。
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
              診断履歴の保存
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
              いつでも再閲覧
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
              あなただけの診断結果
            </span>
          </div>
        </motion.div>

        {/* 右側：ログインカード */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md flex-1"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.2)] backdrop-blur-xl">
            {/* 装飾グラデーション */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-100 blur-3xl" />

            <div className="relative px-8 py-8">
              {/* ヘッダー */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white shadow-md">
                  F
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {mode === 'login' ? 'Log in' : 'Sign up'}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {mode === 'login' ? 'FaceType16 にログイン' : 'FaceType16 に登録'}
                </h2>
              </div>

              {/* OAuth ボタン */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOAuthLogin}
                  disabled={oauthLoading || loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {oauthLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span>Google で{mode === 'login' ? 'ログイン' : '登録'}</span>
                </button>

                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>またはメールアドレスで続行</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              </div>

              {/* メール + パスワードフォーム */}
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    パスワード
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上を推奨"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || oauthLoading}
                  className="mt-2 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? '送信中...'
                    : mode === 'login'
                    ? 'メールでログイン'
                    : 'メールで新規登録'}
                </button>
              </div>

              {/* モード切り替え＋戻るリンク */}
              <div className="mt-6 flex flex-col items-center gap-2 text-xs text-slate-500">
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                  onClick={() =>
                    setMode((m) => (m === 'login' ? 'signup' : 'login'))
                  }
                >
                  {mode === 'login'
                    ? 'アカウントをお持ちでない方はこちら'
                    : 'すでにアカウントをお持ちの方はこちら'}
                </button>

                <Link
                  href="/"
                  className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                >
                  トップページに戻る
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
