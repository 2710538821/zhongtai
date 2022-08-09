import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

// 引入插件
import App from './App'
import store from './store'
import router from './router'
import Print from 'vue-print-nb'

// 使用插件
Vue.use(Print)

import '@/icons' // icon
import '@/permission' // permission control

// 注册全局的自定义事件
import * as directives from '@/directives'
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 全局过滤器
import * as filters from '@/filters/index'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局组件文件
import components from './components'
Vue.use(components)

import checkPermission from '@/mixin/checkPermission'
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法

// 隐藏 右侧浏览器 滚动条
import VueSmoothScroll from 'vue2-smooth-scroll'
Vue.use(VueSmoothScroll)

// 引入i18n国际语言包文件
import i18n from '@/lang'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// 这里添加 { size: 'small' } 是对全局el-button定义size大小的
// element本身支持i18n的处理，此时i18n就会根据当前的locale属性去寻找对应的显示内容，t方法会去对应的语言包里寻找对应的内容
Vue.use(ElementUI, { size: 'small', i18n: (key, value) => i18n.t(key) })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
