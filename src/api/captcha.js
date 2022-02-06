import request from '@/utils/request'

export function getCaptcha() {
  return request({
    method: 'GET',
    url: '/api/captcha'
  })
}
