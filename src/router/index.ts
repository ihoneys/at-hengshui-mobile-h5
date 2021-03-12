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
  docPage: '医生主页',
  order: '提交订单',
  orderList: '挂号列表',
  orderDetail: '订单详情',
  orderCancel: '订单取消',
  orderPay: '订单支付',
  record: '个人记录',
  recordData: '指标采集',
  accountInfo: '账户信息'
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
  {
    path: '/docPage',
    name: 'docPage',
    component: () => import('@/page/docPage/docPage.vue'),
    meta: { title: title.docPage, requiredLogin: true },
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/page/order/order.vue'),
    meta: { title: title.order },
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import('@/page/orderList/orderList.vue'),
    meta: { title: title.orderList },
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: () => import('@/page/orderDetail/orderDetail.vue'),
    meta: { title: title.orderDetail },
  },
  {
    path: '/orderCancel',
    name: 'orderCancel',
    component: () => import('@/page/orderCancel/orderCancel.vue'),
    meta: { title: title.orderCancel },
  },
  {
    path: '/orderPay',
    name: 'orderPay',
    component: () => import('@/page/orderPay/orderPay.vue'),
    meta: { title: title.orderPay },
  },
  {
    path: '/record',
    name: 'record',
    component: () => import('@/page/record/record.vue'),
    meta: { title: title.record },
  },
  {
    path: '/recordData',
    name: 'recordData',
    component: () => import('@/page/recordData/recordData.vue'),
    meta: { title: title.recordData },
  },
  {
    path: '/accountInfo',
    name: 'accountInfo',
    component: () => import('@/page/accountInfo/accountInfo.vue'),
    meta: { title: title.accountInfo },
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
