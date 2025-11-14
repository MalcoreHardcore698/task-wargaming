import { useSyncExternalStore } from "react";

import playerService from "../service";

function usePlayer() {
  const state = useSyncExternalStore(
    playerService.subscribe.bind(playerService),
    playerService.getSnapshot,
    playerService.getSnapshot
  );

  return {
    ...state,
    setSelectedSkin: playerService.setSelectedSkin.bind(playerService),
    setResources: playerService.setResources.bind(playerService),
    updateResource: playerService.updateResource.bind(playerService),
    adjustResource: playerService.adjustResource.bind(playerService),
    purchaseSkin: playerService.purchaseSkin.bind(playerService),
    getSkinGuise: playerService.getSkinGuise.bind(playerService),
    setSkinGuise: playerService.setSkinGuise.bind(playerService),
  };
}

export default usePlayer;
