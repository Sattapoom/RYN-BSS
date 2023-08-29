/**
 * @license Mozilla Public License 2.0
 *
 * This project uses Mozilla Public License 2.0 (MPL 2.0).
 * You should read and accept the terms and conditions of MPL 2.0.
 *
 * โปรเจกต์นี้ใช้ Mozilla Public License 2.0 (MPL 2.0).
 * คุณควรอ่านและยอมรับข้อกำหนดและเงื่อนไขของ MPL 2.0
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="font-mono">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </div>
);
