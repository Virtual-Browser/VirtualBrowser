import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import tableRouter from './modules/table'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: require('@/views/redirect/index').default
      }
    ]
  },
  {
    path: '/login',
    component: require('@/views/login/index').default,
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: require('@/views/login/auth-redirect').default,
    hidden: true
  },
  {
    path: '/404',
    component: require('@/views/error-page/404').default,
    hidden: true
  },
  {
    path: '/401',
    component: require('@/views/error-page/401').default,
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component:  import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', affix: true },
  //     },
  //   ],
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: 'browser', icon: 'globe-americas' },
    children: [
      {
        path: 'index',
        component: require('@/views/browser/index').default,
        name: 'Browser',
        meta: { title: 'browser_list', icon: 'list-ul', affix: true }
      },
      {
        path: 'group',
        component: require('@/views/browser/group').default,
        name: 'Group',
        meta: { title: 'group', icon: 'collection-fill', affix: true }
      }
    ]
  },
  {
    path: '/crx',
    component: Layout,
    redirect: '/crx/store',
    meta: { title: 'extensions', icon: 'component' },
    children: [
      {
        path: 'store',
        component: require('@/views/crx/store').default,
        meta: { title: 'crx_store', icon: 'shopping', affix: true }
      },
      {
        path: 'list',
        component: require('@/views/crx/list').default,
        meta: { title: 'crx_list', icon: 'component', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component:  import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true },
  //     },
  //   ],
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
