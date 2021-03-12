import { Dialog } from 'vant'
import { sm4Config } from '../config/index'
import crypt from 'gm-crypt'
import moment from 'moment'
const SM4 = crypt.sm4
const createSm4 = new SM4(sm4Config)

export function createMessage(
  message: string,
  title: string = '提示',
  callBack: () => void = () => {}
): void {
  Dialog.alert({
    title,
    message,
  }).then(() => {
    callBack()
  })
}
export function isObjEmpty(obj: any): boolean {
  return (
    obj === undefined ||
    obj === 'undefined' ||
    obj == null ||
    obj === '' ||
    obj.length === 0 ||
    (typeof obj === 'object' && Object.keys(obj).length === 0)
  )
}

export function encrypt(val: string): string {
  return createSm4.encrypt(val)
}

export function sm4Decrypt(val: string): string {
  return createSm4.decrypt(val)
}
export function idEncrypt(value: string): string {
  if (!value) return value
  const call = '' + value
  return call.substr(0, 4) + '**********' + call.substr(14)
}

// 电话号码+****
export function telEncrypt(value: string): string {
  if (!value) return value
  let call = '' + value
  call = call.substr(0, 3) + '****' + call.substr(7)
  return call
}

export function computedAge(birthDay: string): number {
  return new Date().getFullYear() - new Date(birthDay).getFullYear()
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

// 获取医生排班的日期
export function getCustomDate(n: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + n)
  return moment(date).format('YYYY-MM-DD')
}

export const parsingSchedulingData = function (arr) {
  if (typeof arr === 'string') {
    arr = JSON.parse(arr)
  }
  let objDate = {} //医生排班日期的数组对象
  for (let v in arr) {
    let objTimeType = {} //医生某一天的排班
    let d = arr[v] //获取对象的值
    let date = d.toDate // 获取日期
    let timetype = d.timeType // 获取时间段类型(上午、下午、晚上)
    objTimeType[timetype] = d
    if (objDate[date] == null) {
      objDate[date] = objTimeType
    } else {
      objDate[date][timetype] = d
    }
  }
  return objDate
}

export function isWeixinBrower(): boolean {
  var ua: any = navigator.userAgent.toLowerCase() //获取判断用的对象
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //在微信中打开
    return true
  } else {
    return false
  }
}

export function formateDate(datetime: string, isComplete = true): string {
  function addDateZero(num) {
    return num < 10 ? '0' + num : num
  }
  let d = new Date(datetime)
  let yearsMonthDay =
    d.getFullYear() +
    '-' +
    addDateZero(d.getMonth() + 1) +
    '-' +
    addDateZero(d.getDate())
  if (isComplete) {
    yearsMonthDay +
      ' ' +
      addDateZero(d.getHours()) +
      ':' +
      addDateZero(d.getMinutes())
  }
  return yearsMonthDay
}
