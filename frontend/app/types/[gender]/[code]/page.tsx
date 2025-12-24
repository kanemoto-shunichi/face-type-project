import React from 'react';
import { notFound } from 'next/navigation';
import { FACE_TYPE_DATA_MAN } from '@/data/faceTypeDataMan';
import { FACE_TYPE_DATA_WOMAN } from '@/data/faceTypeDataWoman';
import { TypeDetailViewer } from '@/app/components/TypeDetailViewer';

type Props = {
  params: Promise<{
    gender: 'man' | 'woman';
    code: string;
  }>;
};

export async function generateStaticParams() {
  const manCodes = Object.keys(FACE_TYPE_DATA_MAN).filter(key => key !== 'DEFAULT');
  const womanCodes = Object.keys(FACE_TYPE_DATA_WOMAN).filter(key => key !== 'DEFAULT');

  const paths = [
    ...manCodes.map((code) => ({ gender: 'man', code })),
    ...womanCodes.map((code) => ({ gender: 'woman', code })),
  ];

  return paths;
}

export default async function TypePage(props: Props) {
  const params = await props.params;
  const { gender, code } = params;
  
  // データの取得
  const dataSource = gender === 'man' ? FACE_TYPE_DATA_MAN : FACE_TYPE_DATA_WOMAN;
  const data = dataSource[code];

  if (!data) return notFound();

  // タイトルなどのSEO情報
  const title = `【${gender === 'man' ? '男性' : '女性'}】${code}タイプの性格・特徴・似合うファッション完全ガイド`;
  const description = data.intro;

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <main className="max-w-2xl mx-auto px-4 py-12">
        
        {/* SEO・AdSense用テキストエリア */}
        <article className="prose prose-slate lg:prose-lg mx-auto mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
          <p className="text-indigo-600 font-bold tracking-widest">{data.subTitle}</p>
          
          <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">どんなタイプ？</h2>
            <p className="text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </article>

        {/* ロック機能付き詳細エリア */}
        <TypeDetailViewer data={data} type_code={code} />

      </main>
    </div>
  );
}