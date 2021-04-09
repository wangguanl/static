export default [
    {
        path: 'menu1',
        name: 'Menu1',
        meta: { title: '子路由1', icon: 'el-icon-s-check' },
        component: () => import(/* webpackChunkName: "Menu1" */ '@/views/Menu/Menu1'),
        children: []
    },
    {
        path: 'menu2',
        name: 'Menu2',
        meta: { title: '子路由2', icon: 'el-icon-s-check' },
        component: () => import(/* webpackChunkName: "Menu2" */ '@/views/Menu/Menu2'),
        children: [
            {
                path: 'menu21',
                name: 'Menu21',
                meta: { title: '子路由21', icon: 'el-icon-s-check' },
                component: () => import(/* webpackChunkName: "Menu21" */ '@/views/Menu/Menu2/Menu21'),
                children: []
            }, {

                path: 'menu22',
                name: 'Menu22',
                meta: { title: '子路由22', icon: 'el-icon-s-check' },
                component: () => import(/* webpackChunkName: "Menu22" */ '@/views/Menu/Menu2/Menu22'),
                children: []
            }
        ]
    },
]