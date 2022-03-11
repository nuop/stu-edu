<template>
  <div class="login">
    <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px"
    label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoginLoading">登录</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/services/user.js'

export default {
  name: 'loginIndex',
  data () {
    return {
      isLoginLoading: false,
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { requires: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '请输入6-18位密码，必须包含大小写和符号', trigger: 'blur' }
          // pattern:  /^.*(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?]).*$/,
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 表单验证
        await this.$refs.form.validate()
        console.log('通过验证')
        // 设置按钮不可用
        this.isLoginLoading = true
        // 发送请求
        const { data } = await login(this.form)
        // 恢复按钮
        this.isLoginLoading = false
        if (data.state === 1) {
          this.$message.success('登录成功')
          // 登录成功时 记录登录状态，存储到vuex中
          this.$store.commit('setUser', data.content)
          // 根据可能存在的redirect数据，进行跳转设置
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error(data.message)
        }
      } catch (err) {
        console.log('验证未通过')
      }
    }
  }
}

</script>
<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      background-color: #fff;
      padding: 20px;
      width: 300px;
      border-radius: 10px;
      .el-button {
        margin-top: 30px;
        width: 100%;
      }
    }
  }
</style>
