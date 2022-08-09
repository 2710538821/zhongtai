// 请求接口---员工模块
import request from '@/utils/request'
export const getEmployeeSimple = () => request({
  url: '/sys/user/simple'
})

// 获取员工信息
export const getEmployeeList = params => request({
  url: '/sys/user',
  params
})

// 删除员工信息
export const delEmployee = id => request({
  url: `/sys/user/${id}`,
  method: 'delete'
})

// 新增员工信息
export const addEmployee = data => request({
  method: 'post',
  url: '/sys/user',
  data
})

// 导入员工的入口
export const importEmployee = data => request({
  url: '/sys/user/batch',
  method: 'post',
  data
})

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给员工分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}

// 保存离职表单信息
export function saveDimissionFormInfo(id, data) {
  return request({
    url: `/employees/${id}/leave`,
    method: 'put',
    data
  })
}
