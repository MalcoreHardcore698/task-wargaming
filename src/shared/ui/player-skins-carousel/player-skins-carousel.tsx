import cn from "classnames";
import { motion } from "framer-motion";
import {
  type Ref,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { TPlayerSkin } from "@/services/player-skins";
import {
  useDirectionalInput,
  type IDirectionalInputEvent,
} from "@/shared/hooks";
import PlayerSkinPortrait from "@/shared/ui/player-skin-portrait";
import { EASING } from "@/shared/ui/animations";

import styles from "./styles.module.scss";

export type TCarouselDirection = "vertical" | "horizontal";

export interface IPlayerSkinsCarouselProps {
  ref?: Ref<HTMLDivElement>;
  skins: TPlayerSkin[];
  direction?: TCarouselDirection;
  pendingIndex: number | null;
  selectedPlayerSkin: TPlayerSkin;
  equippedSkinId: string;
  className?: string;
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
  const playerSkins = skins.map((playerSkin, idx) => ({
    index: idx,
    id: playerSkin.id,
    name: playerSkin.name,
    image: playerSkin.portrait,
    equipped: playerSkin.id === equippedSkinId,
  }));

  const currentIndex = useMemo(
    () =>
      Math.max(
        0,
        skins.findIndex((s) => s.id === selectedPlayerSkin.id)
      ),
    [skins, selectedPlayerSkin.id]
  );
  const isSwitching = pendingIndex != null;
  const visualIndex = pendingIndex ?? currentIndex;

  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stride, setStride] = useState<number>(120);
  const [itemExtent, setItemExtent] = useState<number>(114);
  const ACTIVE_VIEWPORT_TOP = 300;

  const isHorizontal = direction === "horizontal";
  const totalSkins = skins.length;

  const rootClassName = cn(
    styles.root,
    isHorizontal && styles.horizontal,
    className
  );

  const handleDirectionalInput = useCallback(
    ({ direction }: IDirectionalInputEvent): void => {
      if (isSwitching || totalSkins === 0) return;

      const isForward =
        (isHorizontal && direction === "right") ||
        (!isHorizontal && direction === "down");
      const isBackward =
        (isHorizontal && direction === "left") ||
        (!isHorizontal && direction === "up");

      if (!isForward && !isBackward) return;

      const delta = isForward ? 1 : -1;
      const nextIndex = Math.min(
        totalSkins - 1,
        Math.max(0, currentIndex + delta)
      );

      if (nextIndex === currentIndex) return;

      setContentVisible(false);
      setPendingIndex(nextIndex);
    },
    [
      currentIndex,
      isHorizontal,
      isSwitching,
      setContentVisible,
      setPendingIndex,
      totalSkins,
    ]
  );

  const directionalInputTarget = useDirectionalInput<HTMLDivElement>({
    onDirection: handleDirectionalInput,
    enabled: !isSwitching && totalSkins > 1,
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

  const getTranslate = (index: number): number => {
    if (isHorizontal) {
      const container = containerRef.current;
      if (!container) return 0;

      const { width } = container.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyle.paddingLeft || "0") || 0;

      const target = width / 2 - paddingLeft;
      const itemCenter = index * stride + itemExtent / 2;

      return target - itemCenter;
    }

    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
    const itemCenter = index * stride + itemExtent / 2;
    return ACTIVE_VIEWPORT_TOP - containerTop - itemCenter;
  };

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const items = listEl.querySelectorAll<HTMLElement>("[data-portrait-item]");
    const first = items[0];
    if (!first) return;
    const style = window.getComputedStyle(listEl);

    if (isHorizontal) {
      const gap =
        parseFloat(style.columnGap || style.gap || style.rowGap || "0") || 0;
      const width = first.offsetWidth;
      setItemExtent(width);
      setStride(width + gap);
      return;
    }

    const gap = parseFloat(style.rowGap || style.gap || "0") || 0;
    const height = first.offsetHeight;
    setItemExtent(height);
    setStride(height + gap);
  }, [skins.length, isHorizontal]);

  return (
    <div ref={handleContainerRef} className={rootClassName} tabIndex={0}>
      <motion.div
        ref={listRef}
        className={styles.carousel}
        animate={
          isHorizontal
            ? {
                x: getTranslate(visualIndex),
              }
            : {
                y: getTranslate(visualIndex),
              }
        }
        transition={{
          duration: 0.3,
          ease: EASING.out,
        }}
        onAnimationComplete={finishAnimation}
      >
        {playerSkins.map((p) => (
          <div
            key={p.id}
            data-portrait-item
            className={cn(
              styles.item,
              !isSwitching && p.index === currentIndex && styles.activeItem,
              (p.index < visualIndex || p.index > visualIndex + 2) &&
                styles.dimmed
            )}
          >
            <PlayerSkinPortrait
              src={p.image}
              name={p.name}
              active={!isSwitching && p.index === currentIndex}
              equipped={p.equipped}
              onClick={() => {
                if (isSwitching || p.index === currentIndex) return;
                setContentVisible(false);
                setPendingIndex(p.index);
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default PlayerSkinsCarousel;
