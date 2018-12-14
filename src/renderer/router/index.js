import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/local'
    },
    {
      path: '/local',
      name: 'Local',
      component: () => import('@/components/local/Index'),
      redirect: '/local/playlist',
      children: [
        {
          path: 'playlist',
          name: 'PlayList',
          component: () => import('@/components/local/PlayList')
        },
        {
          path: 'playlistdetail/:id',
          name: 'PlayListDetail',
          component: () => import('@/components/local/PlayListDetail')
        }
      ]
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
