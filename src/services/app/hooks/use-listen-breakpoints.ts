import { useEffect } from "react";

import appService from "../service";

function useListenBreakpoints(): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      appService.updateViewport(window.innerWidth, window.innerHeight);
    };

    const scheduleUpdate = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, []);
}

export default useListenBreakpoints;
