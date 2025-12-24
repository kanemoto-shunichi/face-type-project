import { ImageResponse } from 'next/og';

// export const runtime = 'edge';

const FACE_TYPE_DATA_WOMAN: Record<string, { title: string; subTitle: string }> = {
  YCSW: { title: '平和の象徴 / 愛されミューズ', subTitle: 'YCSW - Pure Angel' },
  YCSK: { title: '霧の中の幻影 / クリスタル・フェアリー', subTitle: 'YCSK - Mysterious Fairy' },
  YCDW: { title: '真夏の太陽 / ハッピー・ポッパー', subTitle: 'YCDW - Vitamin Girl' },
  YCDK: { title: '魅惑の小悪魔 / リトル・デビル', subTitle: 'YCDK - Sweet Poison' },

  YLSW: { title: '癒やしの微風 / ソフト・フレッシュ', subTitle: 'YLSW - Gentle Breeze' },
  YLSK: { title: '水晶の少年 / クール・フレッシュ', subTitle: 'YLSK - Crystal Clear' },
  YLDW: { title: '快活なリーダー / スポーティ・エナジー', subTitle: 'YLDW - Active Hero' },
  YLDK: { title: '時代の反逆者 / アーバン・エッジ', subTitle: 'YLDK - Rebel Soul' },

  MCSW: { title: '高貴なる癒やし / ロイヤル・ソフトエレガント', subTitle: 'MCSW - Noble Healer' },
  MCSK: { title: '静寂の女神 / ノーブル・ミューズ', subTitle: 'MCSK - Noble Silence' },
  MCDW: { title: '華麗なる女王 / ゴージャス・ディーバ', subTitle: 'MCDW - Luxury Queen' },
  MCDK: { title: '運命の女 / ファム・ファタール', subTitle: 'MCDK - Fatal Charm' },

  MLSW: { title: '知的なお姉さん / スマート・シスター', subTitle: 'MLSW - Smart Beauty' },
  MLSK: { title: '氷の女帝 / アーバン・クールビューティー', subTitle: 'MLSK - Ice Queen' },
  MLDW: { title: '情熱の女神 / エキゾチック・アマゾネス', subTitle: 'MLDW - Wild Goddess' },
  MLDK: { title: '時代の開拓者 / モダン・アヴァンギャルド', subTitle: 'MLDK - Future Icon' },

  DEFAULT: { title: '診断結果', subTitle: 'Face Type Diagnosis' },
};

const FACE_TYPE_DATA_MAN: Record<string, { title: string; subTitle: string }> = {
  YCSW: { title: '癒しのプリンス / 愛され弟キャラ', subTitle: 'YCSW - Charming Prince' },
  YCSK: { title: '霧の中の少年 / ミステリアス・ボーイ', subTitle: 'YCSK - Mysterious Boy' },
  YCDW: { title: '真夏の太陽 / 元気なポップスター', subTitle: 'YCDW - Vitamin Boy' },
  YCDK: { title: '魅惑の小悪魔 / クールな反逆児', subTitle: 'YCDK - Little Devil' },

  YLSW: { title: '癒やしの微風 / ソフト・フレッシュ', subTitle: 'YLSW - Gentle Breeze' },
  YLSK: { title: '爽やか塩顔男子 / クールな隣人', subTitle: 'YLSK - Fresh Cool' },
  YLDW: { title: '快活なリーダー / スポーティ・ヒーロー', subTitle: 'YLDW - Active Hero' },
  YLDK: { title: '時代の反逆者 / アーバン・エッジ', subTitle: 'YLDK - Rebel Soul' },

  MCSW: { title: '高貴なる癒やし / ロイヤル・ジェントルマン', subTitle: 'MCSW - Noble Gentleman' },
  MCSK: { title: '静寂の賢者 / ノーブル・ミューズ', subTitle: 'MCSK - Noble Silence' },
  MCDW: { title: '情熱のジェントルマン / 色気のある大人', subTitle: 'MCDW - Elegant Sexy' },
  MCDK: { title: '運命の男 / ファム・ファタール', subTitle: 'MCDK - Fatal Charm' },

  MLSW: { title: '知的なお兄さん / スマート・ジェントル', subTitle: 'MLSW - Smart Brother' },
  MLSK: { title: '孤高のカリスマ / 鋭利な知性', subTitle: 'MLSK - Cool Leader' },
  MLDW: { title: '荒野の覇者 / ワイルド・キング', subTitle: 'MLDW - Wild King' },
  MLDK: { title: '時代の開拓者 / モダン・アヴァンギャルド', subTitle: 'MLDK - Future Icon' },

  DEFAULT: { title: '診断結果', subTitle: 'Face Type Diagnosis' },
};

