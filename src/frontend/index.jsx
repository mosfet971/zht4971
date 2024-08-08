import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import App from "./components/specific/App.jsx";

ReactDOM.render(
  <App/>,
  document.getElementById("reactRoot")
);