// 建立全局快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 用户名称的映射
  userId: state => state.user.userInfo.userId, // 建立用户id的映射
  username: state => state.user.userInfo.username, // 建立用户id的映射
  staffPhoto: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId, // 建立对公司id 的快捷访问方式
  routes: state => state.permission.routes, // 建立权限模块下的快捷访问
  points: state => state.user.userInfo.points // 建立功能权限的快捷访问
}
export default getters
