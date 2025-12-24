'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

import { StaticTypeData } from '@/data/types';
import { FACE_TYPE_DATA_WOMAN, COLOR_MAP } from '@/data/faceTypeDataWoman';
import { FACE_TYPE_DATA_MAN } from '@/data/faceTypeDataMan';
import { StickyAdLayout } from '@/components/StickyAdLayout';

// ----------------------------------------------------------------------
// 1. 型定義 (結果データ用)
// ----------------------------------------------------------------------

type FaceResult = {
  id: number;
  type_code: string;
  numeric_params: {
    eye_size: number;
    face_length: number;
    jaw_roundness: number;
    brow_curve: number;
    contrast_level: number;
    warmth: number;
  };
  gender: string;
  created_at: string;
  is_shared?: boolean;
};

const Icons = {
  Lock: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Twitter: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  Fashion: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Makeup: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
};

const PARAM_LABELS: Record<keyof FaceResult['numeric_params'], string> = {
  eye_size: '目の大きさ',
  face_length: '顔の縦横比',
  jaw_roundness: '輪郭の丸み',
  brow_curve: '眉の曲線度',
  contrast_level: '立体感',
  warmth: '雰囲気'
};

// ----------------------------------------------------------------------
// 3. メインコンポーネント
// ----------------------------------------------------------------------

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<FaceResult | null>(null);
  const [staticData, setStaticData] = useState<StaticTypeData>(FACE_TYPE_DATA_WOMAN.DEFAULT);
  const [loading, setLoading] = useState(true);

  const [isShared, setIsShared] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [population, setPopulation] = useState<number>(0);
  const [faceScore, setFaceScore] = useState<number>(0);

  useEffect(() => {
    const fetchResultData = async () => {
      const { data, error } = await supabase
        .from('face_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error || !data) return;

      setResult(data);
      if (data.is_shared) setIsShared(true);

      const type_code = data.type_code;
      const gender = data.gender; 

      let sourceData = FACE_TYPE_DATA_WOMAN;

      if (gender === 'man') {
        sourceData = FACE_TYPE_DATA_MAN; // 将来的にこれを有効化
      }

      setStaticData(sourceData[type_code] || sourceData.DEFAULT);

      const p = data.numeric_params;
      const standardEye = 0.5;
      const standardContrast = 0.5;
      const multiplier = 35;
      let rawScore = 50
        + (p.eye_size - standardEye) * multiplier
        + (p.contrast_level - standardContrast) * multiplier;
      const score = Math.min(75, Math.max(20, Math.floor(rawScore)));

      setFaceScore(score);

      const { count } = await supabase
        .from('face_results')
        .select('*', { count: 'exact', head: true })
        .eq('type_code', type_code);

      setPopulation((count || 0) * 31);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        if (profile?.is_premium) setIsPremium(true);
      }
      setLoading(false);
    };

    fetchResultData();
  }, [resultId]);

