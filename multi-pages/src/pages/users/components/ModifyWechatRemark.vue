<!--
 * @Descripttion: 增加或编辑学员艾客微信备注信息
 * 用户表的微信备注名。
    1. 如果用户表中为空，则为新增
    2. 先看是否有艾客微信备注，有的话带过来为默认内容，无则为空新增

    3.如果用户表中有微信备注，直接带过来-为编辑
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-17 20:11:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-17 21:44:02
-->
<template>
  <el-dialog
    title="微信备注名"
    :visible.sync="visible"
    @closed="closed"
    custom-class="user-wechat-remark"
  >
    <el-form
      :model="remarkForm"
      :rules="rules"
      ref="remarkForm"
      size="small"
      label-width="120px"
    >
      <el-form-item prop="remark" label="微信备注名：">
        <el-input v-model="remarkForm.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 用户微信信息 JLUserInfo 数据
    wechat: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      remarkForm: {
        remark: ''
      },
      rules: {
        remark: [
          { required: true, message: '请输入微信备注名', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleConfirm() {
      this.$refs.remarkForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    closed() {
      this.$refs.remarkForm.resetFields()
      this.$refs.remarkForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-wechat-remark {
  width: 500px;
}
</style>
