import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入对应组件需要的路由规则
// import Advert from '@/views/advert/advertIndex'
// import AdvertSpace from '@/views/advert-space/advertSpace'
// import Course from '@/views/course/courseIndex'
// import ErrorPage from '@/views/error-page/errorPage'
// import Home from '@/views/home/homeIndex'
// import Layout from '@/views/layout/layoutIndex'
// import Login from '@/views/login/loginIndex'
// import Menu from '@/views/menu/menuIndex'
// import Resource from '@/views/resource/resourceIndex'
// import Role from '@/views/role/roleIndex'
// import User from '@/views/user/userIndex'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/loginIndex') // 路由懒加载
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/layoutIndex'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/layout/layoutIndex')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/roleIndex')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/menuIndex')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/resourceIndex')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/courseIndex')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/userIndex')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/advertIndex')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/advertSpace')
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'errpr-page' */'@/views/error-page/errorPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
