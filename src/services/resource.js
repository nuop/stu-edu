import request from '@/utils/request'

export const getResourcePages = data => {
  return request({
    method: 'Post',
    url: '/boss/resource/getResourcePages',
    data
  })
}
