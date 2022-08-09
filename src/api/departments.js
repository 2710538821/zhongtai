// 组织架构模块
import request from '@/utils/request'

export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}

export const delDepartments = (id) => request({
  method: 'delete',
  url: `/company/department/${id}`
})

// 新增部门
export const addDepartments = (data) => request({
  url: '/company/department',
  method: 'post',
  data
})

// 获取部门详情
export const getDepartDetail = id => request({
  url: `/company/department/${id}`
})

// 提交编辑部门信息
export const updateDepartments = data => request({
  url: `/company/department/${data.id}`,
  method: 'put',
  data
})
