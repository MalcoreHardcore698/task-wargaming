export interface IBreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

export interface IViewportState {
  width: number;
  height: number;
}

export interface IAppState {
  viewport: IViewportState;
  breakpoints: IBreakpointState;
}
