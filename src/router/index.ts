import { createRouter, createWebHashHistory } from 'vue-router'
import index from '@/views/index.vue'
import home from '@/views/home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      component: index,
      meta: { title: '', index: 1, keepAlive: true },
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: { title: '', index: 2, keepAlive: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/components/VNotFound'),
      meta: { index: 404, keepAlive: true },
    },
  ],
})

router.beforeEach(async (to, from) => { })

// router.afterEach((to, from) => {})

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    keepAlive?: boolean

    index?: number
    transitionName?: string

    [x: string]: string | number | boolean | undefined
  }
}

export default router
