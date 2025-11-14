export type TPlayerSkinGuiseType = "general" | "national";

export type TPlayerSkinGuise = {
  type: TPlayerSkinGuiseType;
  icon: string;
  label: string;
  description: string;
};

export type TPlayerSkinEffect = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type TPlayerSkin = {
  id: string;
  name: string;
  rank: string;
  level: number;
  description: string;
  portrait: string;
  splashImage: string;
  effects: TPlayerSkinEffect[];
};
