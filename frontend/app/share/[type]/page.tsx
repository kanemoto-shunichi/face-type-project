import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://facetype16.com';

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function normalizeGender(v: string | string[] | undefined): 'man' | 'woman' {
  const g = Array.isArray(v) ? v[0] : v;
  return g === 'man' ? 'man' : 'woman';
}

function normalizeType(v: string | undefined): string {
  const t = (v ?? '').trim().toUpperCase();
  return t || 'DEFAULT';
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { type: rawType } = await params;
  const sp = await searchParams;

  const type = normalizeType(rawType);
  const gender = normalizeGender(sp.gender);

  const pageUrl = new URL(`/share/${encodeURIComponent(type)}`, SITE_URL);
  pageUrl.searchParams.set('gender', gender);

  const ogImageUrl = new URL('/api/og', SITE_URL);
  ogImageUrl.searchParams.set('type', type);
  ogImageUrl.searchParams.set('gender', gender);

  return {
    metadataBase: new URL(SITE_URL),
    title: `私の顔タイプは【${type}】でした！ | 顔タイプ16診断`,
    description: 'AIが顔写真を分析して、あなたの魅力を引き出す「顔タイプ」を診断します。',
    alternates: { canonical: pageUrl.toString() },

    openGraph: {
      url: pageUrl.toString(),
      type: 'website',
      siteName: '顔タイプ16診断',
      title: `診断結果: ${type}タイプ`,
      description: 'あなたも診断してみませんか？',
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `診断結果: ${type}タイプ`,
      description: 'あなたも診断してみませんか？',
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function SharePage({ params, searchParams }: Props) {
  const { type: rawType } = await params;
  const sp = await searchParams;

  const type = normalizeType(rawType);
  const gender = normalizeGender(sp.gender);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-3xl font-bold">診断結果共有</h1>

        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <img
            src={`/api/og?type=${encodeURIComponent(type)}&gender=${gender}`}
            alt="Result OGP"
            className="w-full h-auto"
          />
        </div>

        <p className="text-slate-300 mt-4">
          結果: {type} ({gender === 'man' ? '男性' : '女性'})
        </p>

        <Link
          href="/"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all"
        >
          診断する（トップへ）
        </Link>
      </div>
    </div>
  );
}
