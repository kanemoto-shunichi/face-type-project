// app/tokushoho/page.tsx

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <header className="space-y-2 border-b border-slate-100 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            特定商取引法に基づく表記
          </h1>
          <p className="text-xs text-slate-500">
            「特定商取引に関する法律」第11条（通信販売についての広告）に基づき、以下のとおり表示いたします。
          </p>
        </header>

        <div className="space-y-6 text-sm text-slate-700">
          
          {/* 販売事業者 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">販売事業者名</h3>
            <div className="md:col-span-2">
              株式会社 PassionSmile
            </div>
          </div>

          {/* 代表責任者 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">運営統括責任者</h3>
            <div className="md:col-span-2">
              {/* ※個人の場合は氏名、法人の場合は代表者名を入れてください */}
              金本俊一
            </div>
          </div>

          {/* 所在地 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">所在地</h3>
            <div className="md:col-span-2">
              〒170-0003<br />
              東京都豊島区駒込4-9-29駒込コーポラス307号室
            </div>
          </div>

          {/* メールアドレス */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">メールアドレス</h3>
            <div className="md:col-span-2">
              manifold.smile.tmis@gmail.com
            </div>
          </div>

          {/* 販売価格 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">販売価格</h3>
            <div className="md:col-span-2">
              購入手続き画面に表示されます。
            </div>
          </div>

          {/* 商品代金以外の必要料金 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">商品代金以外の必要料金</h3>
            <div className="md:col-span-2">
              インターネット接続料金、通信料金等はお客様の負担となります。
            </div>
          </div>

          {/* 引き渡し時期 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">引き渡し時期</h3>
            <div className="md:col-span-2">
              クレジットカード決済完了後、ただちにWebブラウザ上で閲覧可能となります。
            </div>
          </div>

          {/* お支払い方法 */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">お支払い方法</h3>
            <div className="md:col-span-2">
              ・クレジットカード決済<br />
              ・その他、購入画面で表示される決済方法
            </div>
          </div>

          {/* 返品・キャンセル（デジタルコンテンツで最も重要） */}
          <div className="grid md:grid-cols-3 gap-2 md:gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900">返品・キャンセルについて</h3>
            <div className="md:col-span-2">
              商品の性質上（デジタルコンテンツ）、購入完了後のお客様都合による返品・キャンセルはお受けできません。予めご了承ください。<br />
              ただし、当社のシステムの不具合により閲覧が不可能だった場合に限り、対応させていただきます。
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}