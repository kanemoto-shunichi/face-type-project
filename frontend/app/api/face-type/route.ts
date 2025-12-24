// app/api/face-type/route.ts
import { NextRequest, NextResponse } from 'next/server';
import faceTypeParamsFemaleRaw from '@/photo/output_16types_woman/face_type_params.json';
import faceTypeParamsMaleRaw from '@/photo/output_16types_man/face_type_params.json';

const FEMALE_TYPE_CODES = Object.keys(
  faceTypeParamsFemaleRaw as Record<string, unknown>
);
const MALE_TYPE_CODES = Object.keys(
  faceTypeParamsMaleRaw as Record<string, unknown>
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // フロントから送っている gender（woman / man）
    const gender = (formData.get('gender') as string) || 'woman';

    // ファイルは一応存在チェックだけ（ここでは中身はまだ使わない）
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json(
        { error: 'file is required' },
        { status: 400 }
      );
    }

    const candidates =
      gender === 'man' ? MALE_TYPE_CODES : FEMALE_TYPE_CODES;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: 'no face type meta loaded' },
        { status: 500 }
      );
    }

    // ランダムに 1つ typeCode を選ぶ（例: "YCSW"）
    const typeCode =
      candidates[Math.floor(Math.random() * candidates.length)];

    // 必要ならここで axisScores なども返せる
    return NextResponse.json({ typeCode });
  } catch (err) {
    console.error('face-type API error', err);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}
