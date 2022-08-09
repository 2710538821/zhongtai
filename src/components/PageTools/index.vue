<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="showBefore" class="before">
          <!-- 定义前面得插槽 -->
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// 此插槽主要用来 用作通知栏
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }

  }
}
</script>

<style lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 30px;
    i {
      display: inline-block;
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 20px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
