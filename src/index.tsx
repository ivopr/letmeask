import "./services/firebase";
import "./styles/global.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
