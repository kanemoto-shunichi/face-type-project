// data/types.ts

export type SectionContent = {
  title: string;
  body: string;
};

export type MbtiGroup = {
  groupName: string;
  catchPhrase: string;
  description: string;
  items: { type: string; gap: string; text: string }[];
};

export type StaticTypeData = {
  title: string;
  subTitle: string;
  intro: string;
  physiognomy: SectionContent[]; // 人相（無料）
  aura: SectionContent[];        // オーラ（シェア）
  mbtiGroups: MbtiGroup[];       // MBTI（プレミアム）
  colors: string[];              // カラー（シェア）
  fashion: string;               // ファッション（シェア）
  makeup: string;                // メイク（シェア）
};