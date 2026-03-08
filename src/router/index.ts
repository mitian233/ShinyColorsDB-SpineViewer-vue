import { createRouter, createWebHistory } from 'vue-router'
import DesktopViewer from '../views/DesktopViewer.vue'
import MobileViewer from '../views/MobileViewer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: DesktopViewer,
    },
    {
      path: '/mobile',
      name: 'mobile',
      component: MobileViewer,
    },
  ],
})

export default router
