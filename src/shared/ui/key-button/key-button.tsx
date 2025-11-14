import { useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

export type TKeyButtonColor = "red" | "green" | "yellow" | "blue" | "gray";

export interface IKeyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  keyLabel: string;
  label: ReactNode;
  color?: TKeyButtonColor;
  keyboardKey?: string | string[];
}

function KeyButton({
  type = "button",
  label,
  color = "gray",
  keyLabel,
  className,
  keyboardKey,
  disabled,
  ...rest
}: IKeyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const rootClassName = cn(styles.root, className);

  const keyClassName = cn(styles.icon, styles[color]);

  useEffect(() => {
    if (!keyboardKey || isMobile) {
      return;
    }

    const keys = Array.isArray(keyboardKey)
      ? keyboardKey.filter(Boolean)
      : [keyboardKey];

    if (keys.length === 0) {
      return;
    }

    const normalizedKeys = keys.map((key) => key.toLowerCase());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!buttonRef.current || disabled) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.getAttribute("role") === "textbox")
      ) {
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
  }, [keyboardKey, disabled, isMobile]);

  useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }

    const navigatorWithUAData = navigator as Navigator & {
      userAgentData?: {
        mobile?: boolean;
      };
    };

    const detectedMobile =
      navigatorWithUAData.userAgentData?.mobile ??
      /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/.test(
        navigatorWithUAData.userAgent.toLowerCase()
      );

    setIsMobile(Boolean(detectedMobile));
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      className={rootClassName}
      disabled={disabled}
      {...rest}
    >
      {!isMobile && <span className={keyClassName}>{keyLabel}</span>}
      <span className={styles.text}>{label}</span>
    </button>
  );
}

export default KeyButton;
