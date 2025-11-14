import cn from "classnames";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";

import { EASING } from "@/shared/ui/animations";

import styles from "./styles.module.scss";

export interface IPlayerSkinPortraitProps {
  src: string;
  name: string;
  active?: boolean;
  equipped?: boolean;
  onClick?: () => void;
}

function PlayerSkinPortrait({
  src,
  name,
  active,
  equipped,
  onClick,
}: IPlayerSkinPortraitProps) {
  const rootClassName = cn(styles.root, active && styles.active);

  return (
    <button
      type="button"
      title={name}
      className={rootClassName}
      onClick={onClick}
    >
      <img className={styles.image} src={src} alt={name} />

      {equipped && (
        <FaCheck className={styles.equippedIcon} aria-label="Equipped Skin" />
      )}

      <motion.span
        className={styles.underline}
        animate={{
          width: active ? "calc(100% + 40px)" : "0%",
        }}
        transition={{
          delay: 0.15,
          duration: 0.3,
          ease: EASING.out,
        }}
      />
    </button>
  );
}

export default PlayerSkinPortrait;
