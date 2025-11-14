import type { TPlayerSkin } from "@/services/player-skins";

export interface ICarouselPlayerSkin {
  index: number;
  id: string;
  name: string;
  image: string;
  equipped: boolean;
}

export const ACTIVE_VIEWPORT_TOP = 300;

export function mapPlayerSkins(
  skins: TPlayerSkin[],
  equippedSkinId: string
): ICarouselPlayerSkin[] {
  return skins.map((playerSkin, index) => ({
    index,
    id: playerSkin.id,
    name: playerSkin.name,
    image: playerSkin.portrait,
    equipped: playerSkin.id === equippedSkinId,
  }));
}

type IDirectionalDirection = "up" | "down" | "left" | "right";

export function resolveCurrentIndex(
  skins: TPlayerSkin[],
  selectedSkinId: string
): number {
  const foundIndex = skins.findIndex((skin) => skin.id === selectedSkinId);
  return foundIndex >= 0 ? foundIndex : 0;
}

export function resolveVisualIndex(
  pendingIndex: number | null,
  currentIndex: number
): number {
  return pendingIndex ?? currentIndex;
}

export function getNavigationDelta(
  direction: IDirectionalDirection,
  isHorizontal: boolean
): -1 | 0 | 1 {
  if (isHorizontal) {
    if (direction === "right") return 1;
    if (direction === "left") return -1;
    return 0;
  }

  if (direction === "down") return 1;
  if (direction === "up") return -1;

  return 0;
}

export function resolveNextIndex(
  currentIndex: number,
  delta: number,
  totalSkins: number
): number {
  if (delta === 0) {
    return currentIndex;
  }

  const nextIndex = currentIndex + delta;
  const clampedNextIndex = Math.max(0, Math.min(totalSkins - 1, nextIndex));

  return clampedNextIndex;
}

interface ITranslateParams {
  index: number;
  isHorizontal: boolean;
  stride: number;
  itemExtent: number;
  container: HTMLDivElement | null;
  activeViewportTop: number;
}

export function calculateTranslate({
  index,
  isHorizontal,
  stride,
  itemExtent,
  container,
  activeViewportTop,
}: ITranslateParams): number {
  if (isHorizontal) {
    if (!container) {
      return 0;
    }

    const { width } = container.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft || "0") || 0;

    const target = width / 2 - paddingLeft;
    const itemCenter = index * stride + itemExtent / 2;

    return target - itemCenter;
  }

  const containerTop = container?.getBoundingClientRect().top ?? 0;
  const itemCenter = index * stride + itemExtent / 2;

  return activeViewportTop - containerTop - itemCenter;
}
