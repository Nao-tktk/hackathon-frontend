import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core"; // UIライブラリ
import { BrowserRouter } from "react-router-dom"; // ルーター
import App from "./App.tsx";

// Mantineのスタイルシート (必須)
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
