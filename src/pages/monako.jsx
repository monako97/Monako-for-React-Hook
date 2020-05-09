import React from "react";
import ReactDom from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "../style/common.scss";
import "../style/iconfont";
import "../unit/dateFormat";
import App from "../pages/App";
const render = module.hot ? ReactDom.render : ReactDom.hydrate;
render(<BrowserRouter basename="/">
    <App />
</BrowserRouter>, document.getElementById("monako"));
