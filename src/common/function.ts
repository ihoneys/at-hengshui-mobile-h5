import { Dialog } from 'vant'
import { sm4Config } from '../config/index'
import { patternObj } from './regularData'
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
    allowHtml: true,
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
export function protectName(name: string): string {
  if (!name) return name
  let nameSplit = name.split('')
  nameSplit[1] = '*'
  name = nameSplit.join('')
  return name
}

// 电话号码+****
export function telEncrypt(value: string): string {
  if (!value) return value
  let call = '' + value
  call = call.substr(0, 3) + '****' + call.substr(7)
  return call
}

export function computedAge(birthDay: string): number {
  if (!birthDay) {
    return 0
  }
  return new Date().getFullYear() - new Date(birthDay).getFullYear()
}
// 截取code码
// 获取url中的参数--
export function getUrlParams(): any {
  var hre = window.location.href
  var query = hre.split('?')[1]
  let obj = {}
  if (query) {
    var queryParams = query.split('&')
    if (!queryParams) return false
    for (let i in queryParams) {
      var typeArr = queryParams[i].split('=')
      let key = typeArr[0]
      let value = typeArr[1]
      obj[key] = value
    }
  }
  return obj
}

export function redirectLoginUrl(
  userId: string,
  routerUrl: string,
  tokenKey: string
): void {
  const local =
    'http://www.jk-hs.com/yygh/lqt-yygh-provider/yygh-pub/pub/getHospitalOpenid' // 正式
  const APPID = 'wxe78b60aa91fcd552' // 正式
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURIComponent(
    local
  )}&response_type=code&scope=snsapi_base&state=${userId}_${routerUrl}_${tokenKey}#wechat_redirect`
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
  if (Array.isArray(arr) && !arr.length) {
    return { newData: [], isProcess: false }
  }
  const isNeedProessData = isProcessData(arr)
  let obj = {}
  let timeTypeObj = {}
  let list = []
  if (isNeedProessData) {
    arr.forEach((cur, index) => {
      list.push(cur)
      if (arr[index + 1] && cur.toDate === arr[index + 1].toDate) {
        // 如果日期前后相等
        timeTypeObj[cur.timeType] = {
          list,
        }
        obj[cur.toDate] = timeTypeObj
        if (cur.timeType !== arr[index + 1].timeType) {
          // 如果上午下午不相等
          list = []
        }
      } else {
        timeTypeObj[cur.timeType] = {
          list,
        }
        obj[cur.toDate] = timeTypeObj
        list = [] // 清空push ，下一个继续
        timeTypeObj = {} // 清空储存的
      }
    })

    for (const key in obj) {
      const cur = obj[key]

      if (!cur['am']) {
        cur['am'] = {}
      }
      if (!cur['pm']) {
        cur['pm'] = {}
      }
      const periodListAm = cur['am'].list
      const periodListPm = cur['pm'].list

      const filterAm =
        Array.isArray(periodListAm) && periodListAm.some((v) => v.isYuyue)
      const filterPm =
        Array.isArray(periodListPm) && periodListPm.some((v) => v.isYuyue)
      cur['am'].isYuyue = filterAm ? true : false
      cur['pm'].isYuyue = filterPm ? true : false
    }
    return {
      newData: obj,
      isProcess: true,
    }
  } else {
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
    return {
      newData: objDate,
      isProcess: false,
    }
  }

  function isProcessData(arr) {
    if (!arr) return false
    let result = false
    for (let i = 0, len = arr.length; i < len; i++) {
      let curDate = arr[i].toDate
      let curTimeType = arr[i].timeType
      for (let k = i + 1; k < len; k++) {
        let prevDate = arr[k].toDate
        let prevTimeType = arr[k].timeType
        if (curDate === prevDate && curTimeType === prevTimeType) {
          result = true
          break
        }
      }
    }
    return result
  }
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

export function tranformPickerType(typeList): any {
  typeList = JSON.parse(JSON.stringify(typeList).replace(/dictName/g, 'text'))
  typeList = JSON.parse(JSON.stringify(typeList).replace(/dictCode/g, 'value'))
  return (
    Array.isArray(typeList) &&
    typeList.map((item) => {
      return { value: item.value, text: item.text }
    })
  )
}

export function byPatientIdGetBrithdayAndSex(value) {
  const rexg = patternObj['01'].rules
  if (!rexg.test(value))
    return {
      birthDay: '',
      radio: '',
    }
  function substring(pre, next) {
    return value.substring(pre, next)
  }
  let radio = ''
  const birthDay = `${substring(6, 10)}-${substring(10, 12)}-${substring(
    12,
    14
  )}`
  if (parseInt(value.substr(16, 1)) % 2 == 1) {
    radio = '0'
  } else if (parseInt(value.substr(16, 1)) % 2 == 0) {
    radio = '1'
  } else {
    radio = '2'
  }
  return {
    birthDay,
    radio,
  }
}
