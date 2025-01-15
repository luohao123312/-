import request from '@/utils/request'

// 查询床位列表
export function listBed(query) {
  return request({
    url: '/nursing/bed/list',
    method: 'get',
    params: query
  })
}

// 查询床位详细
export function getBed(id) {
  return request({
    url: '/nursing/bed/' + id,
    method: 'get'
  })
}

// 新增床位
export function addBed(data) {
  return request({
    url: '/nursing/bed',
    method: 'post',
    data: data
  })
}

// 修改床位
export function updateBed(data) {
  return request({
    url: '/nursing/bed',
    method: 'put',
    data: data
  })
}

// 删除床位
export function delBed(id) {
  return request({
    url: '/nursing/bed/' + id,
    method: 'delete'
  })
}
