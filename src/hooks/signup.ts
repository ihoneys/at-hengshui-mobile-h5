import { ref } from 'vue'
import { Toast } from 'vant'
import { getPhoneCode } from '../common/api'
import { encrypt } from '../common/function'

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
    } else {
      Toast.fail(infor)
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
