import { type PropsWithChildren } from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

export interface ISectionProps {
  title?: string;
  description?: string;
  className?: string;
}

function Section({
  title,
  description,
  className,
  children,
}: PropsWithChildren<ISectionProps>) {
  const rootClassName = cn(styles.root, className);

  return (
    <div className={rootClassName}>
      {title && (
        <header className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </header>
      )}

      {description && <p className={styles.description}>{description}</p>}

      {children}
    </div>
  );
}

export default Section;
