<template>
  <el-drawer
    :visible.sync="drawerShow"
    :with-header="false"
    :destroy-on-close="true"
    size="50%"
  >
    <div class="wechat-message-box" v-loading="wechatMessageLoading">
      <header class="header-class">
        <i
          class="el-icon-close icon-close-class"
          @click="closeWechatDrawer"
        ></i>
        <el-steps :active="stepActive" align-center>
          <el-step>
            <span class="step-dot step-dot-active" slot="icon"></span>
            <span
              slot="title"
              class="step-title"
              :class="[{ 'step-title-active': stepActive === 1 }]"
            >
              确认发送好友
            </span>
          </el-step>
          <el-step>
            <span
              class="step-dot"
              :class="[{ 'step-dot-active': stepActive === 2 }]"
              slot="icon"
            ></span>
            <span
              slot="title"
              class="step-title"
              :class="[{ 'step-title-active': stepActive === 2 }]"
            >
              生成本次系统群发标签
            </span>
          </el-step>
        </el-steps>
        <el-divider></el-divider>
        <div class="text-box">
          <p>
            确认群发用户-->点击【下一步】生成本次群发标签-->点击【进入聊天工作台】-->使用精准推送功能，通过系统标签筛选本次群发用户
          </p>
          <!-- <p class="p-1">
            群发码生成规则:期数+发送人ID+随机4位数
          </p> -->
        </div>
        <el-divider></el-divider>
      </header>
      <main class="main-class-1" v-show="stepActive === 1">
        <section class="contain-class">
          <p><i class="v-pillar"></i>已选用户数：</p>
          <p class="p-2">
            {{ totalNum }}人
            <span>（绑定微信号人数：{{ bindingWechatNum }}人）</span>
          </p>
          <p><i class="v-pillar"></i>有微信好友数量：</p>
          <el-table
            class="table-1"
            border
            size="small"
            tooltip-effect="dark"
            :data="tableData1"
            :header-cell-class-name="headerCellClass"
            style="width: 381px"
          >
            <el-table-column
              prop="wechatNo"
              label="我的工作微信号"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="friendNum"
              label="与所选用户有好友关系数量"
              width="230"
            >
            </el-table-column>
          </el-table>
          <div class="table-2-box">
            <span class="table-2-text">
              确认群发用户：{{ totalReceive }}人
            </span>
            <el-table
              ref="table2"
              class="table-2"
              border
              size="small"
              tooltip-effect="dark"
              height="400"
              :data="tableData2"
              :header-cell-class-name="headerCellClass"
              @selection-change="tableSelectChange"
            >
              <el-table-column
                type="selection"
                min-width="40"
              ></el-table-column>
              <el-table-column prop="mobile" label="用户手机号" min-width="110">
              </el-table-column>
              <el-table-column prop="remark" label="微信备注" min-width="200">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="微信性别"
                min-width="70"
              ></el-table-column>
              <el-table-column prop="wechatNo" label="所属微信" min-width="150">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.wechatNo &&
                        scope.row.wechatNo.split(',').length === 1
                    "
                  >
                    {{ scope.row.wechatNo }}
                  </span>
                  <div
                    v-else
                    v-for="(item, key) in scope.row.wechatNo.split(',')"
                    :key="key"
                  >
                    {{ item }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </section>
        <footer class="footer-class">
          <el-button type="text" size="small" @click="goBack">上一步</el-button>
          <el-button
            type="primary"
            @click="nextStep"
            size="small"
            :disabled="!selectList.length"
          >
            下一步
          </el-button>
        </footer>
      </main>
      <main class="main-class-2" v-show="stepActive === 2">
        <p class="p-3">
          本次群发系统标签：<span>{{ groupTag }}</span>
        </p>
        <i class="el-icon-arrow-down arrow-class"></i>
        <el-button
          plain
          :data-clipboard-text="groupTag"
          class="copy-button"
          @click="copyFun"
        >
          点击复制本次群发系统标签
        </el-button>
        <footer class="footer-class footer-class-2">
          <el-button type="text" size="small" @click="preStep"
            >上一步</el-button
          >
          <el-button type="primary" @click="linkTo" size="small">
            前往【聊天工作台】设置发送内容
          </el-button>
        </footer>
      </main>
    </div>
  </el-drawer>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  name: 'wechatGroupMessage',
  data() {
    return {
      drawerShow: false,
      params: null,
      stepActive: 1,
      tableData1: null,
      tableData2: null,
      totalReceive: 0,
      totalNum: 0,
      bindingWechatNum: 0,
      // repeatNum: 0,
      wechatMessageLoading: false,
      selectList: [],
      groupTag: ''
    }
  },
  methods: {
    openWechatDrawer(query) {
      this.params = query
      this.initData()
      this.drawerShow = true
    },
    closeWechatDrawer() {
      this.drawerShow = false
    },
    initData() {
      this.stepActive = 1
      this.totalNum = this.params.totalNum
      this.userId = this.params.userId
      this.selectList.length = 0
      this.getListData()
    },
    getListData() {
      const query = {
        teacherId: this.params.teacherId,
        // userId: [
        //   '460813388734533632',
        //   '461258677811417088',
        //   '468860051919212544',
        //   '472478218109325312',
        //   '472487004505116672',
        //   '472518151222071296',
        //   '452452894873292800',
        //   '461283960878796800'
        // ]
        userId: this.userId
      }
      this.wechatMessageLoading = true
      this.$http.User.getWexinInfoOfTeacher(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            this.tableData1 = res.payload.list
            // 绑定微信的人数
            this.bindingWechatNum = 0
            this.tableData1.forEach((tItem) => {
              this.bindingWechatNum += +tItem.friendNum
            })
            if (
              res.payload.resultInfoPage &&
              res.payload.resultInfoPage.content &&
              res.payload.resultInfoPage.content.length
            ) {
              this.tableData2 = res.payload.resultInfoPage.content
              // // 重复人数
              // this.tableData2.forEach((tItem) => {
              //   if (tItem.wechatNo.split(',').length > 1) {
              //     this.repeatNum++
              //   }
              // })
              // 可接受消息人数
              this.totalReceive = res.payload.resultInfoPage.totalElements
              // 默认全部选中
              this.$refs.table2.toggleAllSelection()
            } else {
              this.tableData2 = []
              // this.repeatNum = 0
              this.totalReceive = 0
            }
          }
          this.wechatMessageLoading = false
        })
        .catch((error) => {
          console.log(error)
          this.wechatMessageLoading = false
        })
    },
    // 返回列表
    goBack() {
      this.drawerShow = false
    },
    // 上一步
    preStep() {
      this.stepActive = 1
    },
    // 下一步
    nextStep() {
      // 期数 + 老师ID + [1000, 10000)之内的随机数字
      this.groupTag = `【${this.params.period_name}】${
        this.params.teacherId
      }${Math.floor(1000 + Math.random() * 9000)}`
      this.stepActive = 2
    },
    // 前往聊天工作台
    linkTo() {
      const recordList = this.selectList.map((mItem) => mItem.wechatRecordId)
      const query = {
        term: this.groupTag,
        teacherId: this.params.teacherId,
        recordList: recordList
      }
      this.wechatMessageLoading = true
      this.$http.User.pushTagToUser(query)
        .then((res) => {
          this.wechatMessageLoading = false
          if (res.code === 0 && res.status === 'OK') {
            this.groupTag = res.payload
            window.open(
              `https://wgjapi.xiaoxiongmeishu.com/Personal/LoginService/LoginFromThirdParty?thirdPartyUserId=${this.params.teacherId}`
            )
          } else {
            this.$message.error('发送群系统标签失败')
          }
        })
        .catch(() => {
          this.$message.error('发送群系统标签失败')
          this.wechatMessageLoading = false
        })
    },
    tableSelectChange(val) {
      this.selectList = val
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 复制
    copyFun() {
      const clipboard = new Clipboard('.copy-button')
      clipboard.on('success', (e) => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        e.clearSelection()
        // 销毁实例避免多次提示
        clipboard.destroy()
      })
    },
    // 表头的class
    headerCellClass() {
      return 'header-cell-class'
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-message-box {
  max-height: 100vh;
  overflow: auto;
  .header-class {
    margin: 30px 0 10px;
    /deep/ {
      .el-steps {
        width: 65%;
        margin: 0 auto;
      }
      .el-step__title {
        font-size: 12px;
      }
      .el-step__icon.is-text {
        border: none;
        width: 8px;
        height: 8px;
        .step-dot {
          width: 8px;
          height: 8px;
          background-color: #c0c4cc;
          border-radius: 50%;
          position: relative;
          top: 3px;
        }
        .step-dot-active {
          background-color: #409eff;
        }
      }
      .step-title {
        font-weight: normal;
        color: #c0c4cc;
      }
      .step-title-active {
        font-weight: bold;
        color: #303133;
      }
      .el-divider--horizontal {
        margin: 0;
      }
    }
    .icon-close-class {
      color: #c0c4cc;
      font-size: 18px;
      position: absolute;
      top: 7px;
      left: 20px;
      cursor: pointer;
    }
    .text-box {
      margin: 0px 30px;
      font-size: 12px;
      color: #909399;
      .p-1 {
        color: #ce9c00;
      }
    }
  }
  .main-class-1 {
    .contain-class {
      margin: 0 30px 70px;
      p {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-weight: bold;
      }
      .v-pillar {
        display: inline-block;
        width: 3px;
        height: 15px;
        background: #2a75ed;
        margin-right: 10px;
      }
      .p-2 {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-weight: bold;
        span {
          color: #909399;
        }
      }
      .table-2-box {
        margin-top: 20px;
        padding: 0 20px 20px;
        border: 1px solid #d7dae2;
        border-radius: 3px;
        .table-2-text {
          display: inline-block;
          font-size: 12px;
          margin: 10px 0;
          color: #909399;
        }
      }
      /deep/ .el-pagination {
        margin-top: 20px;
        text-align: center;
      }
      /deep/ .header-cell-class {
        .cell {
          font-weight: normal;
          color: #000;
        }
      }
    }
  }
  .main-class-2 {
    text-align: center;
    padding-bottom: 70px;
    .p-3 {
      margin-top: 50px;
      margin-bottom: 0px;
      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .arrow-class {
      display: block;
      margin: 30px;
      font-size: 25px;
      color: #bebebe;
      font-weight: bold;
    }
  }
  .footer-class {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 50%;
    background-color: #fff;
    height: 70px;
    line-height: 70px;
    text-align: center;
    z-index: 1;
  }
}
</style>
