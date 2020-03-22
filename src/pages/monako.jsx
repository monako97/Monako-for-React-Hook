import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "../style/common";
import "../style/iconfont";
import App from "../pages/App";

const render = module.hot ? ReactDom.render : ReactDom.hydrate;
render(<BrowserRouter basename="/">
    <App />
</BrowserRouter>, document.getElementById("monako"));
