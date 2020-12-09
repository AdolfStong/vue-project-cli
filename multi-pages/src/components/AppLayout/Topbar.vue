<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 15:13:34
 * @Description: topbar 顶部功能区
 -->
<template>
  <div class="navbar" :class="{ prod: isProd }">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 用户信息 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="user-info">
          <div class="avatar-wrapper">
            <img
              :src="userInfo ? userInfo.head || head : head"
              class="user-avatar"
            />
          </div>
          <p>{{ userInfo ? userInfo.realName : '' }}</p>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="updatePawShow">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 用户信息 end -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import { removeToken } from '@/utils/auth'
import { baseUrl } from '@/utils/index'
// import { debounce } from 'lodash'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  data() {
    return {
      ruleForm: {
        inputPaw: ''
      },
      dialogVisible: false,
      isProd: false,
      isEnv: null,
      userInfo: null,
      head: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
      noticeBadge: 0,
      teachId: JSON.parse(localStorage.getItem('teacher')).id,
      // websocket
      ws: null,
      wsLock: false,
      reconnectData: null
    }
  },
  created() {
    this.isProd = location.origin.indexOf('prod') > -1
    this.isEnv = new RegExp('[0-9]').test(location.origin.split('/')[2])
      ? 0
      : location.origin.includes('test')
      ? 1
      : location.origin.includes('prod')
      ? 2
      : 3
    const userInfo = localStorage.getItem('teacher')
    if (!userInfo) {
      this.logout()
      return
    }
    this.userInfo = JSON.parse(userInfo)
    // 通知的角标数字
  },
  mounted() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    updatePaw(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const teacherId = JSON.parse(localStorage.getItem('teacher'))
          console.log(teacherId.id)
          const paw = this.ruleForm.inputPaw
          this.$http.NoticeCenter.resetPwd(teacherId.id, paw).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              this.dialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    updatePawShow() {
      this.ruleForm.inputPaw = ''
      this.dialogVisible = true
    },
    logout() {
      removeToken()
      location.href = `${baseUrl()}login/#/`
    },
    // 禁止输入中文
    checkStart() {
      this.checkInterval = setInterval(this.checkChinese, 100)
    },
    checkEnd() {
      clearInterval(this.checkInterval)
    },
    checkChinese() {
      // 禁止输入中文
      const test = /[\u4e00-\u9fa5]/gi
      // /[^0-9A-Za-z]/g
      this.updatePwd.newPassword = this.updatePwd.newPassword.replace(test, '')
    },
    clickNoticeTop() {
      this.$refs.noticeCenter.openDrawer()
    },
    reduceBadge() {
      this.noticeBadge--
    },
    clearBadge() {
      this.noticeBadge = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &.prod {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .globelSearch-con {
    line-height: 46px;
    height: 100%;
    width: 220px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    margin-right: 20px;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
    margin-left: 15px;
  }

  .right-menu {
    .item-line {
      display: inline-block;
      background-color: #bec0c3;
      width: 2px;
      height: 10px;
    }
    .order-btn {
      cursor: pointer;
      padding: 5px 10px;
      height: 20px;
      font-weight: 500;
      color: gray;
      font-size: 14px;

      // &:hover {
      //   background-color: #2a75ed;
      //   color: #fff;
      // }
    }
    .talk-btn {
      cursor: pointer;
      margin: 0 20px;
      padding: 5px 10px;
      height: 20px;
      border: 1px solid #2a75ed;
      color: #2a75ed;
      border-radius: 20px;
      font-size: 12px;
      &:hover {
        background-color: #2a75ed;
        color: #fff;
      }
    }
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0px 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      p {
        margin: 0 0 0 8px;
      }
    }

    .avatar-container {
      margin-right: 30px;
      height: 50px;
      line-height: 50px;
      .avatar-wrapper {
        height: 50px;
        line-height: 50px;
        position: relative;

        .user-avatar {
          vertical-align: middle;
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 100%;
          border: 1px solid #e5e5e5;
        }
      }
    }
    .el-icon-arrow-down {
      position: absolute;
      right: -20px;
      top: 20px;
      font-size: 12px;
    }
    .notices-content {
      margin-right: 0px;
      /deep/ .el-badge__content.is-fixed {
        top: 12px;
      }
    }
    .el-badge {
      vertical-align: inherit !important;
    }
  }

  // 多科目
  .subject-change {
    position: relative;
    float: right;
    min-width: 100px;
    margin-left: 10px;
    padding-left: 30px;
    border-left: 2px solid #bec0c3;
    cursor: pointer;
    // &::before {
    //   content: '';
    //   position: absolute;
    //   left: 0;
    //   top: 50%;
    //   width: 2px;
    //   height: 30px;
    //   transform: translateY(-50%);
    //   background-color: #bec0c3;
    // }
    &-title {
      position: relative;
      font-weight: 500;
    }
  }
}
.subject-change {
  &-menu {
    width: 135px;
    .iconfont {
      position: relative;
      top: 10px;
      float: right;
      width: 14px;
      margin-right: -5px;
      fill: #999;
      &:hover {
        fill: #2a75ed;
      }
    }
  }
}
</style>
<style lang="scss">
.navbar {
  .mask-css {
    .el-dialog__body {
      padding: 10px 20px 0 20px !important;
    }
  }
}
</style>
