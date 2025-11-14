import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { ERoutePath } from "@/app/routes/types";
import defaultAvatar from "@/assets/images/avatar.png";
import { appearRight } from "@/shared/ui";

import styles from "./styles.module.scss";

let hasPlayerNameAnimated = false;

export interface IPlayerNameProps {
  name?: string;
  avatarSrc?: string;
  className?: string;
}

function PlayerName({
  name = "test_ivcy",
  avatarSrc = defaultAvatar,
  className,
}: IPlayerNameProps) {
  const navigate = useNavigate();
  const [shouldAnimate, setShouldAnimate] = useState(
    () => !hasPlayerNameAnimated
  );

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    hasPlayerNameAnimated = true;
    setShouldAnimate(false);
  }, [shouldAnimate]);

  const handleClick = () => {
    navigate(ERoutePath.WELCOME);
  };

  return (
    <motion.div
      {...(shouldAnimate
        ? appearRight({ distance: 16, duration: 0.45, delay: 0.16 })
        : {
            initial: false,
            animate: { opacity: 1, x: 0 },
          })}
      className={className}
      onClick={handleClick}
    >
      <div className={styles.container}>
        <img className={styles.avatar} src={avatarSrc} alt={name} />
        <span className={styles.name}>{name}</span>
      </div>
    </motion.div>
  );
}

export default PlayerName;
