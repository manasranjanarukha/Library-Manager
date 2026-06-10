// React
import { StrictMode } from "react";

// React DOM
import { createRoot } from "react-dom/client";

// Router
import { BrowserRouter } from "react-router-dom";

// Styles
import "./index.css";

// App
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
