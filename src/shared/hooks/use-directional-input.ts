import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TNavigationDirection = "up" | "down" | "left" | "right";

export type TDirectionalInputSource = "keyboard";

export interface IDirectionalInputEvent {
  direction: TNavigationDirection;
  source: TDirectionalInputSource;
}

export interface IDirectionalInputOptions {
  onDirection: (event: IDirectionalInputEvent) => void;
  enabled?: boolean;
  repeatInterval?: number;
}

const DEFAULT_REPEAT_INTERVAL = 200;

const KEY_DIRECTION_MAP: Record<string, TNavigationDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

function useLatestRef<TValue>(value: TValue) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

function now(): number {
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    return performance.now();
  }
  return Date.now();
}

function isElementActive(target: HTMLElement | null): boolean {
  if (!target) return true;
  if (typeof document === "undefined") return false;
  const active = document.activeElement as HTMLElement | null;
  if (!active) return false;
  return active === target || target.contains(active);
}

export default function useDirectionalInput<
  TElement extends HTMLElement = HTMLElement
>({
  onDirection,
  enabled = true,
  repeatInterval = DEFAULT_REPEAT_INTERVAL,
}: IDirectionalInputOptions): (element: TElement | null) => void {
  const [element, setElement] = useState<TElement | null>(null);
  const handlerRef = useLatestRef(onDirection);
  const lastTriggerRef = useRef<Record<TNavigationDirection, number>>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });

  const attachRef = useCallback((node: TElement | null) => {
    setElement(node);
  }, []);

  const repeatIntervalMs = useMemo(
    () => Math.max(0, repeatInterval),
    [repeatInterval]
  );

  const triggerDirection = useCallback(
    (direction: TNavigationDirection) => {
      const handler = handlerRef.current;
      if (!handler) return;
      handler({ direction, source: "keyboard" });
    },
    [handlerRef]
  );

  useEffect(() => {
    if (!enabled || !element) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_DIRECTION_MAP[event.key];
      if (!direction) return;
      if (!isElementActive(element)) return;

      const timestamp = now();
      const lastTimestamp = lastTriggerRef.current[direction];
      if (event.repeat && timestamp - lastTimestamp < repeatIntervalMs) {
        return;
      }

      event.preventDefault();
      lastTriggerRef.current[direction] = timestamp;
      triggerDirection(direction);
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [element, enabled, repeatIntervalMs, triggerDirection]);

  return attachRef;
}
