import request from '@/utils/request'
import qs from 'qs'
// import store from '@/store'

// 登录接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

// 用户信息基本接口

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

// 用户管理

export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户

export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: 'boss/user/forbidUser',
    params: {
      userId
    }
  })
}
