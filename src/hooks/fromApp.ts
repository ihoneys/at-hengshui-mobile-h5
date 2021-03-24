import { getCurrentInstance, inject, ref } from 'vue'
import { getToken } from '../common/api'
import { getUrlParams } from '../common/function'
// import { LOCALSTORAGE_SYMBOL } from '../symbol/index'‘
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import { loginSuccess } from './signup'
export default () => {
  //   const { proxy }: any = getCurrentInstance()
  //   const {
  //     $LocalStorage,
  //   } = getCurrentInstance().appContext.config.globalProperties
  const isAppEnv = ref(false)
  const { from, tokenKey, cid } = getUrlParams() // 判断是否从app进入
  const { storeLoginInfomation } = loginSuccess()
  const getAuthortionLogin = async () => {
    const postData = {
      tokenKey,
    }
    const { success, data: userInfo } = await getToken(postData)
    if (success && userInfo) {
      userInfo.data = tokenKey
      storeLoginInfomation(userInfo)
    }
  }
  if (from && tokenKey) {
    isAppEnv.value = true
    SessionStorage.set('isApp', true)
  }
  console.log(from, 'from')
  console.log(tokenKey, 'tokenKey')
  console.log(cid, 'cid')
  return {
    isAppEnv,
    getAuthortionLogin
  }
}