const COLORS = {
  WARM: ['#f472b6', '#fb923c'],
  COOL: ['#60a5fa', '#22d3ee'],
  MAN_WARM: ['#a78bfa', '#f472b6'],
  MAN_COOL: ['#3b82f6', '#10b981'],
  DEFAULT: ['#475569', '#1e293b'],
};

function normalizeType(v: string | null): string {
  const t = (v ?? '').trim().toUpperCase();
  return t || 'DEFAULT';
}

function normalizeGender(v: string | null): 'man' | 'woman' {
  return v === 'man' ? 'man' : 'woman';
}

function getGradientColors(type: string, isMan: boolean) {
  if (!type || type.length < 4) return COLORS.DEFAULT;
  const vibe = type.slice(-1); // W or K
  if (isMan) return vibe === 'W' ? COLORS.MAN_WARM : COLORS.MAN_COOL;
  return vibe === 'W' ? COLORS.WARM : COLORS.COOL;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const type = normalizeType(searchParams.get('type'));
    const gender = normalizeGender(searchParams.get('gender'));
    const isMan = gender === 'man';

    const source = isMan ? FACE_TYPE_DATA_MAN : FACE_TYPE_DATA_WOMAN;
    const target = source[type] ?? source.DEFAULT;

    const title = target.title;
    const sub = source[type] ? target.subTitle : `Not Found: "${type}" (Gender: ${gender})`;

    const genderLabel = isMan ? 'MEN' : 'WOMAN';
    const [colorStart, colorEnd] = getGradientColors(type, isMan);

    let image: ImageResponse;
    try {
      image = new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: 'white',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '-20%',
                width: 800,
                height: 800,
                background: `radial-gradient(circle, ${colorStart} 0%, transparent 70%)`,
                opacity: 0.4,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-30%',
                right: '-20%',
                width: 800,
                height: 800,
                background: `radial-gradient(circle, ${colorEnd} 0%, transparent 70%)`,
                opacity: 0.4,
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                padding: '40px 60px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 30,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  display: 'flex',
                }}
              >
                Face Type Diagnosis : {genderLabel}
              </div>

              <div
                style={{
                  fontSize: 90,
                  fontWeight: 900,
                  marginBottom: 10,
                  backgroundImage: `linear-gradient(to right, #fff, ${colorEnd})`,
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'flex',
                }}
              >
                {type}
              </div>

              <div
                style={{
                  width: 80,
                  height: 4,
                  background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
                  margin: '20px 0',
                  borderRadius: 2,
                  display: 'flex',
                }}
              />

              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  maxWidth: 900,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 24,
                  marginTop: 20,
                  color: '#cbd5e1',
                  letterSpacing: '0.05em',
                  display: 'flex',
                }}
              >
                {sub}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 40,
                fontSize: 18,
                opacity: 0.5,
                letterSpacing: '0.1em',
                display: 'flex',
              }}
            >
              facetype16.com
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } catch (e: any) {
      return new Response(`ImageResponse error: ${String(e?.message ?? e)}`, {
        status: 500,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    image.headers.set(
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    );

    return image;
  } catch (e: any) {
    return new Response(`OG route error: ${String(e?.message ?? e)}`, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}
