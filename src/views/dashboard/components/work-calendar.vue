<template>
  <div>
    <!-- 工作日历 -->
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :value="item" :label="`${item}年`" />
      </el-select>
      <!-- 月 -->
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dataChange">
        <el-option v-for="item in 12" :key="item" :value="item" :label="`${item}月`" />
      </el-select>
    </el-row>
    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- data { type, isSelected, day}，type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；
       isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd -->
      <!-- 通过设置名为 dateCell 的 scoped-slot 来自定义日历单元格中显示的内容。在 scoped-slot 可以获取到 date（当前
      单元格的日期）, data（包括 type，isSelected，day 属性）-->
      <template v-slot:dateCell="{ date,data }">
        <!-- {{ data.day | getDay }} -->
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2] // 2022-07-09 => 09
      return day.startsWith(0) ? day.substr(1) : day // 09 => 9
    }
  },
  props: {
    startData: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date() // 如果没有传递startDate这个数据，就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null // 当前日期
    }
  },
  created() {
    // 获取当前的年份
    this.currentYear = this.startData.getFullYear() // 得到当前的年份
    this.currentMonth = this.startData.getMonth() + 1 // 得到当前的月份
    // 快速生成数组的方法
    this.yearList = Array.from(Array(11), (value, index) => index + this.currentYear - 5)
    this.dataChange()
  },
  methods: {
    dataChange() {
      // 生成新的日期
      // alert(this.currentYear)
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`) // 以1号为开始
    },
    // 判断当前是否是周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style scoped>
 div /deep/ .el-calendar-day {
  height:  auto;
 }
 div /deep/ .el-calendar-table__row td,div /deep/ .el-calendar-table tr td:first-child, div /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
div /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
div /deep/ .el-calendar__header {
   display: none
 }
</style>
