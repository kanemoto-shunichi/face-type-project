'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold">システムエラーが発生しました</h1>
          <p className="mt-2 text-slate-600">現在アクセスできません。しばらくしてから再度お試しください。</p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-full bg-indigo-600 px-6 py-2 text-white font-bold"
          >
            再読み込み
          </button>
        </div>
      </body>
    </html>
  );
}