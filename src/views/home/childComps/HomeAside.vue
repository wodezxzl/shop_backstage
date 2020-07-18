<template>
  <div class="home-aside" v-show="Object.keys(menuList).length !== 0">
    <!--折叠和显示菜单切换按钮-->
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!--菜单-->
    <el-menu
      background-color="#323744"
      text-color="#fff"
      active-text-color="#78b7fa"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
    >
      <!--一级菜单-->
      <el-submenu v-for="(item, index) in menuList" :key="item.authName" :index="index + ''">
        <!--一级菜单内容区-->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>

        <!--二级菜单-->
        <el-menu-item
          v-for="value in item.children"
          :key="value.authName"
          :index="value.path"
          @click="saveNavState(value.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ value.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'HomeAside',
    props: {
      menuList: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        // 一级菜单的icon
        iconObj: {
          125: 'iconfont icon-user',
          103: 'iconfont icon-tijikongjian',
          101: 'iconfont icon-shangpin',
          102: 'iconfont icon-danju',
          145: 'iconfont icon-baobiao',
        },
        // 是否折叠
        isCollapse: false,
        activePath: '',
      }
    },
    methods: {
      // 1.点击切换菜单栏是否折叠
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
        // 传递出点击事件动态改变aside宽度
        this.$emit('toggleCollapse', this.isCollapse)
      },
      // 2.点击对应子菜单时保存路径作为活跃路径,并立即将该路径对应的元素活跃
      saveNavState(path) {
        window.sessionStorage.setItem('activePath', path)
        this.activePath = path
      },
    },
    created() {
      this.activePath = window.sessionStorage.getItem('activePath')
    },
  }
</script>

<style scoped lang="less">
  .home-aside {
    .toggle-button {
      text-align: center;
      line-height: 24px;
      letter-spacing: 4px;
      font-size: 16px;
      color: #fff;
      background-color: #4a5064;
      cursor: pointer;
    }
    .el-menu {
      border: none;
      .iconfont {
        margin-right: 7px;
      }
    }
  }
</style>
