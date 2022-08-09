// 导出员工的路由规则

import Layout from '@/layout'

// 每个子模块外层都是 layout  组件位于layout 的二级路由
// /employees属于一级路由，一级路由对应的组件会显示在一级路由的出口
// 下面的子路由默认打开，子路由显示在二级路由的出口
// 所以，访问/employees 这个一级路由的时候，实际上是一级路由+二级路由的显示界面
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', // params传参 动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
