<!--
 * @Descripttion: 系统课学员搜索
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-27 18:43:42
 * @LastEditors: liukun
 * @LastEditTime: 2020-06-19 14:52:25
-->
<template>
  <div class="search-container">
    <el-card border="false" shadow="never">
      <div class="form">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-form-item label="课前准备:" class="search-group">
            <simple-select
              name="addedwechat"
              placeholder="是否添加微信"
              :multiple="false"
              :data-list="addedWechatStatus"
              @result="getSearchData('addedwechat', arguments)"
              class="search-group-item"
            />
            <simple-select
              name="addedgroup"
              placeholder="是否进群"
              :multiple="false"
              :data-list="addedGroupStatus"
              @result="getSearchData('addedgroup', arguments)"
              class="search-group-item"
            />
            <follow-express-status
              name="expressstatus"
              @result="getSearchData('expressstatus', arguments)"
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
            <el-input
              v-model="labelName"
              size="mini"
              placeholder="请输入标签名称"
              clearable
              @input="getLabelName"
            ></el-input>
          </el-form-item>
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
          <el-form-item label="招生排期:" class="search-group">
            <group-sell
              name="teacherid"
              tip="全部辅导老师"
              is-multiple
              @result="getSearchData('teacherid', arguments)"
              class="search-group-item"
            />
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
            <!-- // isRefund 1: '已退费'，2: '申请退费'，3: '退费中' -->
            <simple-select
              name="isrefund"
              placeholder="是否退费"
              :multiple="false"
              :data-list="refundStatus"
              @result="getSearchData('isrefund', arguments)"
              class="search-group-item"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="extra">
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
    </div>
  </div>
</template>

<script>
import FollowExpressStatus from '@/components/MSearch/searchItems/followExpressStatus.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import HardLevel from '@/components/MSearch/searchItems/hardLevel.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
// import DatePickerWithQuickSelect from '@/components/MSearch/searchItems/datePickerWithQuickSelect.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import enums from '../components/searchData'
import { deepClone } from '@/utils/index'
export default {
  components: {
    FollowExpressStatus,
    GroupSell,
    SearchStage,
    HardLevel,
    SearchPhoneAndUsername,
    // DatePickerWithQuickSelect,
    SimpleSelect
  },
  props: {
    // 班级类型： 0-体验课 1-系统课
    teamType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      labelName: '',
      ...enums,
      searchQuery: {},
      // 体验课未上传作品的值是 -1。这里单独拿出来写
      courseTaskStatusList: [
        {
          id: 1,
          text: '已上传作品'
        },
        {
          id: 0,
          text: '未上传作品'
        }
      ]
    }
  },
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      console.log(search)
      if (search) {
        if (key === 'currentsuper') {
          const r = search[key].map((item) => `s${item}`)
          search[key] = r
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
      }
      // 删除返回值为空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      console.log(search, 'getSearchData')
      console.log(this.searchQuery, 'this.searchQuery')
      this.$emit('search', this.searchQuery)
    },
    getLabelName(labelname) {
      if (labelname) {
        const obj = {
          'userlabel.like': { 'userlabel.keyword': `*${labelname}*` }
        }
        Object.assign(this.searchQuery, obj)
      } else {
        delete this.searchQuery['userlabel.like']
      }
      const query = deepClone(this.searchQuery)
      this.$emit('search', query)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: space-between;
  .el-card /deep/ {
    border: 0;
    .el-card__body {
      padding: 0 0 10px 0;
    }
  }
  .extra {
    padding: 10px 0;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // &-up {
    //   flex: 1;
    // }
    // &-down {
    //   flex: 1;
    // }
  }
}
.search-group-box {
  display: flex;
}
.search-group /deep/ {
  display: flex;
  margin-bottom: 0 !important;
  .el-form-item__content {
    display: flex;
    .search-group-item {
      margin-right: 10px;
    }
  }
}
.search-group.flt {
  float: left;
}
</style>
