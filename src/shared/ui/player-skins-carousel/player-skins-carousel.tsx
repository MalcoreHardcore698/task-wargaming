import cn from "classnames";
import { motion } from "framer-motion";
import { type Ref, useCallback, useMemo, useRef } from "react";

import type { TPlayerSkin } from "@/services/player-skins";
import { EASING } from "@/shared/ui/animations";

import { useCarouselDimensions, useCarouselNavigation } from "./hooks";
import {
  ACTIVE_VIEWPORT_TOP,
  calculateTranslate,
  mapPlayerSkins,
  resolveCurrentIndex,
  resolveVisualIndex,
} from "./utils";
import PlayerSkinItem from "./player-skin-item";
import styles from "./styles.module.scss";

const CAROUSEL_ANIMATION = {
  duration: 0.3,
  ease: EASING.out,
} as const;

export type TCarouselDirection = "vertical" | "horizontal";

export interface IPlayerSkinsCarouselProps {
  ref?: Ref<HTMLDivElement>;
  skins: TPlayerSkin[];
  className?: string;
  direction?: TCarouselDirection;
  pendingIndex: number | null;
  selectedPlayerSkin: TPlayerSkin;
  equippedSkinId: string;
  setContentVisible: (visible: boolean) => void;
  setPendingIndex: (index: number | null) => void;
  onSkinSelect: (skin: TPlayerSkin) => void;
}

function PlayerSkinsCarousel({
  ref,
  skins,
  direction = "vertical",
  pendingIndex,
  selectedPlayerSkin,
  equippedSkinId,
  className,
  setContentVisible,
  setPendingIndex,
  onSkinSelect,
}: IPlayerSkinsCarouselProps) {
  const playerSkins = useMemo(
    () => mapPlayerSkins(skins, equippedSkinId),
    [skins, equippedSkinId]
  );
  const currentIndex = useMemo(
    () => resolveCurrentIndex(skins, selectedPlayerSkin.id),
    [skins, selectedPlayerSkin.id]
  );
  const isSwitching = pendingIndex != null;
  const visualIndex = resolveVisualIndex(pendingIndex, currentIndex);

  const containerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = direction === "horizontal";
  const totalSkins = skins.length;

  const rootClassName = cn(
    styles.root,
    isHorizontal && styles.horizontal,
    className
  );

  const { listRef, stride, itemExtent } = useCarouselDimensions({
    isHorizontal,
    itemsCount: totalSkins,
  });

  const getTranslate = useCallback(
    (index: number): number => {
      return calculateTranslate({
        index,
        isHorizontal,
        stride,
        itemExtent,
        container: containerRef.current,
        activeViewportTop: ACTIVE_VIEWPORT_TOP,
      });
    },
    [stride, itemExtent, isHorizontal]
  );

  const carouselAnimation = useMemo(() => {
    if (isHorizontal) {
      return {
        x: getTranslate(visualIndex),
      };
    }

    return {
      y: getTranslate(visualIndex),
    };
  }, [isHorizontal, visualIndex, getTranslate]);

  const setPendingIndexForNavigation = useCallback(
    (index: number) => {
      setPendingIndex(index);
    },
    [setPendingIndex]
  );

  const handleItemSelect = useCallback(
    (index: number) => {
      if (isSwitching || index === currentIndex) {
        return;
      }

      setContentVisible(false);
      setPendingIndex(index);
    },
    [currentIndex, isSwitching, setContentVisible, setPendingIndex]
  );

  const directionalInputTarget = useCarouselNavigation({
    isHorizontal,
    isSwitching,
    totalSkins,
    currentIndex,
    setContentVisible,
    setPendingIndex: setPendingIndexForNavigation,
  });

  const handleContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      directionalInputTarget(node);

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, directionalInputTarget]
  );

  const completeSelection = useCallback(
    (index: number | null): void => {
      if (index == null) return;

      const skin = skins[index];

      if (skin && skin.id !== selectedPlayerSkin.id) {
        onSkinSelect(skin);
      }

      setPendingIndex(null);
    },
    [skins, selectedPlayerSkin.id, onSkinSelect, setPendingIndex]
  );

  const finishAnimation = (): void => {
    if (pendingIndex == null) return;
    completeSelection(pendingIndex);
  };

  return (
    <div ref={handleContainerRef} className={rootClassName} tabIndex={0}>
      <motion.div
        ref={listRef}
        animate={carouselAnimation}
        className={styles.carousel}
        transition={CAROUSEL_ANIMATION}
        onAnimationComplete={finishAnimation}
      >
        {playerSkins.map((playerSkin) => (
          <PlayerSkinItem
            key={playerSkin.id}
            name={playerSkin.name}
            image={playerSkin.image}
            index={playerSkin.index}
            visualIndex={visualIndex}
            currentIndex={currentIndex}
            equipped={playerSkin.equipped}
            isSwitching={isSwitching}
            isHorizontal={isHorizontal}
            onSelect={handleItemSelect}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default PlayerSkinsCarousel;
