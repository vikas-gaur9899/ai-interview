import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App.jsx";

import "./styles/global.css";
import "./styles/admin.css";

/* ====================================================
   ROOT
==================================================== */

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <BrowserRouter>

    {/* ================= TOAST ================= */}

    <Toaster

      position="top-right"

      reverseOrder={false}

      toastOptions={{

        duration: 3000

      }}

    />

    {/* ================= APP ================= */}

    <App />

  </BrowserRouter>

);