<template>
  <div id="home">
    <el-container class="container">
      <!--头部区域-->
      <el-header>
        <span>电商后台管理系统</span>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <!--页面主题区域-->
      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <home-aside :menuList="menuList" @toggleCollapse="toggleCollapse" />
        </el-aside>
        <!--右侧内容主体-->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  // 子组件
  import HomeAside from './childComps/HomeAside'

  // 网络请求
  import { getLeftMenu } from 'network/leftMenu'

  export default {
    name: 'Home',
    components: {
      HomeAside,
    },
    data() {
      return {
        menuList: [],
        isCollapse: false,
      }
    },
    methods: {
      /**
       * 事件处理
       */
      // 1.退出登入
      logout() {
        // 清除token
        window.sessionStorage.clear()
        // 重定向到登入页
        this.$router.replace('/login')
      },
      // 2.折叠切换时动态改变aside的宽度
      toggleCollapse(isCollapse) {
        this.isCollapse = isCollapse
      },

      /**
       * 网络请求
       */
      // 1.请求左侧菜单栏数据
      getLeftMenu() {
        getLeftMenu().then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.menuList = res.data
        })
      },
    },
    created() {
      // 1.请求左侧菜单栏数据
      this.getLeftMenu()
    },
  }
</script>

<style scoped lang="less">
  #home {
    height: 100vh;
    .container {
      height: 100%;
      /*每一个标签名自动也是一个类名*/
      .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #373c41;
        span {
          font-size: 22px;
          letter-spacing: 4px;
          color: #fff;
        }
      }
      .el-aside {
        background-color: #323744;
      }
      .el-main {
        background-color: #eaedf2;
      }
    }
  }
</style>
