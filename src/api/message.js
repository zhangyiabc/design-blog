import request from '@/utils/request'

// 发送系统消息
export function sendMessage(data) {
  return request({
    method: 'POST',
    url: '/api/adminNotice',
    data
  })
}

// 获取系统消息
export function getMessage(data) {
  return request({
    method: 'GET',
    url: '/api/adminNotice/all',
    params: data
  })
}
