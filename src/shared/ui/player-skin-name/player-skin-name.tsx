import cn from "classnames";
import { useMemo } from "react";
import { motion } from "framer-motion";

import DashSVG from "@/assets/svg/cmd-badge-legend-4.svg";
import { EASING } from "@/shared/ui/animations";

import styles from "./styles.module.scss";

const APPEAR_ANIMATION = {
  y: 0,
  opacity: 1,
  visibility: "visible",
  transition: { duration: 0.35, ease: EASING.out },
};

const DISAPPEAR_ANIMATION = {
  y: 12,
  opacity: 0,
  transition: { duration: 0.2, ease: EASING.out },
  transitionEnd: { visibility: "hidden" },
};

export interface IPlayerSkinNameProps {
  rank?: string;
  name?: string;
  level?: number | string;
  subtitle?: string;
  className?: string;
  visible?: boolean;
}

function PlayerSkinName({
  name,
  rank,
  level,
  subtitle,
  className,
  visible = true,
}: IPlayerSkinNameProps) {
  const rootClassName = cn(styles.root, className);

  const animation = useMemo(() => {
    return visible ? APPEAR_ANIMATION : DISAPPEAR_ANIMATION;
  }, [visible]);

  return (
    <motion.div
      initial={DISAPPEAR_ANIMATION}
      animate={animation}
      className={rootClassName}
    >
      <div className={styles.container}>
        <span className={styles.level}>{level}</span>

        <img src={DashSVG} alt="Dash" className={styles.dash} />

        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.rank}>
            {subtitle} {rank}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerSkinName;
