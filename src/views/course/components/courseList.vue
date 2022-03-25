<template>
  <div class="course-list">
    <el-card>
      <div slot="header">
        <span>数据筛选</span>
      </div>
      <el-form
        :inline="true"
        ref="form"
        label-position="left"
        :model="filterParams"
      >
        <el-form-item label="课程名称：" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            :disabled="isLoading"
            @click="handleFilter"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">
        <span>查询结果：</span>
        <el-button
          style="float: right; margin-top: -10px"
          type="primary"
          @click="$router.push({ name: 'course-create' })"
        >添加课程</el-button>
      </div>
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center"
        >
          <template v-slot="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button @click="$router.push({
              name: 'course-section',
              params: {
                courseId: scope.row.id
              }
            })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'
export default {
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      courses: [],
      totalCount: 0,
      isLoading: true
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        // 给媒体数据设置属性，标识状态是否处于切换中，默认 false（本小节添加的功能）
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    // 上下架按钮操作
    async onStateChange (course) {
      // 请求发送前，更改课程操作状态
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
        course.isStatusLoading = false
      }
    },
    handleEdit (rowData) {
      console.log(rowData.id)
      this.$router.push({
        name: 'course-edit',
        params: {
          id: rowData.id
        }
      })
    }
  }
}
</script>
