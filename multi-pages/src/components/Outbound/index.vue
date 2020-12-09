<!--
 * @Descripttion: 电话外呼
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-09 23:32:45
-->
<template>
  <div class="phone">
    <img src="../../assets/images/phone-icon.png" @click="makeCall" />
    <el-dialog
      title="坐席外呼中"
      :visible.sync="phoneDialogVisible"
      width="30%"
      center
      :modal-append-to-body="false"
    >
      <div class="useinfo" style="display:flex">
        <img
          style="width:50px"
          src="../../assets/images/phone-line.png"
          @click="makeCall"
        />
        <div class="listCile">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div v-if="useInfo">
          <P v-if="useInfo.userInfo">{{
            useInfo.userInfo.realname || useInfo.userInfo.username
          }}</P>
          <P v-if="useInfo.username">{{ useInfo.username }}</P>
          <P v-if="useInfo.mobile">{{ useInfo.mobile }}</P>
          <P v-if="useInfo.userInfo">{{ useInfo.userInfo.mobile }}</P>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="phoneDialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { openBrowserTab } from '@/utils/index'
export default {
  props: {
    phoneData: {
      type: Object
    }
  },
  data() {
    return {
      student_id: '',
      phoneDialogVisible: false,
      useInfo: {}
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.useInfo = this.$props.phoneData
    console.log(111, this.$props.phoneData)
  },
  methods: {
    makeCall() {
      this.$confirm(
        `您即将给用户${this.useInfo.mobile ||
          this.useInfo.userInfo.mobile}-${this.useInfo.username ||
          (this.useInfo.userInfo && this.useInfo.userInfo.realname) ||
          (this.useInfo.userInfo && this.useInfo.userInfo.username) ||
          ''}拨打电话，请确认`,
        '外呼电话',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then(() => {
          this.postCall()
          this.phoneDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拨打电话'
          })
        })
    },
    postCall() {
      console.log(this.useInfo)
      const params = {
        teacherId: JSON.parse(localStorage.getItem('teacher')).id,
        cno: JSON.parse(localStorage.getItem('teacher')).cno,
        tel: this.useInfo.mobile || this.useInfo.userInfo.mobile,
        studentId: this.useInfo.id || this.useInfo.user_info.id
      }
      return this.$http.Outbound.makeCall(params)
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.StudentTrialRecordDetailTossStatistics
          ) {
            this.recordDetail = res.data.StudentTrialRecordDetailTossStatistics
            this.lessonType = this.recordDetail.lesson_type

            // this.lessonType = 10
            this.lessonData.push(this.recordDetail)

            console.log(111, this.lessonType)
          }
        })
        .catch(() => {
          // loading.close()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.phone {
  img {
    width: 30px;
  }
  .useinfo {
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    .listCile {
      span {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: #36cb2a;
        border-radius: 50%;
        margin: 0 10px;
      }
    }
  }
}
</style>
