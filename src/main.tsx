import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/globals.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./i18n/index.ts";
import { Provider } from "./provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Provider>
          <main className="dark">
            <App />
          </main>
        </Provider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
