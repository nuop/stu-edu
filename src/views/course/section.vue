<template>
  <div class="course-section">
    <el-card>
      <div slot="heaser">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
        v-loading="isLoading">
        <span class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <!-- section结构 -->
          <span v-if="data.sectionName" class="actions">
            <el-button
              @click="() => append(data)">
              编辑
            </el-button>
            <el-button
            type="primary"
              @click="() => remove(node, data)">
              添加课时
            </el-button>
            <el-button>状态</el-button>
          </span>
          <!-- lesson结构 -->
          <span v-else class="actions">
            <el-button
              @click="() => append(data)">
              编辑
            </el-button>
            <el-button
            type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                }
              })">
              上传视频
            </el-button>
            <el-button>状态</el-button>
          </span>
        </span>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'
export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 1. 声明数据
      sections: [],
      // 4. 根据响应数据调整属性
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // draggingNode：正在拖拽的节点
    // dropNode：放置的目标节点
    // type：放置在目标节点的哪个位置
    // 这个type有三种情况：prev（同级前），inner（内部），next（同级后）
    // 1. 不能有放入内部的操作，但例如将章节1拖拽到章节2的课时1之前时，type 为 prev，需要进一步处理
    // 2. 所有课时都具有 sectionId，通过下面的条件，限制章节不能移动到课时前后，也不能将章节的课时移动到其他章节
    handleAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 设置节点拖动后的数据更新
    async handleNodeDrop (draggingNode, dropNode, tyoe, event) {
      this.isLoading = true
      // 1. 无论是章节还是课时, dropNode 都有parent(draggingNode.parent 总为 null), 内部有childNodes
      // - dropNode.parent.childNodes 可获取拖拽项所在列表的所有数据
      // - 遍历操作
      // 2. 由于是批量请求，可以使用 Promise.all() 便于进行统一操作
      // - 将 map 返回的，由 Axios 调用返回的 Promise 对象组成的数组，传入到 Promise.all() 中
      // - 设置 async await 并进行 try..catch 处理
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 对章节与课时进行分别处理
          // - 除了 draggingNode.data.sectionId 外，draggingNode.lessonDTOS 也可以判断
          if (draggingNode.data.sectionId) {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新时间')
      } catch (err) {
        this.$message.success('数据更新失败', err)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .inner {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep .el-tree-node__content {
    height: auto;
  }
</style>
