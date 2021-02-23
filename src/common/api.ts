import { get, post } from './request'

const provider = 'lqt-yygh-provider'
const auth = 'lqt-yygh-auth'
const API = {
  URL_HOSLIST: provider + '/yygh-pub/pub/hospital/hdbs/unit/findPage',
}
export const getHospitalList = (params: Object) => get(API.URL_HOSLIST, params)
