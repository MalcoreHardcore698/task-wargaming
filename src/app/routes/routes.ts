import { lazy } from "react";

import { ERoutePath } from "./types";
import type { IRoute } from "./types";

const AuthPage = lazy(() => import("@/pages/auth"));
const WelcomePage = lazy(() => import("@/pages/welcome"));
const SkinSelectionPage = lazy(() => import("@/pages/skin-selection"));
const ShopPage = lazy(() => import("@/pages/shop"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const routes: IRoute[] = [
  {
    path: ERoutePath.ROOT,
    component: WelcomePage,
  },
  {
    path: ERoutePath.AUTH,
    component: AuthPage,
    guested: true,
  },
  {
    path: ERoutePath.WELCOME,
    component: WelcomePage,
    secured: true,
  },
  {
    path: ERoutePath.SKIN_SELECTION,
    component: SkinSelectionPage,
    secured: true,
  },
  {
    path: ERoutePath.SHOP,
    component: ShopPage,
    secured: true,
  },
  {
    path: ERoutePath.NOT_FOUND,
    component: NotFoundPage,
  },
];

export default routes;
