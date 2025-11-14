import { useCallback } from "react";

import {
  useDirectionalInput,
  type IDirectionalInputEvent,
} from "@/shared/hooks";

import { getNavigationDelta, resolveNextIndex } from "../utils";

interface IUseCarouselNavigationParams {
  totalSkins: number;
  currentIndex: number;
  isHorizontal: boolean;
  isSwitching: boolean;
  setContentVisible: (visible: boolean) => void;
  setPendingIndex: (index: number) => void;
}

function useCarouselNavigation({
  totalSkins,
  currentIndex,
  isHorizontal,
  isSwitching,
  setContentVisible,
  setPendingIndex,
}: IUseCarouselNavigationParams) {
  const handleDirectionalInput = useCallback(
    ({ direction }: IDirectionalInputEvent) => {
      if (isSwitching || totalSkins === 0) {
        return;
      }

      const delta = getNavigationDelta(direction, isHorizontal);

      if (delta === 0) {
        return;
      }

      const nextIndex = resolveNextIndex(currentIndex, delta, totalSkins);

      if (nextIndex === currentIndex) {
        return;
      }

      setContentVisible(false);
      setPendingIndex(nextIndex);
    },
    [
      currentIndex,
      isHorizontal,
      isSwitching,
      setContentVisible,
      setPendingIndex,
      totalSkins,
    ]
  );

  return useDirectionalInput<HTMLDivElement>({
    onDirection: handleDirectionalInput,
    enabled: !isSwitching && totalSkins > 1,
  });
}

export default useCarouselNavigation;
