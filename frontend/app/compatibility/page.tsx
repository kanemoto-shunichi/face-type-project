'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';

type NumericParams = {
  eye_size: number; face_length: number; jaw_roundness: number;
  brow_curve: number; contrast_level: number; warmth: number;
};

type ApiResult = {
  type_code: string; 
  numeric_params: NumericParams;
  fileUrl: string;
  is_face_detected: boolean; 
};

type CompatibilityResult = {
  score: number;
  title: string;
  message: string;
  userA_Type: string;
  userB_Type: string;
};

type Gender = 'woman' | 'man';

type PlayerState = {
  file: File | null;
  previewUrl: string | null;
  gender: Gender;
  apiResult: ApiResult | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend-5csp.onrender.com';
const MIN_PROCESS_TIME_MS = 8000;

const Icons = {
  Upload: () => <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>,
  Heart: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>,
  Twitter: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  Line: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.16 9.42C21.16 13.92 17.06 18.06 12 18.06C11.16 18.06 10.33 17.96 9.53 17.75C9.28 17.7 9.03 17.71 8.8 17.84C8.42 18.06 7.21 18.73 5.48 19.46C5.07 19.63 4.67 19.33 4.78 18.91C4.85 18.66 5.15 17.16 5.34 16.03C5.37 15.82 5.3 15.61 5.16 15.44C2.96 13.06 2.84 9.42 2.84 9.42C2.84 4.92 6.94 0.78 12 0.78C17.06 0.78 21.16 4.92 21.16 9.42Z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  LoadingLoop: () => (
    <svg className="animate-spin h-8 w-8 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  ),
};


const AdSection = () => {
  return (
    <section className="w-full py-8 mt-12 mb-8 bg-slate-50 border-t border-b border-slate-100 flex flex-col items-center gap-6 overflow-hidden">
      <p className="text-[10px] text-slate-400 font-medium tracking-widest">RECOMMEND</p>

      <div className="
        w-full px-4
        flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide
        md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:w-auto md:px-0
      ">

        {/* 1. 楽天ウィジェット */}
        <div className="flex-shrink-0 snap-center mx-auto">
          <div className="relative h-[250px] w-[300px] overflow-hidden rounded-lg shadow-sm bg-white">
            <iframe
              src="/rakuten-ad.html"
              width="300"
              height="250"
              scrolling="no"
              frameBorder="0"
              title="Rakuten Widget"
              className="pointer-events-auto"
              style={{ border: 'none', overflow: 'hidden' }}
            />
          </div>
        </div>

        {/* 2. A8バナー (追加分1) */}
        <div className="flex-shrink-0 snap-center mx-auto">
          <div className="relative h-[250px] w-[300px] overflow-hidden rounded-lg shadow-sm bg-white flex justify-center items-center">
            <a href="https://px.a8.net/svt/ejp?a8mat=45KBWX+A65LTE+5QFO+5Z6WX" rel="nofollow" target="_blank">
              <img style={{ border: 0 }} width="300" height="250" alt="" src="https://www20.a8.net/svt/bgt?aid=251211345615&wid=001&eno=01&mid=s00000026754001004000&mc=1" />
            </a>
            <img width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=45KBWX+A65LTE+5QFO+5Z6WX" alt="" style={{ border: 0 }} />
          </div>
        </div>

        {/* 3. A8バナー (追加分2) */}
        <div className="flex-shrink-0 snap-center mx-auto">
          <div className="relative h-[250px] w-[300px] overflow-hidden rounded-lg shadow-sm bg-white flex justify-center items-center">
            <a href="https://px.a8.net/svt/ejp?a8mat=45KB4Y+3VBGC2+4QYG+609HT" rel="nofollow" target="_blank">
              <img style={{ border: 0 }} width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=251210338234&wid=001&eno=01&mid=s00000022156001009000&mc=1" />
            </a>
            <img width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=45KB4Y+3VBGC2+4QYG+609HT" alt="" style={{ border: 0 }} />
          </div>
        </div>

        {/* スマホで右端の余白を確保するためのダミー要素 */}
        <div className="w-1 flex-shrink-0 md:hidden" />

      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// 2. Logic Helper: Calculate Compatibility (New Logic)
// ----------------------------------------------------------------------

// タイプコードの1文字目（Y/M）と2文字目（C/L）を判定に使います
// 例: "YM..." -> Age='Y', Line='M' (※コード体系に合わせて調整してください)
// ここでは "Y(世代) C(形状) S(強さ) W(重さ)" のような並びと仮定します

const calculateCompatibility = (
  typeA: string,
  typeB: string,
  genderA: Gender,
  genderB: Gender
): CompatibilityResult => {
  let score = 60; // 基礎点
  let title = "未知の可能性"; // デフォルト

  const ageA = typeA.charAt(0);
  const lineA = typeA.charAt(1);
  const ageB = typeB.charAt(0);
  const lineB = typeB.charAt(1);


  // 1. 【完全一致】同性・異性問わず、同じタイプは高得点
  if (typeA === typeB) {
    score += 30;
    title = "運命の似た者同士";
  }
  // 2. 【王道バランス】男性(大人M) × 女性(子供Y)
  // 頼りがいのある彼 × 守りたくなる彼女
  else if (genderA === 'man' && ageA === 'M' && genderB === 'woman' && ageB === 'Y') {
    score += 35;
    title = "理想の王子様＆お姫様";
  }
  // 3. 【逆バランス】女性(大人M) × 男性(子供Y)
  // しっかり者の彼女 × 母性本能くすぐる彼
  else if (genderA === 'woman' && ageA === 'M' && genderB === 'man' && ageB === 'Y') {
    score += 25;
    title = "姉さん女房的な好相性";
  }
  // 4. 【形状の一致】曲線同士 or 直線同士（タイプは違ってもノリが合う）
  else if (lineA === lineB) {
    score += 15;
    title = "波長が合う関係";
  }
  // 5. それ以外（世代も形状も違う＝刺激的）
  else {
    score += 5;
    title = "刺激しあえる関係";
  }

  const combined = typeA + typeB + genderA + genderB;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  const jitter = (hash % 10) - 5;

  score += jitter;

  score = Math.min(100, Math.max(0, score));
  return {
    score,
    title,
    message: "",
    userA_Type: typeA,
    userB_Type: typeB
  };
};


export default function FaceTypeCompatibilityPage() {
  const router = useRouter();

  const [playerA, setPlayerA] = useState<PlayerState>({ file: null, previewUrl: null, gender: 'woman', apiResult: null });
  const [playerB, setPlayerB] = useState<PlayerState>({ file: null, previewUrl: null, gender: 'man', apiResult: null });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compResult, setCompResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasShared, setHasShared] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  // 初期ロード＆セッション復元
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // ログイン後のリダイレクト復帰処理
      const pendingDataStr = localStorage.getItem('pending_compatibility_result');
      if (pendingDataStr) {
        const pending = JSON.parse(pendingDataStr);
        setPlayerA(prev => ({ ...prev, ...pending.playerA }));
        setPlayerB(prev => ({ ...prev, ...pending.playerB }));
        setCompResult(pending.compResult);

        // ログイン済みならDB保存してモーダル表示
        if (session?.user) {
          await saveCompatibilityToDb(pending.playerA.apiResult, pending.playerB.apiResult, pending.compResult, session.user.id);
          localStorage.removeItem('pending_compatibility_result');
          setShowUnlockModal(true);
        }
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 相性結果をDBに保存する関数
  const saveCompatibilityToDb = async (resA: ApiResult, resB: ApiResult, scoreObj: CompatibilityResult, userId: string | null) => {
    try {
      const { data, error } = await supabase
        .from('compatibility_results')
        .insert({
          user_id: userId,
          file_url_a: resA.fileUrl,
          gender_a: playerA.gender,
          type_code_a: resA.type_code,
          file_url_b: resB.fileUrl,
          gender_b: playerB.gender,
          type_code_b: resB.type_code,
          score: scoreObj.score,
        })
        .select()
        .single();

      if (data) setSavedId(data.id);
      if (error) console.error("DB Save Error:", error.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);

    setCompResult(null); setError(null); setHasShared(false); setSavedId(null);
    if (target === 'A') setPlayerA(prev => ({ ...prev, file: f, previewUrl: url, apiResult: null }));
    else setPlayerB(prev => ({ ...prev, file: f, previewUrl: url, apiResult: null }));
  };

  const handleGenderChange = (gender: Gender, target: 'A' | 'B') => {
    if (target === 'A') setPlayerA(prev => ({ ...prev, gender }));
    else setPlayerB(prev => ({ ...prev, gender }));
  };

  const predictOne = async (player: PlayerState): Promise<ApiResult> => {
    if (!player.file) throw new Error("File missing");
    const options = { maxSizeMB: 1, maxWidthOrHeight: 500, useWebWorker: true };
    const compressedFile = await imageCompression(player.file, options);
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('gender', player.gender);

    const res = await fetch(`${API_BASE}/predict`, { method: 'POST', body: formData });
    return (await res.json()) as ApiResult;
  };

  const handleSubmit = async () => {
    if (!playerA.file || !playerB.file) {
      setError('2枚の写真を選択してください。');
      return;
    }
    setLoading(true); setProgress(0); setError(null);
    const startTime = Date.now();

    try {
      const [resA, resB] = await Promise.all([predictOne(playerA), predictOne(playerB)]);

      const elapsed = Date.now() - startTime;
      const remaining = MIN_PROCESS_TIME_MS - elapsed;
      if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

      setPlayerA(prev => ({ ...prev, apiResult: resA }));
      setPlayerB(prev => ({ ...prev, apiResult: resB }));

      // 相性計算
      const scoreObj = calculateCompatibility(
        resA.type_code,
        resB.type_code,
        playerA.gender,
        playerB.gender
      );
      setCompResult(scoreObj);
      setProgress(100);

      await saveCompatibilityToDb(resA, resB, scoreObj, user?.id ?? null);

    } catch (e) {
      console.error(e);
      setError('解析に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = () => {
    if (user && hasShared && savedId) {
      router.push(`/comReport/${savedId}`); 
      return;
    }
    setShowUnlockModal(true);
  };

  const handleLogin = async () => {
    // 現在の状態を保存してからログインへ
    if (compResult && playerA.apiResult && playerB.apiResult) {
      const pendingData = {
        playerA: { gender: playerA.gender, previewUrl: playerA.previewUrl, apiResult: playerA.apiResult },
        playerB: { gender: playerB.gender, previewUrl: playerB.previewUrl, apiResult: playerB.apiResult },
        compResult: compResult
      };
      localStorage.setItem('pending_compatibility_result', JSON.stringify(pendingData));
    }

    const redirectTo = window.location.href;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo },
    });
    if (error) alert('ログインエラー');
  };

  const handleShareComplete = async () => {
    setHasShared(true);
    // DBのフラグ更新など必要ならここで行う
    if (savedId) {
      await supabase.from('compatibility_results').update({ is_shared: true }).eq('id', savedId);
    }
  };

  // SNSシェアURL
  let twitterShareUrl = '';
  let lineShareUrl = '';
  if (compResult) {
    const text = `【顔タイプ相性診断】二人の相性は... ${compResult.score}点でした！ #顔タイプ診断`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(text + " " + url)}`;
  }

  // アップロードカード (変更なし)
  const UploadCard = ({ target, player, setPlayer }: { target: 'A' | 'B', player: PlayerState, setPlayer: any }) => (
    <div className="flex-1 min-w-[140px]">
      <div className="mb-2 flex justify-center">
        <div className="flex bg-rose-50 rounded-full p-1">
          <button onClick={() => handleGenderChange('woman', target)} className={`px-3 py-1 text-xs rounded-full transition ${player.gender === 'woman' ? 'bg-white shadow text-rose-500 font-bold' : 'text-slate-400'}`}>Woman</button>
          <button onClick={() => handleGenderChange('man', target)} className={`px-3 py-1 text-xs rounded-full transition ${player.gender === 'man' ? 'bg-white shadow text-rose-500 font-bold' : 'text-slate-400'}`}>Man</button>
        </div>
      </div>
      <div className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 transition-all hover:border-rose-400 hover:bg-rose-50">
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, target)} className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" />
        {player.previewUrl ? (
          <div className="h-full w-full relative">
            <img src={player.previewUrl} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-bold">変更する</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-rose-300">
            <Icons.Upload />
            <span className="text-xs font-bold">{target === 'A' ? 'あなた' : 'お相手'}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 bg-slate-50 flex flex-col items-center">
      <motion.div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 relative">

          {/* ヘッダー */}
          {!compResult && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                顔タイプ<span className="text-rose-600">相性診断</span>
              </h1>
              <p className="mt-2 text-xs text-slate-500">AIが二人の顔立ちを分析し、相性をスコア化</p>
            </div>
          )}

          {/* 入力 or 結果 */}
          {!compResult && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex gap-4 justify-center">
                <UploadCard target="A" player={playerA} setPlayer={setPlayerA} />
                <div className="flex items-center justify-center text-rose-300"><span className="text-2xl font-serif italic">x</span></div>
                <UploadCard target="B" player={playerB} setPlayer={setPlayerB} />
              </div>
              <div className="text-center">
                <button onClick={handleSubmit} disabled={!playerA.file || !playerB.file} className="w-full max-w-xs rounded-full bg-rose-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-rose-500 disabled:bg-slate-300">
                  相性を診断する
                </button>
                {error && <p className="mt-4 text-xs font-bold text-red-500">{error}</p>}
              </div>
            </motion.div>
          )}

          {/* ローディング */}
          {loading && (
            <div className="py-12 text-center">
              <div className="relative mx-auto h-32 w-32 mb-6">
                <Icons.LoadingLoop /> {/* 簡易的なローディングアイコンか、既存のアニメーション */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-rose-500 text-xl">{Math.round(progress)}%</div>
              </div>
              <h3 className="text-lg font-bold text-slate-700">Analyzing...</h3>
            </div>
          )}

          {/* 結果表示画面 (パラメータなし、タイプとスコアのみ) */}
          {compResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">

              {/* 顔認識失敗時の警告 */}
              {((playerA.apiResult && !playerA.apiResult.is_face_detected) || (playerB.apiResult && !playerB.apiResult.is_face_detected)) && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[10px] text-amber-700">
                  ⚠️ 一部の顔が正しく認識されなかったため、精度が低い可能性があります。
                </div>
              )}

              {/* スコア表示 */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
                <span className="text-6xl font-black">{compResult.score}%</span>
                <h2 className="text-xl font-bold mt-2">{compResult.title}</h2>
              </div>

              {/* 分類結果（16タイプ名のみ） */}
              <div className="flex justify-around items-center py-4 border-y border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">You</p>
                  <p className="text-lg font-extrabold text-slate-800">{playerA.apiResult?.type_code}</p>
                </div>
                <div className="text-rose-300 font-serif italic text-xl">vs</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Partner</p>
                  <p className="text-lg font-extrabold text-slate-800">{playerB.apiResult?.type_code}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">やり直す</button>
                <button onClick={handleDetailClick} className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg flex items-center gap-2">
                  詳細レポートを見る <Icons.ArrowRight />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 広告セクション */}
      <AdSection />

      {/* アンロックモーダル（ログイン＋シェア） */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="bg-rose-600 p-6 text-center text-white">
                <h3 className="text-xl font-bold">詳細レポートをアンロック</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Login Step */}
                <div className={`flex items-center gap-4 ${user ? 'opacity-50' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${user ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{user ? <Icons.Check /> : 1}</div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold">アカウント作成 / ログイン</p>
                    {!user && <button onClick={handleLogin} className="mt-1 text-xs bg-slate-900 text-white px-3 py-1 rounded">Googleでログイン</button>}
                  </div>
                </div>
                <div className="h-px bg-slate-100"></div>
                {/* Share Step */}
                <div className={`flex items-center gap-4 ${!user ? 'opacity-30 pointer-events-none' : (hasShared ? 'opacity-50' : '')}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${hasShared ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{hasShared ? <Icons.Check /> : 2}</div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold">結果をシェアしてロック解除</p>
                    {user && !hasShared && (
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => { window.open(twitterShareUrl); handleShareComplete(); }} className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold">X</button>
                        <button onClick={() => { window.open(lineShareUrl); handleShareComplete(); }} className="bg-[#00C300] text-white px-3 py-1.5 rounded text-xs font-bold">LINE</button>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleDetailClick} disabled={!user || !hasShared} className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg disabled:bg-slate-200 disabled:text-slate-400">
                  レポートを表示する
                </button>
                <button onClick={() => setShowUnlockModal(false)} className="w-full text-center text-xs text-slate-400 mt-2">閉じる</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}