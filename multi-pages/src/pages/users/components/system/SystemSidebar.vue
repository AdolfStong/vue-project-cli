<!--
 * @Descripttion: 系统课左侧快捷切换
 * @version: 2.1.0
 * @Author: shasen
 * @Date: 2020-11-30 11:20:19
 * @LastEditors: shasen
 * @LastEditTime: 2020-11-30 18:01:31
-->
<template>
  <div class="system-list-sidebar">
    <el-scrollbar>
      <el-tree
        :data="treeList"
        :props="defaultProps"
        current-node-key="user-0"
        node-key="id"
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <!-- 自定义 el-tree -->
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <p :class="{ 'group-title': data.group }" v-if="!data.button">
            <span class="d-flex align-start">
              <!-- 人群组的icon -->
              <i
                class="el-icon-s-custom group-title-icon"
                v-if="data.isGroup"
              ></i>
              {{ data.label }}
            </span>
          </p>
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
  </div>
</template>

<script>
import {
  todayTimestamp,
  getWeekStartTimestamp,
  getMonthStartTimestamp
} from '../../utils'
export default {
  props: {},
  computed: {},
  data() {
    return {
      isSidebarOpen: true,
      currentExpression: {},
      showFollowDialog: false,
      advanceSearchParams: {},
      sidebarParams: {},
      treeList: [
        {
          label: '全部学员',
          children: [
            {
              id: 'user-0',
              label: '全部学员'
            },
            {
              id: 'user-1',
              label: '开课中'
            },
            {
              id: 'user-2',
              label: '待开课'
            },
            {
              id: 'user-3',
              label: '已结课'
            },
            {
              id: 'user-4',
              label: '已退费'
            }
          ]
        },
        {
          label: '活跃状态',
          children: [
            {
              id: 'lively-1',
              label: '近7天未参课'
            },
            {
              id: 'lively-2',
              label: '近15天未参课'
            },
            {
              id: 'lively-3',
              label: '近30天未参课'
            }
            // {
            //   id: 'user-6',
            //   label: '30天以上未参课'
            // }
          ]
        },
        // {
        //   label: '续费补差池',
        //   children: [
        //     {
        //       id: 'user-7',
        //       label: '高意向'
        //     },
        //     {
        //       id: 'user-8',
        //       label: '首月补差'
        //     },
        //     {
        //       id: 'user-9',
        //       label: '学习进度6个月'
        //     },
        //     {
        //       id: 'user-10',
        //       label: '学习进度12个月'
        //     }
        //   ]
        // },
        {
          label: '未参与转介绍',
          children: [
            {
              id: 'referral-1',
              label: '全部未上传'
            },
            {
              id: 'referral-2',
              label: '本周未上传'
            },
            {
              id: 'referral-3',
              label: '本月未上传'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleNodeClick(data) {
      const { id = '' } = data
      if (!id) return

      console.log(id)
      const today = todayTimestamp()
      const weekStart = getWeekStartTimestamp()
      const monthStart = getMonthStartTimestamp()
      console.log(weekStart, 'weekStart')
      console.log(monthStart, 'monthStart')
      let param = {}
      // gt大于， lt小于
      switch (id) {
        // 全部学员
        case 'user-0':
          param = { life_cycle: ['0', '1', '2', '91'] }
          break
        // 开课中
        case 'user-1':
          param = { life_cycle: '1' }
          break
        // 待开课
        case 'user-2':
          param = { life_cycle: '0' }
          break
        // 已结课
        case 'user-3':
          param = { life_cycle: '2' }
          break
        // 已退费
        case 'user-4':
          param = { life_cycle: '91' }
          break
        // 近7天未参课
        case 'lively-1':
          // param = { user_status: { lte: 2 } }
          param = {
            last_join_time: {
              gt: today - 15 * 86400 * 1000,
              lt: today - 7 * 86400 * 1000
            },
            life_cycle: ['0', '1']
          }
          break
        // 近15天未参课
        case 'lively-2':
          param = {
            last_join_time: {
              gt: today - 30 * 86400 * 1000,
              lt: today - 15 * 86400 * 1000
            },
            life_cycle: ['0', '1']
          }
          break
        // 近30天未参课
        case 'lively-3':
          param = {
            last_join_time: { lt: today - 30 * 86400 * 1000 },
            life_cycle: ['0', '1']
          }
          break
        // 全部未上传
        case 'referral-1':
          param = { last_bu_time: '0', life_cycle: ['0', '1'] }
          break
        // 本周未上传
        case 'referral-2':
          param = {
            last_bu_time: { lt: weekStart },
            life_cycle: ['0', '1']
          }

          break
        // 本月未上传
        case 'referral-3':
          param = {
            last_bu_time: { lt: monthStart },
            life_cycle: ['0', '1']
          }
          break
        // 全部学员
        default:
          param = null
          break
      }
      this.sidebarParams = param

      console.log(param)
      if (!param) return
      this.$emit('filter', param)
    },
    // toggle - 展开或收起
    handleToggle() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle', this.isSidebarOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
.system-list-sidebar {
  position: relative;
  width: 130px;
  height: calc(100vh - 100px); // 先写死
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
  }
}
</style>
