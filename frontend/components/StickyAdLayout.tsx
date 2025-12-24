"use client";

import { useState, useEffect } from "react";

// ==========================================
// ★型定義：画像(A8)とiframe(楽天)の両対応
// ==========================================
type AdType = "image" | "iframe";

type AdData = {
  type: AdType;        // "image" か "iframe" か
  width: number;
  height: number;
  // 画像(A8)用のデータ
  href?: string;
  imgSrc?: string;
  pixelSrc?: string;
  // iframe(楽天)用のデータ
  iframeSrc?: string;
};

// ==========================================
// ★広告プール定義
// ==========================================

// 1. 幅120px の広告リスト (PC用)
const ADS_120: AdData[] = [
  // --- A8 (type: "image") ---
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0Q+4P34KY+2UG2+BXQOH",
    imgSrc: "https://www28.a8.net/svt/bgt?aid=251215370284&wid=001&eno=01&mid=s00000013277002005000&mc=1",
    pixelSrc: "https://www17.a8.net/0.gif?a8mat=45KF0Q+4P34KY+2UG2+BXQOH",
    width: 120, height: 600
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KB4Y+2PN3ZM+1WP2+5ZU29",
    imgSrc: "https://www20.a8.net/svt/bgt?aid=251210338164&wid=001&eno=01&mid=s00000008903001007000&mc=1",
    pixelSrc: "https://www13.a8.net/0.gif?a8mat=45KB4Y+2PN3ZM+1WP2+5ZU29",
    width: 120, height: 600
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7IATF6+1WP2+1HP31T",
    imgSrc: "https://www28.a8.net/svt/bgt?aid=251215373454&wid=001&eno=01&mid=s00000008903009019000&mc=1",
    pixelSrc: "https://www17.a8.net/0.gif?a8mat=45KF0T+7IATF6+1WP2+1HP31T",
    width: 120, height: 600
  },
  // --- 楽天 (type: "iframe") ---
  {
    type: "iframe",
    iframeSrc: "/rakuten-120x600.html",
    width: 120, height: 600
  },
];

// 2. 幅160px の広告リスト (PC用)
const ADS_160: AdData[] = [
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0Q+4P34KY+2UG2+C5VW1",
    imgSrc: "https://www25.a8.net/svt/bgt?aid=251215370284&wid=001&eno=01&mid=s00000013277002043000&mc=1",
    pixelSrc: "https://www13.a8.net/0.gif?a8mat=45KF0Q+4P34KY+2UG2+C5VW1",
    width: 160, height: 600
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KB4Y+2PN3ZM+1WP2+6F1WH",
    imgSrc: "https://www28.a8.net/svt/bgt?aid=251210338164&wid=001&eno=01&mid=s00000008903001078000&mc=1",
    pixelSrc: "https://www17.a8.net/0.gif?a8mat=45KB4Y+2PN3ZM+1WP2+6F1WH",
    width: 160, height: 600
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7IATF6+1WP2+1HPIHD",
    imgSrc: "https://www27.a8.net/svt/bgt?aid=251215373454&wid=001&eno=01&mid=s00000008903009021000&mc=1",
    pixelSrc: "https://www10.a8.net/0.gif?a8mat=45KF0T+7IATF6+1WP2+1HPIHD",
    width: 160, height: 600
  },
];

