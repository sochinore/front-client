import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/explorer'
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/explorer'
      },
      {
        path: 'explorer',
        component: () => import('@/views/Explorer.vue')
      },
      {
        path: 'market',
        component: () => import('@/views/Market.vue')
      },
      {
        path: 'token',
        component: () => import('@/views/Token.vue')
      },
      {
        path: 'wallet',
        component: () => import('@/views/Wallet.vue')
      },
      {
        path: 'document',
        component: () => import('@/views/Document.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
