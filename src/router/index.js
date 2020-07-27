import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Layout from '@/views/Layout'

export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: 'console'
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          keepAlive: true,
          name: "首页"
        },
        component: resolve=>(require(["@/views/Console/index.vue"],resolve))
      }
    ]
  },
  {
    path: "/page404",
    meta: {
      name: "404",
      icon: '404'
    },
    hidden: true,
    component: Layout,
    children: [
      {
        path: "/404",
        meta: {
          name: "404"
        },
        component: () => import("../views/404.vue")
      }
    ]
  }
]

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: defaultRouterMap
});

export const asnycRouterMap = [
  {
    path: "/info",
    name: "Info",
    meta: {
      role: ['sale', 'manager'],
      system: 'infoSystem',
      name: "信息管理",
      icon: 'menu'
    },
    component: Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          keepAlive: true,
          role: ['sale', 'manager'],
          name: "信息列表"
        },
        component: () => import("../views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息分类"
        },
        component: () => import("../views/Info/category.vue")
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息详情"
        },
        component: () => import("../views/Info/detailed.vue")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    meta: {
      role: ['sale'],
      system: 'userSystem',
      name: "用户管理",
      icon: 'user'
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "用户列表"
        },
        component: () => import("../views/User/index.vue")
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
]