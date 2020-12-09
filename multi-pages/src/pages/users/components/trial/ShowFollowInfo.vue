<!--
 * @Descripttion: 展示跟进策略
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-09 17:42:52
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-10 14:15:14
-->
<template>
  <el-dialog
    title="跟进策略"
    :visible.sync="visible"
    width="40%"
    :before-close="handleClose"
  >
    <p>{{ desc }}</p>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 跟进策略文字
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },

  methods: {
    handleClose() {
      // this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
