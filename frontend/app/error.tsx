'use client'; // Error Boundaryは必ずClient Componentである必要があります

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // コンソールにエラーを表示
    console.error(error);
    // Sentryにエラーを送信
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900">一時的な不具合が発生しました</h2>
        <p className="mt-2 text-sm text-slate-500">
          申し訳ありません。予期せぬエラーが発生しました。<br />
          再読み込みするか、トップページにお戻りください。
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-500"
          >
            もう一度試す
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            トップに戻る
          </button>
        </div>
        
        {/* デバッグ用: エラーIDがあれば表示 */}
        {error.digest && (
          <p className="mt-6 text-[10px] text-slate-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}