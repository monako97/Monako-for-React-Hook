import React from "react";
export default pathName => {
    return React.lazy(() => import(/* webpackChunkName: "[request]" */ `../pages/${pathName}`));
}
