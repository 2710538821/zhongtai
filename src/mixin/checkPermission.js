import store from '@/store'

// 做一个导出混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限，要么有，要么没有，key就是要检查的点
    checkPermission(key) {
      // 去用户的信息里面找points中有没有key，如果没有key，则认为有权限，如果没有key，则认为不能点击
      if (store.getters.points) {
        return store.getters.points.some(item => item === key)
      }
      return false // 如果没进去，说明没有权限
    }
  }
}
