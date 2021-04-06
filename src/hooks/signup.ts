import { ref } from 'vue'
import { Toast } from 'vant'
import { getPhoneCode } from '../common/api'
import { encrypt, redirectLoginUrl, isWeixinBrower } from '../common/function'
import { sendToAppMessage } from '../common/uniPostMessage'
import { SessionStorage, LocalStorage } from 'storage-manager-js'
const isGetCode = ref(false),
  codeText = ref('获取验证码'),
  countDown = ref(59),
  phone = ref('')

export function getVerificationCode() {
  const countTime = () => {
    isGetCode.value = true
    let timer = setInterval(
      (function setIntervalFunc() {
        if (countDown.value !== 0) {
          codeText.value = `重新发送${countDown.value--}`
        } else {
          isGetCode.value = false
          codeText.value = '获取验证码'
          countDown.value = 59
          clearInterval(timer)
        }
        return setIntervalFunc
      })(),
      1000
    )
  }

  const onGetCode = async () => {
    const { success, infor } = await getPhoneCode(encrypt(phone.value))
    if (success) {
      countTime()
      Toast.success(infor)
    }
  }
  return {
    onGetCode,
    isGetCode,
    codeText,
    countDown,
    phone,
  }
}

export function loginSuccess() {
  const prevRoute = SessionStorage.get('preRoute')
  const { userId, data } = LocalStorage.get('userInfo') || ''
  const isWechat = isWeixinBrower()
  // 登录成功跳转逻辑
  const toPreviousRoute = (
    router,
    isNeedSlientLogin = false,
    tokenKey = data
  ) => {
    if (isNeedSlientLogin && isWechat) {
      //是否在微信中需要静默登录
      redirectLoginUrl(userId, prevRoute, tokenKey)
    } else {
      if (prevRoute === '/MyCenter' || prevRoute === '/home') {
        router.push(prevRoute)
      } else {
        router.push(prevRoute)
      }
    }
  }
  // 登录成功存token
  const storeLoginInfomation = (userInfo) => {
    LocalStorage.deleteAll()
    LocalStorage.set('userInfo', userInfo)
    LocalStorage.set('token', userInfo.token)
    if (SessionStorage.get('isApp')) {
      sendToAppMessage(userInfo.data, userInfo.token)
    }
  }
  return {
    toPreviousRoute,
    storeLoginInfomation,
  }
}
