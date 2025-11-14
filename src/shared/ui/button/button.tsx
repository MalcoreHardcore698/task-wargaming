import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";
export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
}

function Button({
  ref,
  type = "button",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: IButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const isDisabled = disabled || loading;

  const rootClassName = cn(
    styles.root,
    {
      [styles.state__loading]: loading,
      [styles.state__disabled]: isDisabled,
    },
    className
  );

  return (
    <button
      ref={ref}
      type={type}
      className={rootClassName}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
