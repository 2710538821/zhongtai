// 导入静态和动态路由
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 一开始肯定拥有静态路由的权限
  // constantRoutes：表示当前用户所拥有的所有路由的数组
  routes: constantRoutes
}

const mutations = {
  // 定义修改routes
  setRoutes(state, newRoutes) {
    // 登录 => 管理员登录 => 100个页面的权限 => 退出
    // 登录 => 张三 => 管理员100个页面的权限 + 张三的权限（默认静态+张三权限才是正确的）
    // state.routes = [...state.routes, ...newRoutes] // 这么写看着没问题，但是业务不太正确

    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上，去加新的路由
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus:['settings','permissions',......] => 可在vue插件中的vuex中的userInfo的roles的menus查看
  filterRoutes(context, menus) {
    const routes = []
    // 筛选动态路由中和menus中能够对上的路由
    menus.forEach(key => { // menu中的数据是权限管理每一项的标识
      // key就是标识
      // asyncRoutes上面的每个路由都有一个name属性，然后筛选一遍和key相等的，如果找不到就是没有这个权限，如果找到了，就筛选出来
      // [1,2,3].push([4,5,6]) 错的   [1,2,3].push(...[4,5,6]) 对的
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组，有可能有元素，也有可能是空的
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations，然后就会静态和筛选出的动态路由合并到了一起
    return routes // 这里return state数据是用来显示左侧菜单用的，return是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
