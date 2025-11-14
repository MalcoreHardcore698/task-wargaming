import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDown } from "react-icons/fa";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

import { usePlayer } from "@/services/player";
import {
  type TPlayerSkin,
  type TPlayerSkinEffect,
  usePlayerSkins,
} from "@/services/player-skins";
import PlayerSkinName from "@/shared/ui/player-skin-name";
import Section from "@/shared/ui/section";
import Option from "@/shared/ui/option";

import { EASING } from "@/shared/ui/animations";
import { useBreakpoints } from "@/shared/hooks";

import styles from "./styles.module.scss";

const APPEAR_ANIMATION = {
  x: 0,
  opacity: 1,
  visibility: "visible",
  transition: { duration: 0.3, ease: EASING.out },
};

const DISAPPEAR_ANIMATION = {
  x: -20,
  opacity: 0,
  transition: { duration: 0.2, ease: EASING.out },
  transitionEnd: { visibility: "hidden" },
};

const GUISE_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: EASING.standard },
  },
};

const GUISE_APPLY_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASING.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASING.standard },
  },
};

const COLLAPSED_HEIGHT = 150;

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
  const { selectedSkinId, getSkinGuise, setSkinGuise } = usePlayer();
  const { skins, getGuises } = usePlayerSkins();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isPickerOpen, setPickerOpen] = useState<boolean>(false);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [isAnimating, setAnimating] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const { isTablet, isMobile } = useBreakpoints();

  const guiseOptions = getGuises();

  const rootClassName = cn(styles.root, className);

  const canCollapsable = isTablet || isMobile;

  const totalSkins = skins.length;
  const currentIndex =
    Math.max(
      0,
      skins.findIndex((s) => s.id === skin?.id)
    ) + 1;

  const currentGuise = getSkinGuise(selectedSkinId);

  const measureContentHeight = useCallback(() => {
    if (!canCollapsable) {
      return;
    }

    const node = contentRef.current;

    if (!node) {
      return;
    }

    setContentHeight(node.scrollHeight);
  }, [canCollapsable]);

  const scheduleContentHeightMeasurement = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureContentHeight();
      });
    });
  }, [measureContentHeight]);

  const animation = useMemo(() => {
    return visible ? APPEAR_ANIMATION : DISAPPEAR_ANIMATION;
  }, [visible]);

  const showGradient = useMemo(() => {
    if (!canCollapsable) {
      return false;
    }

    return !isExpanded || isAnimating;
  }, [isAnimating, isExpanded, canCollapsable]);

  const collapseStyles = useMemo(() => {
    if (!canCollapsable) {
      return undefined;
    }

    const expandedHeight = `${Math.max(contentHeight, COLLAPSED_HEIGHT + 1)}px`;

    return {
      "--collapse-mask-opacity": showGradient ? 0 : 1,
      maxHeight: isExpanded ? expandedHeight : `${COLLAPSED_HEIGHT}px`,
      overflow: showGradient ? "hidden" : "visible",
      cursor: isExpanded ? "auto" : "pointer",
    };
  }, [contentHeight, isExpanded, canCollapsable, showGradient]);

  const handleToggleExpand = (nextState: boolean) => {
    if (!canCollapsable) {
      return;
    }

    if (nextState === isExpanded) {
      return;
    }

    setAnimating(true);
    setExpanded(nextState);
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== rootRef.current) {
      return;
    }

    if (event.propertyName !== "max-height") {
      return;
    }

    setAnimating(false);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!canCollapsable) {
      return;
    }

    const node = contentRef.current;

    if (!node) {
      return;
    }

    measureContentHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureContentHeight();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [
    canCollapsable,
    isPickerOpen,
    effects.length,
    guiseOptions.length,
    selectedSkinId,
    measureContentHeight,
  ]);

  useEffect(() => {
    setPickerOpen(false);
    setAnimating(false);
  }, [selectedSkinId]);

  useEffect(() => {
    if (!canCollapsable) {
      setAnimating(false);
    }
  }, [canCollapsable]);

  return (
    <motion.div
      ref={rootRef}
      style={collapseStyles}
      initial={DISAPPEAR_ANIMATION}
      animate={animation}
      className={rootClassName}
      onTransitionEnd={handleTransitionEnd}
      onClick={() => {
        if (!canCollapsable || isExpanded) {
          return;
        }

        handleToggleExpand(true);
      }}
    >
      {canCollapsable && (
        <button
          type="button"
          className={styles.collapseToggle}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse" : "Expand"}
          onClick={(event) => {
            event.stopPropagation();
            handleToggleExpand(!isExpanded);
          }}
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

              {skin && canCollapsable && (
                <PlayerSkinName
                  level={skin?.level ?? 0}
                  rank={skin?.rank ?? ""}
                  name={(skin?.name ?? "").toUpperCase()}
                  subtitle="RANK"
                  className={styles.playerSkinName}
                  visible={canCollapsable}
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
                          setSkinGuise(selectedSkinId, guiseOption.type);
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

        {effects.length > 0 && (
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
      </div>
    </motion.div>
  );
}

export default PlayerSkinOverview;
