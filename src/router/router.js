import lazyImport from "../unit/lazyImport";
const router = [
    {
        title: "首页",
        path: "/home",
        exact: true,
        component: lazyImport("home/Home")
    },
    {
        title: "详情",
        path: "/detail/:id",
        exact: true,
        component: lazyImport("MarkdownView")
    },
    {
        title: "时间轴",
        path: "/timeline",
        exact: true,
        component: lazyImport("TimeLine")
    },
    {
        title: "分类",
        path: "/class",
        exact: true,
        component: lazyImport("Class")
    }
];
export default router;
