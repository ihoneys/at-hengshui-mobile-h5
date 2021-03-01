import { get, post, postAndGet } from './request'

const provider = 'lqt-yygh-provider'
const auth = 'lqt-yygh-auth'
const API = {
  URL_HOSLIST: `${provider}/yygh-pub/pub/hospital/hdbs/unit/findPage`,
  URL_PHONE_CODE: `${auth}/jwt/loginBySms`,
  URL_LOGIN: `${auth}/jwt/registerByPhoneAndOpenId`,
  URL_GETUSERINFO: `${auth}/jwt/loginByTokenKey`,
  URL_PASSWORD_LOGIN: `${auth}/jwt/loginByPwd`,
  URL_DEPARTMENT: `${provider}/yygh-pub/pub/dep/hdbs/depDoc/findList`,
}
/**
 *
 * @param params 获取列表数量参数
 */
export function getHospitalList(params: any) {
  return get(API.URL_HOSLIST, params)
}

/**
 * 获取验证码
 * @param phone 手机号
 */
export function getPhoneCode(phone: number | string) {
  const params = {
    phone,
  }
  return postAndGet(API.URL_PHONE_CODE, params)
}

export function getLogin(data) {
  return post(API.URL_LOGIN, data)
}

export function getToken(params) {
  return get(API.URL_GETUSERINFO, params)
}

export function loginByPwd(params) {
  return get(API.URL_PASSWORD_LOGIN, params)
}

// 获取当前选中医院的数据
export const getDepartmentList = (data) => {
  return post(API.URL_DEPARTMENT, data)
}
