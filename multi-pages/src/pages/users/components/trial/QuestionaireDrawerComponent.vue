<template>
  <el-drawer
    title="问卷结果"
    :with-header="false"
    :visible.sync="showQuestionDrawer"
    size="40%"
  >
    <el-container class="question-box">
      <el-aside
        style="width: 200px"
        class="question-aside"
        v-loading="asideLoading"
      >
        <el-scrollbar style="height:100%" id="v-scroll">
          <div
            class="button-item"
            :class="[{ 'button-item-active': bItem.id === curButton }]"
            v-for="(bItem, bKey) in titleList"
            :key="bKey"
            @click="clickTitle(bItem)"
          >
            {{ bItem.title }}
          </div>
          <div ref="lazyLoadingBox" class="lazy-loading-box"></div>
        </el-scrollbar>
      </el-aside>
      <el-divider direction="vertical" class="question-v-line"></el-divider>
      <el-container class="question-content">
        <el-header class="c-header">
          <h3>问卷结果</h3>
          <i
            class="el-icon-close c-icon-close"
            @click="showQuestionDrawer = false"
          ></i>
        </el-header>
        <el-divider class="question-h-line"></el-divider>
        <el-main class="c-main" v-loading="contentLoading">
          <el-scrollbar style="height:100%">
            <div
              class="question-content"
              v-for="(qItem, qKey) in questionList"
              :key="qKey"
            >
              {{ qKey + 1 }}、 {{ qItem.title }}
              <pre class="answer-content">{{ qItem.questionAnswer }}</pre>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-drawer>
</template>

<script>
import { debounce } from 'lodash'
export default {
  name: 'QuestionaireDrawerComponent',
  data() {
    return {
      showQuestionDrawer: false,
      asideLoading: false,
      contentLoading: false,
      uid: '',
      mobile: '',
      page: 0,
      pagesize: 0,
      titleList: [],
      questionList: [],
      // 当前选中的左侧按钮
      curButton: '',
      hasRemoved: true
    }
  },
  methods: {
    async openDrawer(query) {
      this.showQuestionDrawer = true
      // initData
      this.titleList = []
      this.uid = query.uid
      this.mobile = query.mobile
      this.page = query.page
      this.pagesize = query.pagesize
      const titleList = await this.initTitleList()
      // 获取第一项的详情
      if (titleList.length) {
        this.curButton = titleList[0].id
        this.initContent(titleList[0])
      }
      // 大于一页，开启懒加载
      if (titleList.length === 20) {
        const scrollBox = document
          .getElementById('v-scroll')
          .getElementsByClassName('el-scrollbar__wrap')[0]
        scrollBox.addEventListener('scroll', debounce(this.scrollEvent, 100))
        this.hasRemoved = false
      }
    },
    // 左侧title列表
    initTitleList() {
      this.asideLoading = true
      const query = {
        uid: this.uid,
        mobile: this.mobile,
        page: this.page,
        pagesize: this.pagesize
      }
      return this.$http.User.getQuestionnairePage(query)
        .then((res) => {
          this.asideLoading = false
          if (res.code === 0 && res.status === 'OK') {
            this.titleList = this.titleList.concat(res.payload.content)
            // 没下一页关闭懒加载
            if (!this.hasRemoved && res.payload.content.length < 20) {
              this.removeEventListener()
            }
            return res.payload.content
          }
        })
        .catch((error) => {
          console.log(error)
          this.asideLoading = false
        })
    },
    // 详情
    initContent(item) {
      this.contentLoading = true
      const query = {
        uid: this.uid,
        questionnaireId: item.id,
        mobile: this.mobile
      }
      this.$http.User.getQuestionnaireByUserId(query)
        .then((res) => {
          this.contentLoading = false
          if (res.code === 0 && res.status === 'OK') {
            this.questionList = res.payload.questionList
          }
        })
        .catch((error) => {
          this.contentLoading = false
          console.log(error)
        })
    },
    scrollEvent() {
      // 可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 滚动距离
      const scrollLong = document
        .getElementById('v-scroll')
        .getElementsByClassName('el-scrollbar__wrap')[0].scrollTop
      // 判定元素距离顶部的距离
      const itemToTop = this.$refs.lazyLoadingBox.offsetTop
      if (clientHeight + scrollLong >= itemToTop) {
        this.page++
        this.initTitleList()
      }
    },
    // 关闭懒加载
    removeEventListener() {
      const scrollBox = document
        .getElementById('v-scroll')
        .getElementsByClassName('el-scrollbar__wrap')[0]
      scrollBox.removeEventListener('scroll', this.scrollEvent)
      this.hasRemoved = true
    },
    clickTitle(item) {
      this.curButton = item.id
      this.initContent(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-box {
  /deep/ {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-divider--vertical {
      height: 100vh;
    }
  }
  .question-aside {
    width: 200px;
    height: 100vh;
    padding: 10px 0px;
    .button-item {
      text-align: center;
      padding: 4px;
      background-color: #f2f2f2;
      margin: 20px;
      padding: 15px 0;
      cursor: pointer;
    }
    .button-item-active {
      color: #fff;
      background-color: #2a75ed;
    }
    .lazy-loading-box {
      height: 10px;
      background-color: #fff;
    }
  }
  .question-v-line,
  .question-h-line {
    margin: 0;
  }
  .question-content {
    text-align: center;
    .c-header {
      position: relative;
      .c-icon-close {
        position: absolute;
        top: 8px;
        right: 10px;
        cursor: pointer;
        font-size: 17px;
        color: #999;
      }
    }
    .c-main {
      height: calc(100vh - 60px - 1px);
      padding: 0;
      overflow: auto;
      .question-content {
        margin: 30px 20px 10px;
        text-align: left;
        font-size: 14px;
        .answer-content {
          font-size: 12px;
          margin-top: 10px;
          padding-left: 20px;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
