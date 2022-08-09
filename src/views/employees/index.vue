<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">{{ page.total }}条信息</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=user')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportxlsx"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="头像" width="120px" align="center">
            <template v-slot="{row}">
              <img
                v-imgagerror="require('@/assets/common/img.jpeg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showCodeDialog(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imgagerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showCodeImg(row.staffPhoto)"
              >
            </template>
          </el-table-column> -->
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- 使用单元格中的作用域插槽 -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showRoleFn(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination layout="total,sizes,prev, pager, next" :total="page.total" :page-size="page.size" :page-sizes="[5,10,15,20]" background prev-text="上一页" next-text="下一页" @current-change="changePage" @size-change="changeSize" />
        </el-row>
      </el-card>
    </div>
    <AddDemployee
      :show-dialog.sync="showDialog"
      @SHOWDiolog="showDialog = false"
    />
    <!-- 头像二维码 -->
    <el-dialog title="二维码头像" :visible.sync="showCode" center="">
      <el-row type="flex" justify="center">
        <canvas ref="MyCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置角色组件 -->
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeListAPI, delEmployeeAPI } from '@/api'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from '@/views/employees/components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  name: 'Employess',
  components: {
    AddDemployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      list: [], // 存数据
      page: {
        page: 1, // 当前页码
        size: 10, // 每页的总数
        total: 0 // 总数
      },
      showDialog: false,
      showCode: false, // 显示二维码弹层
      showRoleDialog: false, // 显示分配角色弹层
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工信息
    async getEmployeeList() {
      const { data: { rows, total }} = await getEmployeeListAPI(this.page)
      // 将数据保存
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    formatEmployment(row, column, cellValue, index) {
      // call表示当前单元格的数据
      const res = EmployeeEnum.hireType.find(item => item.id === Number(cellValue))
      return res ? res.value : '未知'
    },
    // 删除员工信息
    deleteEmployee(id) {
      // 弹窗是否删除
      this.$confirm('确定要删除吗？').then(async() => {
        try {
          await delEmployeeAPI(id)
          this.getEmployeeList()
        } catch (error) {
          console.log(error)
        }
      }, (error) => {
        error === 'cancel' ? this.$message.warning('已取消') : this.$message.warning('未知错误')
      })
    },
    async changePage(currentPage) {
      // page代表着当前页的意思
      this.page.page = currentPage
      await this.getEmployeeList()
    },
    async changeSize(currentSize) {
      this.page.size = currentSize
      await this.getEmployeeList()
    },
    // 导出xlsx表格
    exportxlsx() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { data: { rows }} = await getEmployeeListAPI({ page: 1, size: this.page.total })
        // console.log(rows)
        // 对所有员工的信息进行数据结构的调整
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工信息表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader,
          merges
        })
      })
    },
    // 定义formatJson 方法,将 [{},{}]数据转化成 [[],[]]
    // headers是头部信息，data 是每个单元格中的数据
    formatJson(headers, rows) {
      return rows.map(item => {
        // item 是每一个{username:'yefan'}
        return Object.keys(headers).map(key => {
          // 在获取item对象中数据的时候进行判断
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 需要对时间进行格式化
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 对聘用方式进行格式化
            const en = EmployeeEnum.hireType.find(obj => obj.id === Number(item[headers[key]]))
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 二维码
    showCodeDialog(staffPhoto) {
      if (staffPhoto) {
        this.showCode = true // 数据更新了，但是我的弹层不会立刻出现，页面的渲染是异步的
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          // 如果转换的二维码后面信息是一个地址的话，就会跳转到该地址，如果不是地址就会显示内容
          QrCode.toCanvas(this.$refs.MyCanvas, staffPhoto) // 将地址转化为二维码
        })
      } else {
        this.$message.warning('该用户还没有上传头像')
      }
    },
    // 角色弹出框
    async showRoleFn(id) {
      // 调用角色子组件并将id传入
      this.userId = id
      // 为了防止数据加载时抖动
      await this.$refs.assignRole.getUserDetail(this.userId) // 父组件调用子组件中的方法，属于异步方法
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
