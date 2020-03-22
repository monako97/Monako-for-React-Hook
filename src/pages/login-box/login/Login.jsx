import React from "react";
import LoginUI from "./LoginUI";
import controller from "./controller";

export default ({ InTransaction, OutTransaction }) => (<LoginUI {...controller({InTransaction, OutTransaction})} />);
