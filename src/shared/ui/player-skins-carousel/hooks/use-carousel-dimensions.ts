import { useLayoutEffect, useRef, useState } from "react";

const DEFAULT_STRIDE = 120;
const DEFAULT_ITEM_EXTENT = 114;
const ITEM_SELECTOR = "[data-portrait-item]";

interface IUseCarouselDimensionsParams {
  isHorizontal: boolean;
  itemsCount: number;
}

function useCarouselDimensions({
  isHorizontal,
  itemsCount,
}: IUseCarouselDimensionsParams) {
  const listRef = useRef<HTMLDivElement>(null);
  const [stride, setStride] = useState(DEFAULT_STRIDE);
  const [itemExtent, setItemExtent] = useState(DEFAULT_ITEM_EXTENT);

  useLayoutEffect(() => {
    const listElement = listRef.current;

    if (!listElement) {
      return;
    }

    const items = listElement.querySelectorAll<HTMLElement>(ITEM_SELECTOR);
    const firstItem = items[0];

    if (!firstItem) {
      return;
    }

    const style = window.getComputedStyle(listElement);

    if (isHorizontal) {
      const gap =
        parseFloat(style.columnGap || style.gap || style.rowGap || "0") || 0;
      const width = firstItem.offsetWidth;

      setItemExtent(width);
      setStride(width + gap);
      return;
    }

    const gap = parseFloat(style.rowGap || style.gap || "0") || 0;
    const height = firstItem.offsetHeight;

    setItemExtent(height);
    setStride(height + gap);
  }, [itemsCount, isHorizontal]);

  return {
    listRef,
    stride,
    itemExtent,
  };
}

export default useCarouselDimensions;
