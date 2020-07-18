import axios from 'axios'

export function request(config) {
  // 1.创建axios实例,配置基本选项
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000,
  })

  // 2.请求拦截,添加token
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  // 3.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  })

  return instance(config)
}
