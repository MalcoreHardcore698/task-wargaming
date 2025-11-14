import { AuthProvider } from "@/services/auth";

import { Router } from "./routes";

import "@/shared/styles/global.scss";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
