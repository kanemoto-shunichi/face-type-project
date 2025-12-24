'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';

// ----------------------------------------------------------------------
// 1. データ・型定義
// ----------------------------------------------------------------------
import faceTypeParamsFemaleRaw from '@/photo/output_16types_woman/face_type_params.json';
import faceTypeParamsMaleRaw from '@/photo/output_16types_man/face_type_params.json';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend-5csp.onrender.com';
const MIN_PROCESS_TIME_MS = 8000;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ==========================================
// ★広告セクション
// ==========================================
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

// --- Types ---
type AxisKey = 'age' | 'line' | 'contrast' | 'vibe';
type AxisCodeMap = {
  age: 'Y' | 'M';
  line: 'C' | 'L';
  contrast: 'S' | 'D';
  vibe: 'W' | 'K';
};

type NumericParams = {
  eye_size: number;
  face_length: number;
  jaw_roundness: number;
  brow_curve: number;
  contrast_level: number;
  warmth: number;
};

type FaceTypeMeta = {
  index: number;
  axes: {
    age: AxisCodeMap['age'];
    line: AxisCodeMap['line'];
    contrast: AxisCodeMap['contrast'];
    vibe: AxisCodeMap['vibe'];
  };
  numeric_params: NumericParams;
  prompt: string;
};

type RawMetaMap = Record<string, FaceTypeMeta>;

const buildMetaByTypeCode = (raw: RawMetaMap): Record<string, FaceTypeMeta> => {
  const map: Record<string, FaceTypeMeta> = {};
  Object.values(raw).forEach((meta) => {
    const axes = meta.axes;
    const code = `${axes.age}${axes.line}${axes.contrast}${axes.vibe}`;
    map[code] = meta;
  });
  return map;
};

const FACE_TYPE_META_WOMAN: Record<string, FaceTypeMeta> = buildMetaByTypeCode(
  faceTypeParamsFemaleRaw as RawMetaMap,
);
const FACE_TYPE_META_MAN: Record<string, FaceTypeMeta> = buildMetaByTypeCode(
  faceTypeParamsMaleRaw as RawMetaMap,
);

const AXIS_SLIDER_LABELS: Record<AxisKey, { title: string; left: string; right: string }> = {
  age: { title: 'Age Impression', left: 'Youth (Y)', right: 'Mature (M)' },
  line: { title: 'Line Shape', left: 'Curve (C)', right: 'Linear (L)' },
  contrast: { title: 'Contrast', left: 'Soft (S)', right: 'Distinct (D)' },
  vibe: { title: 'Vibe', left: 'Warm (W)', right: 'Cool (K)' },
};

const AXIS_SLIDER_POSITION: Record<AxisKey, Record<string, number>> = {
  age: { Y: 20, M: 80 },
  line: { C: 20, L: 80 },
  contrast: { S: 20, D: 80 },
  vibe: { W: 20, K: 80 },
};

type FaceTypeExample = {
  name: string;
  note?: string | null;
};

type ApiResult = {
  type_code: string;
  numeric_params: NumericParams;
  fileUrl: string;
  examples: FaceTypeExample[];
  resultId?: number | null;
  detailUrl?: string | null;
  is_face_detected: boolean;
};

type Gender = 'woman' | 'man';

const DIAG_STEPS = [
  { key: 'detect', label: 'Face Detection', detail: '顔の座標・角度をスキャン中...' },
  { key: 'feature', label: 'Feature Extraction', detail: 'パーツ比率・特徴量を演算中...' },
  { key: 'classify', label: 'Type Classification', detail: '16タイプへマッピング中...' },
] as const;

