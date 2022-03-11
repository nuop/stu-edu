import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import QueryString from 'qs'
const request = axios.create({

})

// 封装URL基地址检测函数
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 封装跳转登录页面函数
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // router.currentRoute 用于获取当前路由对应的路由信息对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 设置请求拦截器

request.interceptors.request.use(function (config) {
  // 判断config.url的前缀
  config.baseURL = getBaseURL(config.url)
  // 统一的token信息设置
  // 为了严谨，可以读取store中的user后进行Token检测
  const { user } = store.state
  if (user && user.access_token) {
    // 设置token
    config.headers.Authorization = user.access_token
  }
  return config
})

// 响应拦截器
// 是否正在更新Token
let isRefreshing = false
// 存储因为Token刷新而挂起的请求
let requests = []
request.interceptors.response.use(function (response) {
  console.log('请求响应成功了:', response)
  return response
}, function (error) {
  if (error.response) {
    console.log(store.state.user)

    // 请求发送成功，响应接收完毕，但是状态码为失败的情况
    // 1.判断失败的状态码情况（主要处理401的情况）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // errorMessage = 'Token无效'
      // 2.Token无效（过期）处理
      // 第一，无token信息
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 检测是否已经存在了正在刷新token的请求
      if (isRefreshing) {
        // 将当前失败的请求存起来，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 第二，Token无效（错误Token，过期Token）
      // 发送请求，获取新的access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: QueryString.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // -刷新token失败
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // 存储新的token
        store.commit('setUser', res.data.content)
        // 重新发送失败的请求
        // 根据requests发送多次失败的请求
        requests.forEach(callback => callback())
        // 发送完毕清除requests内容
        requests = []
        // 将本次请求发送
        return request(error.config)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务器错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，未收到响应
    Message.error('请求超时请重试')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default request
