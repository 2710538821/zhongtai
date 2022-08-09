<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployeeAPI } from '@/api'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      // 定义一个 关于 键 的对应关系，因为后端接口要求传入 规定的键名，所以需要把 中文 => 英文
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // results [{},{},{}]
      const arr = []
      // 把原始的对象数据循环出来
      results.forEach(item => {
        // 把每个对象中的键循环出来，然后将userRelations对象中的值替换成新对象的键
        const userinfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userinfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
            return
          }
          userinfo[userRelations[key]] = item[key]
        })
        arr.push(userinfo)
      })
      await importEmployeeAPI(arr) // 调用导入接口
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
}
</script>

