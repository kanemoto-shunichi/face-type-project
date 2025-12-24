'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// ----------------------------------------------------------------------
// 1. 型定義 (face_results テーブルに合わせる)
// ----------------------------------------------------------------------

type NumericParams = {
  eye_size: number;
  face_length: number;
  jaw_roundness: number;
  brow_curve: number;
  contrast_level: number;
  warmth: number;
};

// DBのカラム定義に合わせました
type FaceResult = {
  id: number;
  user_id: string;
  file_url: string;
  gender: string;
  type_code: string;
  numeric_params: NumericParams; // JSONデータ
  created_at: string;
};

// 表示用の日本語タイトルマッピング
const TYPE_TITLES: Record<string, string> = {
  // デフォルト
  DEFAULT: '診断結果',
};

// ----------------------------------------------------------------------
// 2. コンポーネント実装
// ----------------------------------------------------------------------

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [history, setHistory] = useState<FaceResult[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. ユーザーセッション確認
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email ?? "");

      // 2. DBから診断履歴を取得
      const { data, error } = await supabase
        .from('face_results')
        .select('*')
        .eq('user_id', session.user.id) 
        .order('created_at', { ascending: false }); 

      if (error) {
        // エラーの詳細をコンソールに出すように修正
        console.error('データ取得エラー詳細:', error.message, error.details, error.hint);
      } else {
        setHistory(data || []);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // ローディング画面
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-slate-500">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- ヘッダーエリア --- */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              ログイン中: {userEmail}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              マイページ
            </h1>
            <p className="mt-2 text-slate-600">
              これまでの診断履歴や、保存された顔タイプを確認できます。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/face-type"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:-translate-y-0.5"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規診断
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* --- 診断履歴一覧 --- */}
        <div className="mb-8 flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">診断履歴</h2>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
            {history.length}件
          </span>
        </div>

        {history.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => {
              // 日付フォーマット
              const dateObj = new Date(item.created_at);
              const dateStr = dateObj.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              });

              // タイトル取得
              const title = TYPE_TITLES[item.type_code] || TYPE_TITLES.DEFAULT;

              return (
                <Link
                  key={item.id}
                  href={`/report/${item.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200"
                >
                  {/* コンテンツエリア */}
                  <div className="flex flex-1 flex-col p-6"> {/* パディングを少し広げました(p-5 -> p-6) */}

                    {/* ヘッダー：性別と日付を横並びに */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase ${item.gender === 'man' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {item.gender === 'man' ? 'MALE' : 'FEMALE'}
                      </span>
                      {/* 日付をここに移動 */}
                      <span className="text-xs font-medium text-slate-400">
                        {dateStr}
                      </span>
                    </div>

                    <h3 className="mb-1 text-3xl font-black tracking-tight text-slate-900">
                      {item.type_code}
                    </h3>

                    <p className="mb-4 text-sm font-medium text-indigo-600 line-clamp-1">
                      {title}
                    </p>

                    {/* パラメータのミニグラフ */}
                    <div className="mt-auto grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
                      {(['age', 'line', 'contrast', 'vibe'] as const).map((key) => (
                        <div key={key} className="flex flex-col gap-1">
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-[9px] text-center text-slate-400 font-bold uppercase">{key.slice(0, 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 追加用カード */}
            <Link
              href="/face-type"
              className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold">新しい写真を診断する</span>
            </Link>
          </div>
        ) : (
          // --- データがない場合 ---
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-200">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">まだ診断履歴がありません</h3>
            <p className="mb-8 max-w-sm text-sm text-slate-500">
              顔写真をアップロードして、あなたの顔タイプ診断をはじめましょう。結果はここに保存されます。
            </p>
            <Link
              href="/face-type"
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5"
            >
              診断をスタート
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}