<template>
  <el-dialog
    title="学员标签详情"
    :visible.sync="dialogVisible"
    width="60%"
    class="tag-detail-component"
    @closed="closed"
  >
    <div class="container" v-loading="loading">
      <div class="left-side">
        <h4>学员当前标签</h4>
        <div class="title" v-show="leftPersonTagList">个人库标签</div>
        <tags-item
          size="small"
          v-for="(item, index) in leftPersonTagList"
          :key="index"
          :text="item.name"
          :closable="true"
          :item="{ item: item, index: index }"
          @closeTag="closeLeftPersonTag"
        ></tags-item>
        <div class="title" v-if="leftDepartmentTagList">部门库标签</div>
        <div v-for="(val, key) in leftDepartmentTagList" :key="key">
          <div class="name"><span class="v-line"></span>{{ key }}</div>
          <tags-item
            v-for="(item, index) in val"
            :key="item.name"
            size="small"
            :text="item.name"
            :closable="true"
            :item="{ val: val, key: key, item: item, index: index }"
            @closeTag="closeLeftDepartmentTag"
          ></tags-item>
        </div>
      </div>
      <div class="right-side">
        <div v-if="showGoEdit" class="go-edit-class" @click="goEdit">
          前往部门标签管理>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="部门标签库" name="first">
            <div
              class="tag-group"
              v-for="(val, key) in rightDepartSysTagList"
              :key="key"
            >
              <div class="title">
                <span class="v-line"></span>
                <span class="text">{{ key }}</span>
              </div>
              <div class="p-tag-box">
                <div
                  class="p-tag-item"
                  v-for="(item, index) in val"
                  :key="item.id"
                >
                  <span
                    class="text"
                    :class="[{ 'text-active': item.active }]"
                    @click="checkDepartmentTag(val, key, item, index)"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="个人标签库" name="second">
            <div>
              <el-button
                type="primary"
                class="add-new-button"
                v-show="!addNewStatus"
                size="mini"
                @click="addNew"
              >
                新增
              </el-button>
              <div v-show="addNewStatus" class="add-new-box">
                <el-input
                  v-model="addNewVal"
                  placeholder="请输入内容"
                  size="mini"
                  maxlength="15"
                  show-word-limit
                ></el-input>
                <i class="el-icon-check" @click="editTagConfirm('new')"></i>
                <i
                  class="el-icon-circle-close"
                  @click="addNewStatus = false"
                ></i>
              </div>
              <el-button
                type="primary"
                v-show="!tagEditStatus"
                size="mini"
                @click="tagEditStatus = true"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                v-show="tagEditStatus"
                size="mini"
                @click="tagEditStatus = false"
              >
                编辑结束
              </el-button>
            </div>
            <div class="p-tag-box">
              <div
                class="p-tag-item"
                v-for="(item, index) in rightPersonSysTagList"
                :key="index"
              >
                <div v-show="item.editing" class="add-new-box">
                  <el-input
                    v-model="editVal"
                    placeholder="请输入内容"
                    size="mini"
                    maxlength="15"
                    show-word-limit
                  ></el-input>
                  <i
                    class="el-icon-check"
                    @click="editTagConfirm('edit', item)"
                  ></i>
                  <i
                    class="el-icon-circle-close"
                    @click="editTagCancel(item)"
                  ></i>
                </div>
                <span
                  v-show="!item.editing"
                  class="text"
                  :class="[{ 'text-active': item.active }]"
                  @click="checkPersonTag(item, index)"
                >
                  {{ item.name }}
                </span>
                <i
                  v-show="tagEditStatus"
                  class="el-icon-edit"
                  :class="[{ 'grey-color': hasTagEditStatus }]"
                  @click="editTag(item, index)"
                ></i>
                <i
                  v-show="tagEditStatus"
                  class="el-icon-delete"
                  :class="[{ 'grey-color': hasTagEditStatus }]"
                  @click="deleteTag(item, index)"
                ></i>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="save" size="small">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import tagsItem from './TagsItem.vue'
