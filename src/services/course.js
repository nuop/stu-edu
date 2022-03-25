import request from '@/utils/request'

export const getQueryCourses = data => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

export const changeState = params => {
  return request({
    methos: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

export const getCourseById = courseId => {
  return request({
    mothod: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

export const uploadCourseImage = (data, onUploadProgress) => {
  // 接口要求的请求数据类型为：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}
