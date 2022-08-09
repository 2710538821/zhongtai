<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-ca rd">
        <!-- 放置新增弹层组件  -->
        <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
        <!-- 根节点 -->
        <tree-tools :tree-node="{name:'南京黑马程序员'}" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departmentData" :props="defaultProps">
          <!-- 使用作用域插槽的数据，来生成一些html结构，然后再进行插入 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script scoped>
import treeTools from './components/tree-tools.vue'
import { getDepartmentsAPI } from '@/api'
import { tranListToTreeData } from '@/utils'
import AddDept from '@/views/departments/components/add-dept.vue'
export default {
  components: {
    treeTools,
    AddDept
  },
  data() {
    return {
      departmentData: [],
      defaultProps: {
        children: 'children', // 从这个节点去找 内容
        label: 'name'
      },
      showDialog: false, // 显示窗体
      node: null,
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 拉取组织架构的数据
    async getDepartments() {
      this.loading = true
      const res = await getDepartmentsAPI()
      this.loading = false
      // 根节点信息
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // 子节点信息
      this.departmentData = tranListToTreeData(res.data.depts, '')
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    async editDepts(node) {
      // 弹出层变量，打开弹出层
      this.showDialog = true
      //  拿到获取当前的TreeNode
      this.node = node
      // 因为通过父组件获取数据，然后通过父川子的技术会存在异步问题，有可能再数据代理的时候，无法获取到传送过去的值，所以还是通过触发子组件中函数的形式来完成回显
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}

</style>