export default {
  name: 'tagDetail',
  components: {
    tagsItem
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      uid: '',
      userinfo: {},
      activeName: 'first',
      leftPersonTagList: [],
      leftDepartmentTagList: [],
      rightDepartSysTagList: [],
      rightPersonSysTagList: [],
      // 进入新增状态
      addNewStatus: false,
      addNewVal: '',
      tagEditStatus: false,
      hasTagEditStatus: false,
      editVal: '',
      showGoEdit: false
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('teacher'))
    if (+this.userinfo.rankId === 1 || +this.userinfo.rankId === 2) {
      this.showGoEdit = true
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    async initdata(pageData, uid) {
      this.uid = uid
      this.loading = false
      // 四个地方的列表数据都从pageData里拿
      // 左侧的个人库标签
      this.leftPersonTag(pageData)
      // 左侧的部门库标签
      this.leftDepartmentTag(pageData)
      // 右侧的部门系统库标签
      this.rightDepartSysTag(pageData)
      // 右侧的个人系统库标签
      this.rightPersonSysTag(pageData)
    },
    getAllTeacherByRole() {
      return this.$http.Permission.getAllTeacherByRole({
        teacherId: this.userinfo.id
      })
        .then((res) => {
          if (res.length) {
            return res
          }
          this.$message.error('暂无数据')
          return false
        })
        .catch(() => {
          this.$message.error('获取老师信息失败')
          return false
        })
    },
    leftPersonTag(data) {
      this.leftPersonTagList = JSON.parse(JSON.stringify(data.studentLabel))
    },
    leftDepartmentTag(data) {
      this.leftDepartmentTagList = JSON.parse(JSON.stringify(data.stuDepLabel))
    },
    rightDepartSysTag(data) {
      this.rightDepartSysTagList = JSON.parse(JSON.stringify(data.teaDepLabel))
      // 左侧部门库有的标签，在右侧要高亮显示
      for (const key1 in this.rightDepartSysTagList) {
        for (const key2 in this.leftDepartmentTagList) {
          // 先筛组名相同的，然后再筛标签相同的
          // 四层循环，比较难受
          if (key1 === key2) {
            this.rightDepartSysTagList[key1].forEach((item1) => {
              this.leftDepartmentTagList[key2].forEach((item2) => {
                if (item1.id === item2.id) {
                  item1.active = true
                }
              })
            })
          }
        }
      }
    },
    rightPersonSysTag(data) {
      this.rightPersonSysTagList = JSON.parse(JSON.stringify(data.teacherLabel))
      // 左侧个人库有的标签，在右侧要高亮显示
      if (!this.leftPersonTagList || !this.rightPersonSysTagList) {
        return
      }
      this.leftPersonTagList.forEach((item1) => {
        this.rightPersonSysTagList.forEach((item2) => {
          if (item1.id === item2.id) {
            item2.active = true
          }
        })
      })
    },
    addNew() {
      this.addNewVal = ''
      this.addNewStatus = true
    },
    saveDefineLabel(item) {
      const query = {
        teacherId: this.userinfo.id,
        name: this.addNewVal || this.editVal,
        id: item ? item.id : ''
      }
      return this.$http.Setting.saveDefineLabel(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            return res
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    closeLeftPersonTag(param) {
      for (let i = 0, len = this.rightPersonSysTagList.length; i < len; i++) {
        if (this.rightPersonSysTagList[i].id === param.item.id) {
          this.$set(this.rightPersonSysTagList[i], 'active', false)
          break
        }
      }
      this.leftPersonTagList.splice(param.index, 1)
    },
    closeLeftDepartmentTag(param) {
      Object.keys(this.rightDepartSysTagList).forEach((key) => {
        this.rightDepartSysTagList[key].forEach((item, index) => {
          if (item.id === param.item.id) {
            this.$set(item, 'active', false)
          }
        })
      })
      this.leftDepartmentTagList[param.key].splice(param.index, 1)
      if (!this.leftDepartmentTagList[param.key].length) {
        delete this.leftDepartmentTagList[param.key]
      }
    },
    deleteTag(item) {
      if (this.hasTagEditStatus) {
        return
      }
      this.$confirm('删除标签后，该标签自动从学员身上取消', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.delDefineLabel(item)
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('changeTagSucc', 'deleteTagEmit', this.uid)
        }
      })
    },
    delDefineLabel(item) {
      const query = {
        labelId: item.id,
        teacherId: this.userinfo.id,
        type: 1
      }
      return this.$http.Setting.delDefineLabel(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            return true
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    editTag(item, index) {
      if (this.hasTagEditStatus) {
        return
      }
      this.hasTagEditStatus = true
      this.editVal = item.name
      this.$set(item, 'editing', true)
    },
    editTagCancel(item, index) {
      this.editTagEnd(item)
    },
    // 新增和编辑都是一个接口，所以写一个方法里
    async editTagConfirm(type, item) {
      let inputData
      switch (type) {
        case 'new':
          inputData = this.addNewVal
          break
        case 'edit':
          inputData = this.editVal
          break
      }
      if (!inputData) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
        return
      }
      if (this.rightPersonSysTagList) {
        for (let i = 0, len = this.rightPersonSysTagList.length; i < len; i++) {
          if (this.rightPersonSysTagList[i].name === inputData) {
            this.$message({
              message: '标签名在该组已存在，请重新编辑',
              type: 'warning'
            })
            return
          }
        }
      }
      const result = await this.saveDefineLabel(item)
      if (result.code === 0 && result.status === 'OK') {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        return
      }
      switch (type) {
        case 'new':
          this.addNewStatus = false
          this.addNewVal = ''
          this.$emit('changeTagSucc', 'createPersonTag', this.uid)
          break
        case 'edit':
          this.$set(item, 'name', this.editVal)
          this.editTagEnd(item)
          this.$emit('changeTagSucc', 'createPersonTag', this.uid)
          break
      }
    },
    editTagEnd(item) {
      this.editVal = ''
      this.hasTagEditStatus = false
      this.$set(item, 'editing', false)
    },
    // 打部门标签
    checkDepartmentTag(val, key, item, index) {
      this.$set(item, 'active', !item.active)
      if (item.active) {
        if (!this.leftDepartmentTagList) {
          this.leftDepartmentTagList = {}
        }
        if (!this.leftDepartmentTagList[key]) {
          this.leftDepartmentTagList[key] = []
        }
        this.leftDepartmentTagList[key].splice(index, 0, item)
      } else {
        for (
          let i = 0, len = this.leftDepartmentTagList[key].length;
          i < len;
          i++
        ) {
          if (this.leftDepartmentTagList[key][i].id === item.id) {
            this.leftDepartmentTagList[key].splice(i, 1)
            break
          }
        }
        if (!this.leftDepartmentTagList[key].length) {
          delete this.leftDepartmentTagList[key]
        }
      }
    },
    // 打个人标签
    checkPersonTag(item, index) {
      this.$set(item, 'active', !item.active)
      if (item.active) {
        if (!this.leftPersonTagList) {
          this.leftPersonTagList = []
        }
        this.leftPersonTagList.push(item)
      } else {
        for (let i = 0, len = this.leftPersonTagList.length; i < len; i++) {
          if (this.leftPersonTagList[i].id === item.id) {
            this.leftPersonTagList.splice(i, 1)
            break
          }
        }
      }
    },
    save() {
      const labelIds = []
      const labelNames = []
      Object.keys(this.rightDepartSysTagList).forEach((key) => {
        this.rightDepartSysTagList[key].forEach((item) => {
          if (item.active) {
            labelIds.push(item.labelInfoId)
            labelNames.push(item.name)
          }
        })
      })
      this.rightPersonSysTagList &&
        this.rightPersonSysTagList.forEach((item) => {
          if (item.active) {
            labelIds.push(item.labelInfoId)
            labelNames.push(item.name)
          }
        })
      // console.log(labelIds)
      // console.log(labelNames)
      const query = {
        teacherId: this.userinfo.id,
        uid: this.uid,
        labelIds: labelIds.join(',')
      }
      this.$http.Setting.setLabelForUser(query).then((res) => {
        if (res.code === 0 && res.status === 'OK') {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.dialogVisible = false
          // 回显到外头的列表上
          this.$emit('saveTag', labelNames.join(','), this.uid)
        }
      })
    },
    goEdit() {
      if (location.host.includes('test')) {
        location.href = `${location.protocol}//${location.host}/ai-app-vue-toss-test/setting/#/`
      } else {
        location.href = `${location.protocol}//${location.host}/setting/#/`
      }
    },
    closed() {
      this.addNewStatus = false
      this.addNewVal = ''
      this.tagEditStatus = false
      this.hasTagEditStatus = false
      this.editVal = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-detail-component {
  /deep/ {
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
  }
  .container {
    display: flex;
    .left-side {
      width: 200px;
      border-right: 1px solid #e4e7ed;
      font-size: 12px;
      height: 450px;
      overflow: auto;
      h4 {
        font-size: 13px;
      }
      .title {
        color: #969495;
        margin: 10px 0;
      }
      .v-line {
        display: inline-block;
        width: 3px;
        height: 12px;
        background-color: #606266;
        vertical-align: top;
        margin-right: 3px;
      }
      .name {
        color: #606266;
        margin: 10px 0 5px;
      }
    }
    .right-side {
      position: relative;
      flex: 1;
      padding: 0 10px;
      .go-edit-class {
        position: absolute;
        right: 14px;
        top: 12px;
        font-size: 13px;
        color: #2a75ed;
        cursor: pointer;
        z-index: 1;
      }
      .tag-group {
        font-size: 12px;
        margin: 0px 10px 0px;
        .title {
          margin-bottom: 10px;
          .v-line {
            display: inline-block;
            width: 3px;
            height: 12px;
            background-color: #606266;
            vertical-align: top;
            margin-right: 3px;
          }
        }
      }
      .add-new-button {
        margin-right: 10px;
      }
      .add-new-box {
        display: inline-block;
        margin-bottom: 10px;
        /deep/ .el-input {
          width: 150px;
          margin-right: 10px;
          .el-input__suffix {
            top: 10px;
          }
        }
        i {
          margin-right: 10px;
          font-size: 15px;
          cursor: pointer;
          color: #2a75ed;
        }
      }
      .p-tag-box {
        max-height: 350px;
        margin-top: 15px;
        overflow: auto;
        .p-tag-item {
          display: inline-block;
          font-size: 12px;
          margin-right: 20px;
          margin-bottom: 10px;
          .text {
            display: inline-block;
            padding: 3px 3px;
            border: 1px solid transparent;
            border-color: #e0e4ec;
            border-radius: 3px;
            background-color: #f9fafd;
            color: #8c8c8c;
            cursor: pointer;
          }
          .text-active {
            border: 1px solid #f9d7d7;
            color: #f56c6c;
            background-color: #fdfbfb;
          }
          i {
            font-size: 14px;
            margin: 0 5px;
            cursor: pointer;
          }
        }
      }
      /deep/ {
        .el-tabs__item {
          font-size: 13px;
        }
        .el-tabs__content {
          max-height: 400px;
          overflow-y: auto;
        }
      }
    }
  }
  .grey-color {
    color: #ccc;
    cursor: default !important;
  }
}
</style>
