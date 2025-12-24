"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { StickyAdLayout } from "../components/StickyAdLayout";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const CheckIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SparklesIcon = () => (
  <svg
    className="h-5 w-5 text-amber-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const MannequinHeadFront = () => (
  <svg viewBox="0 0 160 210" className="h-24 w-24 md:h-32 md:w-32" fill="none">
    <defs>
      <radialGradient id="headGradient" cx="50%" cy="20%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#d4d4d4" />
      </radialGradient>
      <linearGradient id="neckGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e5e5e5" />
        <stop offset="100%" stopColor="#c7c7c7" />
      </linearGradient>
    </defs>
    <path
      d="M80 24 C 56 24, 42 44, 42 72 C 42 104, 52 126, 80 138 C 108 126, 118 104, 118 72 C 118 44, 104 24, 80 24 Z"
      fill="url(#headGradient)"
      stroke="#e5e5e5"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M80 88 C 78 98, 79 108, 80 114" stroke="#d0d0d0" strokeWidth={1.1} strokeLinecap="round" />
    <path d="M66 126 C 72 130, 88 130, 94 126" stroke="#d0d0d0" strokeWidth={1.2} strokeLinecap="round" />
    <path d="M60 138 C 54 150, 48 160, 44 176 L 116 176 C 112 160, 106 150, 100 138 Z" fill="url(#neckGradient)" />
    <line x1={80} y1={40} x2={80} y2={132} stroke="#000000" strokeWidth={1.6} strokeLinecap="round" />
    <line x1={52} y1={94} x2={108} y2={94} stroke="#000000" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

type HeroAxisKey = "age" | "line" | "contrast" | "vibe";
const HERO_SAMPLE_TYPE = "YCSW";
const HERO_AXIS_CONFIG: Record<
  HeroAxisKey,
  { title: string; left: string; right: string; code: string; pos: number }
> = {
  age: { title: "Age Impression", left: "Youth (Y)", right: "Mature (M)", code: "Y", pos: 28 },
  line: { title: "Line Shape", left: "Curve (C)", right: "Linear (L)", code: "C", pos: 30 },
  contrast: { title: "Contrast", left: "Soft (S)", right: "Distinct (D)", code: "S", pos: 32 },
  vibe: { title: "Vibe", left: "Warm (W)", right: "Cool (K)", code: "W", pos: 35 },
};