// 3. SP用 下部バナー (320x50)
const ADS_SP: AdData[] = [
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0Q+4P34KY+2UG2+C0QPD",
    imgSrc: "https://www26.a8.net/svt/bgt?aid=251215370284&wid=001&eno=01&mid=s00000013277002019000&mc=1",
    pixelSrc: "https://www10.a8.net/0.gif?a8mat=45KF0Q+4P34KY+2UG2+C0QPD",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7CCHDE+53GG+64C3L",
    imgSrc: "https://www27.a8.net/svt/bgt?aid=251215373444&wid=001&eno=01&mid=s00000023776001028000&mc=1",
    pixelSrc: "https://www13.a8.net/0.gif?a8mat=45KF0T+7CCHDE+53GG+64C3L",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7CCHDE+53GG+63WO1",
    imgSrc: "https://www24.a8.net/svt/bgt?aid=251215373444&wid=001&eno=01&mid=s00000023776001026000&mc=1",
    pixelSrc: "https://www18.a8.net/0.gif?a8mat=45KF0T+7CCHDE+53GG+63WO1",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7CCHDE+53GG+644DT",
    imgSrc: "https://www28.a8.net/svt/bgt?aid=251215373444&wid=001&eno=01&mid=s00000023776001027000&mc=1",
    pixelSrc: "https://www16.a8.net/0.gif?a8mat=45KF0T+7CCHDE+53GG+644DT",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0T+7H3Y7M+34VM+25GA35",
    imgSrc: "https://www25.a8.net/svt/bgt?aid=251215373452&wid=001&eno=01&mid=s00000014629013009000&mc=1",
    pixelSrc: "https://www10.a8.net/0.gif?a8mat=45KF0T+7H3Y7M+34VM+25GA35",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0U+5GH2EQ+4YJS+609HT",
    imgSrc: "https://www21.a8.net/svt/bgt?aid=251215374330&wid=001&eno=01&mid=s00000023140001009000&mc=1",
    pixelSrc: "https://www10.a8.net/0.gif?a8mat=45KF0U+5GH2EQ+4YJS+609HT",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0U+5GH2EQ+4YJS+60H7L",
    imgSrc: "https://www26.a8.net/svt/bgt?aid=251215374330&wid=001&eno=01&mid=s00000023140001010000&mc=1",
    pixelSrc: "https://www14.a8.net/0.gif?a8mat=45KF0U+5GH2EQ+4YJS+60H7L",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0U+5GH2EQ+4YJS+609HT",
    imgSrc: "https://www22.a8.net/svt/bgt?aid=251215374330&wid=001&eno=01&mid=s00000023140001009000&mc=1",
    pixelSrc: "https://www10.a8.net/0.gif?a8mat=45KF0U+5GH2EQ+4YJS+609HT",
    width: 320, height: 50
  },
  {
    type: "image",
    href: "https://px.a8.net/svt/ejp?a8mat=45KF0U+5GH2EQ+4YJS+60H7L",
    imgSrc: "https://www26.a8.net/svt/bgt?aid=251215374330&wid=001&eno=01&mid=s00000023140001010000&mc=1",
    pixelSrc: "https://www18.a8.net/0.gif?a8mat=45KF0U+5GH2EQ+4YJS+60H7L",
    width: 320, height: 50
  },
];

// ==========================================
// ★表示コンポーネント
// ==========================================
const AdRenderer = ({ ad }: { ad: AdData }) => {
  if (ad.type === "image") {
    return (
      <div className="flex flex-col items-center">
        <a href={ad.href} rel="nofollow" target="_blank">
          <img
            style={{ border: 0 }}
            width={ad.width}
            height={ad.height}
            alt=""
            src={ad.imgSrc}
          />
        </a>
        <img
          style={{ border: 0 }}
          width={1}
          height={1}
          src={ad.pixelSrc}
          alt=""
        />
      </div>
    );
  }

  if (ad.type === "iframe" && ad.iframeSrc) {
    return (
      <iframe
        src={ad.iframeSrc}
        width={ad.width}
        height={ad.height}
        scrolling="no"
        frameBorder="0"
        title="Advertisement"
        style={{ border: "none", overflow: "hidden" }}
      />
    );
  }

  return null;
};

export const StickyAdLayout = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [leftAd, setLeftAd] = useState<AdData | null>(null);
  const [rightAd, setRightAd] = useState<AdData | null>(null);
  const [bottomAd, setBottomAd] = useState<AdData | null>(null);

  useEffect(() => {
    // 1. 今回は120幅(小)にするか、160幅(大)にするかをランダム決定 (50%の確率)
    const useSmallSize = Math.random() < 0.5;
    
    // 決定したサイズのプールを選択
    const targetPool = useSmallSize ? ADS_120 : ADS_160;

    // 2. そのプールから左右それぞれランダムに選ぶ
    const randomLeft = targetPool[Math.floor(Math.random() * targetPool.length)];
    const randomRight = targetPool[Math.floor(Math.random() * targetPool.length)];

    setLeftAd(randomLeft);
    setRightAd(randomRight);

    // 3. SP用ランダム
    const randomSp = ADS_SP[Math.floor(Math.random() * ADS_SP.length)];
    setBottomAd(randomSp);
  }, []);

  if (!leftAd || !rightAd || !bottomAd) return null;

  return (
    <>
      {/* 1. PC用：左サイドバー */}
      <div className="fixed left-2 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <AdRenderer ad={leftAd} />
      </div>

      {/* 2. PC用：右サイドバー */}
      <div className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <AdRenderer ad={rightAd} />
      </div>

      {/* 3. SP用：下部固定バナー */}
      {!isClosed && (
        <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
          <button
            onClick={() => setIsClosed(true)}
            className="absolute -top-6 right-2 flex h-6 w-6 items-center justify-center rounded-t-md bg-gray-200 text-xs text-gray-500 hover:bg-gray-300"
          >
            ×
          </button>

          <div className="py-2">
            <AdRenderer ad={bottomAd} />
          </div>
        </div>
      )}
    </>
  );
};