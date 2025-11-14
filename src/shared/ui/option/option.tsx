import cn from "classnames";

import styles from "./styles.module.scss";

export interface IOptionProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

function Option({
  icon,
  title,
  description,
  className,
  onClick,
}: IOptionProps) {
  const rootClassName = cn(
    styles.root,
    { [styles.clickable]: !!onClick },
    className
  );

  return (
    <div className={rootClassName} onClick={onClick}>
      <img src={icon} alt={title} className={styles.icon} />

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}

export default Option;
