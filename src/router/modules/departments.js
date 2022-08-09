// 导出员工的路由规则

import Layout from '@/layout'

// 每个子模块外层都是 layout  组件位于layout 的二级路由
// /employees属于一级路由，一级路由对应的组件会显示在一级路由的出口
// 下面的子路由默认打开，子路由显示在二级路由的出口
// 所以，访问/employees 这个一级路由的时候，实际上是一级路由+二级路由的显示界面
export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
