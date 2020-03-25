import lazyImport from "../unit/lazyImport";
const routes = [
    {
        title: "首页",
        path: "/home",
        exact: true,
        component: require("../pages/home/Home").default
        // component: lazyImport("home/Home")
    },
    {
        title: "详情",
        path: "/detail/:id",
        exact: true,
        // component: MarkdownView
        // component: require("../pages/detail/MarkdownView").default
        component: lazyImport("detail/MarkdownView")
    },
    {
        title: "时间轴",
        path: "/timeline",
        exact: true,
        // component: TimeLine
        // component: require("../pages/timeLine/TimeLine").default
        component: lazyImport("timeLine/TimeLine")
    },
    {
        title: "分类",
        path: "/class",
        exact: true,
        // component: Class
        component: lazyImport("class/Class")
    }
];
export default routes;
