// RakutenAdWidget.tsx (または同じファイル内に定義)
import { useEffect, useRef } from "react";

const RakutenAdWidget = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // 既にスクリプトがある場合は重複追加しない
    if (adRef.current.querySelector("script")) return;

    // スクリプト要素を作成
    const script = document.createElement("script");
    script.type = "text/javascript";
    
    // 楽天ウィジェットの設定変数をグローバル（window）にセットする関数
    // ※スクリプトの仕様上、変数を先に定義してから外部JSを読み込む必要があるため
    const scriptContent = `
      rakuten_design="slide";
      rakuten_affiliateId="0ea62065.34400275.0ea62066.204f04c0";
      rakuten_items="ranking";
      rakuten_genreId="100939";
      rakuten_recommend="on";
      rakuten_size="120x600";
      rakuten_target="_blank";
      rakuten_border="on";
      rakuten_auto_mode="on";
      rakuten_adNetworkId="a8Net";
      rakuten_adNetworkUrl="https%3A%2F%2Frpx.a8.net%2Fsvt%2Fejp%3Fa8mat%3D45KB4Y%2B2Q8JLE%2B2HOM%2BBS629%26rakuten%3Dy%26a8ejpredirect%3D";
      rakuten_pointbackId="a25121058406_45KB4Y_2Q8JLE_2HOM_BS629";
      rakuten_mediaId="20011811";
    `;

    // 設定用スクリプト
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = scriptContent;

    // 外部ソース読み込み用スクリプト
    const srcScript = document.createElement("script");
    srcScript.type = "text/javascript";
    srcScript.src = "//xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js";

    // A8のトラッキング用img
    const trackingImg = document.createElement("img");
    trackingImg.border = "0";
    trackingImg.width = 1;
    trackingImg.height = 1;
    trackingImg.src = "https://www11.a8.net/0.gif?a8mat=45KB4Y+2Q8JLE+2HOM+BS629";
    trackingImg.alt = "";

    // DOMに追加
    adRef.current.appendChild(configScript);
    adRef.current.appendChild(srcScript);
    adRef.current.appendChild(trackingImg);

  }, []);

  return (
    <div className="flex justify-center items-center py-8 bg-slate-50/50">
      <div ref={adRef} className="overflow-hidden rounded-lg shadow-sm bg-white" />
    </div>
  );
};