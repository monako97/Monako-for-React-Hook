import React from "react";
import LoginUI from "./LoginUI";
import controller from "./controller";

const Login = ({ InTransaction, OutTransaction }) => (<LoginUI {...controller({InTransaction, OutTransaction})} />);

export default Login;
