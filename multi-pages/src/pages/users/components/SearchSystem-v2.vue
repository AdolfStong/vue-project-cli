<!--
 * @Descripttion: 系统课学员搜索
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-27 18:43:42
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-12 20:46:37
-->
<template>
  <div class="search-container" :key="resetSearch" ref="searchContainer">
    <el-card border="false" shadow="never">
      <div class="form">
        <el-form :inline="true" label-position="right" label-width="100px">
          <div style="padding-bottom:5px;">
            <el-form-item label="学员搜索:" style="margin-left: -20px;">
              <div class="search-group">
                <search-phone-and-username
                  name="studentid"
                  type="1"
                  :custom-style="{ width: '140px' }"
                  placeholder="手机号或昵称"
                  :teacher-id="teacherIds"
                  @result="getSearchData('studentid', arguments)"
                  class="phone-name"
                />
              </div>
            </el-form-item>
            <el-form-item label="班级信息:">
              <div class="search-group">
                <search-stage
                  class="search-group-item"
                  name="term"
                  placeholder="系统课期数"
                  :teacher-id="teacherIds"
                  type="1"
                  :myStyle="{ width: '100px' }"
                  @result="getSearchData('term', arguments)"
                />
                <search-team-name
                  teamnameType="1"
                  :teacher-id="teacherIds"
                  @result="getSearchData('teamid', arguments)"
                  name="teamid"
                />
                <simple-select
                  name="user_status"
                  placeholder="课包类型"
                  :my-style="{ width: '130px', marginLeft: '10px' }"
                  :multiple="false"
                  :data-list="userStatusList"
                  @result="getSearchData('user_status', arguments)"
                />
              </div>
            </el-form-item>
            <el-form-item label="是否续费:">
              <div class="search-group">
                <simple-select
                  name="remain_order_count"
                  placeholder="请选择"
                  :my-style="{ width: '130px' }"
                  :multiple="false"
                  :data-list="isrenewList"
                  @result="getSearchData('remain_order_count', arguments)"
                />
              </div>
            </el-form-item>
          </div>

          <div style="margin:5px 0; padding-bottom:5px;">
            <el-form-item label="课程难度:" style="margin-left: -20px;">
              <hard-level
                class="search-group-item"
                placeholder="全部系统课难度"
                style="width:140px"
                name="currentsuper"
                @result="getSearchData('currentsuper', arguments)"
              />
            </el-form-item>
            <el-form-item label="课前准备:" style="margin-left: -10px;">
              <div class="search-group">
                <simple-select
                  name="addedwechat"
                  placeholder="是否加微"
                  :multiple="false"
                  :myStyle="{ width: '100px' }"
                  :data-list="addedWechatStatus"
                  @result="getSearchData('addedwechat', arguments)"
                  class="search-group-item"
                />
                <simple-select
                  name="addedgroup"
                  placeholder="是否进群"
                  :multiple="false"
                  :myStyle="{ width: '100px' }"
                  :data-list="addedGroupStatus"
                  @result="getSearchData('addedgroup', arguments)"
                  class="search-group-item"
                />
                <simple-select
                  name="follow"
                  placeholder="是否关注公众号"
                  :multiple="false"
                  :data-list="followWechatStatus"
                  @result="getSearchData('follow', arguments)"
                  class="search-group-item"
                />
              </div>
            </el-form-item>
            <el-form-item label="学习进度:" style="margin-left:-10px;">
              <div class="search-group">
                <stage-sup-levels
                  @levelCallBack="getSearchData('currentlevel', arguments)"
                  :disabled="true"
                  :levelName="currentlevel"
                  style="margin-bottom:0px"
                />
              </div>
            </el-form-item>
          </div>

          <!-- <div class="search-group-box">
            <el-form-item label="查询时间:" class="search-group flt">
              <date-picker-with-quick-select
                :quick-btn="['week', 'month']"
                name="dateTime"
                @result="getSearchData('dateTime', arguments)"
              />
            </el-form-item>
            <el-form-item label="学习情况:" class="search-group">
              <simple-select
                name="isNoactive"
                placeholder="是否参课"
                :multiple="false"
                :data-list="joinCourseStatus"
                @result="getSearchData('isNoactive', arguments)"
                class="search-group-item"
              />
              <simple-select
                name="isActive"
                placeholder="是否完课"
                :multiple="false"
                :data-list="completeCourseStatus"
                @result="getSearchData('isActive', arguments)"
                class="search-group-item"
              />
              <simple-select
                name="isTask"
                placeholder="是否上传作品"
                :multiple="false"
                :data-list="courseTaskStatus"
                @result="getSearchData('isTask', arguments)"
                class="search-group-item"
              />
            </el-form-item>
          </div> -->
          <div style="margin:5px 0;">
            <el-form-item label="辅导老师:" style="margin-left: -20px;">
              <div class="search-group">
                <department
                  name="department_id"
                  :only-dept="1"
                  :departmentId="departmentId"
                  :isDisabled="teacher_.rankId == '3' || teacher_.rankId == '2'"
                  placeholder="选择辅导老师组"
                  style="margin-right: 10px;"
                  @result="getSearchData('department_id', arguments)"
                />
                <group-sell
                  name="teacherid"
                  tip="辅导老师"
                  is-multiple
                  :teacherscope="teacherIds"
                  :isDisabled="teacher_.rankId == '3'"
                  @result="getSearchData('teacherid', arguments)"
                  class="search-group-item"
                />
              </div>
            </el-form-item>
            <el-form-item label="转介绍学员:" style="margin-left: -10px;">
              <div class="search-group">
                <simple-select
                  name="send_id"
                  placeholder="请选择"
                  :my-style="{ width: '130px' }"
                  :multiple="false"
                  :data-list="user_StatusList"
                  @result="getSearchData('send_id', arguments)"
                />
              </div>
            </el-form-item>
            <el-form-item label="VIP学员">
              <simple-select
                name="sys_label"
                placeholder="请选择"
                :multiple="false"
                :data-list="vipUserStatus"
                @result="getSearchData('sys_label', arguments)"
                class="search-group-item"
              />
            </el-form-item>
          </div>

          <!-- <el-form-item label="招生排期:" class="search-group">
            <search-stage
              class="search-group-item"
              name="term"
              placeholder="全部系统课排期"
              type="1"
              @result="getSearchData('term', arguments)"
            />
            <hard-level
              class="search-group-item"
              placeholder="全部系统课难度"
              style="width:140px"
              name="currentsuper"
              @result="getSearchData('currentsuper', arguments)"
            />
            <simple-select
              name="isrefund"
              placeholder="是否退费"
              :multiple="false"
              :data-list="refundStatus"
              @result="getSearchData('isrefund', arguments)"
              class="search-group-item"
            />
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
    <p @click="handleClear" class="clear-btn primary-text">清空筛选</p>
    <p @click="handlePutaway" class="putaway-btn primary-text">
      {{ toggleawayText }}
    </p>

    <!-- <div class="extra">
      <div class="extra-up">
        <search-phone-and-username
          name="studentid"
          type="1"
          :custom-style="{ width: '190px !important' }"
          @result="getSearchData('studentid', arguments)"
        />
      </div>
      <div class="extra-down">
        <slot name="down"></slot>
      </div>
    </div> -->
  </div>
