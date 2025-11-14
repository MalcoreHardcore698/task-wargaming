import { useMemo, useSyncExternalStore } from "react";

import playerSkinsService from "../service";

function usePlayerSkins() {
  const subscribe = (cb: () => void) => playerSkinsService.subscribe(cb);

  const getSnapshot = () => playerSkinsService.getAll();

  const skins = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const getById = useMemo(
    () => playerSkinsService.getById.bind(playerSkinsService),
    []
  );

  const getGuises = useMemo(
    () => playerSkinsService.getGuises.bind(playerSkinsService),
    []
  );

  return { skins, getById, getGuises };
}

export default usePlayerSkins;
