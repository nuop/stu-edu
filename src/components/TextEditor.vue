<template>
  <div ref="editor" class="text-editor">
  </div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      dedault: ''
    }
  },
  data () {
    return {
      editor: null,
      isLoaded: false
    }
  },
  mounted () {
    this.initEditor()
  },
  watch: {
    value () {
      if (!this.isLoaded) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      this.editor = editor
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
