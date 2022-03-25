<template>
  <div class="course">
    <course-list></course-list>
  </div>
</template>

<script>
import CourseList from './components/courseList'

export default {
  name: 'CourseIndex',
  components: {
    CourseList
  }
}
</script>
