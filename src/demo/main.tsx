import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AiKitProvider } from "../lib";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AiKitProvider>
      <App />
    </AiKitProvider>
  </StrictMode>,
);
