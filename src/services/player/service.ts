import type {
  TPlayerSkinGuise,
  TPlayerSkinGuiseType,
} from "../player-skins/types";
import { PLAYER_SKIN_GUISES } from "../player-skins/__mocks__";
import type { TPlayerResource, TPlayerState } from "./types";
import { PLAYER_RESOURCES } from "./__mocks__";

const STORAGE_KEY = "player_state";

class PlayerService {
  private state: TPlayerState;

  private listeners = new Set<() => void>();

  constructor() {
    const initial = this.load() ?? this.defaultState();
    this.state = this.migrateState(initial);
  }

  private migrateState(state: TPlayerState): TPlayerState {
    return {
      resources: state.resources,
      selectedSkinId: state.selectedSkinId,
      skinGuiseById: state.skinGuiseById ?? {},
    };
  }

  private defaultState(): TPlayerState {
    return {
      resources: PLAYER_RESOURCES,
      selectedSkinId: "poseidon",
      skinGuiseById: {},
    };
  }

  private save(state: TPlayerState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private load(): TPlayerState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TPlayerState) : null;
    } catch {
      return null;
    }
  }

  private setState(next: TPlayerState): void {
    this.state = next;
    this.save(next);
    this.emit();
  }

  getSnapshot = (): TPlayerState => this.state;

  getState(): TPlayerState {
    return this.state;
  }

  setSelectedSkin(skinId: string): void {
    if (this.state.selectedSkinId === skinId) return;
    this.setState({ ...this.state, selectedSkinId: skinId });
  }

  setResources(resources: TPlayerResource[]): void {
    this.setState({ ...this.state, resources });
  }

  updateResource(id: string, amount: string): void {
    const nextResources = this.state.resources.map((r) =>
      r.id === id ? { ...r, amount } : r
    );
    this.setResources(nextResources);
  }

  getSkinGuise(skinId: string): TPlayerSkinGuise | void {
    const skinGuiseType = this.state.skinGuiseById?.[skinId];

    if (!skinGuiseType) return void 0;

    return PLAYER_SKIN_GUISES.find((g) => g.type === skinGuiseType);
  }

  setSkinGuise(skinId: string, guise: TPlayerSkinGuiseType): void {
    const current = this.state.skinGuiseById ?? {};
    const nextMap = { ...current, [skinId]: guise };
    this.setState({ ...this.state, skinGuiseById: nextMap });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const l of this.listeners) l();
  }
}

const playerService = new PlayerService();

export default playerService;
