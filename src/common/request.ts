import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { config } from 'process'
import { Toast, Dialog } from 'vant'
import { LocalStorage } from 'storage-manager-js'
import { error } from 'console'
let httpCode = {
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时',
}
const baseURL: string = 'http://jk-hs.com/yygh'

const getEnv = () => process.env.NODE_ENV === 'production'

const instance = axios.create({
  timeout: 10000,
  baseURL,
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers['LQT-TOKEN'] = LocalStorage.get('token') || ''
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        // t: new Date().getTime(),
      }
    }
    // 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    //   if (config.url.includes('pur/contract/export')) {
    //     config.headers['responseType'] = 'blob'
    //   }
    // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    //   if (config.url.includes('pur/contract/upload')) {
    //     config.headers['Content-Type'] = 'multipart/form-data'
    //   }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    Toast.clear()
    if (response.data.status === 200) {
      return Promise.resolve(response.data)
    } else {
      Dialog({
        title: '提示',
        message: response.data.message,
      })
      return Promise.reject(response.data.message)
    }
  },
  (error) => {
    Toast.clear()
    if (error.response) {
      let tips =
        error.response.status in httpCode
          ? httpCode[error.response.status]
          : error.response.data.message

      Dialog({
        title: '提示',
        message: tips,
      })
      return Promise.reject(error)
    } else {
      Dialog({
        title: '提示',
        message: '请求超时，请刷新重试',
      })
      return Promise.reject(new Error('请求超时，请刷新重试'))
    }
  }
)
export const post = (url: string, data: Object, config = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    ...config,
  })
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

export const get = (url: string, params: Object, config = {}) => {
  return instance({
    method: 'get',
    url,
    params,
    ...config,
  })
    .then((response) => {
      return Promise.resolve(response)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}
