import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/services/auth";
import { usePlayer } from "@/services/player";
import {
  PageSEO,
  PlayerSkinName,
  PlayerResources,
  PlayerName,
  appearDown,
} from "@/shared/ui";

import type { TPlayerSkin } from "@/services/player-skins";
import styles from "./styles.module.scss";

let hasPageHeaderBarsAnimated = false;

export interface IPageHeaderProps {
  title?: string;
  keywords?: string;
  description?: string;
  selectedPlayerSkin?: TPlayerSkin;
  contentVisible?: boolean;
}

function PageHeader({
  title,
  keywords,
  description,
  selectedPlayerSkin,
  contentVisible = true,
}: IPageHeaderProps) {
  const { user } = useAuth();
  const { resources } = usePlayer();
  const [shouldAnimateBars, setShouldAnimateBars] = useState(
    () => !hasPageHeaderBarsAnimated
  );

  useEffect(() => {
    if (!shouldAnimateBars) {
      return;
    }

    hasPageHeaderBarsAnimated = true;
    setShouldAnimateBars(false);
  }, [shouldAnimateBars]);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.root}>
      <PageSEO.Helmet
        type="website"
        title={title}
        keywords={keywords}
        description={description}
      />

      <div className={styles.container}>
        {selectedPlayerSkin ? (
          <PlayerSkinName
            level={selectedPlayerSkin?.level ?? 0}
            rank={selectedPlayerSkin?.rank ?? ""}
            name={(selectedPlayerSkin?.name ?? "").toUpperCase()}
            subtitle="RANK"
            className={styles.playerSkinName}
            visible={contentVisible}
          />
        ) : (
          <span className={styles.playerSkinName} />
        )}

        <motion.div
          {...(shouldAnimateBars
            ? appearDown({ distance: 12, duration: 0.45, delay: 0.12 })
            : {
                initial: false,
                animate: { opacity: 1, y: 0 },
              })}
          className={styles.bars}
        >
          <PlayerResources resources={resources} />
          <PlayerName name={user.name} className={styles.playerName} />
        </motion.div>
      </div>
    </div>
  );
}

export default PageHeader;
