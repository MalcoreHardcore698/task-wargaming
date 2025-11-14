import type { TPlayerSkinGuiseType } from "../player-skins/types";

export type TPlayerResource = {
  id: string;
  label: string;
  icon: string;
  amount: string;
  color?: string;
  hasNew?: boolean;
};

export type TPlayerState = {
  resources: TPlayerResource[];
  selectedSkinId: string;
  skinGuiseById: Record<string, TPlayerSkinGuiseType | undefined>;
};
