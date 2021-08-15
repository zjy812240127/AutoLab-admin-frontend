import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/statistics/daily',
        component: Layout,
        redirect: '/statistics/daily/create',
        name: 'Statistics',
        meta: { title: '统计分析', icon: 'chart' },
        children: [{
                path: 'create',
                name: 'StatisticsDailyCreate',
                component: () =>
                    import ('@/views/statistics/daily/create'),
                meta: { title: '生成统计' }
            },
            {
                path: 'chart',
                name: 'StatisticsDayChart',
                component: () =>
                    import ('@/views/statistics/daily/chart'),
                meta: { title: '统计图表' }
            }
        ]
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index')
        }]
    },

    {
        path: '/teacher', // 路由父路径
        component: Layout, // 不变
        redirect: '/teacher/table', // 路由到的页面
        name: '讲师管理', // 随便写
        meta: { title: '讲师管理', icon: 'example' },
        children: [{
                path: 'table', // 子路径
                name: '讲师列表', // 随便写
                component: () =>
                    import ('@/views/edu/teacher/list'), // 跳转的页面可以省略尾缀
                meta: { title: '讲师列表', icon: 'table' } // 随便写
            },
            {
                path: 'add',
                name: '添加讲师',
                component: () =>
                    import ('@/views/edu/teacher/save'),
                meta: { title: '添加讲师', icon: 'tree' }
            },
            { // 隐藏路由，用于修改讲师时，点击按钮跳转到该页面
                path: 'edit/:id', // ：id相当于sql中的 where id =? ，id值通过url传递
                name: 'EduTeacherEdit',
                component: () =>
                    import ('@/views/edu/teacher/save'), // 跳转到和添加讲师的同一个页面
                meta: { title: '编辑讲师', noCache: true },
                hidden: true // 表示前端页面中不显示该组件
            }
        ]
    },

    {
        path: '/subject', // 路由父路径
        component: Layout, // 不变
        redirect: '/subject/list', // 路由到的页面
        name: '课程分类管理', // 随便写
        meta: { title: '课程分类管理', icon: 'example' },
        children: [{
                path: 'list', // 子路径
                name: '课程分类列表', // 随便写
                component: () =>
                    import ('@/views/edu/subject/list'), // 跳转的页面可以省略尾缀
                meta: { title: '课程分类列表', icon: 'table' } // 随便写
            },
            {
                path: 'save',
                name: '添加课程分类',
                component: () =>
                    import ('@/views/edu/subject/save'),
                meta: { title: '添加课程分类', icon: 'tree' }
            }
        ]
    },

    {
        path: '/course', // 路由父路径
        component: Layout, // 不变
        redirect: '/course/info', // 路由到的页面
        name: '课程管理', // 随便写
        meta: { title: '课程管理', icon: 'example' },
        children: [{
                path: 'list', // 子路径
                name: '课程列表', // 随便写
                component: () =>
                    import ('@/views/edu/course/list'), // 跳转的页面可以省略尾缀
                meta: { title: '课程列表', icon: 'table' } // 随便写
            },
            {
                path: 'info/:id',
                name: '添加课程',
                component: () =>
                    import ('@/views/edu/course/info'),
                meta: { title: '添加课程', icon: 'tree' }
            },
            {
                path: 'chapter/:id', // 注意这里跳转的路径
                name: 'EduCourseChapterEdit',
                component: () =>
                    import ('@/views/edu/course/chapter'),
                meta: { title: '编辑课程大纲', noCache: true },
                hidden: true
            },
            {
                path: 'publish/:id',
                name: 'EduCoursePublishEdit',
                component: () =>
                    import ('@/views/edu/course/publish'),
                meta: { title: '发布课程', noCache: true },
                hidden: true
            }
        ]
    },

    {
        path: '/file', // 路由父路径
        component: Layout, // 不变
        redirect: '/file/list', // 路由到的页面
        name: '文件管理', // 随便写
        meta: { title: '文件管理', icon: 'example' },
        children: [{
                path: 'list', // 子路径
                name: '文件管理', // 随便写
                component: () =>
                    import ('@/views/edu/file/list'), // 跳转的页面可以省略尾缀
                meta: { title: '文件列表', icon: 'table' } // 随便写
            },
            {
                path: 'info', // 注意这里跳转的路径
                name: '上传文件',
                component: () =>
                    import ('@/views/edu/file/info'),
                meta: { title: '上传文件', icon: 'tree' }
            }
            // {
            //     path: 'save',
            //     name: '文件管理',
            //     component: () =>
            //         import ('@/views/edu/course/info'),
            //     meta: { title: '上传文件', icon: 'tree' }
            // }
        ]
    },

    {
        path: '/banner', // 路由父路径
        component: Layout, // 不变
        redirect: '/banner/list', // 路由到的页面
        name: '轮播图管理', // 随便写
        meta: { title: '轮播图管理', icon: 'example' },
        children: [{
                path: 'list', // 子路径
                name: '轮播图管理', // 随便写
                component: () =>
                    import ('@/views/edu/banner/list'), // 跳转的页面可以省略尾缀
                meta: { title: '轮播图列表', icon: 'table' } // 随便写
            },
            {
                path: 'info', // 注意这里跳转的路径
                name: '上传轮播图',
                component: () =>
                    import ('@/views/edu/banner/info'),
                meta: { title: '上传轮播图', icon: 'tree' }
            }
            // {
            //     path: 'save',
            //     name: '文件管理',
            //     component: () =>
            //         import ('@/views/edu/course/info'),
            //     meta: { title: '上传文件', icon: 'tree' }
            // }
        ]
    },

    {
        path: '/activity', // 路由父路径
        component: Layout, // 不变
        redirect: '/activity/list', // 路由到的页面
        name: '活动管理', // 随便写
        meta: { title: '活动管理', icon: 'example' },
        children: [{
                path: 'list', // 子路径
                name: '活动管理', // 随便写
                component: () =>
                    import ('@/views/edu/activity/list'), // 跳转的页面可以省略尾缀
                meta: { title: '活动列表', icon: 'table' } // 随便写
            },
            {
                path: 'info', // 注意这里跳转的路径
                name: '上传活动',
                component: () =>
                    import ('@/views/edu/activity/info'),
                meta: { title: '上传活动', icon: 'tree' }
            }
            // {
            //     path: 'save',
            //     name: '文件管理',
            //     component: () =>
            //         import ('@/views/edu/course/info'),
            //     meta: { title: '上传文件', icon: 'tree' }
            // }
        ]
    },

    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: { title: 'Example', icon: 'example' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/table/index'),
                meta: { title: 'Table', icon: 'table' }
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () =>
                    import ('@/views/tree/index'),
                meta: { title: 'Tree', icon: 'tree' }
            }
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [{
            path: 'index',
            name: 'Form',
            component: () =>
                import ('@/views/form/index'),
            meta: { title: 'Form', icon: 'form' }
        }]
    },

    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: 'Nested',
            icon: 'nested'
        },
        children: [{
                path: 'menu1',
                component: () =>
                    import ('@/views/nested/menu1/index'), // Parent router-view
                name: 'Menu1',
                meta: { title: 'Menu1' },
                children: [{
                        path: 'menu1-1',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-1'),
                        name: 'Menu1-1',
                        meta: { title: 'Menu1-1' }
                    },
                    {
                        path: 'menu1-2',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-2'),
                        name: 'Menu1-2',
                        meta: { title: 'Menu1-2' },
                        children: [{
                                path: 'menu1-2-1',
                                component: () =>
                                    import ('@/views/nested/menu1/menu1-2/menu1-2-1'),
                                name: 'Menu1-2-1',
                                meta: { title: 'Menu1-2-1' }
                            },
                            {
                                path: 'menu1-2-2',
                                component: () =>
                                    import ('@/views/nested/menu1/menu1-2/menu1-2-2'),
                                name: 'Menu1-2-2',
                                meta: { title: 'Menu1-2-2' }
                            }
                        ]
                    },
                    {
                        path: 'menu1-3',
                        component: () =>
                            import ('@/views/nested/menu1/menu1-3'),
                        name: 'Menu1-3',
                        meta: { title: 'Menu1-3' }
                    }
                ]
            },
            {
                path: 'menu2',
                component: () =>
                    import ('@/views/nested/menu2/index'),
                meta: { title: 'menu2' }
            }
        ]
    },

    {
        path: 'external-link',
        component: Layout,
        children: [{
            path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
            meta: { title: 'External Link', icon: 'link' }
        }]
    },

    { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})