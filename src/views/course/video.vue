<template>
  <div class="course-video">
    <el-card>
      <div slot="header">课程相关信息</div>
      <el-form ref="form" :model="lesson">
        <el-form-item label="课时名称">
          <el-input v-model="lesson.theme"></el-input>
        </el-form-item>
      <el-form-item label="视频上传">
        <input ref="video-file" type="file">
      </el-form-item>
      <el-form-item label="封面上传">
        <input ref="image-file" type="file">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpload">开始上传</el-button>
        <el-button @click="$router.push({
          name: 'course-section',
          params: {
            courseId
          }
        })">返回</el-button>
      </el-form-item>
      <el-form-item>
        <p v-if="uploadPercent !== 0">视频上传中：{{ uploadPercent }}%</p>
        <p v-if="isUploadSuccess">视频转码中：{{ isTranscodeSuccess ? '完成' : '正在转吗，请稍等...' }}</p>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import { aliyunImagUploadAddressAndAuth, aliyunVideoUploadAddressAndAuth, aliyunVideoTrancode, getAliyunTranscodePercent } from '@/services/aliyun-upload'
import { getLessonById } from '@/services/course'
export default {
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false,
      lesson: {
        theme: ''
      }
    }
  },
  created () {
    this.initUploader()
    if (this.$route.query.lessonId) {
      this.loadLesson()
    }
  },
  methods: {
    async loadLesson () {
      const { data } = await getLessonById(this.$route.query.lessonId)
      this.lesson = data.data
    },
    handleUpload () {
      // 点击上传时重置状态信息
      this.isTranscodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercent = 0
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      uploader.startUpload()
    },
    // 初始化上传对象
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        userId: '1618139964448548',
        region: '',
        partSize: 1048576,
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          console.log(uploadInfo)
          // 声明变量存储得到上传凭证
          let uploadAddressAndAuth = null
          if (uploadInfo.isImage) {
            const { data } = await aliyunImagUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
            console.log(this.uploadPercent)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          const { data } = await aliyunVideoTrancode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: this.$refs['video-file'].files[0].name,
            fileId: this.videoId
          })
          console.log(data)
          if (data.code === '000000') {
            const timer = setInterval(async () => {
              const { data } = getAliyunTranscodePercent(this.$route.query.lessonId)
              if (data === 100) {
                this.isTranscodeSuccess = true
                clearInterval(timer)
                this.$message.success('转码成功')
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