</template>

<script>
// import FollowExpressStatus from '@/components/MSearch/searchItems/followExpressStatus.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import Department from '@/components/MSearch/searchItems/department.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
// import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername_system.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
// import DatePickerWithQuickSelect from '@/components/MSearch/searchItems/datePickerWithQuickSelect.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
import enums from '../components/searchData'
// import { deepClone } from '@/utils/index'
export default {
  components: {
    // FollowExpressStatus,
    GroupSell,
    Department,
    SearchStage,
    HardLevel,
    SearchPhoneAndUsername,
    SearchTeamName,
    // DatePickerWithQuickSelect,
    SimpleSelect,
    StageSupLevels
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0'
    },
    // 名下所有老师
    teacherIds: {
      type: Array,
      default: () => {
        return null
      }
    },
    departmentId: {
      type: String,
      default: '0'
    },
    teacher_: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelName: '',
      ...enums,
      searchQuery: {},
      nowDate: new Date().getTime(),
      // 体验课未上传作品的值是 -1。这里单独拿出来写
      // courseTaskStatusList: [
      //   {
      //     id: 1,
      //     text: '已上传作品'
      //   },
      //   {
      //     id: 0,
      //     text: '未上传作品'
      //   }
      // ]
      // 是否体验课学员
      vipUserStatus: [
        {
          id: 1,
          text: '是'
        }
        // {
        //   id: 0,
        //   text: '否'
        // }
      ],
      toggleawayText: '更多筛选',
      toggleawayStatus: false,
      toggleawayHeight: 'auto',
      currentlevel: 'currentlevel'
    }
  },
  computed: {
    resetSearch() {
      console.log(this.nowDate, 'this.nowDate')
      return this.nowDate
    }
  },
  created() {},
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      console.log(search, '=========================', key)
      if (search) {
        if (key === 'currentsuper') {
          const r = search[key].map((item) => `s${item}`)
          search[key] = r
        }
        // 系统课包类型
        if (key === 'user_status') {
          // 半年课
          if (search.user_status === 2) {
            search.user_status = { gte: 11, lte: 12 }
          }
          // 年课
          if (search.user_status === 1) {
            search.user_status = { gte: 5, lte: 7 }
          }
        }
        // vip
        if (key === 'sys_label' && search[key] === 1) {
          search['sys_label.like'] = { 'sys_label.keyword': '*vip*' }
        } else {
          this.$delete(this.searchQuery, 'sys_label.like')
        }
        // currentlevel
        if (key === 'currentlevel') {
          search.currentlevel = JSON.parse(
            JSON.stringify(search.currentlevel).toLowerCase()
          )
        } else {
          this.$delete(this.searchQuery, 'currentlevel')
        }
        // 是否续费
        if (key === 'remain_order_count') {
          // 已续费
          if (search.remain_order_count === '2') {
            search.remain_order_count = { gt: 1 }
          }
          // 待续费
          if (search.remain_order_count === '1') {
            search.remain_order_count = { lte: 1 }
          }
        }
        // 是否转介绍
        if (key === 'send_id') {
          // 是
          if (search.send_id === '2') {
            search.send_id = { gt: 0 }
          }
          // 否
          if (search.send_id === '1') {
            search.send_id = { lte: 0 }
          }
        }
        if (key !== 'dateTime') {
          this.searchQuery = {
            ...this.searchQuery,
            ...search
          }
        }
        // 查询时间处理格式
        else {
          const startTime = search.dateTime.gte
          const endTime = search.dateTime.lte
          this.searchQuery = {
            ...this.searchQuery,
            startTime,
            endTime
          }
        }
      } else {
        // delete this.searchQuery[key]
        this.$delete(this.searchQuery, key)
        if (key === 'dateTime') {
          this.$delete(this.searchQuery, 'startTime')
          this.$delete(this.searchQuery, 'endTime')
        }
        if (key === 'sys_label') {
          this.$delete(this.searchQuery, 'sys_label.like')
        }
      }
      // 删除返回值为空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      this.$delete(this.searchQuery, 'sys_label')
      console.log(search, 'getSearchData')
      console.log(this.searchQuery, 'this.searchQuery')
      this.$emit('search', this.searchQuery)
    },
    // getLabelName(labelname) {
    //   if (labelname) {
    //     const obj = {
    //       'userlabel.like': { 'userlabel.keyword': `*${labelname}*` }
    //     }
    //     Object.assign(this.searchQuery, obj)
    //   } else {
    //     delete this.searchQuery['userlabel.like']
    //   }
    //   const query = deepClone(this.searchQuery)
    //   this.$emit('search', query)
    // },
    // 清除搜索框
    handleClear() {
      this.nowDate = new Date().getTime()
      this.searchQuery = {}
      console.log(this.searchQuery, 'searchQuery')
      this.$emit('search', {})
    },
    // 搜索框收缩
    handlePutaway() {
      this.toggleawayHeight = this.$refs.searchContainer.offsetHeight
      if (this.toggleawayStatus) {
        this.toggleawayStatus = false
        this.toggleawayText = '更多筛选'
        this.$refs.searchContainer.style.height = 40 + 'px'
        this.$emit('handlePutaway', this.toggleawayStatus)
      } else {
        this.toggleawayStatus = true
        this.toggleawayText = '收起'
        this.$refs.searchContainer.style.height = 'auto'
        this.$emit('handlePutaway', this.toggleawayStatus)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  font-size: 12px;
  overflow: hidden;
  height: 40px;
  .clear-btn {
    position: absolute;
    right: 80px;
    bottom: 0;
    text-decoration: underline;
  }
  .putaway-btn {
    position: absolute;
    right: 20px;
    bottom: 0;
  }

  ::v-deep {
    .el-card {
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid #ddd;
      .el-card__body {
        padding: 0 0 10px 10px;
      }
    }
    .el-form-item__label {
      font-size: inherit;
      font-weight: normal;
    }
    .el-form--inline .el-form-item {
      margin-bottom: -10px;
      margin-right: -20px;
    }
  }
}
.search-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0 !important;
  &-item {
    margin-right: 10px;
  }
}
.phone-name {
  /deep/ i {
    top: 14px !important;
  }
}
// .el-icon-search i {
//   top: 20px !important;
// }
// .el-icon-search {
//   top: 20px !important;
// }
// .search-container {
//   display: flex;
//   justify-content: space-between;
//   .el-card /deep/ {
//     border: 0;
//     .el-card__body {
//       padding: 0 0 10px 0;
//     }
//   }
//   .extra {
//     padding: 10px 0;
//     margin-right: 10px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     // &-up {
//     //   flex: 1;
//     // }
//     // &-down {
//     //   flex: 1;
//     // }
//   }
// }
// .search-group-box {
//   display: flex;
// }
// .search-group /deep/ {
//   display: flex;
//   margin-bottom: 0 !important;
//   .el-form-item__content {
//     display: flex;
//     .search-group-item {
//       margin-right: 10px;
//     }
//   }
// }
// .search-group.flt {
//   float: left;
// }
</style>
