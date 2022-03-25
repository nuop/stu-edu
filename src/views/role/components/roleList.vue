<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-loading="isLoading">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table :data="roles" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间">
          <template v-slot="scope">
            <span>{{scope.row.createdTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <div>
              <el-button
              type="text"
              @click="$router.push({name: 'alloc-menu', params: {roleId: scope.row.id}})"
              >分配菜单</el-button>
              <el-button
              type="text"
              >分配资源</el-button>
            </div>
            <div>
              <el-button
              type="text"
              @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
              type="text"
              @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%">
      <create-or-edit @success="onSuccess" @cancel="dialogVisible=false" :is-edit="isEdit" :role-id="roleId" v-if="dialogVisible"></create-or-edit>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, deleteRole } from '@/services/role'
import dateFormat from '@/utils/dateFormat'
import CreateOrEdit from './create-or-edit'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      isLoading: false,
      roles: [],
      dialogVisible: false,
      isEdit: false,
      roleId: null
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    onSubmit () {},
    onReset () {},
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    async handleDelete (role) {
      this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.isLoading = false
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    }
  },
  filters: {
    dateFormat
  }
}
</script>

<style lang="scss" scoped>

</style>