const handleShare = async () => {
    if (!result) return;
    const typeStr = result.type_code || (result as any).typeCode
    const origin = window.location.origin;
    const shareUrl = `${origin}/share/${typeStr}?gender=${result.gender}`;

    const text = `私の顔タイプは【${typeStr}】でした！\nAI診断で自分の魅力を発見✨\n#FaceType16 #顔タイプ診断`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, 
      '_blank'
    );
    const { error } = await supabase
      .from('face_results')
      .update({ is_shared: true })
      .eq('id', result.id);

    if (!error) setIsShared(true);
  };

  const handlePurchase = async () => {
    alert('デモ：決済機能へ遷移します');
  };

  if (loading || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  const hasData = staticData.physiognomy.length > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-32">
      <StickyAdLayout />
      {/* --- HERO SECTION --- */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-300 drop-shadow-2xl tracking-tighter">
              {result.type_code}
            </h1>
            <div className="space-y-1">
              <p className="text-sm font-medium text-indigo-200 tracking-[0.2em] uppercase">
                {staticData.subTitle}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {staticData.title}
              </h2>
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
              <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
          </motion.div>
        </div>

        <Link href="/mypage" className="absolute top-6 left-6 z-20 rounded-full bg-white/10 p-3 backdrop-blur-md transition active:scale-95">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-20 -mt-16 px-4 space-y-6 md:px-0 max-w-2xl mx-auto">

        {/* 1. 鑑定サマリー */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Icons.Sparkles /></div>
            <h3 className="text-lg font-bold text-slate-800">鑑定サマリー</h3>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
            {staticData.intro}
          </p>
        </motion.div>

        {/* 2. 人相学的特徴 */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 pl-4 tracking-widest uppercase">1. 人相学的特徴</h3>
          {staticData.physiognomy.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100"
            >
              <h4 className="text-base font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600 leading-7">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* 3. シェアロックエリア */}
        <div className="relative pt-6">
          <div className={`transition-all duration-700 space-y-6 ${!isShared ? 'blur-lg grayscale opacity-60 pointer-events-none select-none' : ''}`}>

            {/* オーラ鑑定 */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 pl-4 tracking-widest uppercase">2. オーラ鑑定</h3>
              {staticData.aura.map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-pink-50 to-white rounded-[1.5rem] p-6 shadow-sm border border-pink-100">
                  <h4 className="text-base font-bold text-pink-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-700 leading-7">{item.body}</p>
                </div>
              ))}
            </div>

            {/* ファッション・メイク・カラー */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 pl-4 tracking-widest uppercase">3. スタイル & アドバイス</h3>
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase">似合うカラー</h4>
                <div className="flex flex-wrap gap-3">
                  {staticData.colors.map((c, i) => {
                    // インポートした COLOR_MAP を使用
                    const colorCode = COLOR_MAP[c] || '#E2E8F0';
                    return (
                      <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div
                          className="w-4 h-4 rounded-full shadow-inner"
                          style={{ background: `linear-gradient(to bottom right, ${colorCode}, ${colorCode}aa)` }}
                        ></div>
                        <span className="text-sm font-bold text-slate-600">{c}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-50 rounded-xl text-pink-500"><Icons.Fashion /></div>
                    <h3 className="font-bold text-slate-800">Fashion</h3>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{staticData.fashion}</p>
                </div>

                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Icons.Makeup /></div>
                    <h3 className="font-bold text-slate-800">Makeup</h3>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{staticData.makeup}</p>
                </div>
              </div>
            </div>
          </div>

          {!isShared && hasData && (
            <div className="absolute top-20 left-0 right-0 z-30 flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl p-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Icons.Lock />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">全結果をアンロック</h3>
                <p className="mb-6 text-sm text-slate-500 font-medium leading-6">
                  シェアして「オーラ・メイク」に加え<br />
                  <span className="font-bold text-pink-500">MBTI・顔面偏差値</span> もすべて見る
                </p>
                <button
                  onClick={handleShare}
                  className="w-full rounded-2xl bg-black py-4 font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Icons.Twitter /> Xでシェアして見る
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------
           4. プレミアムロック (MBTI)
           ------------------------------------------------ */}
        <div className="relative pt-8 pb-12">
          <div className={`transition-all duration-700 space-y-6 ${!isPremium && !isShared ? 'blur-xl opacity-40 pointer-events-none select-none' : ''}`}>

            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">4. 深層心理 (MBTI)</h3>
              <span className="px-2 py-0.5 bg-yellow-400 text-xs font-bold rounded text-slate-900">PREMIUM</span>
            </div>

            {staticData.mbtiGroups.map((group, idx) => (
              <div key={idx} className="overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-xl">
                {/* Header */}
                <div className="bg-white/10 p-6 backdrop-blur-md">
                  <p className="text-xs font-bold text-yellow-400 mb-1">{group.groupName}</p>
                  <h4 className="text-xl font-bold mb-2">{group.catchPhrase}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{group.description}</p>
                </div>
                {/* List */}
                <div className="p-6 space-y-6">
                  {group.items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-indigo-300 text-sm">{item.type}</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">ギャップ: {item.gap}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ===== Numeric Params ===== */}
            {result && (
              <div className="rounded-[1.5rem] border border-slate-700 bg-slate-800/80 p-6 shadow-lg backdrop-blur-sm">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">分析データ詳細 (Numeric Params)</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {(Object.keys(result.numeric_params) as Array<keyof FaceResult['numeric_params']>).map((key) => {
                    const val = result.numeric_params[key];
                    const percent = Math.min(100, Math.max(0, val * 100));
                    return (
                      <div key={key}>
                        <div className="mb-1 flex items-end justify-between">
                          <span className="text-[10px] font-medium text-slate-300">{PARAM_LABELS[key] || key}</span>
                          <span className="font-mono text-[10px] text-slate-400">{Math.round(percent)}%</span>
                        </div>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 rounded-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-3xl bg-white p-6 text-center shadow-lg border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">顔面偏差値</div>
                <div className="text-4xl font-black text-slate-800">{faceScore}</div>
              </div>
              <div className="rounded-3xl bg-white p-6 text-center shadow-lg border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">同タイプ</div>
                <div className="text-4xl font-black text-slate-800">{population.toLocaleString()} <span className="text-sm font-normal">人</span></div>
              </div>
            </div>

          </div>

          {!isPremium && !isShared && hasData && (
            <div className="absolute top-20 left-0 right-0 z-30 flex items-center justify-center p-4">
              <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-slate-900/95 backdrop-blur-xl p-8 text-center shadow-2xl border border-white/10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-white shadow-lg shadow-orange-500/30">
                  <Icons.Star />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">禁断の相性診断</h3>
                <p className="mb-6 text-sm text-slate-400">
                  上のシェアボタンから共有すると<br />
                  <span className="text-yellow-400 font-bold">期間限定で無料アンロック</span><br />
                  されます！
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group relative w-full overflow-hidden rounded-2xl bg-white/10 py-4 font-bold text-white transition-colors hover:bg-white/20"
                >
                  シェアエリアへ戻る
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      <div className="h-[70px] w-full md:hidden" aria-hidden="true" />
    </div>
  );
}