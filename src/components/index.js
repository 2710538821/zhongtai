// 这里统一注册全局需要的组件
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import TagsView from './TagsView'
import Lang from './Lang'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 全局可复用的excel组件
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('TagsView', TagsView)
    Vue.component('Lang', Lang)
  }
}
