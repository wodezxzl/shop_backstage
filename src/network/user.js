import { request } from './request'

// 请求用户列表
export function getUserList(queryInfo) {
  return request({
    url: '/users',
    params: queryInfo,
  })
}

// 保存用户状态
export function saveUserState(uId, type) {
  return request({
    method: 'put',
    url: `users/${uId}/state/${type}`,
  })
}

// 添加用户
export function addUser(data) {
  return request({
    method: 'post',
    url: '/users',
    data,
  })
}

// 通过用户id获取用户信息
export function getUserInfoById(id) {
  return request({
    url: `users/${id}`,
  })
}

// 保存修改后的用户信息
export function saveUserInfo(id, email, mobile) {
  return request({
    method: 'put',
    url: `users/${id}`,
    data: {
      id,
      email,
      mobile,
    },
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: `users/${id}`,
    data: {
      id,
    },
  })
}
