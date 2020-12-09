<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-21 22:16:32
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-21 22:16:32
 * @Description: 下拉框设置是否已加好友、已进群
 -->
<template>
  <el-dropdown @command="handleDropdown">
    <span class="el-dropdown-link">
      <item-status ref="itemStatus" :type="type" :row="row" />
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        icon="el-icon-success"
        class="icon-status"
        command="1"
        v-if="
          (+row.added_wechat === 0 && this.type === '1') ||
            (+row.added_group === 0 && this.type === '2')
        "
      ></el-dropdown-item>
      <el-dropdown-item
        icon="el-icon-error"
        class="icon-status"
        command="0"
        v-if="
          (+row.added_wechat === 1 && this.type === '1') ||
            (+row.added_group === 1 && this.type === '2')
        "
      ></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import ItemStatus from './ItemStatus.vue'
export default {
  components: {
    ItemStatus
  },
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    // 1-是否加微信，2-是否进群
    type: {
      type: String,
      default: '1'
    }
  },
  // computed: {
  //   courseType() {
  //     return this.row.team_type ? 'TRAIL' : 'YEAR'
  //   }
  // },
  methods: {
    handleDropdown(command) {
      /**
       *  studentId,
          teamId,
          courseType,
          addedGroup,
          addedWechat
       */
      const { row } = this
      const params = {
        teamId: row.team_id,
        courseType: 'YEAR',
        studentId: row.id
      }
      if (this.type === '1' && +command !== row.added_wechat) {
        Object.assign(params, { addedWechat: command })
      } else if (this.type === '2' && +command !== row.added_group) {
        Object.assign(params, { addedGroup: command })
      } else {
        return
      }
      this.$http.User.updateTeamStudent(params).then((res) => {
        if (res && res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          // 本地修改状态
          const newRow = {}
          if (this.type === '1') {
            Object.assign(newRow, this.row, {
              added_wechat: res.payload.addedWechat
            })
            this.row.added_wechat = res.payload.addedWechat
          }
          if (this.type === '2') {
            Object.assign(newRow, this.row, {
              added_group: res.payload.addedGroup
            })
            this.row.added_group = res.payload.addedGroup
          }
          this.$forceUpdate()
          this.$refs.itemStatus.$forceUpdate()
          // this.$emit('change', newRow)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.icon-status {
  font-size: 20px;
  .el-icon-success {
    color: #42b983;
  }
  .el-icon-error {
    color: rgb(151, 151, 151);
  }
}
</style>
