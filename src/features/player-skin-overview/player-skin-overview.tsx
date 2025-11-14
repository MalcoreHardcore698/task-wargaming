import cn from "classnames";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
import { FaAngleDown } from "react-icons/fa";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useApp } from "@/services/app";
import { usePlayer } from "@/services/player";
import {
  type TPlayerSkin,
  type TPlayerSkinEffect,
  usePlayerSkins,
} from "@/services/player-skins";
import PlayerSkinName from "@/shared/ui/player-skin-name";
import Section from "@/shared/ui/section";
import Option from "@/shared/ui/option";

import { useOverviewCollapse } from "./hooks";
import {
  DISAPPEAR_ANIMATION,
  getCurrentSkinPosition,
  getOverviewAnimation,
  GUISE_APPLY_VARIANTS,
  GUISE_VARIANTS,
} from "./utils";
import styles from "./styles.module.scss";

export interface IPlayerSkinOverviewProps {
  skin?: TPlayerSkin;
  title?: string;
  description?: string;
  effects?: TPlayerSkinEffect[];
  className?: string;
  visible?: boolean;
}

export function PlayerSkinOverview({
  skin,
  title,
  effects = [],
  className,
  visible = true,
}: IPlayerSkinOverviewProps) {
  const { getSkinGuise, setSkinGuise } = usePlayer();
  const { skins, getGuises } = usePlayerSkins();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);

  const { breakpoints } = useApp();
  const { isTablet, isMobile } = breakpoints;

  const rootClassName = cn(styles.root, className);

  const canCollapse = isTablet || isMobile;

  const animation = useMemo(() => getOverviewAnimation(visible), [visible]);
  const transformTemplate = useCallback<
    NonNullable<MotionProps["transformTemplate"]>
  >((_props, transform) => {
    const scaleValue = "scale(var(--player-skin-overview-scale, 1))";

    const trimmed = typeof transform === "string" ? transform.trim() : "";

    if (trimmed && trimmed !== "none") {
      return `${scaleValue} ${trimmed}`;
    }

    return scaleValue;
  }, []);

  const displayedSkinId = skin?.id;
  const guiseOptions = getGuises();
  const { totalSkins, currentIndex } = useMemo(
    () => getCurrentSkinPosition(skins, skin?.id),
    [skins, skin?.id]
  );

  const currentGuise = displayedSkinId
    ? getSkinGuise(displayedSkinId)
    : undefined;

  const {
    collapseStyles,
    isExpanded,
    handleToggleExpand,
    handleTransitionEnd,
    scheduleContentHeightMeasurement,
    resetAnimation,
  } = useOverviewCollapse({
    canCollapse,
    rootRef,
    contentRef,
    effectsLength: effects.length,
    guiseOptionsLength: guiseOptions.length,
    selectedSkinId: displayedSkinId,
  });

  const handleCollapseOnce = useCallback(() => {
    if (!canCollapse || isExpanded) {
      return;
    }

    handleToggleExpand(true);
  }, [canCollapse, isExpanded, handleToggleExpand]);

  const handleCollapseToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      handleToggleExpand(!isExpanded);
    },
    [isExpanded, handleToggleExpand]
  );

  useEffect(() => {
    setPickerOpen(false);
    resetAnimation();
  }, [displayedSkinId, resetAnimation]);

  return (
    <motion.div
      ref={rootRef}
      style={collapseStyles}
      initial={DISAPPEAR_ANIMATION}
      animate={animation}
      className={rootClassName}
      transformTemplate={transformTemplate}
      onTransitionEnd={handleTransitionEnd}
      onClick={handleCollapseOnce}
    >
      {canCollapse && (
        <button
          type="button"
          className={styles.collapseToggle}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse" : "Expand"}
          onClick={handleCollapseToggle}
        >
          <FaAngleDown />
        </button>
      )}
      <div ref={contentRef} className={styles.content}>
        <div className={styles.header}>
          <div className={styles.stock}>
            <span className={styles.stockIndex}>
              {currentIndex}/{totalSkins}
            </span>{" "}
            IN STOCK
          </div>

          <h2 className={styles.title}>{title}</h2>

          <AnimatePresence mode="wait">
            <div className={styles.guiseContainer}>
              {!!currentGuise && (
                <motion.div
                  key={currentGuise.type}
                  className={styles.guise}
                  variants={GUISE_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className={styles.guiseIcon}>
                    <img src={currentGuise.icon} alt={currentGuise.label} />
                  </div>
                  <div className={styles.guiseLabel}>{currentGuise.label}</div>
                </motion.div>
              )}

              {skin && canCollapse && (
                <PlayerSkinName
                  level={skin?.level ?? 0}
                  rank={skin?.rank ?? ""}
                  name={(skin?.name ?? "").toUpperCase()}
                  subtitle="RANK"
                  className={styles.playerSkinName}
                  visible={canCollapse}
                />
              )}
            </div>
          </AnimatePresence>
        </div>
        <div className={styles.guiseApply}>
          <AnimatePresence mode="wait">
            {!isPickerOpen && (
              <motion.button
                key="guise-picker-toggle"
                type="button"
                variants={GUISE_APPLY_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={() => {
                  setPickerOpen((v) => !v);
                  scheduleContentHeightMeasurement();
                }}
              >
                <p className={styles.guiseApplyTitle}>APPLY GUISE</p>
                <p className={styles.guiseApplyDescription}>
                  This guise can be applied to the Commander.
                </p>
              </motion.button>
            )}

            {isPickerOpen && (
              <motion.div
                key="guise-picker"
                variants={GUISE_APPLY_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Section
                  title="TYPES OF GUISES"
                  description="You can select a guise that applies a bonus to battle earnings, changes your Commaner's appearance, and/or applies special effects."
                >
                  <div className={styles.options} role="menu">
                    {guiseOptions.map((guiseOption) => (
                      <Option
                        key={guiseOption.type}
                        icon={guiseOption.icon}
                        title={guiseOption.label}
                        description={guiseOption.description}
                        onClick={() => {
                          if (!displayedSkinId) {
                            return;
                          }

                          setSkinGuise(displayedSkinId, guiseOption.type);
                          setPickerOpen(false);
                          scheduleContentHeightMeasurement();
                        }}
                      />
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {effects.length > 0 && !isPickerOpen && (
            <Section title="VISUAL AND SOUND EFFECTS">
              <div className={styles.options}>
                {effects.map((effect) => (
                  <Option
                    key={effect.id}
                    icon={effect.icon}
                    title={effect.title}
                    description={effect.description}
                  />
                ))}
              </div>
            </Section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default PlayerSkinOverview;
