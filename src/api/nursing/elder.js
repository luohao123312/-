import request from '@/utils/request'

// 查询老人列表
export function listElder(query) {
  return request({
    url: '/nursing/elder/list',
    method: 'get',
    params: query
  })
}

// 查询老人详细
export function getElder(id) {
  return request({
    url: '/nursing/elder/' + id,
    method: 'get'
  })
}

// 新增老人
export function addElder(data) {
  return request({
    url: '/nursing/elder',
    method: 'post',
    data: data
  })
}

// 修改老人
export function updateElder(data) {
  return request({
    url: '/nursing/elder',
    method: 'put',
    data: data
  })
}

// 删除老人
export function delElder(id) {
  return request({
    url: '/nursing/elder/' + id,
    method: 'delete'
  })
}
