import { PLAYER_SKIN_GUISES, PLAYER_SKINS } from "./__mocks__";
import type { TPlayerSkin, TPlayerSkinGuise } from "./types";

class PlayerSkinsService {
  private skins: TPlayerSkin[] = [];

  private listeners = new Set<() => void>();

  constructor() {
    this.skins = this.prepareDefaultSkins();
    this.emit();
  }

  private prepareDefaultSkins(): TPlayerSkin[] {
    return PLAYER_SKINS;
  }

  getAll(): TPlayerSkin[] {
    return this.skins;
  }

  getById(id: string): TPlayerSkin | undefined {
    return this.skins.find((s) => s.id === id);
  }

  getGuises(): TPlayerSkinGuise[] {
    return PLAYER_SKIN_GUISES;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const l of this.listeners) l();
  }
}

const playerSkinsService = new PlayerSkinsService();

export default playerSkinsService;
