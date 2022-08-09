<template>
  <!-- 用了一个行列布局 -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px ; width:100%"
  >
    <el-col>
      <span style="font-weight:700">{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row
        type="flex"
        justify="end"
      >
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown trigger="click" @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 这是权限判断，如果公司设置没有给用户添加权限，那么用户那边添加按钮是添加不了的，并且处于禁用状态 -->
              <!-- 这里checkPermission前面加了一个 ! 是为了取反，如果表示正确一取反就是false，false的禁用状态就是接触禁用了 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- <el-dropdown-item command="add" :disabled="!checkPermission('point-user-add')">添加子部门</el-dropdown-item> -->
              <!-- 这里也可以用v-if，如果标识对应成功，就会显示出这个功能按钮，如果为false，直接就看不到这个功能了 -->
              <!-- <el-dropdown-item command="add" v-if="checkPermission('point-user-add')">添加子部门</el-dropdown-item> -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentsAPI } from '@/api'
export default {
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门操作
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑操作
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除操作
        // 提醒是否需要删除操作
        this.$confirm('确定要删除么？').then(async() => {
          const res = await delDepartmentsAPI(this.treeNode.id) // 调用接口删除后端的数据
          // 删除成功，重新拉取数据，并且提醒用户删除成功
          console.log(res)

          res.success ? this.$emit('delDepts') && this.$message.success('删除成功啦！') : this.$message.error('删除失败啦！')
        }, (error) => {
          console.log(error)
          this.$message.warning('已取消')
        })
      }
    }
  }
}
</script>

<style>

</style>
