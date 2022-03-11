import request from '@/utils/request'

export const getResourceCategory = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}
