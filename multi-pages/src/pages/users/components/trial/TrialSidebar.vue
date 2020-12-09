<!--
 * @Descripttion: 体验课左侧快捷切换
 * @version: 2.1.0
 * @Author: YangJiyong
 * @Date: 2020-06-28 11:20:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-11 18:01:31
-->
<template>
  <div class="trial-list-sidebar">
    <el-scrollbar>
      <el-tree
        :data="treeDataList"
        :props="defaultProps"
        current-node-key="user-0"
        node-key="id"
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <!-- 自定义 el-tree -->
        <!-- :class="{ current: data.isGroup && currentNode.id == data.id }" -->
        <div
          class="custom-tree-node"
          @mouseenter="handleEnter(data)"
          @mouseleave="handleLeave(data)"
          slot-scope="{ node, data }"
        >
          <p :class="{ 'group-title': data.group }" v-if="!data.button">
            <span class="d-flex align-start">
              <!-- 人群组的icon -->
              <i
                class="el-icon-s-custom group-title-icon"
                v-if="data.isGroup"
              ></i>
              {{ data.label }}
            </span>
            <!-- 更多操作 -->
            <template>
              <i
                class="el-icon-more"
                @click.stop="handleMore(data)"
                v-show="currentNodeId === data.id && moreList.length > 0"
                v-if="data.isGroup"
              ></i>
              <el-card v-show="currentNodeId == data.id && showMenu">
                <div v-for="item in moreListByRank" :key="item.type">
                  <div @click.stop.prevent="handleMoreItem(data, item)">
                    {{ item.label }}
                  </div>
                </div>
              </el-card>
            </template>
          </p>
          <!-- 自定义群组 -->
          <div class="group" v-if="data.button">
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click.stop="handleAddFollowGroup(data.id)"
            ></el-button>
          </div>
        </div>
      </el-tree>
    </el-scrollbar>

    <!-- button -->
    <div class="toggle-btn" @click="handleToggle">
      <!-- open -->
      <i class="el-icon-arrow-left" v-if="isSidebarOpen"></i>
      <!-- close -->
      <i class="el-icon-arrow-right" v-else></i>
    </div>

    <show-follow-info
      :visible="showFollowDialog"
      :desc="groupFollow"
      @close="hideFollowDialog"
    />

    <!-- 新增自定义人群组 -->
    <handle-drawer
      :drawer="showDrawer"
      :active-type="currentGroupType"
      :rank-id="rankId"
      :key="now"
      :personal-count="groupList[0].children[0].children.length"
      :current-group="currentNode"
      :search-params="advanceSearchParams"
      @close="handleCloseDrawer"
      @advanced-search="handleAdvancedSearch"
      ref="drawer"
    />
  </div>
</template>

