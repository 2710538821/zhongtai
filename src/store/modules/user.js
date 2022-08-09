// 关于 user 的 vuex 模块化管理
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { loginAPI, getUserInfoAPI, getUserDetailByIdAPI } from '@/api'
import { resetRouter } from '@/router'

const actions = {
  // 定义login 行为方法，调用时需要提交参数，这个参数需要跟着网络请求一并提交
  async login(context, data) {
    const res = await loginAPI(data) // login返回的就是一个promise对象
    // actions中 login 请求回来的 token 提交到 mutations
    // console.log('res', res)
    // 成功之后，客户端写入token 和 时间戳
    // res.success ? (context.commit('setToken', res.data) && setTimeStamp()) : console.log('获取token失败')
    if (res.success) {
      context.commit('setToken', res.data)
      setTimeStamp() // 写入时间戳
    } else {
      console.log('获取token失败')
    }
  },
  // 发起请求，获取用户资料，相对应的axios请求已经封装成了一个方法，可以直接调用即可
  async getUserInfo(context) {
    const result = await getUserInfoAPI()
    const baseInfo = await getUserDetailByIdAPI(result.data.userId)
    context.commit('setUserInfo', { ...result.data, ...baseInfo.data }) // 两个接口合并，形成员工的个人信息存放再store 中的userinfo中
    return result // 伏笔
  },
  // 登出
  logout(context) {
    // 清除store中token
    // 清除缓存中的token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('reomveUserInfo')

    // 重置路由
    resetRouter()
    // 去设置权限模块下路由为初始状态
    /* Vuex子模块怎么调用子模块的action，都没加锁的情况下，可以随意调用，也就是说mutations和action都是挂载全局上的，
    所以子模块之间都可以互相调用，但是现在每一个子模块都加了命名空间，并且actions中context指的不是全局的context，
    如果要使用的话：context.commit('mutations名称', 载荷payload, { root: true }) */
    context.commit('permission/setRoutes', [], { root: true })
  }
}
const mutations = {
  // 对 token 进行获取，设置，移除的动作
  setToken(state, token) { // 定义设置token 的行为(同步缓存和state中的token)
    state.token = token
    setToken(token)
  },
  removeToken(state) { // 定义移除token 的行为（同步缓存和state中的token）
    state.token = null
    removeToken()
  },
  // 定义对用户信息进行修改的方法
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  // 删除用户信息-----登出
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

const state = {
  // token 值 必须和缓存中的token 进行同步
  token: getToken(), // 默认从缓存中获取token
  userInfo: {} // 设置一个空对象，用来承接用户的信息
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
