import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { usePlayer } from "@/services/player";
import { usePlayerSkins } from "@/services/player-skins";
import type { TPlayerSkin } from "@/services/player-skins";
import PageHeader from "@/features/page-header";
import PageLayout from "@/features/page-layout";
import PageFooter from "@/features/page-footer";
import { fadeIn, EASING } from "@/shared/ui";

import PageContent from "./page-content";
import styles from "./styles.module.scss";

const SKIN_PURCHASE_COST = 25_000;

function SkinSelectionPage() {
  const navigate = useNavigate();

  const { selectedSkinId, resources, purchaseSkin } = usePlayer();
  const { skins, getById } = usePlayerSkins();

  const [displayedSkinId, setDisplayedSkinId] =
    useState<string>(selectedSkinId);

  const selectedPlayerSkin = getById(displayedSkinId) ?? skins[0];

  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [contentVisible, setContentVisible] = useState<boolean>(true);

  const isSwitching = pendingIndex != null;

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSkinSelect = (skin: TPlayerSkin): void => {
    setDisplayedSkinId(skin.id);
  };

  const handleShowGuiseBio = () => {
    alert(`${selectedPlayerSkin.name}: ${selectedPlayerSkin.description}`);
  };

  const credits = resources.find((resource) => resource.id === "credits");
  const canAffordPurchase = (credits?.value ?? 0) >= SKIN_PURCHASE_COST;

  const handleOutfit = () => {
    if (
      !displayedSkinId ||
      displayedSkinId === selectedSkinId ||
      !canAffordPurchase
    ) {
      return;
    }

    const success = purchaseSkin(displayedSkinId, SKIN_PURCHASE_COST);

    if (!success) {
      alert("Not enough credits to outfit this commander.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const previousSelectedSkinIdRef = useRef<string>(selectedSkinId);

  useEffect(() => {
    if (isSwitching) return;
    if (selectedSkinId === previousSelectedSkinIdRef.current) return;

    previousSelectedSkinIdRef.current = selectedSkinId;
    setDisplayedSkinId(selectedSkinId);
  }, [selectedSkinId, isSwitching]);

  useEffect(() => {
    setContentVisible(true);
  }, [selectedPlayerSkin.id]);

  useEffect(() => {
    carouselRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Skin Selection"
        description="Select your skin to continue"
        keywords="skin selection, skin, select, continue"
        selectedPlayerSkin={selectedPlayerSkin}
        contentVisible={contentVisible}
      />

      <motion.div
        {...fadeIn({ duration: 0.9, delay: 0.2, ease: EASING.out })}
        className={styles.background}
      />

      <PageContent
        skins={skins}
        pendingIndex={pendingIndex}
        selectedPlayerSkin={selectedPlayerSkin}
        equippedSkinId={selectedSkinId}
        contentVisible={contentVisible}
        setContentVisible={setContentVisible}
        setPendingIndex={setPendingIndex}
        onSkinSelect={handleSkinSelect}
        carouselRef={carouselRef}
      />

      <PageFooter
        leading={[
          {
            label: "Back",
            keyLabel: "esc",
            keyboardKey: "Escape",
            onClick: handleBack,
          },
          {
            label: "Outfit",
            keyLabel: "Enter",
            keyboardKey: "Enter",
            onClick: handleOutfit,
            disabled: displayedSkinId === selectedSkinId || !canAffordPurchase,
          },
        ]}
        trailing={[
          {
            label: "Show Guise Bio",
            keyLabel: "b",
            keyboardKey: "b",
            onClick: handleShowGuiseBio,
          },
        ]}
      />
    </PageLayout>
  );
}

export default SkinSelectionPage;
