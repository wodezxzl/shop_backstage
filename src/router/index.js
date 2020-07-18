import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const HomeWelcome = () => import('../views/home/childComps/HomeWelcome')
const UserList = () => import('../views/user/UserList')

const routes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: HomeWelcome,
      },
      {
        path: 'users',
        component: UserList,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// 挂载路由导航
router.beforeEach((to, from, next) => {
  // 1.如果访问的是登入页直接放行
  if (to.path === '/login') return next()
  // 2.如果访问的是其他页面,检查是否有token
  const token = window.sessionStorage.getItem('token')
  // 没有token强制跳转到登录页
  if (!token) return next('/login')
  // 否则正确跳转
  next()
})

export default router
