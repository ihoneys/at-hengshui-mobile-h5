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
  URL_GETDEP_DOCTOR: `${provider}/yygh-pub/pub/hdbs/schedule/findScheduleGroupByDate`,
  URL_DICTORY_DATA: `${provider}/dict/dictory/hdbs/dictory/findList`,
  URL_SCHEDULING_DATA: `${provider}/yygh-pub/pub/hdbs/schedule/findByUnitAndDeptAndDoctorAndDate`,
  URL_SOURCE_NUMBER: `${provider}/yygh-pub/pub/numSchedulenum/resource/sch_batchQuerySrcForSch`,
  URL_MEMBER_LIST: `${provider}/pt-platform/pub/userMember/list`,
  URL_SUBMIT_ORDER: `${provider}/pt-platform/order/add`,
  URL_ORDER_LIST: `${provider}/pt-platform/order/queryYuYue`,
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
export function getDepartmentList(data) {
  return post(API.URL_DEPARTMENT, data)
}

// 获取当前选中医院的 科室的所有医生排班数据 (医生排班列表)
export function getDepAllDoctor(data) {
  return post(API.URL_GETDEP_DOCTOR, data)
}

// 字典列表查询接口
export function dictionaryQuery(data = {}) {
  return post(API.URL_DICTORY_DATA, data)
}

// 获取医生的排班
export function getSchedulingData(data) {
  return post(API.URL_SCHEDULING_DATA, data)
}
export function getSelectSchedulingTime(data) {
  return post(API.URL_SOURCE_NUMBER, data)
}

// 获取患者列表
export function getUserMember(params) {
  return get(API.URL_MEMBER_LIST, params)
}

// /yygh-pub/pub/order/add // 预约挂号订单下单接口

export const createOrder = (data) => {
  return post(API.URL_SUBMIT_ORDER, data)
}
// 获取我的预约挂号订单
export const getOrderList = (data) => {
  return post(API.URL_ORDER_LIST, data)
}
