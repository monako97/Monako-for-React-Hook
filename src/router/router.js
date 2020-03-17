import lazyImport from "../unit/lazyImport";
const router = [
    {
        path: "/home",
        exact: true,
        component: lazyImport("home/Home")
    },
    {
        path: "/detail/:id",
        exact: true,
        component: lazyImport("MarkdownView")
    },
    {
        path: "/timeline",
        exact: true,
        component: lazyImport("TimeLine")
    },
    {
        path: "/class",
        exact: true,
        component: lazyImport("Class")
    }
];
export default router;
