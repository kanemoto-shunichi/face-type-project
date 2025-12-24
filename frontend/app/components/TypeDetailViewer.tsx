'use client';

import React, { useState } from 'react';
import { StaticTypeData } from '@/data/types';
import { motion } from 'framer-motion';

// アイコン定義（省略）... Iconsコンポーネントなど

type Props = {
  data: StaticTypeData;
  type_code: string;
};

export const TypeDetailViewer = ({ data, type_code }: Props) => {
  // ★ここで「ロック状態」を管理
  // 将来的にはここで「購入済みか？」を判定するロジックに変えられます
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleShareUnlock = () => {
    const url = window.location.href;
    const text = `顔タイプ診断【${type_code}】の詳細をチェック！ #FaceType16`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    
    // シェアしたらロック解除（簡易版）
    setIsUnlocked(true);
  };

  return (
    <div className="mt-8 space-y-12">
      
      {/* 1. 無料公開エリア（人相学的特徴など、少しだけ見せる） */}
      <section>
        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">1. 基本特徴</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {data.physiognomy.slice(0, 2).map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. ロックエリア（ここから下を隠す） */}
      <section className="relative">
        
        {/* ▼ ロック中はぼかしとオーバーレイを表示 ▼ */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/60 backdrop-blur-md border border-white/50 p-6 text-center">
            <div className="mb-4 p-4 bg-slate-900 rounded-full text-white">
              {/* 鍵アイコン */}
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">続きを見るには？</h3>
            <p className="text-sm text-slate-600 mb-6">
              SNSでシェアすると<br/>
              <span className="font-bold text-indigo-600">詳細レポート（オーラ・MBTI）</span><br/>
              が無料で閲覧できます。
            </p>
            <button
              onClick={handleShareUnlock}
              className="w-full max-w-xs py-3 px-6 bg-black text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              シェアしてロック解除
            </button>
            {/* 将来的な課金ボタン用プレースホルダー */}
            {/* <button className="mt-3 text-xs text-slate-400 underline">プレミアムプランで購入</button> */}
          </div>
        )}

        {/* ▼ コンテンツ本体（ロック中は見えない/ぼやける） ▼ */}
        <div className={`space-y-8 transition-opacity duration-500 ${!isUnlocked ? 'opacity-20 pointer-events-none select-none' : 'opacity-100'}`}>
          
          {/* オーラ（隠したい情報） */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">2. オーラ鑑定</h3>
            {data.aura.map((item, idx) => (
              <div key={idx} className="mb-4 bg-indigo-50 p-6 rounded-2xl">
                <h4 className="font-bold text-indigo-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-700">{item.body}</p>
              </div>
            ))}
          </div>

          {/* MBTI（隠したい情報） */}
          <div>
             <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">3. MBTI分析</h3>
             {/* ... MBTIのマップ展開処理 ... */}
             <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <p className="text-center">MBTI分析の詳細データ...</p>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
};