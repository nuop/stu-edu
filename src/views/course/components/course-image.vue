<template>
  <div>
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="percentage"
      :width="178"
      :status="percentage === 100 ? 'success' : undefined"
    ></el-progress>
    <el-upload
      v-else
      class="avatar-uploader"
      action="/api/boss/course/upload"
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeAvatarUpload">
      <img v-if="value" :src="value" alt="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  methods: {
    // 文件上传成功时的钩子 upload组件方法
    // handleAvatarSuccess (res, file) {
    //   console.log(res)
    //   this.$emit('input', res.data.name)
    // },
    // 上传文件之前的钩子：进行检测
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return isJPG && isLt2M
    },
    // 自定义文件上传操作
    async handleUpload (options) {
      this.isUploading = true
      // 创建 FormData 对象保存数据
      const fd = new FormData()
      // 添加数据的键要根据接口文档设置
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, (event) => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        this.$message.success('上传成功')
        this.isUploading = false
        this.precentage = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 深度作用选择器::v-deep
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width:178px;
  height: 178px;
  display: block;
}
</style>
