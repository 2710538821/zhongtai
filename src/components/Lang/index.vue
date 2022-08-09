<template>
  <!-- trigger	触发下拉的行为	hover / click -->
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- 上面增加了一个点击才能显示出下拉框内容，下面两行代码增加了点谁谁的按钮就会被禁用 -->
      <!-- 方法一 -->
      <!-- <el-dropdown-item command="zh" :disabled="'zh'=== $i18n.locale ">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en'=== $i18n.locale ">en</el-dropdown-item> -->
      <!-- 方法二 -->
      <el-dropdown-item command="zh" :disabled="isDisabled">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="isDisabled">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  data() {
    return {
      // 方法二
      lang: ''
    }
  },
  computed: {
    // 方法二
    isDisabled() {
      return this.lang === this.$i18n.locale
    }
  },
  methods: {
    changeLanguage(lang) {
      Cookie.set('language', lang) // 切换多语言，set是存储，get是获取
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')

      // 方法二
      this.lang = lang
    }
  }
}
</script>
