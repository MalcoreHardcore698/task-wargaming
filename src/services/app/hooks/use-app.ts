import { useSyncExternalStore } from "react";

import appService from "../service";
import type { IAppState } from "../types";

function useApp(): IAppState {
  return useSyncExternalStore(
    appService.subscribe.bind(appService),
    appService.getSnapshot,
    appService.getSnapshot
  );
}

export default useApp;
