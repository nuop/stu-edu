<template>
  <div class="user">
    <user-list></user-list>
  </div>
</template>

<script>
import UserList from './components/userList'
export default {
  name: 'UserIndex',
  components: {
    UserList
  }
}
</script>
