// 在这里对所有的请求进行统一暴露
// 用户模块
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 组织架构模块
import { getDepartments, delDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'

// 员工模块
import { getEmployeeSimple, getEmployeeList, delEmployee, addEmployee, importEmployee, saveUserDetailById, getPersonalDetail, updatePersonal, getJobDetail, updateJob, assignRoles } from '@/api/employees'

// 公司设置模块
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole } from '@/api/setting'

// 权限设置模块
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permission'

/*
	用户模块对应方法
*/
export const loginAPI = login
export const getUserInfoAPI = getUserInfo
export const getUserDetailByIdAPI = getUserDetailById

/*
	组织架构模块方法
*/
export const getDepartmentsAPI = getDepartments
export const delDepartmentsAPI = delDepartments
export const addDepartmentsAPI = addDepartments
export const getDepartDetailAPI = getDepartDetail
export const updateDepartmentsAPI = updateDepartments

/*
	员工模块方法
*/
export const getEmployeeSimpleAPI = getEmployeeSimple
export const getEmployeeListAPI = getEmployeeList
export const delEmployeeAPI = delEmployee
export const addEmployeeAPI = addEmployee
export const importEmployeeAPI = importEmployee
export const saveUserDetailByIdAPI = saveUserDetailById
export const getPersonalDetailAPI = getPersonalDetail
export const updatePersonalAPI = updatePersonal
export const getJobDetailAPI = getJobDetail
export const updateJobAPI = updateJob
export const assignRolesAPI = assignRoles

/*
	公司设置的方法
*/
export const getRoleListAPI = getRoleList
export const getCompanyInfoAPI = getCompanyInfo
export const deleteRoleAPI = deleteRole
export const updateRoleAPI = updateRole
export const getRoleDetailAPI = getRoleDetail
export const addRoleAPI = addRole

// 权限方法
export const getPermissionListAPI = getPermissionList
export const addPermissionAPI = addPermission
export const updatePermissionAPI = updatePermission
export const delPermissionAPI = delPermission
export const getPermissionDetailAPI = getPermissionDetail
