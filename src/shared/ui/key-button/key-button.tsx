import { useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "classnames";

import useBreakpoints from "@/shared/hooks/use-breakpoints";

import { useKeyboardActivation } from "./hooks";
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

  const { isMobile } = useBreakpoints();

  const rootClassName = cn(styles.root, className);

  const keyClassName = cn(styles.icon, styles[color]);

  useKeyboardActivation({
    buttonRef,
    keyboardKey,
    disabled,
    isMobile,
  });

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
