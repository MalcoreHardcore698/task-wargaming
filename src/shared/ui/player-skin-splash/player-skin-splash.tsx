import cn from "classnames";
import { motion } from "framer-motion";

import { EASING } from "@/shared/ui/animations";

import styles from "./styles.module.scss";

const SPLASH_VARIANTS = {
  visible: {
    x: 0,
    scale: 1,
    opacity: 1,
    visibility: "visible",
    transition: { duration: 0.35, ease: EASING.out },
  },
  hidden: {
    x: -24,
    opacity: 0,
    transition: { duration: 0.2, ease: EASING.out },
    transitionEnd: { visibility: "hidden" },
  },
};

export interface IPlayerSkinSplashProps {
  src?: string;
  alt?: string;
  className?: string;
  visible?: boolean;
}

function PlayerSkinSplash({
  src = "/src/assets/images/skins/poseidon.png",
  alt = "Skin splash",
  className,
  visible = true,
}: IPlayerSkinSplashProps) {
  const rootClassName = cn(styles.root, className);

  return (
    <motion.div
      className={rootClassName}
      variants={SPLASH_VARIANTS}
      initial={visible ? "visible" : "hidden"}
      animate={visible ? "visible" : "hidden"}
    >
      <img src={src} alt={alt} className={styles.image} />
    </motion.div>
  );
}

export default PlayerSkinSplash;
