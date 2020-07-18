<template>
  <div id="login">
    <!--背景-->
    <div class="bg">
      <div class="mask"></div>
    </div>
    <!--登入框-->
    <div class="login-box">
      <!--用户头像-->
      <div class="login-avatar">
        <img src="~assets/image/login/avatar.jpg" alt="" />
      </div>
      <!--登入表单区域-->
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login-form"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-lock_fill"
            show-password
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  // 网络请求
  import { getLoginVerify } from 'network/login'

  export default {
    name: 'Login',
    data() {
      return {
        // 登入表单的数据对象
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        // 表单验证规则
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' },
          ],
          // 验证密码是否合法
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      // 1.登入验证表单
      login() {
        this.$refs.formRef.validate(valid => {
          if (!valid) return
          // 登入请求验证
          getLoginVerify(this.loginForm).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('登入失败')
            } else {
              this.$message.success('登入成功')
              // 将token保存到客户端中的sessionStorage中
              window.sessionStorage.setItem('token', res.data.token)
              // 跳转路由进入首页
              this.$router.push('/home')
            }
          })
        })
      },
      // 2.重置表单
      resetLoginForm() {
        this.$refs.formRef.resetFields()
      },
    },
  }
</script>

<style scoped lang="less">
  #login {
    position: relative;
    height: 100%;
    background-color: #2b4b6b;
    /*背景*/
    .bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: url('~assets/image/login/user_img.jpg') no-repeat;
      background-size: cover;
      filter: blur(10px);
      .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    /*登入盒子*/
    .login-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 300px;
      background-color: #fff;
      border-radius: 8px;
      transition: 0.6s;
      &:hover {
        box-shadow: 4px 4px 32px rgba(0, 0, 0, 0.2), -4px 0 32px rgba(0, 0, 0, 0.2);
      }
      /*用户头像*/
      .login-avatar {
        position: absolute;
        top: -50%;
        left: 50%;
        transform: translate(-50%, 50%);
        width: 140px;
        height: 140px;
        overflow: hidden;
        border-radius: 50%;
        transition: 0.6s;
        &:hover {
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
        }
        img {
          width: 100%;
        }
      }
      /*登入表单区域*/
      .login-form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
      }
      /*按钮*/
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
