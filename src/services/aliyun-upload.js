import request from '@/utils/request'

// 获取阿里云图片上传凭证
export const aliyunImagUploadAddressAndAuth = () => {
  return request({
    methos: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

// 获取阿里云视频上传凭证（有两个请求参数）
export const aliyunVideoUploadAddressAndAuth = params => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params
  })
}

// 阿里云转码请求
export const aliyunVideoTrancode = data => {
  return request({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

// 阿里云转码进度
export const getAliyunTranscodePercent = lessonId => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId
    }
  })
}
