import { useCallback } from "react";
import cn from "classnames";

import PlayerSkinPortrait from "@/shared/ui/player-skin-portrait";

import styles from "./styles.module.scss";

export interface IPlayerSkinItemProps {
  name: string;
  index: number;
  image: string;
  visualIndex: number;
  currentIndex: number;
  equipped: boolean;
  isSwitching: boolean;
  isHorizontal: boolean;
  onSelect: (index: number) => void;
}

function PlayerSkinItem({
  name,
  index,
  image,
  visualIndex,
  currentIndex,
  equipped,
  isSwitching,
  isHorizontal,
  onSelect,
}: IPlayerSkinItemProps) {
  const isActive = !isSwitching && index === currentIndex;
  const isOutsideViewport = index < visualIndex || index > visualIndex + 2;

  const itemClassName = cn(
    styles.item,
    isActive && styles.active,
    isActive && isHorizontal && styles.horizontalActive,
    isOutsideViewport && styles.dimmed
  );

  const handleClick = useCallback(() => {
    if (isSwitching || index === currentIndex) {
      return;
    }

    onSelect(index);
  }, [currentIndex, index, isSwitching, onSelect]);

  return (
    <div data-portrait-item className={itemClassName}>
      <PlayerSkinPortrait
        src={image}
        name={name}
        active={isActive}
        equipped={equipped}
        onClick={handleClick}
      />
    </div>
  );
}

export default PlayerSkinItem;
