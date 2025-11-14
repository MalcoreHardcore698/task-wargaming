import cn from "classnames";

import { KeyButton, type IKeyButtonProps } from "@/shared/ui";

import styles from "./styles.module.scss";

export interface PageFooterProps {
  leading?: IKeyButtonProps[];
  trailing?: IKeyButtonProps[];
  className?: string;
}

function PageFooter({
  leading = [],
  trailing = [],
  className,
}: PageFooterProps) {
  const rootClassName = cn(styles.root, className);

  return (
    <div className={rootClassName}>
      <div className={styles.leading}>
        {leading.map((props, index) => (
          <KeyButton key={`${props.keyLabel}-${index}`} {...props} />
        ))}
      </div>

      <div className={styles.trailing}>
        {trailing.map((props, index) => (
          <KeyButton key={`${props.keyLabel}-${index}`} {...props} />
        ))}
      </div>
    </div>
  );
}

export default PageFooter;
