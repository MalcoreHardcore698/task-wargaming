import { ensureAppVersion } from "@/shared/utils/app-version";

import type { IAppState, IBreakpointState, IViewportState } from "./types";

const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

function calculateBreakpoints(width: number): IBreakpointState {
  return {
    isMobile: width <= BREAKPOINTS.mobile,
    isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
    isLaptop: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.laptop,
    isDesktop: width > BREAKPOINTS.laptop,
  };
}

function getInitialViewport(): IViewportState {
  if (typeof window === "undefined") {
    return { width: BREAKPOINTS.laptop + 1, height: BREAKPOINTS.laptop + 1 };
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

function buildAppState(viewport: IViewportState): IAppState {
  return {
    viewport,
    breakpoints: calculateBreakpoints(viewport.width),
  };
}

ensureAppVersion();

class AppService {
  private state: IAppState;

  private listeners = new Set<() => void>();

  constructor() {
    const initialViewport = getInitialViewport();
    this.state = buildAppState(initialViewport);
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private setState(next: IAppState): void {
    const current = this.state;

    if (
      current.viewport.width === next.viewport.width &&
      current.viewport.height === next.viewport.height &&
      current.breakpoints.isMobile === next.breakpoints.isMobile &&
      current.breakpoints.isTablet === next.breakpoints.isTablet &&
      current.breakpoints.isLaptop === next.breakpoints.isLaptop &&
      current.breakpoints.isDesktop === next.breakpoints.isDesktop
    ) {
      return;
    }

    this.state = next;
    this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot = (): IAppState => this.state;

  getState(): IAppState {
    return this.state;
  }

  updateViewport(width: number, height: number): void {
    const nextViewport: IViewportState = { width, height };
    const nextState = buildAppState(nextViewport);
    this.setState(nextState);
  }
}

const appService = new AppService();

export { calculateBreakpoints, buildAppState };
export default appService;
