import request from '@/utils/request'
/**
 * 获取Echarts数据的函数
 * @param {Object} data - 包含查询参数的对象
 * @returns {Promise} - 返回一个Promise，用于处理异步请求
 */
export function getEchartsData(data) {
  // 使用request工具函数发送GET请求到指定的URL
  // URL为'/nursing/daily/list'，并将data对象中的参数作为查询参数传递
  return request({
    url: '/nursing/daily/list',
    method: 'get',
    params: {...data}
  })
}
export function getListElder(query) {
  return request({
    url: '/nursing/elder/list',
    method: 'get',
    params: query
  })
}