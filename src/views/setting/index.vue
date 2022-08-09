<template>
  <div class="dashboard-container">
    <PageTool :show-before="true">
      <!-- 写入结构 -->
      <template v-slot:before>
        <span>今天,天气晴,32~36</span>
      </template>
      <template v-slot:after>
        <h4><button>测试专用</button></h4>
      </template>
    </PageTool>
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border stripe :data="list">
              <el-table-column align="center" label="序号" width="120" type="index" />
              <el-table-column align="center" label="角色名称" width="240" prop="name" />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev,pager,next"
                background
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 弹出层 -->
    <el-dialog title="编辑信息" :visible="showDialog" :before-close="handleClose" close-on-click-modal>
      <el-form ref="roleForm" label-width="100px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
        <!-- 底部按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 权限的弹出层 -->
    <el-dialog :visible="showPremissionDialog" center width="40%" title="分配权限" @close="cancelPremission">
      <!-- 权限是一棵树 -->
      <!-- 将数据绑定在组件上 -->
      <!-- show-checkbox 节点是否可被选择，默认为 false -->
      <!-- check-strictly	在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
      <!-- default-checked-keys	默认勾选的节点的 key 的数组 -->
      <!-- node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的(下面用到的id就是唯一标识) -->
      <!-- getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组 -->
      <el-tree
        ref="premissionRef"
        node-key="id"
        :data="permissionData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectAutoChecked"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button @click="cancelPremission">取消</el-button>
          <el-button type="primary" @click="surePremission">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleListAPI, getCompanyInfoAPI, deleteRoleAPI, getRoleDetailAPI, updateRoleAPI, addRoleAPI } from '@/api'
import PageTool from '@/components/PageTools/index.vue'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { assignPerm } from '@/api/setting'
export default {
  name: 'Setting',
  components: { PageTool },
  data() {
    return {
      // 用来承接数据
      list: [],
      // 用来记录分页数据
      page: {
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formData: {},
      // 整个表单的数据对象
      roleForm: {
        name: '',
        description: ''
      },
      // 整个表单的验证规则
      rules: {
        name: [{ required: true, message: '该信息不能为空', trigger: 'blur' }]
      },
      showDialog: false,
      showPremissionDialog: false, // 控制分配权限弹层的显示或者隐藏
      permissionData: [], // 接收权限数据
      defaultProps: { // 定义显示字段的名称和子属性的字段名称
        label: 'name'
      },
      roleId: null, // 用来记录当前分配权限的id
      selectAutoChecked: [] // 用来记录当前的权限点的标识
    }
  },
  computed: {
    id() {
      return this.$store.getters.companyId
    }
  },
  created() {
    // 获取负责人列表
    this.getRoleList()
    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { data: { rows, total }} = await getRoleListAPI(this.page)
      // 所有的数据
      this.list = rows
      // console.log(this.list)
      // 总条数
      this.page.total = total
    },
    async changePage(newpage) {
      // 更新本地page
      this.page.page = newpage
      const { data: { rows, total }} = await getRoleListAPI(this.page)
      this.list = rows
      this.page.total = total
    },
    async getCompanyInfo() {
      // 拿到公司信息
      const { data } = await getCompanyInfoAPI(this.id)
      // console.log(data)
      this.formData = data
    },
    async deleteRole(id) {
      // 确认是否需要删除
      this.$confirm('确定要删除吗？').then(async() => {
        const res = await deleteRoleAPI(id)
        res.success ? this.$message.success('删除成功') : this.$message.error('删除失败')
        // 重新获取新数据
        this.getRoleList()
      }).catch(error => {
        error === 'cancel' ? this.$message.warning('已取消') : console.log(error)
      })
    },
    // 编辑roles
    async editRole(id) {
      // 获取该编辑按钮所在的信息元
      const { data } = await getRoleDetailAPI(id)
      this.roleForm = data
      this.showDialog = true
    },
    // 点击确认，表单整体验证
    btnOK() {
      try {
        this.$refs.roleForm.validate().then(async isOk => {
        // 验证通过,判断 新增还是编辑
        // 编辑
          if (this.roleForm.id) {
            await updateRoleAPI(this.roleForm)
          } else {
          // 新增
            await addRoleAPI(this.roleForm)
            // 清空表单并且关闭弹出层
            this.btnCancel()
          }
          // 不管新增还是编辑，重新拉取数据
          this.getRoleList()
          this.$message.success('操作成功')
          this.showDialog = false
        })
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 点击取消，清空数据和验证规则
    btnCancel() {
      this.roleForm = {}
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.showDialog = false
        })
        .catch(_ => {})
    },
    // 获取权限点数据，在点击的时候调用
    async assignPermission(id) {
      // 将数据转化成了待children的树形结构
      const { data } = await getPermissionList()
      this.permissionData = tranListToTreeData(data, '0')
      console.log(this.permissionData)
      // 应该去获取这个id的权限点，并且记录这个id
      this.roleId = id
      const { data: { permIds }} = await getRoleDetailAPI(id)
      console.log(permIds) // 打印出的是字符串数组
      this.selectAutoChecked = permIds // 将当前角色所拥有的权限id赋值
      this.showPremissionDialog = true
    },
    // 确定
    async surePremission() {
      // 需要用refs调用el-tree方法
      // getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // console.log(this.$refs.premissionRef.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.premissionRef.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPremissionDialog = false
    },
    // 取消
    cancelPremission() {
      this.selectAutoChecked = [] // 重置数据
      this.showPremissionDialog = false
    }
  }
}
</script>

<style>

</style>
