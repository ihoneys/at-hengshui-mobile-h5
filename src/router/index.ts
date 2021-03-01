import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { LocalStorage } from 'storage-manager-js'
import Home from '@/page/home/home.vue'
const routerHistory = createWebHistory()
const title = {
  user: '个人中心',
  home: '首页',
  login: '登录',
  register: '注册',
  department: '科室',
  departmentDoctor: '预约',
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
  {
    path: '/register/:id',
    name: 'register',
    component: () => import('@/page/register/register.vue'),
    meta: { title: title.register },
  },
  {
    path: '/department/:id',
    name: 'department',
    component: () => import('@/page/department/department.vue'),
    meta: { title: title.department },
  },
  {
    path: '/departmentDoctor/:depId/:unitId',
    name: 'departmentDoctor',
    component: () => import('@/page/departmentDoctor/departmentDoctor.vue'),
    meta: { title: title.departmentDoctor },
  },
]

const router = createRouter({
  history: routerHistory,
  routes,
})
router.beforeEach((to, from, next) => {
  const { requiredLogin } = to.meta
  let token
  if (LocalStorage.has('userInfo')) {
    token = LocalStorage.get('userInfo')
  }
  if (requiredLogin && !token) {
    console.log(token, 'token')
    next('/login')
  } else {
    next()
  }
})
export default router
