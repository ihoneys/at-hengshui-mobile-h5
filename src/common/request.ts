import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Toast, Dialog } from 'vant'
import { LocalStorage } from 'storage-manager-js'
import router from '../router'
import { debounce } from 'lodash'
import { nextTick } from 'vue'
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

const productionURL: string = 'https://jk-hs.com/yygh'
const getEnv = import.meta.env.MODE

let loadingInstance //loading 实例
let needLoadingRequestCount = 0 //当前正在请求的数量

const showLoading = () => {
  if (needLoadingRequestCount === 0 && !loadingInstance) {
    loadingInstance = Toast.loading({
      message: '加载中...',
      duration: 30000,
      forbidClick: true,
    })
  }
  needLoadingRequestCount++
}

const closeLoading = () => {
  nextTick(() => {
    needLoadingRequestCount--
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) //保证大于等于0
    if (needLoadingRequestCount === 0) {
      if (loadingInstance) {
        hideLoading()
      }
    }
  })
}

const hideLoading = debounce(() => {
  loadingInstance.clear()
  loadingInstance = null
}, 300)

const instance = axios.create({
  timeout: 30000,
  baseURL: productionURL,
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers['LQT-TOKEN'] = LocalStorage.get('token') || ''
    config.headers['Access-Control-Allow-Origin'] = `*`
    showLoading()
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
    closeLoading()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    closeLoading()
    const { code, message, success, infor } = response.data
    if (success !== undefined && !success && code !== 40101) {
      Dialog({
        title: '提示',
        message: message || infor,
      }).then(() => {
        // router.push({ name: 'home' })
      })
    }
    if (response.status === 200) {
      if (code === 40101 || message === '登陆超时，请从公众号进入登陆') {
        Dialog({
          title: '提示',
          message: '登录过期',
        }).then(() => {
          router.push({ path: '/login', replace: true })
        })
      }
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(message)
    }
  },
  (error) => {
    closeLoading()
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




export const post = (url: string, data: any = {}, config = {}) => {
  return _requestMethodWithData('post', url, data, config)
}

export const get = (url: string, params: any = {}, config = {}) => {
  return _requestMethodWithoutData('get', url, params, config)
}

export const postAndGet = (url: string, params: any, config = {}) => {
  return _requestMethodWithoutData('post', url, params, config)
}


function _requestMethodWithData(method: string, url: string, data: any, config: any) {
  return instance({
    method,
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

function _requestMethodWithoutData(method: string, url: string, params: any, config: any) {
  return instance({
    method,
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