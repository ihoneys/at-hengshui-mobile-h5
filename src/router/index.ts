import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home/Index.vue'
const routerHistory = createWebHistory()
const title = {
  user: '个人中心',
  home: '首页',
  login: '登录',
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { isTabBar: true },
  },
  {
    path: '/user',
    name: 'user',
    component: () =>
      import(
        /* webpackChunkName: "userCenter" */ '@/views/UserCenter/Index.vue'
      ),
    meta: { requiredLogin: true, title: title.user, isTabBar: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Index.vue'),
    meta: { title: title.login },
  },
]

const router = createRouter({
  history: routerHistory,
  routes,
})
router.beforeEach((to, from, next) => {
  // if(to === )
  console.log(to)
  const { requiredLogin } = to.meta
  if (requiredLogin) {
    next('login')
  }
  next()
})
export default router
