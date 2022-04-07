import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

/* "proxy": "http://127.0.0.1:4000", */
