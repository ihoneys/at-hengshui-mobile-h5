import { Dialog } from 'vant'
import { sm4Config } from '../config/index'
import crypt from 'gm-crypt'
const SM4 = crypt.sm4
const createSm4 = new SM4(sm4Config)

export function createMessage(message: string, title: string = '提示'): void {
  Dialog.alert({
    title,
    message,
  })
}

export function encrypt(val: string): string {
  return createSm4.encrypt(val)
}

export function sm4Decrypt(val: string): string {
  return createSm4.decrypt(val)
}

// 截取code码
export function getUrlParam(name: string) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function getCode(
  userId: string,
  router: string,
  tokenKey: string
): void {
  const code = getUrlParam('code')
  const local =
    'http://www.jk-hs.com/yygh/lqt-yygh-provider/yygh-pub/pub/getHospitalOpenid' // 正式
  const APPID = 'wxe78b60aa91fcd552' // 正式
  if (code == null || code === '') {
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURIComponent(
      local
    )}&response_type=code&scope=snsapi_base&state=${userId}_${router}_${tokenKey}#wechat_redirect`
  }
}

export function getEnv(): boolean {
  return process.env.NODE_ENV === 'production'
}
