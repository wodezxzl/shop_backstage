<template>
  <div id="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      // 1.退出登入
      logout() {
        // 清除token
        window.sessionStorage.clear()
        // 重定向到登入页
        this.$router.replace('/login')
      },
    },
  }
</script>

<style scoped lang="less"></style>