<script>
import { isToss, deepClone } from '@/utils/index'
import {
  todayTimestamp,
  tomorrowTimestamp,
  withinAnHour,
  getDaysTimestamp
} from '../../utils'
import ShowFollowInfo from './ShowFollowInfo.vue'
import HandleDrawer from './HandleDrawer.vue'
export default {
  components: { ShowFollowInfo, HandleDrawer },
  props: {
    todayTotal: {
      type: [String, Number],
      default: 0
    },
    tomorrowTotal: {
      type: [String, Number],
      default: 0
    },
    // 高级搜索时显示 drawer
    searchDrawer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    treeDataList() {
      const track = {
        label: '待跟进学员',
        children: [
          {
            id: 'track-today',
            label: `今日待跟进(${this.todayTotal})`
          },
          {
            id: 'track-tomorrow',
            label: `明日待跟进(${this.tomorrowTotal})`
          }
        ]
      }
      console.log([...this.treeList, track, ...this.groupList])

      return [...this.treeList, track, ...this.groupList]
    },

    // 如果是成员，部门成员组只有查看跟进策略的权限
    moreListByRank() {
      return +this.rankId === 3 && this.currentNode.pid === 'department'
        ? [this.moreList[2]]
        : this.moreList
    },
    // toss - 成员没有增加部门组的权限
    departmentGroup() {
      const group = [
        {
          id: 'DEPARTMENT',
          button: this.rankId !== 3,
          label: ''
        }
      ]
      return group
    }
  },
  data() {
    return {
      timer: null,
      now: null,
      isSidebarOpen: true,
      // TOSS - 老师信息
      teacherInfo: {},
      teacherId: '',
      rankId: 0, // 1-经理，2-组长，3-组员
      showMore: false,
      showMenu: false,
      currentNodeId: '',
      currentNode: {},
      hoverNode: {},
      currentExpression: {},
      showFollowDialog: false,
      groupFollow: '', // 当前群组跟进策略
      showDrawer: false, // 显示增加或编辑群组抽屉
      currentGroupType: '', // 操作的群组类型
      moreList: [],
      advanceSearchParams: {},
      sidebarParams: {},
      treeList: [
        {
          label: '学员',
          children: [
            {
              id: 'user-0',
              label: '全部学员'
            },
            {
              id: 'user-1',
              label: '未转化学员'
            },
            {
              id: 'user-2',
              label: '已转化学员'
            },
            // 系统课标签-vip学员。兑换码兑换来的
            {
              id: 'user-vip',
              label: 'VIP学员'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 自定义人群组
      groupList: [
        {
          label: '自定义人群组',
          children: [
            {
              id: 'PERSONAL',
              label: '个人自定义',
              group: true,
              children: []
            }
            // {
            //   id: 'DEPARTMENT',
            //   label: '部门自定义',
            //   group: true,
            //   children: []
            // }
          ]
        }
      ],
      personalGroup: [
        {
          id: 'PERSONAL',
          button: true,
          label: ''
        }
      ]
    }
  },

  watch: {
    currentGroupType(val) {
      console.log(val, 'currentGroupType')
    },
    hoverNode(group) {
      console.log(group, 'currentNode')
      if (!group.isGroup) return
      const follow = {
        label: '跟进策略',
        type: 'follow'
      }
      let list = [
        {
          label: '编辑',
          type: 'edit'
        },
        {
          label: '删除',
          type: 'delete'
        }
        // {
        //   label: '跟进策略',
        //   type: 'follow'
        // }
      ]
      // 如果是成员，部门成员组只有查看跟进策略的权限
      if (+this.rankId === 3 && group.type === 'DEPARTMENT') {
        list = []
      }
      // 如果本分组设置了跟进策略，则显示
      if (group.remark) {
        list.push(follow)
      }
      this.moreList = list
    }
  },

  created() {
    this.teacherInfo = isToss(true)
    this.rankId = (this.teacherInfo && +this.teacherInfo.rankId) || 0
    this.teacherId = (this.teacherInfo && +this.teacherInfo.id) || ''
    console.log(this.rankId)
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.getAllFollowGroup()
      this.getAllFollowGroup('DEPARTMENT')
    },

    handleNodeClick(data) {
      // console.log(data)
      const { id = '' } = data
      if (!id) return
      /**
       * case 0:
          case 1:
          case 2:
            item.user_status_name = '未转化'
            break
          case 3:
          case 4:
            item.user_status_name = '已购月课'
            break
          case 5:
          case 6:
          case 7:
            item.user_status_name = '已购年课'
            break
          case 8:
            item.user_status_name = '注销失效'
            break
          case 9:
          case 10:
            item.user_status_name = '已购季度课'
            break
          case 11:
          case 12:
            item.user_status_name = '已购半年课'
            break
       */
      console.log(id)
      const today = todayTimestamp()
      const tomorrow = tomorrowTimestamp()

      let param = {}
      switch (id) {
        // 全部学员
        case 'user-0':
          // param = { user_status: { gte: 0 } }
          param = {}
          break
        // 未转化学员
        case 'user-1':
          param = { user_status: { lte: 2 } }
          break
        // 已转化学员
        case 'user-2':
          param = { user_status: { gte: 3 } }
          break
        // VIP学员
        case 'user-vip':
          param = { 'vip_name.like': { 'vip_name.keyword': '*vip*' } }
          break
        // track-today
        case 'track-today':
          param = { today, is_track: 1 }
          break
        // track-tomorrow
        case 'track-tomorrow':
          param = { today: tomorrow, is_track: 1 }
          break
        // 全部学员
        default:
          param = null
          break
      }

      /**
       * 选中自定义人群组
       */
      const { isGroup, expression = '' } = data
      if (isGroup) {
        const expressionObj = (expression && JSON.parse(expression)) || {}
        param = this.formatGroupExpression(expressionObj)
        this.currentExpression = param
      }
      // 🤣TODO: 不清空高级筛选已选择项
      this.resetDrawer()

      this.sidebarParams = param

      console.log(param)
      if (!param) return
      this.$emit('filter', param)
    },

    // 鼠标移入
    handleEnter(item) {
      this.showMore = true
      this.currentNodeId = item.id
      this.hoverNode = deepClone(item)
    },

    // 鼠标移出
    handleLeave(item) {
      // console.log('handleLeave', item)
      this.showMore = false
      this.showMenu = false
      this.currentNodeId = ''
    },

    // 点击更多操作icon
    handleMore(item) {
      // console.log('show more', item)
      this.showMenu = true
      this.currentNode = item
      this.currentGroupType = item.type
    },

    // 点击更多选择项 @data: 当前导航项，@item: 点击的操作项
    handleMoreItem(data, item) {
      // console.log(item, 'handleMoreItem')
      this.showMenu = false

      const { remark, id, name, type } = this.currentNode
      // 查看跟进策略
      if (item.type === 'follow') {
        setTimeout(() => {
          this.showFollowDialog = true
          this.groupFollow = remark
        })
      }
      // 删除
      else if (item.type === 'delete') {
        this.$confirm(`您即将删除【${name}】人群组`, '删除人群组', {
          type: 'warning'
        })
          .then((_) => {
            this.$http.User.deleteTeacherFollowGroup(id)
              .then((res) => {
                if (res && res.code === 0) {
                  this.$message.success('操作成功')
                  this.currentNodeId = ''
                  this.currentNode = {}
                  this.now = Date.now()
                  // 同步数据
                  this.getAllFollowGroup(type)
                } else {
                  this.$message.success('操作失败')
                }
              })
              .catch((_) => {
                this.$message.success('操作失败')
              })
          })
          .catch((_) => {})
      }
      // 编辑
      else {
        console.log(id, '编辑-----------')
        this.showDrawer = true
      }
    },

    /**
     * 新增自定义人群组
     * @type String   个人自定义 - PERSONAL  部门自定义-DEPARTMENT  高级搜索-ADVANCEDSEARCH
     */
    handleAddFollowGroup(type) {
      console.log(type, 'add')
      this.now = Date.now()
      this.showDrawer = false
      // 个人自定义，最多3个
      if (
        type === 'PERSONAL' &&
        this.groupList[0].children[0].children.length >= 4
      ) {
        this.$message.warning('个人自定义人群组只支持添加3个')
        return
      }

      this.showDrawer = true
      this.currentGroupType = type
      this.currentNode = {}
    },

    // TODO：优化
    handleCloseDrawer(status) {
      this.showDrawer = false
      this.timer = setTimeout(() => {
        this.currentGroupType = ''
        if (status) {
          this.currentNode.expression = status
          this.getAllFollowGroup()
          this.getAllFollowGroup('DEPARTMENT')
        } else {
          // this.currentNode = {}
        }
        clearTimeout(this.timer)
      }, 500)
    },

    // 高级搜索
    handleAdvancedSearch(res) {
      console.log(res, '高级搜索条件')
      if (!res) return
      const expressionObj = deepClone(res || {})
      this.advanceSearchParams = expressionObj
      const param = this.formatGroupExpression(expressionObj)
      console.log(param)
      // 高级筛选与当前群组条件合并
      const ex = deepClone(this.sidebarParams)
      const currentParam = Object.assign(ex, param)
      this.$emit('filter', currentParam)
    },

    // 关闭查看策略
    hideFollowDialog() {
      this.showFollowDialog = false
      this.currentNode = {}
      this.groupFollow = ''
    },

    // toggle - 展开或收起
    handleToggle() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle', this.isSidebarOpen)
    },

    // 获取自定义人群组 type: PERSONAL, DEPARTMENT(部门)
    getAllFollowGroup(type = 'PERSONAL') {
      this.$http.User.getAllFollowGroup(this.teacherId, type).then((res) => {
        console.log(res)
        if (res && res.code === 0) {
          const group = (res.payload || []).map((item) => {
            item.label = item.name
            item.isGroup = true
            return item
          })
          if (type === 'PERSONAL') {
            this.$set(this.groupList[0].children[0], 'children', [
              ...this.personalGroup,
              ...group
            ])
          }
          if (type === 'DEPARTMENT') {
            // !!! 如果是组员，且没有部门自定义群组时，不显示 部门自定义 这一组
            if (this.rankId === 3 && group.length === 0) return
            if (
              !this.groupList[0].children[1] ||
              this.groupList[0].children[1].id !== 'DEPARTMENT'
            ) {
              this.groupList[0].children.push({
                id: 'DEPARTMENT',
                label: '部门自定义',
                group: true,
                children: []
              })
            }
            this.$set(this.groupList[0].children[1], 'children', [
              ...this.departmentGroup,
              ...group
            ])

            // 如果有选中的人群组，重新请求
            const { isGroup, expression = '' } = this.currentNode
            let param = null
            if (isGroup) {
              const expressionObj = (expression && JSON.parse(expression)) || {}
              param = this.formatGroupExpression(expressionObj)
            }
            if (param) {
              this.$emit('filter', param)
            }
          }
        }
      })
    },

    // 选中具体的自定义人群组后，格式化条件对象
    formatGroupExpression(expression = {}) {
      const group = deepClone(expression)
      console.log(group, 'expression')
      const params = {}
      /**
       * TODO:
       * 1. 活跃行为的时间转化格式
       * 2. 购系统课格式转化
       * 3. 城市
       * 4. 盒子物流状态
       */
      const {
        user_status: userStatus,
        last_complete_time: lastCompleteTime,
        last_join_time: lastJoinTime,
        last_login_time: lastLoginTime,
        express_status: expressStatus,
        city
      } = group
      // 系统课转化 userStatus是数组 ['0','2','3']的组合
      if (userStatus) {
        const arr = []
        // 未转化
        if (userStatus.includes('0')) {
          // group.user_status = { lte: 2 }
          arr.push(...[0, 1, 2])
        }
        // 已购半年课
        if (userStatus.includes('2')) {
          // group.user_status = { gte: 11, lte: 12 }
          arr.push(...[11, 12])
        }
        // 已购年课
        if (userStatus.includes('3')) {
          // group.user_status = { gte: 5, lte: 7 }
          arr.push(...[5, 6, 7])
        }
        group.user_status = arr
      }

      // 活跃行为的时间转化格式
      if (lastCompleteTime) {
        const complete = this.formatDate('last_complete_time', lastCompleteTime)
        Object.assign(group, complete)
      }
      if (lastJoinTime) {
        const join = this.formatDate('last_join_time', lastJoinTime)
        Object.assign(group, join)
      }
      if (lastLoginTime) {
        const login = this.formatDate('last_login_time', lastLoginTime)
        Object.assign(group, login)
      }

      // 城市 - mobile_province
      if (city) {
        const provinceArr = []
        const cityArr = []
        const mobileProvince = JSON.parse(city)
        const { level, data } = mobileProvince
        data.forEach((item) => {
          if (level > 0) {
            if (!provinceArr.includes(item[0])) provinceArr.push(item[0])
          }
          if (level > 1) {
            if (!cityArr.includes(item[1])) cityArr.push(item[1])
          }
        })
        group['mobile_province.keyword'] = provinceArr
        group['mobile_city.keyword'] = cityArr
        delete group.city
      }

      /**
       * 盒子物流 无地址：[0], 未送达：[1,2,4,5,6,7,8,9], 已送达 [3]
       * 
       * 0: '无地址',
          6: '待审核',
          1: '待发货',
          2: '已发货',
          3: '已完成',
          9: ' 退款，暂停发货',
          '4,5,7,8': '异常物流'
       */
      if (expressStatus && expressStatus.length > 0) {
        const express = expressStatus.map((item) => item.split(','))
        const arr = []
        for (const item of express) {
          arr.push(...item)
        }
        group.express_status = arr
      }

      Object.assign(params, group)

      return params
    },

    // 活跃行为的时间转化格式 type: hour-1小时内, today-当天, day-近两天, custom-自定义
    formatDate(key, type) {
      if (!key || !type) return {}
      if (type === 'hour') {
        return withinAnHour(key)
      }

      if (type === 'today') {
        const today = todayTimestamp()
        const tomorrow = tomorrowTimestamp()
        return { [`${key}`]: { gte: today, lt: tomorrow } }
      }

      if (type === 'day') {
        const yestoday = getDaysTimestamp(-1)
        const today = getDaysTimestamp(1)
        console.log(yestoday)

        return { [`${key}`]: { gte: yestoday, lt: today } }
      }

      if (type && Object.prototype.toString.call(type) === '[object Object]') {
        return { [`${key}`]: type }
      }
    },

    resetDrawer() {
      this.now = Date.now()
      this.advanceSearchParams = null
    }
  }
}
</script>

<style lang="scss" scoped>
.trial-list-sidebar {
  position: relative;
  width: 130px;
  height: calc(100vh - 150px); // 先写死
  margin-right: 10px;
  padding-top: 10px;
  // padding-bottom: 50px;
  background-color: #fff;
  .toggle-btn {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #999;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background-color: rgb(96, 98, 102);
    }
  }

  .custom-tree-node {
    width: 100%;
    &.current {
      p {
        color: #2a75ed !important;
      }
    }
    p {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px 10px 5px 0;
      line-height: 16px;
      font-size: 12px;
      white-space: normal;
      word-break: break-all;
      &.group-title {
        font-weight: 700;
        color: #999;
      }
      .group-title-icon {
        position: relative;
        top: 2px;
        margin-right: 2px;
        transform: scale(0.8);
      }
    }
    .el-icon-more {
      transform: rotate(90deg);
    }
    .group {
      margin: 5px 0;
    }
  }
  ::v-deep {
    // .el-tree > .el-tree-node > .el-tree-node__content .el-tree-node__label {
    //   font-weight: 700;
    // }
    // .el-tree-node__label {
    //   font-size: 12px;
    // }
    .el-tree > .el-tree-node > .el-tree-node__content {
      .custom-tree-node p {
        font-weight: 700;
      }
    }
    // 调整三级tree padding-left
    .el-tree-node__children {
      overflow: inherit;
      .el-tree-node__content {
        height: inherit;
        padding-left: 15px !important;
      }
    }
    .el-button--mini {
      width: 80px;
      padding: 2px 7px !important;
      border-radius: 4px;
      transform: scale(0.8);
    }

    .el-card {
      position: absolute;
      top: 15px;
      right: 0px;
      z-index: 999;
      line-height: 30px;
      &__body {
        padding: 10px;
      }
    }
  }
}
</style>
