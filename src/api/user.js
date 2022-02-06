import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getAllUsers(data) {
  return request({
    url: '/api/user',
    method: 'GET',
    params: data
  })
}

export function countSex() {
  return request({
    url: '/api/user/countSex',
    method: 'GET'
  })
}

export function orderUser(data) {
  return request({
    url: '/api/user/order',
    method: 'GET',
    params: data
  })
}
