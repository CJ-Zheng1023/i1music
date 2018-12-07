import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/local'
    },
    {
      path: '/local',
      name: 'Local',
      component: () => import('@/components/local/Index')
    },
    {
      path: '/online',
      name: 'Online',
      component: () => import('@/components/online/Index')
    },
    {
      path: '/setting',
      name: 'Setting',
      component: () => import('@/components/setting/Index')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
export default router
