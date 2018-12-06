import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Local',
      component: () => import('@/components/local/Index')
    },
    {
      path: '/online',
      name: 'Online',
      component: () => import('@/components/online/Index')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
export default router
