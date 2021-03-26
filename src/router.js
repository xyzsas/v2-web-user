import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/password',
    component: () => import('./views/Password.vue')
  },
  {
    path: '/center',
    component: () => import('./views/Center.vue')
  },
  {
    path: '/photo',
    component: () => import('./views/Photo.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router
