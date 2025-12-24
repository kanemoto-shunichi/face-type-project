// app/terms/page.tsx

export default function TermsPage() {
  const operatorName = '株式会社 PassionSmile';
  const contactEmail = 'manifold.smile.tmis@gmail.com';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-500">
            Terms of Use
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            利用規約
          </h1>
          <p className="text-xs text-slate-500">
            本利用規約（以下「本規約」といいます）は、{operatorName}
            （以下「当サービス」といいます）が提供する「顔タイプ診断」等のサービスの利用条件を定めるものです。
          </p>
        </header>

        {/* 1. 適用 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">1. 適用</h2>
          <p>
            本規約は、当サービスが提供するウェブサイトおよび関連サービス（以下「本サービス」といいます）の利用に関わる一切の関係に適用されます。
            利用者は、本サービスを利用することにより、本規約の全ての条項に同意したものとみなされます。
          </p>
        </section>

        {/* 2. 本サービスの内容 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            2. 本サービスの内容
          </h2>
          <p>
            本サービスは、利用者がアップロードした顔写真等の情報をもとに、AI等のアルゴリズムによって「顔タイプ」や印象の傾向を推定し、結果を表示することを主な内容とします。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              本サービスが提供する結果は、あくまでエンターテインメント・自己理解の参考情報を目的としており、医学的・心理学的・職業診断等の専門的な診断や評価を行うものではありません。
            </li>
            <li>
              当サービスは、結果の正確性・完全性・有用性等について一切の保証を行いません。
            </li>
          </ul>
        </section>

        {/* 3. 利用環境の準備 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            3. 利用環境の準備
          </h2>
          <p>
            本サービスの利用に必要な通信機器、ソフトウェア、通信回線等は、利用者の費用と責任において準備および維持するものとします。
            通信費用（データ通信料を含みます）は、利用者が負担するものとします。
          </p>
        </section>

        {/* 4. 画像・コンテンツの取り扱い */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            4. 画像およびコンテンツの取り扱い
          </h2>
          <p>
            利用者が本サービスにアップロードした顔写真その他のコンテンツ（以下「利用者コンテンツ」といいます）について、当サービスは本サービスの提供・運営のために必要な範囲で利用します。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              利用者は、当サービスに対し、利用者コンテンツを本サービスの運営および品質改善の目的で非独占的に利用する権利を付与します。
            </li>
            <li>
              当サービスは、利用者の同意なく、利用者コンテンツを第三者に販売・公開することはありません（法令に基づく場合を除きます）。
            </li>
            <li>
              利用者は、第三者の肖像権・著作権その他の権利を侵害しないコンテンツのみをアップロードするものとし、侵害があった場合は自己の責任と費用においてこれを解決するものとします。
            </li>
            <li>
              ユーザーは、当社が、ユーザーコンテンツ（画像を含みます）を、機械学習・人工知能等のアルゴリズムの学習・評価・改善のための学習データとして利用する場合があることに同意するものとします。
            </li>
            <li>
              当社は、前項の目的でユーザーコンテンツを学習データとして利用するにあたり、個人情報保護法その他関係法令を遵守し、必要に応じて匿名加工情報化、統計化その他プライバシーへの配慮を行うものとします。
            </li>
            <li>
              当社は、法令に別段の定めがある場合を除き、学習データとして利用されたユーザーコンテンツそのものを、第三者に対しユーザーの個人が特定できる態様で販売・貸与することはありません。
            </li>
            <li>
              当社が学習データとして利用した結果として生成されるモデル、アルゴリズム、統計データその他の成果物に関する知的財産権は、特段の定めがない限り当社に帰属するものとします。
            </li>
          </ul>
        </section>

        {/* 新規追加: 有料サービスについて */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            有料サービスおよび決済
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              本サービスの一部は有料で提供されます。有料サービスの利用料金および詳細は、購入画面に表示されます。
            </li>
            <li>
              利用者は、当サービスが指定する決済手段を用いて利用料金を支払うものとします。
            </li>
            <li>
              決済完了後のキャンセルおよび返金は、デジタルコンテンツという商品の性質上、原則としてお受けできません。
            </li>
            <li>
              特定商取引法に基づく詳細な表示については、
              <a href="/tokushoho" className="text-indigo-600 underline">
                「特定商取引法に基づく表記」
              </a>
              をご参照ください。
            </li>
          </ul>
        </section>

        {/* 5. 禁止事項 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            5. 禁止事項
          </h2>
          <p>利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>
              犯罪行為に関連する行為、またはそのおそれのある行為
            </li>
            <li>
              第三者の権利・利益（肖像権、プライバシー権、著作権等）を侵害する行為
            </li>
            <li>
              他人の顔写真や許可を得ていない画像を無断でアップロードする行為
            </li>
            <li>本サービスの運営を妨害する行為、またはそのおそれのある行為</li>
            <li>
              本サービスによって得られた情報を、不適切な差別・ハラスメント等に利用する行為
            </li>
            <li>
              リバースエンジニアリング、スクレイピング等により本サービスのソースコードや内部アルゴリズムを解析する行為
            </li>
            <li>
              その他、当サービスが不適切と判断する行為
            </li>
          </ul>
        </section>

        {/* 6. 知的財産権 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            6. 知的財産権
          </h2>
          <p>
            本サービスに関する一切のコンテンツ（テキスト、画像、ロゴ、プログラム等）に関する著作権・商標権その他の知的財産権は、当サービスまたは正当な権利を有する第三者に帰属します。
          </p>
          <p>
            利用者は、当サービスの事前の許可なく、本サービスのコンテンツを複製、転載、改変、再配布等してはなりません（個人的な利用の範囲を超える場合）。
          </p>
        </section>

        {/* 7. サービスの変更・停止 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            7. サービスの変更・中断・終了
          </h2>
          <p>
            当サービスは、以下の場合に、利用者への事前の通知なく、本サービスの全部または一部の内容を変更・中断・終了することがあります。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの保守点検または緊急対応を行う場合</li>
            <li>天災地変、停電、通信障害等の不可抗力が発生した場合</li>
            <li>その他、運営上やむを得ない事情があると当サービスが判断した場合</li>
          </ul>
          <p>
            当サービスは、本サービスの変更・中断・終了により利用者に生じた損害について、一切の責任を負わないものとします。
          </p>
        </section>

        {/* 8. 免責事項 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">8. 免責事項</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              当サービスは、本サービスの提供にあたり、その正確性、完全性、有用性、特定目的適合性等についていかなる保証も行いません。
            </li>
            <li>
              利用者が本サービスを利用したこと、または利用できなかったことにより生じた一切の損害について、当サービスは故意または重過失がある場合を除き、責任を負いません。
            </li>
            <li>
              当サービスが責任を負う場合であっても、その賠償責任の範囲は、通常生じうる直接かつ現実の損害に限られるものとします。
            </li>
          </ul>
        </section>

        {/* 9. 利用停止等 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            9. 利用停止・登録削除等
          </h2>
          <p>
            当サービスは、利用者が本規約に違反した場合、またはそのおそれがあると判断した場合、事前の通知なく、本サービスの利用停止・アクセス制限その他必要な措置を講じることができます。
          </p>
        </section>

        {/* 10. 規約の変更 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            10. 規約の変更
          </h2>
          <p>
            当サービスは、必要に応じて本規約の内容を変更することがあります。
            変更後の規約は、本サービス上に掲載した時点から効力を生じるものとし、利用者が変更後も本サービスを利用した場合、変更後の規約に同意したものとみなします。
          </p>
        </section>

        {/* 11. 準拠法・管轄 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            11. 準拠法および合意管轄
          </h2>
          <p>
            本規約の解釈および適用については、日本法を準拠法とします。
            本サービスに関連して紛争が生じた場合、当サービスの所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        {/* 12. お問い合わせ */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            12. お問い合わせ窓口
          </h2>
          <p>
            本規約に関するお問い合わせは、以下の窓口までご連絡ください。
          </p>
          <ul className="list-none pl-0 text-sm">
            <li>運営者名：{operatorName}</li>
            <li>
              メールアドレス：
              <a
                href={`mailto:${contactEmail}`}
                className="text-indigo-600 underline"
              >
                {contactEmail}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
