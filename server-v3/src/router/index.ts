import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { ROUTES } from '@/constants'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: () => import('@/layout/main/Main.vue'),
      redirect() {
        return {
          name: ROUTES.BROWSER_LIST
        }
      },
      children: [
        {
          path: 'browser-list',
          name: ROUTES.BROWSER_LIST,
          component: () => import('@/views/browser/Lists.vue'),
          meta: {
            title: '环境管理'
          }
        },
        {
          path: 'group-list',
          name: ROUTES.GROUP_LIST,
          component: () => import('@/views/group/Lists.vue'),
          meta: {
            title: '分组管理'
          }
        },
        {
          path: 'browser-config',
          name: ROUTES.BROWSER_CONFIG,
          component: () => import('@/views/browser/Config.vue'),
          meta: {
            title: '新建环境',
            back: true
          }
        },
        {
          path: 'browser-edit/:id',
          name: ROUTES.BROWSER_EDIT,
          component: () => import('@/views/browser/Config.vue'),
          meta: {
            title: '编辑环境',
            back: true
          }
        }
      ]
    }
  ]
})

export default router
