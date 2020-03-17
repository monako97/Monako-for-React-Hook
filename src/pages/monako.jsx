import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "../style/common";
import "../style/iconfont";
import App from "../pages/App";
ReactDom.render(<BrowserRouter basename="/">
    <App />
</BrowserRouter>, document.getElementById("monako"));
