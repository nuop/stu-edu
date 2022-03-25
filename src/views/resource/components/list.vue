<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="resource" style="width: 100%" v-loading="isLoading">
          <el-table-column type="index" label="编号" width="100"></el-table-column>
          <el-table-column prop="name" label="资源名称"></el-table-column>
          <el-table-column prop="url" label="资源路径"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column  label="添加时间">
            <template v-slot="scope">
              <span>{{scope.row.createdTime | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加时间">
            <template v-slot="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :page-size="form.size"
        :page-sizes="[10, 15, 20]"
        layout="prev, total, sizes, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages } from '@/services/resource.js'
import { getResourceCategory } from '@/services/resource-category.js'
import dateFormat from '@/utils/dateFormat'

export default {
  name: 'ResourceList',
  data () {
    return {
      resource: [],
      totalCount: 0,
      resourceCategories: [],
      isLoading: false,
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      }
    }
  },
  created () {
    this.loadResources()
    this.loadResourcesCategory()
  },
  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resource = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    // 获取分类
    async loadResourcesCategory () {
      const { data } = await getResourceCategory()
      console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    handleEdit (val) {
      console.log(`每页 ${val} 条`)
    },
    handleDelete (val) {
      console.log(`当前页: ${val}`)
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    }
  },
  filters: {
    dateFormat
  }
}

</script>
