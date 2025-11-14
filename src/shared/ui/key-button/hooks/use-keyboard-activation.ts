import { useEffect } from "react";
import type { MutableRefObject } from "react";

import { isEditableTarget, normalizeKeyboardKeys } from "../utils";

interface IUseKeyboardActivationParams {
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  keyboardKey?: string | string[];
  disabled?: boolean;
  isMobile: boolean;
}

function useKeyboardActivation({
  keyboardKey,
  disabled,
  isMobile,
  buttonRef,
}: IUseKeyboardActivationParams) {
  useEffect(() => {
    if (!keyboardKey || isMobile) {
      return;
    }

    const normalizedKeys = normalizeKeyboardKeys(keyboardKey);

    if (normalizedKeys.length === 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!buttonRef.current || disabled) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (isEditableTarget(target)) {
        return;
      }

      if (!normalizedKeys.includes(event.key.toLowerCase())) {
        return;
      }

      event.preventDefault();
      buttonRef.current.click();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboardKey, disabled, isMobile, buttonRef]);
}

export default useKeyboardActivation;
