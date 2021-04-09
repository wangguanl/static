const ModulesFiles = require.context('./modules', true, /\.js$/);
const { Menu } = ModulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = ModulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});

export const constantRouterMap = [{
    path: '/',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    meta: {
        icon: '',
        title: '后台管理系统'
    },
    redirect: { name: 'Home' },
    children: [
        {
            path: 'home',
            name: 'Home',
            meta: { title: '首页', icon: 'el-icon-s-check' },
            component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
            children: []
        },
        {
            path: 'menu',
            name: 'Menu',
            meta: { title: '嵌套路由', icon: 'el-icon-s-grid' },
            component: () => import(/* webpackChunkName: "Menu" */ '@/views/Menu'),
            children: Menu
        },
    ]
}, {
    path: '/Login',
    name: 'Login',
    props: true,
    meta: {
        icon: '',
        title: '后台管理系统-登录'
    },
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
}];