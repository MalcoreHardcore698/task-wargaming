import { ensureAppVersion } from "@/shared/utils/app-version";

import type {
  TPlayerSkinGuise,
  TPlayerSkinGuiseType,
} from "../player-skins/types";
import { PLAYER_SKIN_GUISES } from "../player-skins/__mocks__";
import type { TPlayerResource, TPlayerState } from "./types";
import { PLAYER_RESOURCES } from "./__mocks__";

const STORAGE_KEY = "player_state";

type LegacyResource = Partial<TPlayerResource>;

ensureAppVersion();

class PlayerService {
  private state: TPlayerState;

  private listeners = new Set<() => void>();

  constructor() {
    const initial = this.load() ?? this.defaultState();
    const migrated = this.migrateState(initial);
    this.state = migrated;
    this.save(migrated);
  }

  private defaultState(): TPlayerState {
    return {
      resources: this.mergeResources(PLAYER_RESOURCES),
      selectedSkinId: "poseidon",
      skinGuiseById: {},
    };
  }

  private migrateState(state: TPlayerState): TPlayerState {
    const storedResources = Array.isArray(
      (state as { resources?: LegacyResource[] }).resources
    )
      ? (state as { resources: LegacyResource[] }).resources ?? []
      : [];

    return {
      resources: this.mergeResources(storedResources),
      selectedSkinId: state.selectedSkinId ?? "poseidon",
      skinGuiseById: state.skinGuiseById ?? {},
    };
  }

  private mergeResources(
    resources: ReadonlyArray<LegacyResource>
  ): TPlayerResource[] {
    const defaultsMap = new Map(
      PLAYER_RESOURCES.map((resource) => [resource.id, resource])
    );

    const storedMap = new Map<string, LegacyResource>();

    for (const resource of resources) {
      if (!resource || typeof resource !== "object") {
        continue;
      }

      const id = resource.id;
      if (typeof id !== "string") {
        continue;
      }

      storedMap.set(id, resource);
    }

    const normalized: TPlayerResource[] = [];

    for (const defaults of PLAYER_RESOURCES) {
      normalized.push(
        this.normalizeResource(defaults, storedMap.get(defaults.id))
      );
    }

    for (const [id, resource] of storedMap.entries()) {
      if (defaultsMap.has(id)) {
        continue;
      }

      const custom = this.normalizeCustomResource(resource);
      if (custom) {
        normalized.push(custom);
      }
    }

    return normalized;
  }

  private normalizeResource(
    defaults: TPlayerResource,
    stored?: LegacyResource
  ): TPlayerResource {
    if (!stored) {
      return { ...defaults };
    }

    const format =
      stored.format === "currency" || stored.format === "days"
        ? stored.format
        : defaults.format;

    const value =
      typeof stored.value === "number" && Number.isFinite(stored.value)
        ? stored.value
        : defaults.value;

    return {
      ...defaults,
      format,
      value: Math.max(0, value),
      color: stored.color ?? defaults.color,
      hasNew: stored.hasNew ?? defaults.hasNew,
    };
  }

  private normalizeCustomResource(
    resource: LegacyResource
  ): TPlayerResource | null {
    if (
      !resource ||
      typeof resource !== "object" ||
      typeof resource.id !== "string" ||
      typeof resource.label !== "string" ||
      typeof resource.icon !== "string"
    ) {
      return null;
    }

    const format =
      resource.format === "currency" || resource.format === "days"
        ? resource.format
        : "currency";

    const value =
      typeof resource.value === "number" && Number.isFinite(resource.value)
        ? resource.value
        : 0;

    return {
      id: resource.id,
      label: resource.label,
      icon: resource.icon,
      format,
      value: Math.max(0, value),
      color: resource.color,
      hasNew: resource.hasNew,
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

  setResources(resources: ReadonlyArray<LegacyResource>): void {
    this.setState({
      ...this.state,
      resources: this.mergeResources(resources),
    });
  }

  updateResource(id: string, value: number): void {
    this.setResources(
      this.state.resources.map((resource) =>
        resource.id === id
          ? { ...resource, value: Math.max(0, value) }
          : resource
      )
    );
  }

  adjustResource(id: string, delta: number): TPlayerResource | undefined {
    const resource = this.state.resources.find((r) => r.id === id);
    if (!resource) {
      return undefined;
    }

    const nextValue = Math.max(0, resource.value + delta);
    this.updateResource(id, nextValue);
    return { ...resource, value: nextValue };
  }

  purchaseSkin(skinId: string, cost: number): boolean {
    const credits = this.state.resources.find((r) => r.id === "credits");

    if (!credits) {
      this.setSelectedSkin(skinId);
      return true;
    }

    if (credits.value < cost) {
      return false;
    }

    this.adjustResource("credits", -Math.abs(cost));
    this.setSelectedSkin(skinId);
    return true;
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
