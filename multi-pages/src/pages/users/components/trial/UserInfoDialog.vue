<!--
 * @Descripttion: 学员课程信息、作品信息、活跃信息详情
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-16 16:27:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-03 01:18:45
-->
<template>
  <div class="user-info">
    <el-dialog
      custom-class="user-info-detail"
      :visible.sync="visible"
      width="60%"
      height="400px"
      :before-close="handleClose"
    >
      <h4 slot="title">
        明细【学员：{{
          (userInfo.userInfo && userInfo.userInfo.mobile) || '-'
        }}】
      </h4>
      <!-- tab -->
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="课程" name="course">
          <!-- 课程 -->
          <el-row type="flex">
            <el-col>
              <h5 class="mgb-10">【参课】</h5>
              <p class="mgb-10">
                <span>参课节数: {{ userInfo.join_course_count }}</span>
                <span>参课总次数: {{ userInfo.all_join_course_count }}</span>
              </p>
              <p>最近一次参课时间</p>
              <p class="primary-text">
                {{ formatDate(userInfo.last_join_time) || '-' }}
              </p>
            </el-col>
            <el-col>
              <h5 class="mgb-10">【完课】</h5>
              <p class="mgb-10">
                <span>完课节数：{{ userInfo.complete_course_count }}</span>
                <span
                  >完课总次数：{{ userInfo.all_complete_course_count }}</span
                >
              </p>
              <p>最近一次完课时间</p>
              <p class="primary-text">
                {{ formatDate(userInfo.last_complete_time) || '-' }}
              </p>
            </el-col>
            <el-col>
              <h5 class="mgb-10">【作品】</h5>
              <p class="mgb-10">
                <span>上传节数：{{ userInfo.task_course_count }}</span>
                <span>上传总数：{{ userInfo.task_count }}</span>
              </p>
              <p>最近一次上传时间</p>
              <p class="primary-text">
                {{ formatDate(userInfo.last_task_time) || '-' }}
              </p>
            </el-col>
            <el-col>
              <h5 class="mgb-10">【点评】</h5>
              <p class="mgb-10">
                <span>点评作品：{{ userInfo.comment_count }}</span>
                <span>听点评：{{ userInfo.listen_comment_count }}</span>
              </p>
              <p>最近一次听点评</p>
              <p class="primary-text">
                {{ formatDate(userInfo.last_listen_comment_time) || '-' }}
              </p>
            </el-col>
          </el-row>

          <!-- 课程记录明细 -->
          <el-table
            v-loading="courseLoading"
            :data="courseLogData"
            style="margin-top: 20px;width: 100%"
          >
            <el-table-column prop="title" label="课程名" min-width="150">
              <template slot-scope="scope">
                {{ scope.row.wd_info }} ·《{{ scope.row.title }}》
              </template>
            </el-table-column>
            <el-table-column label="是否参课">
              <template slot-scope="scope">
                <span
                  :class="{
                    'danger-text':
                      scope.row.studentCompleteCourseLog.learn_course_count > 0
                  }"
                  >{{
                    scope.row.studentCompleteCourseLog.learn_course_count > 0
                      ? '是'
                      : '否'
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="是否完课">
              <template slot-scope="scope">
                <span
                  :class="{
                    'danger-text':
                      scope.row.studentCompleteCourseLog.state === '1'
                  }"
                  >{{
                    scope.row.studentCompleteCourseLog.state === '1'
                      ? '是'
                      : '否'
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="上传作品">
              <template slot-scope="scope">
                {{ scope.row.studentCompleteCourseLog.course_task_count || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="点评">
              <template slot-scope="scope">
                {{ scope.row.studentCompleteCourseLog.task_comment_count || 0 }}
              </template></el-table-column
            >
            <el-table-column label="听点评">
              <template slot-scope="scope">
                {{
                  scope.row.studentCompleteCourseLog.listen_comment_count || 0
                }}
              </template></el-table-column
            >
            <el-table-column label="是否当日完课">
              <template slot-scope="scope">
                <span
                  :class="{
                    'danger-text':
                      scope.row.studentCompleteCourseLog
                        .is_today_complete_course
                  }"
                  v-if="scope.row.studentCompleteCourseLog"
                  >{{
                    scope.row.studentCompleteCourseLog.is_today_complete_course
                      ? '是'
                      : '否'
                  }}</span
                >
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 作品明细 -->
        <el-tab-pane label="作品明细" name="task">
          <el-table :data="courseTaskData" style="width: 100%">
            <el-table-column prop="title" label="课程名" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.sendCourseLog"
                  >{{ scope.row.sendCourseLog.wd_info || '-' }} ·《{{
                    scope.row.sendCourseLog.title || '-'
                  }}》</span
                >
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="task_image_small" label="作品">
              <template slot-scope="scope">
                <!-- 图片 -->
                <div class="task-image-container" v-if="scope.row.task_image">
                  <div class="task-image" @click="handleViewLarge(scope.row)">
                    <img :src="scope.row.task_image_small" />
                    <!-- 视频-播放按钮 -->
                    <i
                      class="el-icon-video-play"
                      v-if="scope.row.task_video"
                    ></i>
                  </div>
                  <!--班级2.0：视频不支持下载-->
                  <p
                    v-if="!(teamIdProp && scope.row.task_video)"
                    class="primary-text"
                    @click="downImg(scope.row)"
                  >
                    下载
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="taskComment" label="是否点评">
              <template slot-scope="scope">
                <span
                  :class="{ 'danger-text': scope.row.taskComment.length > 0 }"
                  >{{ scope.row.taskComment.length > 0 ? '是' : '否' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="listenComment" label="是否听点评">
              <template slot-scope="scope">
                <span
                  :class="{ 'danger-text': scope.row.listenComment.length > 0 }"
                  >{{ scope.row.listenComment.length > 0 ? '是' : '否' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="ctime" label="上传时间">
              <template slot-scope="scope"> {{ scope.row.ctime }} </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 活跃信息 -->
        <el-tab-pane label="活跃信息" name="activeLog">
          <el-table :data="activeLogData" style="width: 100%">
            <el-table-column
              prop="action_type_text"
              label="活跃行为"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="action_time" label="活跃时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div slot="footer">
        <el-pagination
          small
          :hide-on-single-page="false"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalElements"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-dialog>

    <!-- 查看作品 -->
    <el-dialog
      :visible.sync="taskDialogVisible"
      width="450px"
      center
      custom-class="enlarge-box"
      @close="closeTaskDialog"
    >
      <!-- 作品-点击图片放大 -->
      <img v-if="currentImg" :src="currentImg" alt="" />
      <!-- 作品-视频播放 -->
      <video
        v-if="currentVideo"
        :src="currentVideo"
        controls
        autoplay
        class="video"
        width="100%"
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
export default {
  props: {
    // 学员信息
    user: {
      type: Object,
      default: () => {}
    },
    tab: {
      type: String,
      default: ''
    },
    // 老师权限ID
    teacherIds: Array,
    /** 体验课班级2.0 特有 props, 判断从班级引用此组件 */
    // 班级ID
    teamIdProp: {
      type: String,
      default: ''
    }
  },
  computed: {
    userInfo() {
      return this.user || {}
    },
    teamId() {
      return (this.user && this.user.team_id) || ''
    }
  },
  data() {
    return {
      courseLoading: false,
      visible: false,
      activeTab: this.tab || '',
      courseLogData: [],
      activeLogData: [],
      courseTaskData: [],
      currentPage: 1,
      totalPages: 1,
      totalElements: 0,
      pageSize: 5,
      taskDialogVisible: false,
      currentImg: '',
      currentVideo: ''
    }
  },

  watch: {
    tab(val) {
      this.activeTab = val
    },
    activeTab(newVal, old) {
      console.log(newVal, old)
      this.currentPage = 1
      this.totalElements = 0
      this.getDataByTab(newVal)
    }
  },

  methods: {
    // 获取用户学习记录列表
    getSendCourseLogPage() {
      this.courseLoading = true
      const page = this.currentPage
      const studentId = this.userInfo.id
      const teamId = this.teamId
      const params = {
        studentId,
        teamId,
        page,
        size: 5
      }
      this.$http.User.getSendCourseLogPage(params)
        .then((res) => {
          if (res?.data?.SendCourseLogPage) {
            const {
              totalPages,
              totalElements,
              content
            } = res.data.SendCourseLogPage
            const list = content.map((item) => {
              item.studentCompleteCourseLog =
                item.studentCompleteCourseLog || {}
              return item
            })
            this.courseLogData = list
            this.totalPages = +totalPages
            this.totalElements = +totalElements
            this.pageSize = 5
          }
        })
        .finally(() => {
          this.courseLoading = false
        })
    },

    // 获取用户本班级作品集
    getStudentCourseTaskPage() {
      const uid = this.userInfo.id
      const teamId = this.teamId
      const page = this.currentPage
      if (!uid || !teamId) {
        return
      }
      this.$http.User.getStudentCourseTaskPage({
        studentId: uid,
        teamId,
        page,
        size: 5,
        subject: '0'
      }).then((res) => {
        if (res?.data?.StudentCourseTaskPage) {
          const {
            totalPages,
            totalElements,
            content
          } = res.data.StudentCourseTaskPage
          const list = content.map((item) => {
            item.task_image_small =
              (item.task_image &&
                item.task_image + '?x-oss-process=image/resize,l_100') ||
              ''
            item.ctime = (item.ctime && this.formatDate(item.ctime)) || '-'
            return item
          })
          this.courseTaskData = list
          this.totalPages = +totalPages
          this.totalElements = +totalElements
          this.pageSize = 5
        }
      })
    },

    // 获取用户行为记录
    getUserBehaviorLogPage() {
      const page = this.currentPage
      // 不显示 action_type=7 分配班级
      const params = {
        uid: this.userInfo.id,
        // teacher_id: this.teacherIds, // 冬成说去掉
        action_type: [1, 2, 3, 4, 5, 6]
      }
      this.$http.User.getUserBehaviorLogPage(params, page, 9).then((res) => {
        if (res.data?.UserBehaviorLogPage) {
          const {
            content,
            totalPages,
            totalElements
          } = res.data.UserBehaviorLogPage
          const list = content.map((item) => {
            item.action_type_text = item.action_type_text || '-'
            item.action_time =
              (item.action_time && this.formatDate(item.action_time)) || '-'
            return item
          })
          this.activeLogData = list
          this.totalPages = +totalPages
          this.totalElements = +totalElements
          this.pageSize = 9
        }
      })
    },

    // 查看大图
    handleViewLarge(task) {
      const { task_image: taskImage, task_video: taskVideo } = task
      if (taskImage && !taskVideo) {
        this.currentImg = taskImage
        this.currentVideo = ''
      }
      if (taskImage && taskVideo) {
        this.currentImg = ''
        this.currentVideo = taskVideo
      }
      this.taskDialogVisible = true
    },

    // 下载作品图片
    downImg(val) {
      const that = this
      console.log('下载', val)
      const canvas = document.createElement('canvas')
      const typeName = val.task_image.lastIndexOf('.')
      const type = val.task_image.substr(typeName + 1)
      const image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')

      image.src = val.task_image
      image.onload = function() {
        const link = document.createElement('a')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/' + type)
        const blob = that.dataUrlToBold(url)
        const objUrl = URL.createObjectURL(blob)
        link.style.display = 'none'
        link.href = objUrl
        link.download = `${val.sendCourseLog.wd_info}${val.sendCourseLog.title}.jpg`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
      }
    },
    // 图片下载bold
    dataUrlToBold(url) {
      const arr = url.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bStr = atob(arr[1])
      let n = bStr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },

    handleCurrentChange(page) {
      this.currentPage = page
      this.getDataByTab()
    },

    getDataByTab(tab = this.activeTab) {
      // 学习记录（放课记录）
      if (tab === 'course') {
        this.getSendCourseLogPage()
      }
      // 活跃信息
      if (tab === 'activeLog') {
        this.getUserBehaviorLogPage()
      }
      // 作品明细
      if (tab === 'task') {
        this.getStudentCourseTaskPage()
      }
    },

    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    handleClose() {
      this.visible = false
      this.$emit('close')
    },

    // 关闭查看作品dialog
    closeTaskDialog() {
      this.taskDialogVisible = false
      this.currentVideo = ''
      this.currentImg = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  h4,
  h5,
  p {
    margin: 0;
  }
  .mgb-10 {
    margin-bottom: 10px;
  }
  .task-image-container {
    width: 60px;
    text-align: center;
  }
  .task-image {
    position: relative;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      color: white;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: bold;
    }
  }
  ::v-deep {
    .user-info-detail {
      height: 500px;
      display: flex;
      flex-direction: column;
    }
    .el-dialog__header {
      padding: 10px 20px;
      background: #f0f1f2;
      color: #666;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__body {
      flex: 1;
      padding: 20px;
      overflow: auto;
      font-size: 12px;
      p {
        line-height: 18px;
        span {
          margin-right: 10px;
        }
      }
      .el-tabs__content {
        .el-col {
          padding: 10px;
          border: 1px solid #e4e7ed;
          border-left: 0;
          &:first-child {
            border-left: 1px solid #e4e7ed;
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 5px 10px;
    }
  }
  .enlarge-box {
    img {
      width: 100%;
      cursor: pointer;
    }
  }
}
::v-deep {
  .enlarge-box {
    .el-dialog__header {
      padding: 5px 0;
      background: transparent;
    }
  }
}
</style>
