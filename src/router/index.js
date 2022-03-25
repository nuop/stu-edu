import store from '@/store'
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
    meta: {
      requiresAuth: true
    },
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
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu'),
        props: true
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/menuIndex')
      },
      {
        path: '/menu/menuCreate',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/menuCreate')
      },
      {
        path: '/menu/:id/menuEdit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/menuEdit')
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
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
      },
      {
        path: '/course/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit')
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section.vue'),
        props: true
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video.vue'),
        props: true
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
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 验证to路由记录是否需要进行身份认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证Vuex的store中的用户信息是否存储
    if (!store.state.user) {
      // 未登录，跳转到登录页面
      return next({
        name: 'login',
        query: {
          // 将本次路由的fullpath传递给login页面
          // path仅包含路径，fullpage为完整url
          redirect: to.fullPath
        }
      })
    }
    // 已登录，允许通过
    next()
  } else {
    // 无需登录，允许通过
    next()
  }
})
export default router
