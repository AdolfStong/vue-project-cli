<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-20 20:23:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-15 19:03:38
 @ApiModel(description = "用户跟进状态")
    public enum STATUS {

        /**
         * 已注册
         */
        ACTIVE,

        /**
         * 已体验课
         */
        STATUS10,

        /**
         * 体验课完课
         */
        STATUS20,

        /**
         * 已月系统课
         */
        STATUS30,

        /**
         * 月系统课完课
         */
        STATUS40,

        /**
         * 已年系统课
         */
        STATUS50,

        /**
         * 年系统课完课
         */
        STATUS60,

        /**
         * 年系统课续费
         */
        STATUS70,

        /**
         * 注销失效
         */
        CLOSE,

        /**
         * 已季系统课
         */
        STATUS80,

        /**
         * 季系统课完课
         */
        STATUS90,

        /**
         * 已半年系统课
         */
        STATUS100,

        /**
         * 半年系统课完课
         */
        STATUS110,

    }
-->
<template>
  <div class="search-container" :key="resetSearch">
    <el-card border="false" shadow="never">
      <div class="form">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-form-item label="归属销售&班级:" label-width="105px">
            <div class="search-group">
              <department
                name="department_id"
                :only-dept="1"
                placeholder="选择销售组"
                style="margin-right: 10px;"
                @result="getSearchData('department_id', arguments)"
              />
              <group-sell
                name="teacher_id"
                tip="选择销售人员"
                is-multiple
                @result="getSearchData('teacher_id', arguments)"
              />
              <!-- 体验课班级（从订单那边儿搬过来 -->
              <search-team-name
                teamnameType="0"
                :term="term_trial"
                @result="getSearchData('team_id', arguments)"
                name="team_id"
                style="width:140px;margin-left:10px;"
              />
            </div>
          </el-form-item>
          <el-form-item label="学员搜索:">
            <div class="search-group">
              <search-phone-or-usernum
                style="margin-right: 10px;"
                type="2"
                tablename="StudentTrialV2StatisticsList"
                @result="getSearchData('user', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="课前准备:" v-if="false">
            <div class="search-group">
              <simple-select
                name="added_wechat"
                placeholder="加微"
                :multiple="false"
                :data-list="addedWechatStatus"
                :my-style="{ width: '100px' }"
                :searchProp="searchProp"
                @result="getSearchData('added_wechat', arguments)"
                class="search-group-item"
              />
              <simple-select
                name="added_group"
                placeholder="是否进群"
                :multiple="false"
                :data-list="addedGroupStatus"
                :my-style="{ width: '100px' }"
                :searchProp="searchProp"
                @result="getSearchData('added_group', arguments)"
                class="search-group-item"
              />
              <follow-express-status
                name="express_status"
                placeholder="盒子物流"
                :my-style="{ width: '100px' }"
                :searchProp="searchProp"
                @result="getSearchData('express_status', arguments)"
                class="search-group-item"
              />
              <simple-select
                name="follow"
                placeholder="关注公众号"
                :multiple="false"
                :data-list="followWechatStatus"
                :my-style="{ width: '120px' }"
                @result="getSearchData('follow', arguments)"
                class="search-group-item"
              />
              <simple-select
                name="is_login"
                placeholder="登陆APP"
                :multiple="false"
                :data-list="loginStatus"
                :my-style="{ width: '120px' }"
                @result="getSearchData('is_login', arguments)"
                class="search-group-item"
              />
            </div>
          </el-form-item>
          <!-- <el-form-item label="课程难度:">
            <div class="search-group">
              <hard-level
                placeholder="请选择"
                :my-style="{ width: '100px !important' }"
                name="sup"
                @result="getSearchData('sup', arguments)"
              />
            </div>
          </el-form-item> -->

          <el-form-item
            label="渠道选择:"
            v-if="teacherInfo && +teacherInfo.rankId !== 3"
          >
            <div class="search-group">
              <channel
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                name="pay_channel"
                @result="getSearchData('pay_channel', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="手动标签:">
            <div class="search-group">
              <!-- <define-label
                placeholder="请选择"
                name="user_label.like"
                :isMultiple="true"
                :my-style="{ width: '120px !important' }"
                @result="getSearchData('user_label.like', arguments)"
              /> -->
              <define-label-v2
                ref="defineLabelV2"
                placeholder="请选择"
                name="id"
                @result="getSearchData('id', arguments)"
              />
            </div>
          </el-form-item>
          <!-- // user_status 0 未转化 1 月课 2半年课 3 年课 -->
          <el-form-item label="系统课转化:" label-width="85px">
            <div class="search-group">
              <simple-select
                name="user_status"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="conversionStatus"
                @result="getSearchData('user_status', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="意向度:" label-width="75px">
            <div class="search-group">
              <simple-select
                name="user_intention_type"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="intentionList"
                @result="getSearchData('user_intention_type', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="参课节数:">
            <div class="search-group">
              <simple-select
                name="join_course_count"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="joinCourseList"
                @result="getSearchData('join_course_count', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="完课节数:">
            <div class="search-group">
              <simple-select
                name="complete_course_count"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="completeCourseList"
                @result="getSearchData('complete_course_count', arguments)"
              />
            </div>
          </el-form-item>
          <el-form-item label="课程难度:">
            <div class="search-group">
              <simple-select
                name="sup"
                placeholder="请选择"
                :my-style="{ width: '100px' }"
                :multiple="false"
                :data-list="supList"
                @result="getSearchData('sup', arguments)"
              />
            </div>
          </el-form-item>
          <!-- 用来占位 -->
          <div class="seat-div">
            <el-button size="mini" type="primary">
              高级筛选
            </el-button>
            <p class="clear-btn primary-text">清空筛选</p>
          </div>
          <div class="handle-area d-flex align-center">
            <el-button size="mini" @click="advancedSearch" type="primary"
              >高级筛选</el-button
            >
            <p @click="handleClear" class="clear-btn primary-text">清空筛选</p>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import FollowExpressStatus from '@/components/MSearch/searchItems/followExpressStatus.vue'
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
// import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
import Channel from '@/components/MSearch/searchItems/channel.vue'
// import DefineLabel from '@/components/MSearch/searchItems/defineLabel.vue'
import DefineLabelV2 from '@/components/MSearch/searchItems/defineLabelV2.vue'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from '../components/searchData'
import { isToss } from '@/utils/index'
export default {
  components: {
    FollowExpressStatus,
    Department,
    GroupSell,
    SearchTeamName,
    // HardLevel,
    SearchPhoneOrUsernum,
    Channel,
    // DefineLabel,
    SimpleSelect,
    DefineLabelV2
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0'
    },
    // 通知中心的参数集合
    searchProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 参数集合
    paramsToSearch: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      labelName: '',
      ...enums,
      searchQuery: {},
      teacherInfo: {},
      nowDate: new Date().getTime(),
      term_trial: null // 当前选择体验课排期
    }
  },
  computed: {
    resetSearch() {
      return this.nowDate
    }
  },
  created() {
    this.teacherInfo = isToss(true)
    // 搜索项的参数
    if (+this.paramsToSearch.term === 0) {
      this.term_trial = []
    } else {
      this.term_trial = this.paramsToSearch.term && [this.paramsToSearch.term]
    }
  },
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      // console.log(key, res)

      if (search) {
        // if (key === 'sup') {
        //   const r = search[key].map((item) => `s${item}`)
        //   search[key] = r
        // }
        // 系统课转化
        if (key === 'user_status') {
          // 未转化
          if (search.user_status === 0) {
            search.user_status = { lte: 2 }
          }
          // 已购半年课
          if (search.user_status === 2) {
            search.user_status = { gte: 11, lte: 12 }
          }
          // 已购年课
          if (search.user_status === 3) {
            search.user_status = { gte: 5, lte: 7 }
          }
        }

        // user_label 标签
        if (key === 'user_label.like') {
          search['user_label.like'] = {
            'user_label.keyword': `*${search['user_label.like']}*`
          }
        }

        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        // delete this.searchQuery[key]
        this.$delete(this.searchQuery, key)
      }
      // 删除返回值没空数组的情况
      if (key !== 'user' && search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      // 学员手机号或学员编号
      if (key === 'user') {
        if (search.mobile && search.mobile.length === 0)
          this.$delete(this.searchQuery, 'mobile')
        if (search.user_num_text && search.user_num_text.length === 0)
          this.$delete(this.searchQuery, 'user_num_text')
        if (!search.mobile && !search.user_num_text) {
          this.$delete(this.searchQuery, 'mobile')
          this.$delete(this.searchQuery, 'user_num_text')
        }
      }
      // console.log(search, 'getSearchData')
      // console.log(this.searchQuery, 'this.searchQuery')
      this.$emit('search', this.searchQuery)
    },
    resetFilter() {
      this.nowDate = new Date().getTime()
      this.searchQuery = {}
    },
    handleClear() {
      this.resetFilter()
      // 同时清空高级筛选项
      this.$parent.$refs.sidebar.$refs.drawer.handelReset('ruleForm', true)
      this.$emit('search', {})
      this.$parent.$refs.sidebar.handleAdvancedSearch({})
    },
    changeTerm(val) {
      if (+val === 0) {
        this.term_trial = []
      } else {
        this.term_trial = [val]
      }
    },

    /**
     * 高级搜索
     */
    advancedSearch() {
      console.log(this.$parent.$refs.sidebar)
      this.$parent.$refs.sidebar.showDrawer = true
      this.$parent.$refs.sidebar.currentGroupType = 'ADVANCEDSEARCH'
      // this.$parent.$refs.sidebar.currentNode = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  font-size: 12px;
  .seat-div {
    margin-left: 20px;
    display: inline-block;
    visibility: hidden;
    button {
      display: inline-block;
    }
    p {
      display: inline-block;
      margin: 0 0 0 10px;
    }
  }
  .handle-area {
    position: absolute;
    right: 20px;
    bottom: 10px;
    p {
      margin: 0 0 0 10px;
      text-decoration: underline;
    }
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
      font-weight: 500;
    }
    .el-form--inline .el-form-item {
      margin-bottom: -10px;
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
</style>
