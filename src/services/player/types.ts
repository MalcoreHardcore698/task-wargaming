import type { TPlayerSkinGuiseType } from "../player-skins/types";

export type TPlayerResourceFormat = "currency" | "days";

export type TPlayerResource = {
  id: string;
  label: string;
  icon: string;
  value: number;
  format: TPlayerResourceFormat;
  color?: string;
  hasNew?: boolean;
};

export type TPlayerState = {
  resources: TPlayerResource[];
  selectedSkinId: string;
  skinGuiseById: Record<string, TPlayerSkinGuiseType | undefined>;
};
