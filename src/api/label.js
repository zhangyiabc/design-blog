import request from '@/utils/request'

export function getAllLabel() {
  return request({
    url: '/api/label',
    method: 'GET'
  })
}

export function addLabel(data) {
  return request({
    url: '/api/label',
    method: 'POST',
    data
  })
}

export function updateLabel(data) {
  return request({
    url: '/api/label',
    method: 'PUT',
    data
  })
}

export function countLabel() {
  return request({
    url: '/api/label/count',
    method: 'GET'
  })
}
