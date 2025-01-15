import request from '@/utils/request'

// 查询日常信息上传列表
export function listDaily(query) {
  return request({
    url: '/nursing/daily/list',
    method: 'get',
    params: query
  })
}

// 查询日常信息上传详细
export function getDaily(id) {
  return request({
    url: '/nursing/daily/' + id,
    method: 'get'
  })
}

// 新增日常信息上传
export function addDaily(data) {
  return request({
    url: '/nursing/daily',
    method: 'post',
    data: data
  })
}

// 修改日常信息上传
export function updateDaily(data) {
  return request({
    url: '/nursing/daily',
    method: 'put',
    data: data
  })
}

// 删除日常信息上传
export function delDaily(id) {
  return request({
    url: '/nursing/daily/' + id,
    method: 'delete'
  })
}
