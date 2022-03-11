<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create'})">添加菜单</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        <el-table
          :data="menus"
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称">
          </el-table-column>
          <el-table-column
            prop="level"
            label="菜单级数">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="前端图标">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template v-slot="scope">
              <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllmenu, deleteMenu } from '@/services/menu'
export default {
  name: 'MenuIndex',
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllmenu()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (rowData) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    },
    handleDelete (rowData) {
      this.$confirm('确认删除吗？', '删除提示').then(async () => {
        const { data } = await deleteMenu(rowData.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadAllMenus()
        }
      })
    }
  }
}
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
