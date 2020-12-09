<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-09 18:33:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-19 20:56:54
-->
<template>
  <article>
    <div class="labelCheck-box">
      <el-dialog
        title="添加标签"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
      >
        <div>
          <el-tabs v-model="tabsName" @tab-click="handleClick">
            <el-tab-pane label="已有标签" v-if="type" name="existingLabel">
              <el-checkbox-group class="checkbox-scc" v-model="checkedCities">
                <el-checkbox
                  style="padding:5px 0;"
                  v-for="labels in labelOptions"
                  :label="labels.id"
                  :key="labels.id"
                  :disabled="labels.disabled"
                  >{{ labels.name }}</el-checkbox
                >
              </el-checkbox-group>
              <el-button
                style="float:right;width:120px;margin-bottom:20px;"
                type="primary"
                size="mini"
                @click="onBtnLabelList"
                >保存</el-button
              >
            </el-tab-pane>
            <el-tab-pane label="新建标签" name="newLabel">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="标签名称" prop="labelName">
                  <el-input
                    style="width:200px;"
                    v-model="ruleForm.labelName"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    style="float:right;width:120px;"
                    type="primary"
                    size="mini"
                    @click="submitForm('ruleForm')"
                    >保存</el-button
                  >
                  <el-button
                    style="display:none;"
                    id="resetBtn"
                    size="mini"
                    @click="resetForm('ruleForm')"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    labelRowValue: {
      type: Object,
      default: () => {}
    }
  },
  // watch: {
  //   labelRowValue(val) {
  //     this.getAllTeacherByRoleIds()
  //   }
  // },
  data() {
    return {
      type: false,
      dialogFormVisible: false,
      tabsName: 'newLabel',
      labelOptions: [],
      checkedCities: [],
      teacherIds: '',
      ruleForm: {
        labelName: ''
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签', trigger: 'blur' },
          { max: 5, message: '长度不超过 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllTeacherByRoleIds()
  },
  methods: {
    getAllTeacherByRoleIds() {
      const teacherid = JSON.parse(localStorage.getItem('teacher'))
      this.$http.Permission.getAllTeacherByRole({
        teacherId: teacherid.id
      }).then((res) => {
        this.teacherIds = `[${res.join(',')}]`
        setTimeout(() => {
          this.onFindDefineLableByTeacherId()
        }, 200)
      })
    },
    // 已有标签多选框接口
    onFindDefineLableByTeacherId() {
      this.$http.User.findDefineLableByTeacherId(this.teacherIds).then(
        (res) => {
          const _data = res.payload
          if (_data.length > 0) {
            this.type = true
            this.tabsName = 'existingLabel'
          } else {
            this.type = false
            this.tabsName = 'newLabel'
          }
          _data.forEach((item) => {
            if (this.labelRowValue.userlabel) {
              const label = this.labelRowValue.userlabel.split(',')
              label.forEach((ele) => {
                if (item.name === ele) {
                  item.disabled = true
                }
              })
            }
          })
          this.labelOptions = _data
        }
      )
    },
    // 复选框 保存按钮
    onBtnLabelList() {
      // const teacherid = JSON.parse(localStorage.getItem('teacher'))
      const params = {
        teacherId: this.labelRowValue.teacherid,
        uid: this.labelRowValue.studentid,
        labelIds: this.checkedCities.toString()
      }
      this.$http.User.setLabelForUser(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '成功添加标签',
            type: 'success'
          })
          this.checkedCities = []
          this.ruleForm.labelName = ''
          this.dialogFormVisible = false
          this.$emit('onRefresh', 1)
        }
      })
    },
    //   新建标签
    submitForm(formName) {
      const teacherid = JSON.parse(localStorage.getItem('teacher'))
      this.$refs[formName].validate((valid) => {
        const params = {
          teacherId: teacherid.id,
          name: this.ruleForm.labelName
        }
        if (valid) {
          this.$http.User.saveDefineLabel(params).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '标签添加成功',
                type: 'success'
              })
              this.checkedCities = []
              this.ruleForm.labelName = ''
              this.dialogFormVisible = false
              setTimeout(() => {
                this.getAllTeacherByRoleIds()
              }, 200)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleClose() {
      document.getElementById('resetBtn').click()
      this.checkedCities = []
      this.dialogFormVisible = false
    },
    handleClick(tab, event) {
      if (tab.index === '0') {
        this.getAllTeacherByRoleIds()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.labelCheck-box {
  .checkbox-scc {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
<style lang="scss">
.labelCheck-box {
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
