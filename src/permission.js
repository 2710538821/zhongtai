// 全局前置路由守卫  对用户的身份进行鉴权
import router from '@/router/index'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 前置守卫
router.beforeEach(async(to, form, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 有token，判断是否前往login
    if (to.path === '/login') {
      // 如果有token&进入登录，自动跳转首页（因为这是在获取到token的if语句中，所以有token并且还是去的是登录地址，最后跳转的就是首页）
      next('/')
    } else {
      // 如果有token&不是进入登录页，直接放行，放行后判断store中是否有用户信息，如果没有就先获取信息，有就不获取
      // if (!store.getters.userId) {
      //   // 如果没有用户id 的话，就直接发起actions中的请求
      //   await store.dispatch('user/getUserInfo')
      // }
      // next()

      // 如果有token&不是进入登录页，直接放行，放行后判断store中是否有用户信息，如果没有就先获取信息，有就不获取
      if (!store.getters.userId) {
        // 如果没有用户id 的话，就直接发起actions中的请求
        // 先把从用户的基本信息中的返回数据中的data中的roles中menus数据先提出来
        // 因为user/getUserInfo是有一个return的，所以async函数所return的内容，用await可以接收到
        // menus是页面的访问权限，points是页面的功能权限
        const { data: { roles: { menus }}} = await store.dispatch('user/getUserInfo')
        // console.log(qqq)
        // actions中的函数，默认是promise对象，调用这个对象，想要获取返回值的话，必须加await或者then
        // actions是做异步操作的
        // routes就是筛选得到的动态路由
        const routes = await store.dispatch('permission/filterRoutes', menus)
        // 现在的默认路由表是只有静态路由，没有动态路由，所以要把筛选到的动态路由添加到里面
        // addRoutes必须用next(地址),不能用next()
        // console.log(routes) // 数组类型
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表（铺路）
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址，相当于多做一次跳转
        /* 做跳转的原因是：进门了，但是进门之后我要去的地方的路还没有铺好，直接走会掉坑里，但是多做一次跳转，再从门外
        往里进一次，而在进来（跳转）之前，已经开始准备把路铺好，再次进来的时候路已经铺好了 */
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done() // 手动强行关闭
})

router.afterEach(() => {
  nProgress.done() // 路由跳转之后将进度条关闭
})
