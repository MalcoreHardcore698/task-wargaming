import { useEffect, useRef, type Ref } from "react";

import { useApp } from "@/services/app";
import type { TPlayerSkin } from "@/services/player-skins";
import { PlayerSkinSplash, PlayerSkinsCarousel } from "@/shared/ui";
import PlayerSkinOverview from "@/features/player-skin-overview";

import styles from "./styles.module.scss";

export interface IPageContentProps {
  skins: TPlayerSkin[];
  pendingIndex: number | null;
  selectedPlayerSkin: TPlayerSkin;
  equippedSkinId: string;
  contentVisible: boolean;
  setContentVisible: (visible: boolean) => void;
  setPendingIndex: (index: number | null) => void;
  onSkinSelect: (skin: TPlayerSkin) => void;
  carouselRef?: Ref<HTMLDivElement>;
}

function PageContent({
  skins,
  pendingIndex,
  selectedPlayerSkin,
  equippedSkinId,
  contentVisible,
  setContentVisible,
  setPendingIndex,
  onSkinSelect,
  carouselRef,
}: IPageContentProps) {
  const { breakpoints } = useApp();

  const preloadedSplashImagesRef = useRef<Record<string, HTMLImageElement>>({});

  const { isLaptop, isTablet, isMobile } = breakpoints;

  const isHorizontal = isLaptop || isTablet || isMobile;
  const direction = isHorizontal ? "horizontal" : "vertical";

  useEffect(() => {
    if (typeof window === "undefined" || typeof Image === "undefined") {
      return;
    }

    skins
      .map((skin) => skin.splashImage)
      .filter((src): src is string => Boolean(src))
      .forEach((src) => {
        if (preloadedSplashImagesRef.current[src]) {
          return;
        }

        const image = new Image();
        image.src = src;

        preloadedSplashImagesRef.current[src] = image;
      });
  }, [skins]);

  return (
    <div className={styles.root}>
      <PlayerSkinSplash
        src={selectedPlayerSkin?.splashImage}
        alt={selectedPlayerSkin?.name ?? "Skin"}
        className={styles.playerSkinSplash}
        visible={contentVisible}
      />

      <aside className={styles.aside}>
        <PlayerSkinsCarousel
          ref={carouselRef}
          skins={skins}
          direction={direction}
          pendingIndex={pendingIndex}
          equippedSkinId={equippedSkinId}
          className={styles.playerSkinCarousel}
          selectedPlayerSkin={selectedPlayerSkin}
          setContentVisible={setContentVisible}
          setPendingIndex={setPendingIndex}
          onSkinSelect={onSkinSelect}
        />

        <PlayerSkinOverview
          skin={selectedPlayerSkin}
          title={(selectedPlayerSkin?.name ?? "SKIN").toUpperCase()}
          effects={selectedPlayerSkin?.effects}
          description={selectedPlayerSkin?.description ?? ""}
          className={styles.playerSkinOverview}
          visible={contentVisible}
        />
      </aside>
    </div>
  );
}

export default PageContent;
