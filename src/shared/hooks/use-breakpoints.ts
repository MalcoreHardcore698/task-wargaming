import { useApp } from "@/services/app";

function useBreakpoints() {
  const { breakpoints } = useApp();
  return breakpoints;
}

export default useBreakpoints;
