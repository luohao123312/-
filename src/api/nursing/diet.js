import request from '@/utils/request'

// 查询一周膳食列表
export function listDiet(query) {
  return request({
    url: '/nursing/diet/list',
    method: 'get',
    params: query
  })
}

// 查询一周膳食详细
export function getDiet(id) {
  return request({
    url: '/nursing/diet/' + id,
    method: 'get'
  })
}

// 新增一周膳食
export function addDiet(data) {
  return request({
    url: '/nursing/diet',
    method: 'post',
    data: data
  })
}

// 修改一周膳食
export function updateDiet(data) {
  return request({
    url: '/nursing/diet',
    method: 'put',
    data: data
  })
}

// 删除一周膳食
export function delDiet(id) {
  return request({
    url: '/nursing/diet/' + id,
    method: 'delete'
  })
}
