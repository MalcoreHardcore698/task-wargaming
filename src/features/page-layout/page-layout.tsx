import cn from "classnames";
import { type ReactNode } from "react";

import { useAuth } from "@/services/auth";
import { Loader, Placeholder } from "@/shared/ui";
import styles from "./styles.module.scss";

export interface IPageLayoutProps {
  className?: string;
  children: ReactNode;
}

function PageLayout({ className, children }: IPageLayoutProps) {
  const { user, isLoading } = useAuth();

  const rootClassName = cn(styles.root, className);

  if (isLoading) {
    return <Loader.FullScreen />;
  }

  if (!user) {
    return (
      <div className={rootClassName}>
        <div className={styles.page}>
          <Placeholder
            variant="error"
            title="User not found"
            description="Please try to log in again"
          />
        </div>
      </div>
    );
  }

  return <div className={rootClassName}>{children}</div>;
}

export default PageLayout;
