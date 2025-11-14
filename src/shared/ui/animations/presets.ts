import type { Transition } from "framer-motion";

export type TMotionPreset = {
  initial: any;
  animate: any;
  transition: Transition;
};

export const EASING = {
  standard: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const DURATION = {
  xs: 0.3,
  sm: 0.45,
  md: 0.7,
  lg: 0.8,
};

export function fadeIn(options?: {
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    duration = DURATION.md,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration, delay, ease },
  };
}

export function appearUp(options?: {
  distance?: number;
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    distance = 20,
    duration = DURATION.md,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease },
  };
}

export function appearDown(options?: {
  distance?: number;
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    distance = 20,
    duration = DURATION.md,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0, y: -distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease },
  };
}

export function appearLeft(options?: {
  distance?: number;
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    distance = 16,
    duration = DURATION.sm,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0, x: -distance },
    animate: { opacity: 1, x: 0 },
    transition: { duration, delay, ease },
  };
}

export function appearRight(options?: {
  distance?: number;
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    distance = 16,
    duration = DURATION.sm,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0, x: distance },
    animate: { opacity: 1, x: 0 },
    transition: { duration, delay, ease },
  };
}

export function appearScale(options?: {
  distance?: number;
  scaleFrom?: number;
  duration?: number;
  delay?: number;
  ease?: Transition["ease"];
}): TMotionPreset {
  const {
    distance = 24,
    scaleFrom = 0.98,
    duration = DURATION.lg,
    delay = 0,
    ease = EASING.standard,
  } = options ?? {};

  return {
    initial: { opacity: 0, y: distance, scale: scaleFrom },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration, delay, ease },
  };
}

export function createStagger(options?: {
  baseDelay?: number;
  step?: number;
  duration?: number;
  distance?: number;
  ease?: Transition["ease"];
}) {
  const {
    baseDelay = 0.08,
    step = 0.06,
    duration = 0.42,
    distance = 12,
    ease = EASING.standard,
  } = options ?? {};

  return (index: number): TMotionPreset =>
    appearUp({ distance, duration, delay: baseDelay + index * step, ease });
}
