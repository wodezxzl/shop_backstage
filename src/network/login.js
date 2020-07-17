import { request } from './request'

export function getLoginVerify(data) {
  return request({
    method: 'post',
    url: '/login',
    data,
  })
}
