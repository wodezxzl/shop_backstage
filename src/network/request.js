import axios from 'axios'

export function request(config) {
  // 1.创建axios实例,配置基本选项
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000,
  })

  return instance(config)
}
