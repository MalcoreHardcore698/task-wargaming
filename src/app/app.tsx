import { useListenBreakpoints } from "@/services/app";
import { AuthProvider } from "@/services/auth";

import { Router } from "./routes";

import "@/shared/styles/global.scss";

function App() {
  useListenBreakpoints();

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
