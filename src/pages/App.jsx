import React, { useReducer, Suspense } from "react";
import { Route, Redirect } from "react-router-dom";
import HeaderBar from "./header-bar";
import DaiLog from "./DaiLog";
import Live2D from "../modules/Live2D/Live2D";
import AnimatedSwitch from "./AnimatedSwitch";
import routes from "../router/Routes";
import reducer from "../store/reducer";
import Context from "../store/Context";
import store from "../store/store";
export default () => {
    const [state, dispatch] = useReducer(reducer, store);
    return (
        <Context.Provider value={{state, dispatch}}>
            <HeaderBar />
            <DaiLog />
            <Live2D model='../static/live2d/Pio/index.json' width="280" height="250"/>
            <Suspense fallback={null}>
                <AnimatedSwitch>
                    {
                        routes.map((e, i) => {
                            return <Route path={e.path} strict
                                          exact={e.exact}
                                          component={e.component}
                                          location={location}
                                          key={i}/>
                            })
                    }
                    <Redirect from="/" to={"/home"} />
                </AnimatedSwitch>
            </Suspense>
            <footer>
                <p>MONAKO</p>
                <article>MONAKO</article>
            </footer>
        </Context.Provider>
    );
}
