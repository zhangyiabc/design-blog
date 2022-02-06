import request from '@/utils/request'

export function getArticle(data) {
  return request({
    method: 'GET',
    url: '/api/article',
    params: data
  })
}

export function getArticleDetail(id) {
  return request({
    method: 'GET',
    url: '/api/article/' + id
  })
}

export function countArticle(data) {
  return request({
    method: 'GET',
    url: '/api/article/count',
    params: data
  })
}

export function reviewArticle(data) {
  return request({
    method: 'POST',
    url: '/api/article/review',
    data: data
  })
}