const AdSection = () => {
  return (
    <section className="mt-12 mb-8 flex w-full flex-col items-center gap-10 overflow-hidden border-t border-b border-slate-100 bg-slate-50 py-10">
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-[10px] font-medium tracking-widest text-slate-400">RECOMMEND</p>

        <div
          className="
            w-full px-4
            flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide
            md:flex-wrap md:justify-center md:overflow-visible md:w-auto md:px-0
          "
        >
          <div className="flex-shrink-0 snap-center">
            <div className="relative h-[250px] w-[300px] overflow-hidden rounded-lg bg-white shadow-sm">
              <iframe
                src="/rakuten-ad.html"
                width="300"
                height="250"
                scrolling="no"
                frameBorder="0"
                title="Rakuten Widget"
                className="pointer-events-auto"
                style={{ border: "none", overflow: "hidden" }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 snap-center">
            <div className="relative flex h-[250px] w-[300px] items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <a
                href="https://px.a8.net/svt/ejp?a8mat=45KBWX+A65LTE+5QFO+5Z6WX"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <img
                  style={{ border: 0 }}
                  width="300"
                  height="250"
                  alt=""
                  src="https://www20.a8.net/svt/bgt?aid=251211345615&wid=001&eno=01&mid=s00000026754001004000&mc=1"
                />
              </a>
              <img
                width="1"
                height="1"
                src="https://www19.a8.net/0.gif?a8mat=45KBWX+A65LTE+5QFO+5Z6WX"
                alt=""
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 snap-center">
            <div className="relative flex h-[250px] w-[300px] items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <a
                href="https://px.a8.net/svt/ejp?a8mat=45KB4Y+3VBGC2+4QYG+609HT"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                <img
                  style={{ border: 0 }}
                  width="300"
                  height="250"
                  alt=""
                  src="https://www27.a8.net/svt/bgt?aid=251210338234&wid=001&eno=01&mid=s00000022156001009000&mc=1"
                />
              </a>
              <img
                width="1"
                height="1"
                src="https://www19.a8.net/0.gif?a8mat=45KB4Y+3VBGC2+4QYG+609HT"
                alt=""
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="w-1 flex-shrink-0 md:hidden" />
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {

  return (
    <>
     <StickyAdLayout />

      {/* ===== ヒーローセクション ===== */}
      <motion.section
        className="relative flex flex-col items-center gap-12 px-4 py-12 md:px-8 lg:flex-row lg:items-start lg:gap-20 lg:pt-20"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute -top-20 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-[80px] md:h-[500px] md:w-[500px] md:blur-[100px] lg:left-0 lg:translate-x-0" />

        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-[10px] font-medium text-indigo-600 shadow-sm md:text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            AI Image Analysis v2.0
          </motion.div>

          <motion.h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl" variants={itemVariants}>
            あなたの顔を、
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              １６タイプに<br className="sm:hidden" />
              言語化
            </span>
          </motion.h1>

          <motion.p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg" variants={itemVariants}>
            感覚的な「印象」を、4つの分析軸と16のタイプへと分類。
            <br className="hidden md:block" />
            AIがあなたの顔立ちを解析し、客観的なデータとして可視化します。
          </motion.p>

          <motion.div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start" variants={itemVariants}>
            <Link
              href="/face-type"
              className="group relative inline-flex w-full min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
            >
              <span>診断をはじめる</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            <div className="group relative inline-flex w-full min-w-[200px] cursor-not-allowed items-center justify-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-slate-50 px-8 py-3.5 text-sm font-bold text-slate-400 shadow-sm transition-all sm:w-auto">
              <span className="group-hover:hidden">相性診断（準備中） →</span>
              <span className="hidden text-xs font-medium text-slate-500 group-hover:block">現在準備中です...</span>
            </div>
          </motion.div>

          <motion.div className="mt-8 flex flex-col items-center gap-3 text-xs font-medium text-slate-500 sm:flex-row sm:gap-6" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <span>10,000+ Users</span>
            </div>
            <div className="hidden h-4 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-1.5">
              <SparklesIcon />
              <span>AI Powered Analysis</span>
            </div>
          </motion.div>
        </div>

        {/* ===== 右側カード ===== */}
        <motion.div className="relative mt-8 w-full max-w-[420px] flex-1 lg:mt-0" variants={itemVariants}>
          <motion.div
            className="absolute -right-2 -top-10 z-20 w-48 md:-right-8 md:-top-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: 1 },
            }}
          >
            <div className="relative rounded-2xl border border-white/60 bg-white/95 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm">
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/60 bg-white/95" />
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-0.5 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                期間限定
              </div>
              <div className="mt-1 text-center">
                <p className="text-[10px] font-bold text-slate-500">\ 今なら /</p>
                <p className="text-xs font-bold leading-tight text-slate-800">
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">シェア</span>
                  でプレミアム
                  <br />
                  結果が見れる！✨
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative aspect-[4/5] w-full lg:aspect-square">
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl">
              <div className="flex h-full flex-col p-5 md:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="h-3 w-20 rounded-full bg-slate-200/80" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs">📷</div>
                </div>

                <div className="mt-4 flex justify-center md:mt-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-inner md:h-28 md:w-28">
                    <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MannequinHeadFront />
                    </div>
                    <div className="absolute inset-0 h-full w-full animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-indigo-400/15 to-transparent" />
                  </div>
                </div>

                <div className="mt-4 md:mt-6">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white shadow-xl md:p-5">
                    <div className="pointer-events-none absolute right-0 top-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 -mb-12 -ml-12 h-32 w-32 rounded-full bg-pink-500/30 blur-2xl" />

                    <div className="relative text-center">
                      <p className="text-[10px] font-medium text-indigo-100/90 md:text-xs">DIAGNOSIS RESULT</p>
                      <h2 className="mt-1 text-2xl font-extrabold tracking-tight md:mt-2 md:text-3xl">
                        {HERO_SAMPLE_TYPE} <span className="text-base opacity-80 md:text-lg">type</span>
                      </h2>

                      <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:mt-4 md:gap-2">
                        {(Object.keys(HERO_AXIS_CONFIG) as HeroAxisKey[]).map((axisKey) => {
                          const axis = HERO_AXIS_CONFIG[axisKey];
                          return (
                            <span
                              key={axisKey}
                              className="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm md:px-3 md:text-[11px]"
                            >
                              {axis.code} : {axis.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 md:mt-5 md:gap-3">
                  {(Object.keys(HERO_AXIS_CONFIG) as HeroAxisKey[]).map((axisKey) => {
                    const axis = HERO_AXIS_CONFIG[axisKey];
                    return (
                      <div key={axisKey} className="rounded-xl border border-white/70 bg-white/80 p-2.5 shadow-sm md:p-3">
                        <div className="mb-1.5 flex items-end justify-between md:mb-2">
                          <span className="text-[10px] font-bold text-slate-500 md:text-[11px]">{axis.title}</span>
                          <span className="text-[10px] font-bold text-indigo-600 md:text-xs">{axis.code}</span>
                        </div>
                        <div className="relative h-1.5 rounded-full bg-slate-100 md:h-2">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-500"
                            style={{ width: `${axis.pos}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ===== About セクション (Bento Grid) ===== */}
      <motion.section
        id="about"
        className="px-4 py-16 md:py-24"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="mb-12 text-center md:mb-16">
          <motion.h2 variants={itemVariants} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            感覚をデータに変える、<br />
            新しい自己分析体験。
          </motion.h2>
          <motion.p variants={itemVariants} className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            MBTIのようなロジックを顔分析に応用。4つの軸（Y/M・C/L・S/D・W/K）で
            <br className="hidden sm:block" />
            あなたの持つ「言葉にできない雰囲気」を16種類のコードで定義します。
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div variants={itemVariants} className="relative col-span-1 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2 md:p-8">
            <div className="absolute right-0 top-0 -mr-10 -mt-10 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 blur-3xl" />
            <h3 className="relative text-lg font-bold text-slate-900 md:text-xl">4つの軸で精密分析</h3>
            <p className="relative mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              「年齢印象」「曲線・直線」「コントラスト」「雰囲気」。これらを個別にスコアリングし、組み合わせることで、単なる「かわいい・かっこいい」以上の解像度で顔タイプを特定します。
            </p>
            <div className="relative mt-6 flex flex-wrap gap-2 md:mt-8">
              {["Y/M", "C/L", "S/D", "W/K"].map((tag) => (
                <span key={tag} className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm md:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-500 opacity-20 blur-3xl transition-all group-hover:opacity-30" />
            <h3 className="relative text-lg font-bold md:text-xl">活用シーン</h3>
            <ul className="relative mt-4 space-y-3 text-sm text-slate-300">
              {["似合う髪型・メイクの発見", "プロフィール写真の選定", "ファッションの方向性"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckIcon /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      <AdSection />

      {/* ===== 診断プロセス (High-Tech Ver) ===== */}
      <motion.section
        className="border-t border-slate-200 bg-slate-50/50 py-16 md:py-24"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mb-12 px-4 text-center md:mb-16">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Algorithmic Process</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-loose text-slate-600 md:text-base">
            FaceType16は、単純なパターンマッチングではありません。
            <br className="hidden md:block" />
            入力された非構造化データ（画像）に対し、幾何学的特徴のベクトル化、正規化、そして独自の推論モデルによる多次元解析を実行します。
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.7)]">
            <div className="relative grid gap-8 p-6 md:grid-cols-[0.85fr,1.15fr] md:p-10">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-300 ring-1 ring-indigo-500/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  Processing Pipeline
                </p>
                <p className="text-sm leading-relaxed text-slate-200">
                  入力画像は、複数のステージを通して逐次変換されます。各フェーズが独立した役割を持ちながら、最終的な16タイプ推論に向けて連結されたパイプラインとして機能します。
                </p>
              </div>

              <div className="relative space-y-4 md:space-y-6">
                {[
                  { step: "01", title: "Preprocessing", sub: "前処理と正規化", desc: "入力画像を解析可能な状態へ変換。アフィン変換による顔の向きの補正、ヒストグラム平坦化を行います。" },
                  { step: "02", title: "Vectorization", sub: "特徴量抽出", desc: "CNNバックボーンを用い、目・鼻・口の配置や輪郭の曲率を数千次元の特徴ベクトルへと変換します。" },
                  { step: "03", title: "Projection", sub: "4軸投影", desc: "抽出されたベクトルを、Y/M・C/L・S/D・W/Kの4つの意味論的軸へ投影し、スコアを算出します。" },
                  { step: "04", title: "Inference", sub: "推論", desc: "パラメータ空間における座標と、16タイプの重心との距離を計算し、最も近いタイプを特定します。" },
                ].map((item, i) => (
                  <motion.div key={i} variants={itemVariants} className="group relative flex gap-4 rounded-xl bg-slate-900/50 p-3 md:bg-transparent md:p-0">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-300/70 bg-slate-950/90 text-[10px] font-bold text-indigo-100 md:h-10 md:w-10 md:text-xs">
                        {item.step}
                      </div>
                      {i !== 3 && <div className="mt-2 hidden h-full w-px bg-indigo-400/20 md:block" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-mono text-sm font-semibold text-slate-50">{item.title}</h3>
                        <span className="text-[10px] font-semibold text-indigo-300">{item.sub}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-300 md:text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== 診断プロセス (Simple Flow) ===== */}
      <motion.section
        className="py-16 md:py-24"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-slate-500 md:text-base">わずか数十秒で結果が出ます</p>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="absolute left-0 top-12 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent md:block" />
          {[
            { step: "01", title: "写真をUpload", desc: "正面を向いた写真をアップロードします。" },
            { step: "02", title: "AI解析", desc: "顔のパーツ配置や比率を数値化します。" },
            { step: "03", title: "マッピング", desc: "4つの軸上のどこに位置するか計算します。" },
            { step: "04", title: "結果表示", desc: "16タイプの中からあなたのタイプを表示。" },
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="group relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-lg md:h-24 md:w-24">
                <span className="text-2xl font-bold text-slate-200 transition-colors group-hover:text-indigo-500 md:text-3xl">{item.step}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 md:text-lg">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 md:px-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== フッター ===== */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">F</span>
            <span className="text-sm font-semibold text-slate-700">FaceType16</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} FaceType16. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium text-slate-500">
            <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link href="/tokushoho" className="hover:text-indigo-600">特定商取引法に基づく表記</Link>
          </div>
        </div>
      </footer>
      <div className="h-[70px] w-full md:hidden" aria-hidden="true" />
    </>
  );
}
