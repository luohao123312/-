import request from '@/utils/request'

// 查询护理计划列表
export function listnursingPlan(query) {
  return request({
    url: '/nursing/nursingPlan/list',
    method: 'get',
    params: query
  })
}

// 查询护理计划详细
export function getnursingPlan(id) {
  return request({
    url: '/nursing/nursingPlan/' + id,
    method: 'get'
  })
}

// 新增护理计划
export function addnursingPlan(data) {
  return request({
    url: '/nursing/nursingPlan',
    method: 'post',
    data: data
  })
}

// 修改护理计划
export function updatenursingPlan(data) {
  return request({
    url: '/nursing/nursingPlan',
    method: 'put',
    data: data
  })
}

// 删除护理计划
export function delnursingPlan(id) {
  return request({
    url: '/nursing/nursingPlan/' + id,
    method: 'delete'
  })
}
