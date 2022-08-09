<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #after>
          <el-button type="primary" size="small" @click="addBtn(1,'0')">添加权限</el-button>
        </template>
      </PageTools>
      <el-card>
        <!-- 表格 -->
        <!-- 指定id为唯一属性的标识 -->
        <!-- row-key	行数据的 Key，用来优化 Table 的渲染；在使用reserve-selection
        功能与显示树形数据时，该属性是必填的 -->
        <!-- 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id -->
        <el-table border="" :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template v-slot="{ row }">
              <!-- 如果需要树表， 需要给el-table配置row-key属性 => id -->
              <!-- 添加按钮只在访问权的层级显示，当type===1时才显示添加按钮 -->
              <!-- 当type为1（老大）时为访问权限，type为2（children）时为功能权限(是不能有添加权限的) -->
              <el-button v-if="row.type === 1" type="text" @click="addBtn(2, row.id)">添加</el-button>
              <el-button type="text" @click="editBtn(row.id)">编辑</el-button>
              <el-button type="text" @click="delBtn(row.id)">删除</el-button>
              <!--   @click="editBtn(row.id)" -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 放置一个弹层 用来编辑新增节点 -->
      <!-- @close="cancelBtn" -->
      <el-dialog :title="showTitle" :visible="showDialog" center="" @close="cancelBtn">
        <!-- 表单 -->
        <el-form ref="permissionRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <!-- 当值为1时，激活，当值为0时，不激活 -->
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancelBtn">取消</el-button>
            <el-button size="small" type="primary" @click="sureBtn">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // Switch 开关，当值为1时，激活，当值为0时，不激活
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false // 显示关闭弹出框
    }
  },
  computed: {
    // 标题
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限数据
    async getPermissionList() {
      const { data } = await getPermissionList()
      // 将数据转化成了待children的树形结构
      this.list = tranListToTreeData(data, '0')
    },
    // 删除
    async delBtn(id) {
      try {
        await this.$confirm('您确定要删除吗')
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 展示弹窗
    addBtn(type, pid) {
      // 访问权的type=1  按钮操作权type=2
      // pid表示当前数据的父节点的标识
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    // 确定
    async sureBtn() {
      await this.$refs.permissionRef.validate()
      try {
        if (this.formData.id) {
          await updatePermission(this.formData)
          this.$message.success('编辑成功')
        } else {
          await addPermission(this.formData)
          this.$message.success('新增成功')
        }
        this.getPermissionList()
        this.$refs.permissionRef.resetFields()
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 获取权限详情
    async editBtn(id) {
      this.showDialog = true
      const { data } = await getPermissionDetail(id)
      this.formData = data
    },
    // 关闭弹窗
    cancelBtn() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permissionRef.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
