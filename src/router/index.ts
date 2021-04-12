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
  const { requiredLogin = false } = meta
  const urlParams = getUrlParams()
  const { tokenKey, from, doctorId = '' } = urlParams
  const isApp = from || tokenKey /**从app进入 */
  let routePath = fullPath
  let isLogin = LocalStorage.has('userInfo')

  let noLoginPath =
    fullPath !== '/login' &&
    fullPath !== '/register/registered' &&
    fullPath !== '/register/changePassword' &&
    fullPath !== '/register/changePassword?isLogin=true';

  const getRouterPath = function (doctorId: string, splitPath: string): string {
    const doctorRouter = `${splitPath}?doctorId=${doctorId}`
    return doctorId ? doctorRouter : splitPath
  }

  const getAuthortionLogin = async () => {    /**处理从app进入,登录获取用户信息 */
    const postData = { tokenKey }
    const { storeLoginInfomation } = loginSuccess()
    const { success, data: userInfo } = await getToken(postData)
    if (success && userInfo) {
      userInfo.data = tokenKey
      storeLoginInfomation(userInfo) /**储存用户登录信息 */
      next()
    } else {
      next({
        path: '/login',
        replace: true,
      })
    }
  }

  /**不保存登录注册路由 */
  if (noLoginPath) {
    if (Object.values(urlParams).length) { /**处理app路由 */
      const splitPath = fullPath.split('?')[0]
      routePath = getRouterPath(doctorId, splitPath) /** app 是否直接进入医生主页保存 doctorId */
    }
    if (routePath === '/accountInfo' && isWeixinBrower()) { /**从账户信息退出回到登录页，登录成功返回首页 */
      routePath = '/'
    }
    SessionStorage.set('preRoute', routePath)
  }

  console.log(routePath, 'routePath')

  if (isApp && noLoginPath) { /** app进入 */
    getAuthortionLogin()
  } else if (requiredLogin && !isLogin && !tokenKey) { /** h5 */
    next({
      path: '/login',
      replace: true,
    })
  } else {
    next()
  }
})


export default router