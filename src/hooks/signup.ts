import { ref } from 'vue'
import { Toast } from 'vant'
import { getPhoneCode } from '../common/api'
import { encrypt, redirectLoginUrl, isWeixinBrower } from '../common/function'
import { SessionStorage, LocalStorage } from 'storage-manager-js'
const isGetCode = ref(false),
  codeText = ref('获取验证码'),
  countDown = ref(30),
  phone = ref('')

export function getVerificationCode() {
  const countTime = () => {
    isGetCode.value = true
    let timer = setInterval(() => {
      if (countDown.value !== 0) {
        codeText.value = `重新发送${countDown.value--}`
      } else {
        isGetCode.value = false
        codeText.value = '获取验证码'
        countDown.value = 29
        clearInterval(timer)
      }
    }, 1000)
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
  const toPreviousRoute = (router, isNeedSlientLogin = false) => {
    if (isNeedSlientLogin && isWechat) {
      //是否在微信中需要静默登录
      redirectLoginUrl(userId, prevRoute, data)
    } else {
      if (prevRoute === '/user') {
        router.push(prevRoute)
      } else {
        router.go(-1)
      }
    }
  }
  // 登录成功存token
  const storeLoginInfomation = (userInfo) => {
    LocalStorage.set('userInfo', userInfo)
    LocalStorage.set('token', userInfo.token)
  }
  return {
    toPreviousRoute,
    storeLoginInfomation,
  }
}
