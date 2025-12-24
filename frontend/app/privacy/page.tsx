// app/privacy/page.tsx

export default function PrivacyPolicyPage() {
  const operatorName = '株式会社 PassionSmile'; 
  const contactEmail = 'manifold.smile.tmis@gmail.com';

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-500">
            Privacy Policy
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            プライバシーポリシー
          </h1>
          <p className="text-xs text-slate-500">
            本ページは、当サービスにおける個人情報および顔画像データの取り扱いについて定めたものです。
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            {operatorName}
            （以下「当サービス」といいます）は、利用者のプライバシーを尊重し、個人情報および顔画像データを適切に取り扱うことを重要な責務と考えています。
            本プライバシーポリシーでは、当サービスにおける情報の取得、利用、保管、第三者提供などの取り扱い方針について説明します。
          </p>
        </section>

        {/* 1. 取得する情報 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            1. 取得する情報
          </h2>
          <p>当サービスは、以下の情報を取得する場合があります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>顔タイプ診断のために利用者がアップロードした顔写真画像</li>
            <li>顔画像からAIが算出した特徴量（例：顔の比率、コントラストなどの数値情報）</li>
            <li>診断結果のタイプコード（例：YCSW など）および関連パラメータ</li>
            <li>ブラウザや端末に関する技術情報（アクセス日時など）</li>
          </ul>
        </section>

        {/* 2. 利用目的 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            2. 情報の利用目的
          </h2>
          <p>取得した情報は、主に次の目的で利用します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>顔タイプ診断結果の算出および表示のため</li>
            <li>診断ロジックの改善・精度向上のため（統計的・匿名化された形で利用）</li>
            <li>サービスの品質向上、機能改善、利用状況の分析のため</li>
            <li>不正利用の防止、システムの安全な運用のため</li>
          </ul>
        </section>

        {/* 3. 顔画像の取り扱い */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            3. 顔画像データの取り扱い
          </h2>
          <p>顔写真画像については、以下の方針に基づき取り扱います。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              利用者がアップロードした顔写真は、顔タイプ診断を行うAI処理のためにのみ利用します。
            </li>
            <li>
              処理が完了した画像データは、サービス設計に応じて所定の期間（３か月間）保管するか、または速やかに削除します。
            </li>
            <li>
              顔画像そのものを、利用者の同意なく第三者に提供・公開することはありません（法令に基づく場合を除く）。
            </li>
          </ul>
        </section>

        {/* 4. 保存期間 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            4. 情報の保存期間
          </h2>
          <p>
            取得した情報は、利用目的の達成に必要な範囲内で保存し、目的達成後は、遅滞なく削除または匿名化するよう努めます。
            具体的な保存期間は、サービスの運用状況や法令上の要請に応じて定めます。
          </p>
        </section>

        {/* 5. 第三者提供 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            5. 第三者提供について
          </h2>
          <p>
            当サービスは、次の場合を除き、取得した情報を第三者へ提供しません。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>利用者の同意がある場合</li>
            <li>法令に基づく要請がある場合</li>
            <li>
              業務委託先に処理を委託する場合（この場合、委託先に対して適切な管理・監督を行います）
            </li>
          </ul>
        </section>

        {/* 6. 外部サービスの利用 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            6. 外部サービス・AIプラットフォームの利用
          </h2>
          <p>
            顔タイプ診断の処理において、外部のAIプラットフォームやクラウドサービスを利用する場合があります。
            その際は、当該サービス提供者との間で適切な契約・安全管理措置を講じた上でデータを取り扱います。
          </p>
        </section>

        {/* 7. 安全管理措置 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            7. 安全管理措置
          </h2>
          <p>
            当サービスは、取得した情報に対して、不正アクセス、紛失、改ざん、漏えい等を防止するため、必要かつ適切な安全管理措置を講じます。
          </p>
        </section>

        {/* 8. 利用者の権利 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            8. 利用者の権利
          </h2>
          <p>
            利用者は、ご自身の情報について、開示、訂正、削除、利用停止等を求めることができます。
            具体的な手続きについては、下記のお問い合わせ窓口までご連絡ください。
          </p>
        </section>

        {/* 9. ポリシーの変更 */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            9. プライバシーポリシーの変更
          </h2>
          <p>
            本プライバシーポリシーの内容は、必要に応じて変更されることがあります。
            重要な変更がある場合は、本ページ上で告知します。
          </p>
        </section>

        {/* 10. お問い合わせ */}
        <section className="space-y-2 text-sm leading-relaxed text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            10. お問い合わせ窓口
          </h2>
          <p>
            本プライバシーポリシーに関するお問い合わせは、以下の窓口までご連絡ください。
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
