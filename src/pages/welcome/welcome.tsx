import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LogoWargaming from "@/assets/images/logo-wargaming.png";
import {
  appearDown,
  Button,
  EASING,
  fadeIn,
  PlayerSkinSplash,
} from "@/shared/ui";
import { ERoutePath } from "@/app/routes/types";
import PageHeader from "@/features/page-header";
import PageLayout from "@/features/page-layout";

import styles from "./styles.module.scss";
import { usePlayer } from "@/services/player";
import { usePlayerSkins } from "@/services/player-skins";

function WelcomePage() {
  const navigate = useNavigate();

  const { selectedSkinId } = usePlayer();
  const { skins } = usePlayerSkins();

  const selectedSkin = skins.find((s) => s.id === selectedSkinId);

  const handleChooseSkin = () => {
    navigate(ERoutePath.SKIN_SELECTION);
  };

  const handleWargamingClick = () => {
    window.open("https://wargaming.com", "_blank");
  };

  return (
    <PageLayout className={styles.root}>
      <PageHeader
        title="Welcome"
        description="Welcome to World of Warships: Legends."
        keywords="world of warships: legends, welcome, choose your skin"
      />

      {selectedSkin && (
        <PlayerSkinSplash
          src={selectedSkin.splashImage}
          alt={selectedSkin.name ?? "Skin"}
          className={styles.splash}
          visible
        />
      )}

      <div className={styles.container}>
        <motion.h1
          {...appearDown({ distance: 20, delay: 0.1 })}
          className={styles.title}
        >
          Test
          <br />
          Task
        </motion.h1>
        <motion.h2
          {...appearDown({ distance: 20, delay: 0.2 })}
          className={styles.subtitle}
        >
          <span>For</span>
          <img
            src={LogoWargaming}
            alt="Wargaming"
            onClick={handleWargamingClick}
          />
        </motion.h2>

        <motion.div
          {...fadeIn({ delay: 0.3, duration: 3, ease: EASING.out })}
          className={styles.content}
        >
          <Button className={styles.button} onClick={handleChooseSkin}>
            Choose Your Skin
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}

export default WelcomePage;
