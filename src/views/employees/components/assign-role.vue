<template>
  <el-dialog title="分配角色" center :visible="showRoleDialog" @close="cancelBtn">
    <!-- <el-checkbox-group> -->
    <!-- <el-checkbox v-for="item in list" :key="item.id" :label="item.id" /> -->
    <!-- </el-checkbox-group> -->
    <!-- 复选框组属性：value / v-model 绑定值 array，复选框组必须要用数组形式，所以下面的roleIds是数组形式 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="3">
        <el-button size="samll" @click="cancelBtn">取消</el-button>
      </el-col>
      <el-col :span="3">
        <el-button size="samll" type="primary" @click="sureBtn">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: { // 用户的id，当前要处理的那个用户
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有的角色
      roleIds: [] // 这个数组负责存储当前用户所拥有的角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      // rows是要循环的记录
      // 方法一
      // const qqq = await getRoleList({ page: 1, pagesize: 20 })
      // console.log(qqq)
      // this.list = qqq.data.rows
      // 方法二
      // const { data } = await getRoleList({ page: 1, pagesize: 20 })
      // this.list = data.rows
      // console.log(this.list)
      // 方法三
      const { data: { rows }} = await getRoleList({ page: 1, pagesize: 20 }) // 默认只取10条数据，角色数量，不会太多
      this.list = rows // rows是要循环的记录
      // console.log(this.list)
    },
    async getUserDetail(id) {
      // props传值是异步的，所以这里不能用this.userId
      // 这个方法是给父组件调用的
      const { data: { roleIds }} = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 分配角色
    async sureBtn() {
      // 保护用户的角色
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    // 取消
    cancelBtn() {
      this.roleIds = [] // 重置数组，将里面的内容定为空
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
