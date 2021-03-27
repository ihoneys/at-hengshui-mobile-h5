import { RouteRecordRaw } from 'vue-router'
import Home from '@/page/home/home.vue'
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
  record: '我的记录',
  recordData: '指标采集',
  accountInfo: '账户信息',
  addMember: '添加成员',
  userNotice: '隐私政策',
  reviews: '就诊点评',
  report: '门诊缴费',
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { isTabBar: true },
  },
  {
    path: '/MyCenter',
    name: 'MyCenter',
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
    path: '/DepartmentDoctor',
    name: 'DepartmentDoctor',
    component: () => import('@/page/departmentDoctor/departmentDoctor.vue'),
    meta: { title: title.departmentDoctor },
  },
  {
    path: '/DoctorPage',
    name: 'DoctorPage',
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
  {
    path: '/addMember/:id',
    name: 'addMember',
    component: () => import('@/page/addMember/addMember.vue'),
    meta: { title: title.addMember },
  },
  {
    path: '/userNotice/:id',
    name: 'userNotice',
    component: () => import('@/page/userNotice/userNotice.vue'),
    meta: { title: title.userNotice },
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('@/page/reviews/reviews.vue'),
    meta: { title: title.reviews },
  },
  {
    path: '/reportAndOutpatient/:type',
    name: 'reportAndOutpatient',
    component: () =>
      import('@/page/reportAndOutpatient/reportAndOutpatient.vue'),
    meta: { title: title.report, requiredLogin: true },
  },
  {
    path: '/depIntroduce',
    name: 'depIntroduce',
    component: () => import('@/page/departmentDoctor/introduce.vue'),
    meta: { title: title.report, requiredLogin: true },
  },
]
export default routes
