<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
  }
</script>

<style scoped lang="less">
  @import 'assets/css/base.css';
  @import 'assets/fonts/iconfont.css';
  #app {
    height: 100%;
  }
</style>
