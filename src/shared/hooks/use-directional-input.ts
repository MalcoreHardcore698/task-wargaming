import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TNavigationDirection = "up" | "down" | "left" | "right";

export type TDirectionalInputSource = "keyboard" | "gamepad";

export interface IDirectionalInputEvent {
  direction: TNavigationDirection;
  source: TDirectionalInputSource;
}

export interface IDirectionalInputOptions<TElement extends HTMLElement = HTMLElement> {
  /** Обработчик направления, вызывается для клавиатуры и геймпада */
  onDirection: (event: IDirectionalInputEvent) => void;
  /** Флаг активности хука */
  enabled?: boolean;
  /** Порог для аналоговых осей геймпада */
  axisThreshold?: number;
  /** Минимальный интервал между повторными событиями (мс) */
  repeatInterval?: number;
}

const DEFAULT_AXIS_THRESHOLD = 0.6;
const DEFAULT_REPEAT_INTERVAL = 200;

const KEY_DIRECTION_MAP: Record<string, TNavigationDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const GAMEPAD_BUTTON_DIRECTION_MAP: Partial<Record<number, TNavigationDirection>> = {
  12: "up",
  13: "down",
  14: "left",
  15: "right",
};

const DIRECTIONS: TNavigationDirection[] = ["up", "down", "left", "right"];

function useLatestRef<TValue>(value: TValue) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

function now(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
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

export default function useDirectionalInput<TElement extends HTMLElement = HTMLElement>({
  onDirection,
  enabled = true,
  axisThreshold = DEFAULT_AXIS_THRESHOLD,
  repeatInterval = DEFAULT_REPEAT_INTERVAL,
}: IDirectionalInputOptions<TElement>): (element: TElement | null) => void {
  /** Храним текущий DOM-элемент для подписки */
  const [element, setElement] = useState<TElement | null>(null);
  /** Актуальный обработчик направления */
  const handlerRef = useLatestRef(onDirection);
  /** Последние моменты времени для направлений */
  const lastTriggerRef = useRef<Record<TNavigationDirection, number>>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });
  /** Флаги зажатых направлений геймпада */
  const gamepadPressedRef = useRef<Record<TNavigationDirection, boolean>>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const attachRef = useCallback((node: TElement | null) => {
    setElement(node);
  }, []);

  const repeatIntervalMs = useMemo(() => Math.max(0, repeatInterval), [repeatInterval]);
  const axisThresholdValue = useMemo(() => Math.max(0, Math.min(axisThreshold, 1)), [axisThreshold]);

  const triggerDirection = useCallback(
    (direction: TNavigationDirection, source: TDirectionalInputSource) => {
      const handler = handlerRef.current;
      if (!handler) return;
      handler({ direction, source });
    },
    [handlerRef]
  );

  const resetGamepadStates = useCallback(() => {
    DIRECTIONS.forEach((direction) => {
      gamepadPressedRef.current[direction] = false;
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      resetGamepadStates();
    }
  }, [enabled, resetGamepadStates]);

  useEffect(() => {
    if (!enabled || !element) return;
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
      triggerDirection(direction, "keyboard");
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [element, enabled, repeatIntervalMs, triggerDirection]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    let animationFrameId: number | null = null;

    const pollGamepads = () => {
      if (!enabled) return;
      if (!isElementActive(element)) {
        resetGamepadStates();
        return;
      }

      const gamepads = typeof navigator.getGamepads === "function" ? navigator.getGamepads() : [];
      if (!gamepads) return;

      const aggregated: Record<TNavigationDirection, boolean> = {
        up: false,
        down: false,
        left: false,
        right: false,
      };

      for (const gamepad of gamepads) {
        if (!gamepad) continue;

        const [axisHorizontal = 0, axisVertical = 0] = gamepad.axes ?? [];

        if (axisHorizontal <= -axisThresholdValue) {
          aggregated.left = true;
        } else if (axisHorizontal >= axisThresholdValue) {
          aggregated.right = true;
        }

        if (axisVertical <= -axisThresholdValue) {
          aggregated.up = true;
        } else if (axisVertical >= axisThresholdValue) {
          aggregated.down = true;
        }

        (gamepad.buttons ?? []).forEach((button, index) => {
          if (!button?.pressed) return;
          const mappedDirection = GAMEPAD_BUTTON_DIRECTION_MAP[index];
          if (!mappedDirection) return;
          aggregated[mappedDirection] = true;
        });
      }

      DIRECTIONS.forEach((direction) => {
        const isPressed = aggregated[direction];
        const wasPressed = gamepadPressedRef.current[direction];
        const timestamp = now();
        const lastTimestamp = lastTriggerRef.current[direction];

        if (isPressed) {
          if (!wasPressed || timestamp - lastTimestamp >= repeatIntervalMs) {
            gamepadPressedRef.current[direction] = true;
            lastTriggerRef.current[direction] = timestamp;
            triggerDirection(direction, "gamepad");
          }
        } else if (wasPressed) {
          gamepadPressedRef.current[direction] = false;
        }
      });
    };

    const loop = () => {
      pollGamepads();
      animationFrameId = window.requestAnimationFrame(loop);
    };

    loop();

    const handleGamepadDisconnected = () => {
      if (!navigator.getGamepads || Array.from(navigator.getGamepads()).every((pad) => !pad)) {
        resetGamepadStates();
      }
    };

    window.addEventListener("gamepadconnected", resetGamepadStates);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    return () => {
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("gamepadconnected", resetGamepadStates);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      resetGamepadStates();
    };
  }, [axisThresholdValue, element, enabled, repeatIntervalMs, resetGamepadStates, triggerDirection]);

  return attachRef;
}