// --- Icons ---
const Icons = {
  Upload: () => <svg className="w-8 h-8 text-indigo-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  Check: () => <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>,
  Twitter: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  Tiktok: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 3.18-1.34 6.19-3.72 8.05-2.52 2.15-6.38 2.3-8.88.34-2.67-2.13-3.08-6.19-1.02-8.79 2.11-3.03 6.64-3.32 8.89-1.01.21.21.39.46.59.69V.02z" /></svg>,
  Line: () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.16 9.42C21.16 13.92 17.06 18.06 12 18.06C11.16 18.06 10.33 17.96 9.53 17.75C9.28 17.7 9.03 17.71 8.8 17.84C8.42 18.06 7.21 18.73 5.48 19.46C5.07 19.63 4.67 19.33 4.78 18.91C4.85 18.66 5.15 17.16 5.34 16.03C5.37 15.82 5.3 15.61 5.16 15.44C2.96 13.06 2.84 9.42 2.84 9.42C2.84 4.92 6.94 0.78 12 0.78C17.06 0.78 21.16 4.92 21.16 9.42Z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
};

// ----------------------------------------------------------------------
// 2. Main Component
// ----------------------------------------------------------------------

export default function FaceTypeByPhotoPage() {
  const router = useRouter();

  // --- States ---
  const [gender, setGender] = useState<Gender>('woman');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedCurrentFile, setSubmittedCurrentFile] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Unlock / DB Flow States ---
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasShared, setHasShared] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [savedId, setSavedId] = useState<number | null>(null);

  // 1. 初期ロード時の処理
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    const checkSessionAndRestore = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      const pendingDataStr = localStorage.getItem('pending_diagnosis_result');
      if (pendingDataStr) {
        const pendingData = JSON.parse(pendingDataStr);
        setResult(pendingData.result);
        setGender(pendingData.gender);
        if (pendingData.imageBase64) {
          setPreviewUrl(pendingData.imageBase64);
        } else {
          setPreviewUrl(pendingData.result.fileUrl);
        }
        setSubmittedCurrentFile(true);
        if (session?.user) {
          await saveResultToDb(session.user.id, pendingData.result, pendingData.gender);
          localStorage.removeItem('pending_diagnosis_result');
          setShowUnlockModal(true);
        }
      }
    };
    checkSessionAndRestore();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // DB保存用関数
  const saveResultToDb = async (userId: string | null, resultData: ApiResult, genderData: string) => {
    try {
      const { data, error } = await supabase
        .from('face_results')
        .insert({
          user_id: userId,
          file_url: resultData.fileUrl,
          gender: genderData,
          type_code: resultData.type_code,
          numeric_params: resultData.numeric_params,
        })
        .select()
        .single();
      if (error) {
        console.error('DB保存エラー詳細:', error.message);
      } else if (data) {
        console.log('DB保存成功 ID:', data.id);
        setSavedId(data.id);
      }
    } catch (err) {
      console.error('保存処理中の例外:', err);
    }
  };

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setSubmittedCurrentFile(false);
    setProgress(0);
    setHasShared(false);
    setSavedId(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('顔写真を1枚選択してください。');
      return;
    }
    if (submittedCurrentFile) {
      setError('この写真はすでに診断済みです。');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    const startTime = Date.now();
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 500, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('gender', gender);

      const res = await fetch(`${API_BASE}/predict`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResult;

      const elapsed = Date.now() - startTime;
      const remaining = MIN_PROCESS_TIME_MS - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      setResult(json);
      setSubmittedCurrentFile(true);
      setProgress(100);
      await saveResultToDb(user?.id ?? null, json, gender);
    } catch (e) {
      console.error(e);
      setError('判定中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (loading) {
      setProgress((prev) => (prev === 100 ? 0 : prev));
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          const increment = Math.random() * 8;
          return Math.min(prev + increment, 95);
        });
      }, 300);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [loading]);

  const handleDetailClick = () => {
    if (user && hasShared && savedId) {
      router.push(`/report/${savedId}`);
      return;
    }
    setShowUnlockModal(true);
  };

  const handleLogin = async () => {
    if (!result) return;
    let imageBase64 = '';
    if (file) {
      try { imageBase64 = await fileToBase64(file); } catch (e) { console.error("画像の保存に失敗しました", e); }
    }
    localStorage.setItem('pending_diagnosis_result', JSON.stringify({
      result: result, gender: gender, imageBase64: imageBase64
    }));
    const redirectTo = `${window.location.origin}/face-type`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: redirectTo },
    });
    if (error) { console.error('Login Error:', error); alert('ログインに失敗しました'); }
  };

  const handleShareComplete = async () => {
    setHasShared(true);
    if (savedId) {
      const { error } = await supabase.from('face_results').update({ is_shared: true }).eq('id', savedId);
      if (error) console.error('シェア状態のDB更新に失敗:', error.message);
    }
  };

  let twitterShareUrl = '';
  let lineShareUrl = '';
  if (result) {
    const typeStr = result.type_code || (result as any).typeCode || (result as any).type || (result as any).result;
    const sharePageUrl = `${window.location.origin}/share/${typeStr}?gender=${gender}`;
    const baseShareText = `顔タイプ16診断で「${typeStr}タイプ」でした！`;
    const withGender = gender === 'woman' ? `【顔タイプ16診断（女性）】${baseShareText}` : `【顔タイプ16診断（男性）】${baseShareText}`;
    const encodedUrl = encodeURIComponent(sharePageUrl);
    const encodedText = encodeURIComponent(withGender);
    twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodeURIComponent('顔タイプ診断')},FaceType16`;
    const lineText = encodeURIComponent(`${withGender} ${sharePageUrl}`);
    lineShareUrl = `https://line.me/R/share?text=${lineText}`;
  }

  const currentMetaMap = gender === 'man' ? FACE_TYPE_META_MAN : FACE_TYPE_META_WOMAN;
  let meta: FaceTypeMeta | null = null;
  if (result?.type_code) {
    meta = currentMetaMap[result.type_code];
  }

  const isSubmitDisabled = loading || !file || submittedCurrentFile;
  let activeStepIndex: number | null = null;
  if (loading) {
    if (progress < 34) activeStepIndex = 0;
    else if (progress < 67) activeStepIndex = 1;
    else activeStepIndex = 2;
  }
  const displayImageUrl = (previewUrl && previewUrl.length > 0 ? previewUrl : null) ?? (result?.fileUrl && result.fileUrl.length > 0 ? result.fileUrl : null) ?? null;

  // ----------------------------------------------------------------------
  // 3. Render
  // ----------------------------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pb-20 pt-6 px-4">

      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5">

          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <Icons.Camera />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              顔写真から<span className="text-indigo-600">16タイプ診断</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              AIがパーツ比率と特徴を解析。あなたの印象を言語化します。
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. 性別選択 */}
            <div className="mx-auto mb-8 flex max-w-xs rounded-full bg-slate-100 p-1">
              {(['woman', 'man'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGender(g);
                    setResult(null);
                    setSubmittedCurrentFile(false);
                    setProgress(0);
                  }}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${gender === g ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {g === 'woman' ? '女性' : '男性'}
                </button>
              ))}
            </div>

            {/* 2. アップロードエリア */}
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="group relative mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 transition-all hover:border-indigo-400 hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                    />
                    {previewUrl ? (
                      <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
                        <img src={previewUrl} alt="Preview" className="h-full w-full rounded-lg object-cover" />
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="text-xs font-semibold text-white">写真を変更する</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 transition-transform group-hover:scale-110">
                          <Icons.Upload />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-700">写真をアップロード</p>
                        <p className="mt-1 text-xs text-slate-500">クリック または ドラッグ&ドロップ</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitDisabled}
                      className="relative inline-flex min-w-[200px] items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      診断を開始する
                    </button>
                  </div>
                  {error && <p className="mt-4 text-center text-xs font-medium text-red-500 bg-red-50 py-2 rounded-lg">{error}</p>}
                </motion.div>
              )}

              {/* 3. 解析中ローディング */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-10"
                >
                  <div className="mx-auto w-full max-w-sm">
                    {/* ===== 変更点: ぐるぐる回るスキャンリング (青を強調) ===== */}
                    <div className="relative mx-auto mb-8 h-32 w-32">

                      {/* ぐるぐる回るリング (青色インジケーター + 発光) */}
                      <motion.div
                        className="absolute -inset-3 rounded-full border-[4px] border-transparent border-t-blue-600 border-r-blue-600 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      />

                      {/* ベースの薄い青リング */}
                      <div className="absolute -inset-3 rounded-full border-[4px] border-blue-50" />

                      {/* 内側の画像コンテナ */}
                      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-slate-50 shadow-inner">
                        {previewUrl && <img src={previewUrl} className="h-full w-full object-cover opacity-60 blur-sm" />}
                        {/* 内部のスキャンエフェクト (青色グラデーション) */}
                        <div className="absolute inset-0 animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"></div>
                      </div>
                    </div>
                    {/* =========================================== */}

                    <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                      <span>ANALYZING...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <div className="mt-8 space-y-3">
                      {DIAG_STEPS.map((step, idx) => {
                        const isActive = activeStepIndex === idx;
                        const isDone = activeStepIndex !== null && idx < activeStepIndex;
                        return (
                          <div key={step.key} className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${isActive ? 'border-blue-100 bg-blue-50/50' : 'border-transparent'}`}>
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${isDone ? 'bg-blue-600 text-white' : isActive ? 'bg-white text-blue-600 ring-2 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                              {isDone ? <Icons.Check /> : idx + 1}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isActive || isDone ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                              {isActive && <p className="text-[10px] text-blue-600/80">{step.detail}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. 結果表示 */}
              {result && meta && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {!result.is_face_detected && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-700 leading-relaxed font-medium">
                        顔がはっきりと認識されなかったため、正確な診断結果ではない可能性があります。
                        明るい場所で正面を向いた写真で再度お試しいただくことをおすすめします。
                      </p>
                    </div>
                  )}
                  {/* メイン結果カード */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl sm:p-8">
                    <div className="absolute right-0 top-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-white opacity-10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-48 w-48 rounded-full bg-pink-500 opacity-20 blur-3xl" />
                    <div className="relative flex flex-col items-center text-center">
                      {/* 画像 */}
                      {displayImageUrl && (
                        <div className="mb-6 w-full max-h-72 overflow-hidden rounded-xl border-4 border-white/40 bg-black/10 flex items-center justify-center">
                          <img
                            src={displayImageUrl}
                            alt="診断に使用した写真"
                            className="max-h-72 w-auto object-contain"
                          />
                        </div>
                      )}

                      <p className="text-sm font-medium text-indigo-100 opacity-90">
                        DIAGNOSIS RESULT
                      </p>
                      <h2 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {result.type_code}
                        <span className="text-2xl opacity-80"> type</span>
                      </h2>

                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {(['age', 'line', 'contrast', 'vibe'] as AxisKey[]).map((key) => {
                          const code = meta!.axes[key];
                          return (
                            <span
                              key={key}
                              className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/20"
                            >
                              {code} : {AXIS_SLIDER_LABELS[key].title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 詳細パラメータ (スライダー) */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase tracking-wider">Analysis Detail</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(['age', 'line', 'contrast', 'vibe'] as AxisKey[]).map((axisKey) => {
                        const code = meta!.axes[axisKey];
                        const labels = AXIS_SLIDER_LABELS[axisKey];
                        const pos = AXIS_SLIDER_POSITION[axisKey]?.[code as string] ?? 50;

                        return (
                          <div key={axisKey} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex items-end justify-between">
                              <span className="text-xs font-bold text-slate-500">{labels.title}</span>
                              <span className="text-sm font-bold text-indigo-600">{code}</span>
                            </div>
                            <div className="relative h-2.5 rounded-full bg-slate-100 shadow-inner">
                              <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-transparent" />
                              <motion.div
                                initial={{ width: "50%" }}
                                animate={{ width: `${pos}%` }}
                                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-indigo-300 to-indigo-500 opacity-30"
                              />
                              <motion.div
                                initial={{ left: "50%" }}
                                animate={{ left: `${pos}%` }}
                                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                                className="absolute top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full border-2 border-white bg-indigo-600 shadow-md"
                              />
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                              <span>{labels.left}</span>
                              <span>{labels.right}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 有名人例 */}
                  {result.examples && result.examples.length > 0 && (
                    <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Similar Celebrities</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.examples.slice(0, 3).map((ex, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200">
                            {ex.name}
                            {ex.note && <span className="text-slate-400 text-[10px]">({ex.note})</span>}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-slate-400 text-right">※ イメージ例です</p>
                    </div>
                  )}

                  {/* アクションボタン */}
                  <div className="flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">

                    {/* 再診断ボタン */}
                    <button
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                        setSubmittedCurrentFile(false);
                        setPreviewUrl(null);
                        setHasShared(false);
                        setSavedId(null);
                      }}
                      className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100"
                    >
                      もう一度診断
                    </button>

                    {/* 詳細レポート（アンロックトリガー） */}
                    <button
                      onClick={handleDetailClick}
                      className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      詳細レポートを見る
                      <Icons.ArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AdSection />

      {/* --------------------------------------------- */}
      {/* アンロックモーダル */}
      {/* --------------------------------------------- */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="bg-indigo-600 p-6 text-center text-white">
                <h3 className="text-xl font-bold">詳細レポートをアンロック</h3>
                <p className="mt-2 text-indigo-100 text-sm">続きを見るには、以下の2ステップが必要です</p>
              </div>

              <div className="p-6 space-y-6">
                {/* STEP 1: ログイン */}
                <div className={`flex items-center gap-4 transition-opacity ${user ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold transition-colors ${user ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {user ? <Icons.Check /> : '1'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">アカウント作成 / ログイン</p>
                    <p className="text-xs text-slate-500">診断結果を保存するために必要です</p>
                  </div>
                  {!user && (
                    <button
                      onClick={handleLogin}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700"
                    >
                      Googleでログイン
                    </button>
                  )}
                </div>

                {/* 境界線 */}
                <div className="h-px bg-slate-100 w-full" />

                {/* STEP 2: シェア */}
                <div className={`flex items-center gap-4 transition-opacity ${!user ? 'opacity-30 pointer-events-none' : (hasShared ? 'opacity-50' : 'opacity-100')}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold transition-colors ${hasShared ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {hasShared ? <Icons.Check /> : '2'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">診断結果をシェア</p>
                    <p className="text-xs text-slate-500">SNSで結果をシェアしてロック解除</p>
                  </div>
                </div>

                {/* シェアボタン群（ログイン後のみ押せる） */}
                {user && !hasShared && (
                  <div className="grid grid-cols-2 gap-3 pl-14">
                    {twitterShareUrl && (
                      <button
                        onClick={() => { window.open(twitterShareUrl); handleShareComplete(); }}
                        className="flex items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-white text-xs font-bold hover:bg-slate-800"
                      >
                        <Icons.Twitter /> Xでシェア
                      </button>
                    )}
                    {lineShareUrl && (
                      <button
                        onClick={() => { window.open(lineShareUrl); handleShareComplete(); }}
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#00C300] py-2.5 text-white text-xs font-bold hover:bg-[#00b300]"
                      >
                        <Icons.Line /> LINEで送る
                      </button>
                    )}
                  </div>
                )}

                {/* 完了ボタン */}
                <div className="pt-4">
                  <button
                    onClick={handleDetailClick}
                    disabled={!user || !hasShared}
                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all hover:bg-indigo-500"
                  >
                    レポートを表示する
                  </button>
                  <button
                    onClick={() => setShowUnlockModal(false)}
                    className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600"
                  >
                    閉じる
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}