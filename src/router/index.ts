import { createRouter, createWebHashHistory } from 'vue-router'
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import { getUrlParams } from '../common/function'
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
  if (
    fullPath !== '/login' &&
    fullPath !== '/register/registered' &&
    fullPath !== '/register/changePassword'
  ) {
    if (Object.values(urlParams).length) {
      const splitPath = fullPath.split('?')[0]
      routePath = splitPath
      console.log(splitPath)
    }
    SessionStorage.set('preRoute', routePath)
  }

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
  const isApp = from && tokenKey && !LocalStorage.has('userInfo') // 从app进入
  const centerPath = outsideCenterPath[routePath] || '' // app入口登录处理
  if (isApp && centerPath) {
    //处理从app进入
    const { storeLoginInfomation } = loginSuccess()
    const postData = { tokenKey }
    const getAuthortionLogin = async () => {
      const { success, data: userInfo } = await getToken(postData)
      if (success && userInfo) {
        userInfo.data = tokenKey
        storeLoginInfomation(userInfo) // 储存用户登录信息
      }
      next()
    }
    getAuthortionLogin()
  } else {
    // h5
    if (requiredLogin && !isLogin && !tokenKey) {
      next({
        name: 'login',
        replace: true,
      })
    } else {
      next()
    }
  }
})
export default router
