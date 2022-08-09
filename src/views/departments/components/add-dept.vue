<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOk"
        >确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEmployeeSimpleAPI, getDepartmentsAPI, addDepartmentsAPI, getDepartDetailAPI, updateDepartmentsAPI } from '@/api'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 对部门名称进行检查，如果部门下已经有该部门了就不能再添加了
    const checkNameRepeat = async(rule, value, cb) => {
      // 先要获取最新的组织架构数据(最新的)
      const { data: { depts }} = await getDepartmentsAPI()
      // console.log(depts)
      let isRepeat = false
      if (this.formData.id) {
        // console.log(this.treeNode)
        // 有id ，编辑模式
        // 因为数据库中已经有了当前数据，所以需要核对的就是除了本身的数据之外，还需要遍历尝试还有没有重复的数据
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 无id ，新增模式
        // 找到所有的子节点数据 => 判断子节点是否和输入的value 相同
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? cb(new Error('该部门已存在')) : cb()
    }
    // 对编号进行检查，如果有重复就不能再添加了
    const checkCodeRepeat = async(rule, value, cb) => {
      // 拿到节点的所有数据
      const { data: { depts }} = await getDepartmentsAPI()
      let isRepeat = false
      if (this.formData.id) {
        // 有id ，编辑模式
        isRepeat = depts.some(item => item.id !== this.treeNode.id && item.code === value && value)
      } else {
        // 无id 新增模式
        // 将输入的编号和数据中的code进行对比，重复的就提示不能重复添加
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? cb(new Error('该编号已存在')) : cb()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur', validator: checkNameRepeat
          }],

        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur', validator: checkCodeRepeat
          }],

        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      // 如果formdata中有id 的属性，说明是编辑功能，如果是添加的功能就没有id
      return this.formData.id ? '编辑部门信息' : '新增部门信息'
    }
  },
  methods: {
    async getEmployeeSimple() {
      // 拿到所有员工的信息
      const { data } = await getEmployeeSimpleAPI()
      this.peoples = data
    },
    // 点击确定，手动验证表单是否完全通过验证
    btnOk() {
      this.$refs.deptForm.validate().then(async isOk => {
        if (!this.formData.id) {
          // 表单全部验证成功,调用接口新增
          const res = await addDepartmentsAPI({ ...this.formData, pid: this.treeNode.id })
          // 新增成功后重新拉取数据
          res.success ? this.$message.success('新增成功') : this.$message.error('新增失败，请稍后再试')
        } else {
          // 表单验证成功，调用编辑接口
          const result = await updateDepartmentsAPI({ ...this.formData })
          result.success ? this.$message.success('编辑成功') : this.$message.error('新增失败，请稍后再试')
        }
        // 不管是编辑还是新增，最后统一重新获取新数据
        this.$emit('addDepts')
        // 新增成功后将表单置空
        this.$refs.deptForm.resetFields()
        // 并且关闭弹层
        this.$emit('update:showDialog', false)
      })
    },
    // 点击取消就重置表单信息
    btnCancel() {
      // 重置数据和验证规则
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
        id: ''
      }
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false) // 关闭
    },
    // 获取部门详细数据，用来回显数据
    async getDepartDetail(id) {
      const res = await getDepartDetailAPI(id)
      // console.log(res)
      this.formData = {
        name: res.data.name,
        code: res.code,
        manager: res.data.manager,
        introduce: res.data.introduce,
        id: res.data.id
      }
    }
  }
}

</script>

<style>
</style>
