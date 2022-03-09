<!-- 容器布局组件 -->
<template>
  <el-container>
    <el-aside>
      <nav-aside></nav-aside>
    </el-aside>
    <el-container>
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavAside from '../../components/NavAside.vue'
import AppHeader from '../../components/AppHeader.vue'
export default {
  name: 'layoutIndex',
  components: {
    NavAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100vh;
    min-width: 980px;
  }
  .el-aside {
    width: 200px;
    background-color: #d3dce6;
  }
  .el-header {
    background-color: #fff;
  }
  .el-main {
    background-color: #e9eef3;
  }
</style>
