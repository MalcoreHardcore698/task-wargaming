import { useNavigate } from "react-router-dom";

import { ERoutePath } from "@/app/routes/types";
import type { TPlayerResource } from "@/services/player";

import styles from "./styles.module.scss";

export interface IPlayerResourcesProps {
  resources?: TPlayerResource[];
}

function PlayerResources({ resources = [] }: IPlayerResourcesProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ERoutePath.SHOP);
  };

  return (
    <div className={styles.root}>
      {resources.map((resource: TPlayerResource) => (
        <div
          key={resource.id}
          className={styles.item}
          title={resource.label}
          onClick={handleClick}
        >
          <span style={{ color: resource.color }} className={styles.amount}>
            {resource.amount}
          </span>
          <img
            src={resource.icon}
            alt={resource.label}
            className={styles.icon}
          />
          {resource.hasNew && (
            <div className={styles.hasNewTag}>
              <div className={styles.hasNewContainer}>
                <span className={styles.hasNew}>New</span>

                <svg
                  width="46"
                  height="20"
                  viewBox="0 0 46 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 0H46L41 20H0L5 0Z" fill="#B03634" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PlayerResources;
