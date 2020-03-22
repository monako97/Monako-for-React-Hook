import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';
const AnimatedSwitch = props => {
    const { children } = props;
    return (<Route render={({ location }) => (
        <TransitionGroup component={null} appear={true}>
            <CSSTransition
                key={location.pathname}
                mountOnEnter
                //添加这个属性之后当组件消失时将移除组件的DOM
                unmountOnExit
                //添加这个属性使组件第一次出现的时候（即页面刚加载时）也使用动画，
                // 对应css中的route-appear和route-appear-active样式
                appear={true}
                classNames={props.type || 'route'}
                timeout={props.duration || 300}>
                <Switch location={location}>{children}</Switch>
            </CSSTransition>
        </TransitionGroup>
    )}/>);
};
export default AnimatedSwitch
