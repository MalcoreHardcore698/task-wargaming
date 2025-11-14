import type { ComponentType } from "react";

export enum ERoutePath {
  ROOT = "/",
  AUTH = "/auth",
  WELCOME = "/welcome",
  SKIN_SELECTION = "/skin-selection",
  SHOP = "/shop",
  NOT_FOUND = "/*",
}

export interface IRoute {
  path: string;
  component: ComponentType;
  secured?: boolean;
  guested?: boolean;
}
