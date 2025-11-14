import { useCallback, useLayoutEffect, useState } from "react";
import type { MutableRefObject, TransitionEvent } from "react";

import {
  COLLAPSED_HEIGHT,
  getCollapseStyles,
  shouldShowGradient,
} from "../utils";

interface IUseOverviewCollapseParams {
  canCollapse: boolean;
  rootRef: MutableRefObject<HTMLDivElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  effectsLength: number;
  guiseOptionsLength: number;
  selectedSkinId?: string;
}

interface IUseOverviewCollapseResult {
  collapseStyles: ReturnType<typeof getCollapseStyles>;
  isExpanded: boolean;
  isAnimating: boolean;
  handleToggleExpand: (nextState: boolean) => void;
  handleTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
  scheduleContentHeightMeasurement: () => void;
  resetAnimation: () => void;
}

function useOverviewCollapse({
  canCollapse,
  rootRef,
  contentRef,
  effectsLength,
  guiseOptionsLength,
  selectedSkinId,
}: IUseOverviewCollapseParams): IUseOverviewCollapseResult {
  const [isExpanded, setExpanded] = useState(false);
  const [isAnimating, setAnimating] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const showGradient = shouldShowGradient(canCollapse, isExpanded, isAnimating);

  const collapseStyles = getCollapseStyles({
    canCollapse,
    collapsedHeight: COLLAPSED_HEIGHT,
    contentHeight,
    isExpanded,
    showGradient,
  });

  const resetAnimation = useCallback(() => {
    setAnimating(false);
  }, []);

  const measureContentHeight = useCallback(() => {
    if (!canCollapse) {
      return;
    }

    const node = contentRef.current;

    if (!node) {
      return;
    }

    setContentHeight(node.scrollHeight);
  }, [canCollapse, contentRef]);

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

  const handleToggleExpand = useCallback(
    (nextState: boolean) => {
      if (!canCollapse) {
        return;
      }

      if (nextState === isExpanded) {
        return;
      }

      setAnimating(true);
      setExpanded(nextState);
    },
    [canCollapse, isExpanded]
  );

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== rootRef.current) {
        return;
      }

      if (event.propertyName !== "max-height") {
        return;
      }

      setAnimating(false);
    },
    [rootRef]
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !canCollapse) {
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
    canCollapse,
    contentRef,
    effectsLength,
    guiseOptionsLength,
    measureContentHeight,
    selectedSkinId,
  ]);

  useLayoutEffect(() => {
    if (!canCollapse) {
      setAnimating(false);
    }
  }, [canCollapse]);

  return {
    collapseStyles,
    isExpanded,
    isAnimating,
    handleToggleExpand,
    handleTransitionEnd,
    scheduleContentHeightMeasurement,
    resetAnimation,
  };
}

export default useOverviewCollapse;
