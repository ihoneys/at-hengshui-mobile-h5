import { createRouter, createWebHashHistory } from 'vue-router'
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import { getUrlParams, isWeixinBrower } from '../common/function'
import { loginSuccess } from '../hooks/signup'
import { getToken } from '../common/api'
import routes from './path'
const routerHash = createWebHashHistory()
const router = createRouter({
  history: routerHash,
  routes,
})
router.beforeEach(({ meta, fullPath }, form, next) => {
  console.log(fullPath, 'route')
  console.log(form)
  const { requiredLogin } = meta
  const urlParams = getUrlParams()
  const { tokenKey, from } = urlParams
  const hasUserInfo = LocalStorage.get('userInfo')
  let routePath = fullPath
  let isLogin = false
  let loginPath =
    fullPath !== '/login' &&
    fullPath !== '/register/registered' &&
    fullPath !== '/register/changePassword'
  if (loginPath) { // 不保存登录注册路由
    if (Object.values(urlParams).length) { //截取路由
      const splitPath = fullPath.split('?')[0]
      if (urlParams.doctorId) {// app 直接进入医生主页保存 doctorId
        routePath = `${splitPath}?doctorId=${urlParams.doctorId}`
      } else {
        routePath = splitPath // 否则正常保存路由
      }
      console.log(splitPath)
    }
    if (routePath === '/accountInfo' && isWeixinBrower()) { // 从账户信息退出
      routePath = ''
    }
    SessionStorage.set('preRoute', routePath)
  }
  console.log(routePath, 'routePath')
  if (LocalStorage.has('userInfo')) {
    isLogin = hasUserInfo
  }
  const outsideCenterPath = {
    // 配置app入口的h5链接
    '/MyCenter': '/MyCenter',
    '/home': '/home',
    '/reportAndOutpatient/report': '/reportAndOutpatient/report',
    '/reportAndOutpatient/outpatient': '/reportAndOutpatient/outpatient',
  }
  const isApp = from || tokenKey // 从app进入
  const centerPath = outsideCenterPath[routePath] || '' // app入口登录处理
  if (isApp && loginPath) {
    console.log(fullPath, 8888)
    //处理从app进入
    const { storeLoginInfomation } = loginSuccess()
    const postData = { tokenKey }
    console.log(tokenKey, 'tokenKey')
    const getAuthortionLogin = async () => {
      const { success, data: userInfo } = await getToken(postData)
      if (success && userInfo) {
        userInfo.data = tokenKey
        storeLoginInfomation(userInfo) // 储存用户登录信息
        next()
      } else {
        next({
          path: '/login',
          replace: true,
        })
      }
    }
    getAuthortionLogin()
  } else {
    // h5
    if (requiredLogin && !isLogin && !tokenKey) {
      next({
        path: '/login',
        replace: true,
      })
    } else {
      next()
    }
  }
})
export default router
