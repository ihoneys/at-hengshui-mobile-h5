import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { LocalStorage } from 'storage-manager-js'
import Home from '@/page/home/home.vue'
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
        /* webpackChunkName: "userCenter" */ '@/page/userCenter/userCenter.vue'
      ),
    meta: { requiredLogin: true, title: title.user, isTabBar: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/login/login.vue'),
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
    // const token = LocalStorage.get('')
      // if(!)
      next('login')
  }
  next()
})
export default router
