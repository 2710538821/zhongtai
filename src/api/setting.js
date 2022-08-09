// 公司设置模块
import request from '@/utils/request'

// 获取列表
export const getRoleList = params => request({
  url: '/sys/role',
  params
})

export const getCompanyInfo = companyId => request({
  url: `/company/${companyId}`
})

// 删除角色
export const deleteRole = id => request({
  url: `/sys/role/${id}`,
  method: 'delete'
})

// 更新角色信息
export const updateRole = data => request({
  url: `/sys/role/${data.id}`,
  data,
  method: 'put'
})

// 获取角色详情
export const getRoleDetail = id => request({
  url: `/sys/role/${id}`
})

// 新增角色
export const addRole = data => request({
  url: '/sys/role',
  data,
  method: 'post'
})

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
