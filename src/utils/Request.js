import axios from 'axios'

import { ElLoading } from 'element-plus'
import router from '@/router'

import Message from '../utils/Message'

// const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
// const contentTypeJson = 'application/json'
// //arraybuffer	ArrayBuffer对象
// //blob	Blob对象
// const responseTypeJson = 'json'

let loading = null
const instance = axios.create({
  baseURL: '/admin',
  timeout: 30 * 1000
})
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    return config
  },
  (error) => {
    if (config.showLoading && loading) {
      loading.close()
    }
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.data.code === 1) {
      return res
    }
    Message.error(res.data.msg || '服务请求失败')
    // throw new Error(res.data.msg || '服务请求失败')
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response?.status == 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
export default instance
// let loading = null
// const instance = axios.create({
//   baseURL: '/admin',
//   timeout: 30 * 1000
// })
// //请求前拦截器
// instance.interceptors.request.use(
//   (config) => {
//     if (config.showLoading) {
//       loading = ElLoading.service({
//         lock: true,
//         text: '加载中......',
//         background: 'rgba(0, 0, 0, 0.7)'
//       })
//     }
//     return config
//   },
//   (error) => {
//     if (config.showLoading && loading) {
//       loading.close()
//     }
//     Message.error('请求发送失败')
//     return Promise.reject('请求发送失败')
//   }
// )
// //请求后拦截器
// instance.interceptors.response.use(
//   (response) => {
//     const {
//       showLoading,
//       errorCallback,
//       showError = true,
//       responseType
//     } = response.config
//     if (showLoading && loading) {
//       loading.close()
//     }
//     const responseData = response.data
//     if (responseType == 'arraybuffer' || responseType == 'blob') {
//       return responseData
//     }
//     //正常请求
//     if (responseData.code == 200) {
//       return responseData
//     } else if (responseData.code == 901) {
//       //登录超时
//       router.push(
//         '/login?redirectUrl=' + encodeURI(router.currentRoute.value.path)
//       )
//       return Promise.reject({ showError: false, msg: '登录超时' })
//     } else {
//       //其他错误
//       if (errorCallback) {
//         errorCallback(responseData.info)
//       }
//       return Promise.reject({ showError: showError, msg: responseData.info })
//     }
//   },
//   (error) => {
//     if (error.config.showLoading && loading) {
//       loading.close()
//     }
//     return Promise.reject({ showError: true, msg: '网络异常' })
//   }
// )

// const request = (config) => {
//   const {
//     url,
//     params,
//     dataType,
//     showLoading = true,
//     responseType = responseTypeJson
//   } = config
//   let contentType = contentTypeForm
//   let formData = new FormData() // 创建form对象
//   for (let key in params) {
//     formData.append(key, params[key] == undefined ? '' : params[key])
//   }
//   if (dataType != null && dataType == 'json') {
//     contentType = contentTypeJson
//   }
//   let headers = {
//     'Content-Type': contentType,
//     'X-Requested-With': 'XMLHttpRequest'
//   }

//   return instance
//     .post(url, formData, {
//       onUploadProgress: (event) => {
//         if (config.uploadProgressCallback) {
//           config.uploadProgressCallback(event)
//         }
//       },
//       responseType: responseType,
//       headers: headers,
//       showLoading: showLoading,
//       errorCallback: config.errorCallback,
//       showError: config.showError
//     })
//     .catch((error) => {
//       console.log(error)
//       if (error.showError) {
//         Message.error(error.msg)
//       }
//       return null
//     })
// }

// export default request
