import type { CSSProperties } from "react";
import type { MotionProps } from "framer-motion";

import type { TPlayerSkin } from "@/services/player-skins";

type TCollapseCSSProperties = CSSProperties & {
  "--collapse-mask-opacity"?: number;
};

import { EASING } from "@/shared/ui/animations";

export const APPEAR_ANIMATION: MotionProps["animate"] = {
  x: 0,
  opacity: 1,
  visibility: "visible",
  transition: { duration: 0.3, ease: EASING.out },
};

export const DISAPPEAR_ANIMATION: MotionProps["animate"] = {
  x: -20,
  opacity: 0,
  transition: { duration: 0.2, ease: EASING.out },
  transitionEnd: { visibility: "hidden" },
};

export const GUISE_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: EASING.standard },
  },
} as const;

export const GUISE_APPLY_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASING.standard },
  },
} as const;

export const COLLAPSED_HEIGHT = 150;

export function getOverviewAnimation(visible: boolean) {
  return visible ? APPEAR_ANIMATION : DISAPPEAR_ANIMATION;
}

export function shouldShowGradient(
  canCollapse: boolean,
  isExpanded: boolean,
  isAnimating: boolean
) {
  if (!canCollapse) {
    return false;
  }

  return !isExpanded || isAnimating;
}

interface ICollapseStylesOptions {
  canCollapse: boolean;
  collapsedHeight: number;
  contentHeight: number;
  isExpanded: boolean;
  showGradient: boolean;
}

export function getCollapseStyles({
  canCollapse,
  collapsedHeight,
  contentHeight,
  isExpanded,
  showGradient,
}: ICollapseStylesOptions) {
  if (!canCollapse) {
    return undefined;
  }

  const expandedHeight = `${Math.max(contentHeight, collapsedHeight + 1)}px`;

  const styles: TCollapseCSSProperties = {
    "--collapse-mask-opacity": showGradient ? 0 : 1,
    maxHeight: isExpanded ? expandedHeight : `${collapsedHeight}px`,
    overflow: showGradient ? "hidden" : "visible",
    cursor: isExpanded ? "auto" : "pointer",
  };

  return styles;
}

export function getCurrentSkinPosition(skins: TPlayerSkin[], skinId?: string) {
  const totalSkins = skins.length;
  const zeroBasedIndex = skins.findIndex((skin) => skin.id === skinId);
  const currentIndex = Math.max(0, zeroBasedIndex) + 1;

  return {
    totalSkins,
    currentIndex,
  };
}
