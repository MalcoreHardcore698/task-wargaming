import { useEffect, useState } from "react";

type TBreakpoint = "mobile" | "tablet" | "laptop" | "desktop";

interface IBreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

const BREAKPOINTS: Record<TBreakpoint, number> = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

function buildState(width: number): IBreakpointState {
  return {
    isMobile: width <= BREAKPOINTS.mobile,
    isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
    isLaptop: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.laptop,
    isDesktop: width > BREAKPOINTS.laptop,
  };
}

function useBreakpoints() {
  const [state, setState] = useState<IBreakpointState>(() =>
    buildState(window.innerWidth)
  );

  const handleResize = () => {
    setState(buildState(window.innerWidth));
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return state;
}

export default useBreakpoints;
