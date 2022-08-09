<template>
  <el-dialog title="新增员工" :visible="showDialog" close-on-press-escape @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <!-- label表示标签文本的内容,value代表要存储的值，这里存储的是id，可以在谷歌中的Vue里面查看聘用形式formOfEmployment的
          数据的变化，最后渲染到表中就是id所对应的value的值（id：1 -> 正式  id：2 -> 非正式） -->
          <el-option v-for="item in hireType" :key="item.id" :value="item.value" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <!-- 部门===树形结构 -->
      <el-form-item label="部门" prop="departmentName">
        <!-- Input Events：focus 在 Input 获得焦点时触发 -->
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个树形组件 -->
        <!-- 给el-tree加一个显示隐藏效果，初始打开弹框为false不显示，只有点击input输入框时获得焦点才显示，然后焦点又通过
        焦点事件去执行getDepartments()获取部门列表信息 -->
        <!-- 要找事件就直接去下面的events事件表格中去查找，node-click：节点被点击时的回调 -> 共三个参数，依次为：传递给
        data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 -->
        <el-tree v-if="showTree" v-loading="loading" default-expand-all :data="treeData" :props="{label:'name'}" @node-click="selectTree" />
      </el-form-item>

      <el-form-item label="转正时间">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <!-- 如果不写slot="footer"就是和上面el-form一体的，写了就是自成一体，置于底部 -->
    <!-- span	栅格占据的列数 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click.native.prevent="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click.native.prevent="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentsAPI, addEmployeeAPI } from '@/api'
import { tranListToTreeData } from '@/utils'
import Employees from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      treeData: [],
      showTree: false,
      loading: false,
      hireType: Employees.hireType,
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    // console.log(this.hireType)
  },
  methods: {
    // 点击部门的时候获取部门的树形结构数据
    async getDepartments() {
      // 开启进度条
      this.loading = true
      // 显示树形结构
      this.showTree = true
      const { data: { depts }} = await getDepartmentsAPI()
      // 把列表数据转化成树形结构的数据
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 点击树形结构之后的回调
    selectTree(node) {
      // console.log(arguments) // arguments 会把所有的参数都打印出来
      // console.log(node) // node是arguments中的第一个对象
      // formData.departmentName这个数据是和上面的input双向绑定的
      this.formData.departmentName = node.name
      // 选中之后，隐藏树形结构
      this.showTree = false
    },
    // 发送新增请求
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        await addEmployeeAPI(this.formData)
        // 请求，刷新
        /* 这里可以直接调用父组件的更新方法，因为父组件中的子组件是定义在div里面的最外面的，如果定义在了分页组件el-row中，
        那么用this.$parent去调用父组件的方法会失效 */
        // console.log(this.$parent) // 会打印出父组件的实例，里面会有父组件的引入各个封装函数
        this.$parent.getEmployeeList()
        this.$message.success('新增成功')
        this.$emit('SHOWDiolog') // 这里不用重置数据，因为关闭弹出层间接的触发了close事件，而close事件又绑定了cancelBtn这个方法
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 取消按钮
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('SHOWDiolog')
    }
  }
}
</script>

<style>

</style>
