import React from "react";
import ForgetPasswordUI from "./ForgetPasswordUI";
import controller from "./controller";
export default ({InTransaction,OutTransaction}) => (<ForgetPasswordUI {...controller({InTransaction,OutTransaction})}/>);
