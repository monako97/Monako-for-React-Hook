import React from "react";
import RegisterUI from "./RegisterUI";
import controller from "./controller";

export default ({InTransaction,OutTransaction}) => (<RegisterUI {...controller({InTransaction,OutTransaction})}/>);
