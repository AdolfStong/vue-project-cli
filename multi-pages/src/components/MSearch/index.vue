<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-14 15:43:58
 -->

<template>
  <el-card class="search-style" shadow="never">
    <el-form :inline="true">
      <el-form-item v-if="orderType">
        <!-- 订单类型 -->
        <order-type @result="getOrderType" :name="orderType" />
      </el-form-item>

      <el-form-item v-if="phone">
        <!-- 手机号搜索 -->
        <search-phone
          @result="getPhoneHander"
          :teamId="teamId"
          :teamType="teamType"
          :name="phone"
          :onlyPhone="onlyPhone"
          :tip="phoneTip"
          :last_team_id="last_team_id"
          ref="searchUserByPhone"
        />
      </el-form-item>

      <el-form-item v-if="productName">
        <!-- 商品名称搜索 -->
        <product-name @result="getProductName" :name="productName" />
      </el-form-item>

      <el-form-item v-if="outTradeNo">
        <!-- 订单号搜索 -->
        <out-trade-no @result="getOutTradeNo" :name="outTradeNo" />
      </el-form-item>

      <el-form-item v-if="consigneePhone">
        <consignee-phone @result="getConsigneePhone" />
      </el-form-item>

      <el-form-item v-if="expressNo">
        <!-- 物流单号搜索 -->
        <express-no @result="getExpressNo" :name="expressNo" />
      </el-form-item>

      <el-form-item v-if="date">
        <!-- 下单时间 -->
        <date-picker
          :name="date"
          @result="getDate"
          :date-placeholder="datePlaceholder"
        />
      </el-form-item>

      <el-form-item v-if="timeData">
        <!-- 下拉时间选择 -->
        <select-date
          :name="timeData"
          @result="getTimeData"
          @timeCallBack="getTimeCallBack"
        />
      </el-form-item>

      <el-form-item v-if="channel">
        <!-- 渠道 -->
        <channel-select @result="getChannel" :name="channel" ref="channel" />
      </el-form-item>

      <el-form-item v-if="topicType">
        <!-- 主题 -->
        <product-topic @result="getProductTopic" :name="topicType" />
      </el-form-item>

      <el-form-item v-if="productTypeNew">
        <!-- 物流类别 -->
        <product-typelog @result="getProductTypelog" :name="productTypeNew" />
      </el-form-item>

      <el-form-item v-if="moreVersion">
        <!-- 随材版本-->
        <more-version-box @result="getVersionNu" :name="moreVersion" />
      </el-form-item>

      <el-form-item v-if="selectAddress">
        <selectAddress @getAddress="getAddress" :name="selectAddress" />
      </el-form-item>

      <el-form-item v-if="level || sup || stage">
        <stage-sup-levels
          v-if="this.$store.getters.subjects.subjectCode === 0"
          @stageCallBack="stageCallBack"
          @supCallBack="supCallBack"
          @levelCallBack="levelCallBack"
          :disabled="true"
          :stageName="stage"
          :supName="sup"
          :levelName="level"
          :addSupS="addSupS"
          :supPlaceholder="supPlaceholder"
          style="margin-bottom:0px"
        />
        <hard-write-level
          v-if="this.$store.getters.subjects.subjectCode === 1"
          :subType="tab"
          :class="['margin_l10']"
          placeholder="难度"
          style="width:140px"
          name="sup"
          @result="supCallBack"
        />
      </el-form-item>

      <el-form-item v-if="schedule">
        <!-- 排期 -->
        <Schedule @result="selectSchedule" :name="schedule" />
      </el-form-item>

      <el-form-item v-if="teamDetail">
        <!-- 班级期数-->
        <team-detail @result="getTeamDetail" :name="teamDetail" />
      </el-form-item>

      <el-form-item v-if="systemCourseType">
        <!-- 系统课类型 -->
        <system-course-type
          @result="getSystemCourseType"
          :name="systemCourseType"
        />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="department && !teacherId">
        <!-- 社群销售组 -->
        <department @result="getDepartment" :name="department" />
      </el-form-item>

      <el-form-item v-if="groupSell">
        <!-- 社群销售 -->
        <group-sell
          @result="selectSellTeacher"
          :tip="teacherTip"
          :name="groupSell"
        />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="searchTeamName">
        <!-- 班级名称搜索 -->
        <search-team-name @result="getTeamName" :name="searchTeamName" />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="searchTrialTeamName">
        <!-- 体验课班级名称搜索 -->
        <search-trial-team-name
          @result="getTrialTeamName"
          :name="searchTrialTeamName"
        />
      </el-form-item>

      <el-form-item v-if="searchStage">
        <!-- 系统课排期搜索 -->
        <search-stage @result="getSearchStage" :name="searchStage" />
      </el-form-item>

      <el-form-item v-if="searchTrialStage">
        <!-- 体验课排期搜索 -->
        <search-stage
          @result="getSearchTrialStage"
          :name="searchTrialStage"
          type="0"
        />
      </el-form-item>

      <el-form-item v-if="searchCourseware">
        <!-- 系统课名称搜索 -->
        <search-courseware
          @result="getSearchCourseware"
          :name="searchCourseware"
          type="0"
        />
      </el-form-item>

      <el-form-item v-if="productType">
        <product-type
          :name="productType"
          :multiple="productTypemultiple"
          @result="getProductType"
        />
      </el-form-item>
      <!-- 补发原因 -->
      <el-form-item v-if="replenishReason">
        <replenish-reason @result="getReplenishReason" />
      </el-form-item>
      <!-- 补发方式 -->
      <el-form-item v-if="replenishMethod">
        <replenish-method
          @result="getReplenishMethod"
          :sourceType="sourceType"
        />
      </el-form-item>
      <!-- 随材版本 -->
      <el-form-item v-show="showVersion">
        <more-version-box
          @result="getVersionNu2"
          name="product_version.keyword"
        />
      </el-form-item>
      <!-- 物流类型 -->
      <el-form-item v-if="regType">
        <express-type @result="getExpressType" name="regType" />
      </el-form-item>
      <!-- 点评反馈 -->
      <el-form-item v-if="feedbackType">
        <feedback-type @result="getFeedbackType" name="feedback_type" />
      </el-form-item>

      <el-form-item v-if="replenishProductType">
        <replenish-product-type
          @result="getReplenishProductType"
          :replenishProductType="replenishProductType"
        />
      </el-form-item>
      <!-- 补发商品 -->
      <el-form-item v-if="replenishProduct">
        <replenish-product
          :replenishProduct="replenishProduct"
          @result="getReplenishProduct"
          :replenishType="ExpressReplenishType"
        />
      </el-form-item>
      <!-- 申请人 -->
      <el-form-item v-if="operatorId">
        <operator-name @result="gerOperatorName" :name="operatorId" />
      </el-form-item>
      <el-form-item>
        <slot></slot>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import DatePicker from './searchItems/datePicker.vue'
import ChannelSelect from './searchItems/channel.vue'
import ProductTopic from './searchItems/productTopic.vue'
import ProductTypelog from './searchItems/productTypelog.vue'
import StageSupLevels from './searchItems/stageSupLevels.vue'
import hardWriteLevel from './searchItems/hardWriteLevel.vue'
import SearchPhone from './searchItems/searchPhone.vue'
import OutTradeNo from './searchItems/outTradeNo.vue'
import ProductName from './searchItems/productName.vue'
import SelectDate from './searchItems/selectDate.vue'
import ExpressNo from './searchItems/expressNo'
import GroupSell from './searchItems/groupSell'
import TeamDetail from './searchItems/teamDetail'
import MoreVersionBox from './searchItems/moreVersionBox'
import OrderType from './searchItems/orderType'
import ConsigneePhone from './searchItems/consigneePhone.vue'
import SystemCourseType from './searchItems/systemCourseType'
import Department from './searchItems/department'
import SearchTeamName from './searchItems/searchTeamName'
import SearchTrialTeamName from './searchItems/searchTrialTeamName'
import Schedule from './searchItems/schedule'
import SearchStage from './searchItems/searchStage'
import SearchCourseware from './searchItems/searchCourseware'
import ProductType from './searchItems/productType'
import operatorName from './searchItems/operatorName'
import selectAddress from './searchItems/selectAddress.vue'
import replenishReason from './searchItems/replenishReason.vue'
import replenishMethod from './searchItems/replenishMethod.vue'
import replenishProduct from './searchItems/replenishProduct'
import replenishProductType from './searchItems/replenishProductType'
import expressType from './searchItems/expressType'
import feedbackType from './searchItems/feedbackType'

import { isToss } from '@/utils/index'

export default {
  props: {
    // 物流体验课0 系统课1
    tab: {
      type: String,
      default: '' // tab
    },
    // 商品类型
    productType: {
      type: String,
      default: '' // hasaddress
    },
    productTypemultiple: {
      type: Boolean,
      default: false // hasaddress
    },
    // 有无收货地址
    hasaddress: {
      type: String,
      default: '' // hasaddress
    },
    changeData: {
      type: String,
      default: '' // hasaddress
    },
    // 渠道
    channel: {
      type: String,
      default: '' // channelid
    },
    // 主题
    topicType: {
      type: String,
      default: '' // topicType
    },
    // 物流类别
    productTypeNew: {
      type: String,
      default: ''
    },
    teacherTip: {
      type: String,
      default: '社群销售' // topicType
    },
    // 期数
    stage: {
      type: String,
      default: '' // stage
    },
    // 排期
    schedule: {
      type: String,
      default: '' // schedule
    },
    // 难度
    sup: {
      type: String,
      default: '' // sup
    },
    addSupS: {
      type: Boolean,
      default: false // sup+S ?
    },
    // 级别
    level: {
      type: String,
      default: '' // current_level
    },
    // 下单时间
    date: {
      type: String,
      default: '' // octime
    },
    // datepicker placeholder
    datePlaceholder: {
      type: String,
      default: '下单时间'
    },
    // 班级内搜索 需要班级类型
    teamType: {
      type: String,
      default: '' // 0
    },

    // 手机号
    phone: {
      type: String,
      default: '' // phone
    },
    // 是否只搜手机号
    onlyPhone: {
      type: String,
      default: '0' // 0
    },
    // 是否只搜手机号
    phoneTip: {
      type: String,
      default: '用户手机号查询'
    },
    // team_id
    teamId: {
      type: String,
      default: ''
    },
    // 查询班级  搜到用户的最后一个班
    last_team_id: {
      type: String,
      default: ''
    },
    // 订单号
    outTradeNo: {
      type: String,
      default: '' // out_trade_no
    },
    // 收货人电话
    consigneePhone: {
      type: String,
      default: ''
    },
    // 商品名称
    productName: {
      type: String,
      default: '' // product_name
    },
    // 下拉时间选择
    timeData: {
      type: Array,
      default: null // [ {text:'创建时间',value:'ectime'}]
    },
    // 物流单号查询
    expressNo: {
      type: String,
      default: '' // express_nu
    },
    // 社群销售查询
    groupSell: {
      type: String,
      default: '' //
    },
    // 班级信息查询
    teamDetail: {
      type: String,
      default: '' //
    },
    moreVersion: {
      type: String,
      default: '' //
    },
    orderType: {
      type: String,
      default: ''
    },
    systemCourseType: {
      type: String,
      default: ''
    },
    // 销售部门
    department: {
      type: String,
      default: ''
    },
    // 搜索系统课班级名称
    searchTeamName: {
      type: String,
      default: ''
    },
    // 搜索体验课班级名称
    searchTrialTeamName: {
      type: String,
      default: ''
    },
    // 系统课排期
    searchStage: {
      type: String,
      default: ''
    },
    // 体验课排期
    searchTrialStage: {
      type: String,
      default: ''
    },
    // 难度 placeholder
    supPlaceholder: {
      type: String,
      default: '难度'
    },
    // 系统课名称
    searchCourseware: {
      type: String,
      default: ''
    },
    // 是否关联老师搜索
    selectAddress: {
      type: String,
      default: '' // selectAddress
    },
    // 补发原因
    replenishReason: {
      type: String,
      default: ''
    },
    // 补发方式
    replenishMethod: {
      type: String,
      default: ''
    },
    // 物流方式
    regType: {
      type: String,
      default: ''
    },
    // 申请人
    operatorId: {
      type: String,
      default: ''
    },
    // 5 代表活动课物流补发货
    sourceType: {
      type: String,
      default: ''
    },
    // 活动课补发商品
    replenishProduct: {
      type: String,
      default: ''
    },
    // 补发商品类别
    replenishProductType: {
      type: String,
      default: ''
    },
    // 点评反馈
    feedbackType: {
      type: String,
      default: ''
    }
  },
  components: {
    ChannelSelect,
    ProductTopic,
    ProductTypelog,
    StageSupLevels,
    DatePicker,
    SearchPhone,
    SelectDate,
    OutTradeNo,
    ProductName,
    ExpressNo,
    GroupSell,
    TeamDetail,
    MoreVersionBox,
    OrderType,
    SystemCourseType,
    Department,
    SearchTeamName,
    SearchTrialTeamName,
    Schedule,
    SearchStage,
    SearchCourseware,
    ProductType,
    replenishProduct,
    selectAddress,
    ConsigneePhone,
    replenishReason,
    replenishMethod,
    operatorName,
    replenishProductType,
    expressType,
    feedbackType,
    hardWriteLevel
  },
  data() {
    return {
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      teacherId: '', // 判断是否是toss环境还是boss环境
      ExpressReplenishType: '', // 活动课 补发货 补发商品 筛选id
      showVersion: false
    }
  },
  computed: {},
  methods: {
    // 选择商品来源
    getProductType(res) {
      this.setSeachParmas(res, [this.productType || 'regtype'], 'terms')
    },
    // 选择渠道
    getChannel(res) {
      this.setSeachParmas(res, [this.channel || 'channelid'], 'terms')
    },
    // 主题
    getProductTopic(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.topicType || 'topicType'])
    },
    // 物流类别
    getProductTypelog(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.productTypeNew || 'productType'])
    },
    // 期数
    stageCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.stage || 'stage'], 'terms')
    },
    // 排期
    selectSchedule(res) {
      this.setSeachParmas(res, [this.schedule || 'id'])
    },
    // 难度
    supCallBack(res) {
      // debugger
      this.setSeachParmas(res, [this.sup || 'sup'], 'terms')
    },
    // 级别
    levelCallBack(res) {
      this.setSeachParmas(res, [this.level || 'current_level'], 'terms')
    },
    // 选择订单下单时间
    getDate(res) {
      this.setSeachParmas(res, [this.date || 'octime'], 'range')
    },
    // 选择手机号
    getPhoneHander(res) {
      console.log(res, '回调res') // 得到uid
      this.setSeachParmas(res, [this.phone || 'umobile'])
    },
    // 选择订单号
    getOutTradeNo(res) {
      this.setSeachParmas(res, [this.outTradeNo || 'out_trade_no'], 'wildcard')
    },
    // 收货人电话
    getConsigneePhone(res) {
      this.setSeachParmas(res, [this.consigneePhone || 'receipt_tel'])
    },
    // 选择商品名
    getProductName(res) {
      this.setSeachParmas(res, [this.productName || 'product_name'])
    },
    // 选择地址
    getAddress(res) {
      this.setSeachParmas(res, [this.selectAddress])
    },
    // 获取下拉时间选择select
    getTimeCallBack(data) {
      if (data) {
        this.selectTime = data
      } else {
        this.oldTime = data
      }
    },
    // 物流时间
    getTimeData(res) {
      this.setSeachParmas(res, [this.selectTime || this.oldTime], 'range')
    },
    // 选择物流单号
    getExpressNo(res) {
      this.setSeachParmas(res, [this.expressNo || 'express_nu'], 'wildcard')
    },
    // 选择销售老师
    selectSellTeacher(res) {
      this.setSeachParmas(res, [this.groupSell || 'pay_teacher_id'])
    },
    getTeamDetail(res) {
      this.setSeachParmas(res, [this.teamDetail || 'last_team_id'])
    },
    getVersionNu(res) {
      this.setSeachParmas(res, [this.moreVersion || 'product_version'])
    },
    getVersionNu2(res) {
      this.setSeachParmas(res, [this.moreVersion || 'product_version.keyword'])
    },
    getOrderType(res) {
      this.setSeachParmas(res, [this.orderType || 'regtype'])
    },
    getSystemCourseType(res) {
      this.setSeachParmas(res, [this.systemCourseType || 'system_course_type'])
    },
    getDepartment(res) {
      this.setSeachParmas(res, [this.department || 'department'], 'terms')
    },
    getTeamName(res) {
      this.setSeachParmas(res, [this.searchTeamName || 'team_name'], 'terms')
    },
    getTrialTeamName(res) {
      this.setSeachParmas(
        res,
        [this.searchTrialTeamName || 'team_trial_name'],
        'terms'
      )
    },
    getSearchStage(res) {
      this.setSeachParmas(res, [this.searchStage || 'stage'], 'terms')
    },
    getSearchTrialStage(res) {
      this.setSeachParmas(
        res,
        [this.searchTrialStage || 'trial_stage'],
        'terms'
      )
    },
    getSearchCourseware(res) {
      this.setSeachParmas(res, [this.searchTrialStage || 'course_id'], 'terms')
    },
    getReplenishReason(res) {
      this.setSeachParmas(res, [this.replenishReason || 'replenish_reason'])
    },
    getReplenishMethod(res) {
      if (res && res.replenish_type === '0') {
        this.showVersion = true
      } else {
        this.showVersion = false
      }
      this.setSeachParmas(res, [this.replenishMethod || 'replenish_type'])
    },
    getExpressType(res) {
      this.setSeachParmas(res, [this.regType || 'regType'])
    },
    getFeedbackType(res) {
      this.setSeachParmas(res, [this.feedback || 'feedback_type'])
    },
    gerOperatorName(res) {
      this.setSeachParmas(res, [this.operatorId])
    },
    getReplenishProduct(res) {
      this.setSeachParmas(res, [this.replenishProduct || 'product_type'])
    },
    getReplenishProductType(res) {
      this.ExpressReplenishType = res.id.join(',')
      this.setSeachParmas(
        { [this.replenishProductType]: res[this.replenishProductType] },
        [this.replenishProductType || 'product_type']
      )
    },

    /**  处理接收到的查询参数
     * @res: Object, 子筛选组件返回的表达式对象，如 {sup: 2}
     * @key: Array 指定res的key。如课程类型+期数选项，清除课程类型时，期数也清除了，这里要同步清除must的数据
     * @extraKey: String 默认must数组的每项值为 {term: {}}, 如果不为 term，单独指定
     * 如 {range: {lte:0,gte:0}} -> 'range'
     * @name: String 结果放到上层表达式中的位置，默认must. 可指定 should
     */
    setSeachParmas(res, key = [], extraKey = 'term', name = 'must') {
      const { must, should } = this
      const temp = name === 'must' ? must : should
      key.forEach((k) => {
        temp.forEach((item, index) => {
          if (
            item[extraKey] &&
            item[extraKey][k] &&
            (item[extraKey][k] || +item[extraKey][k] === 0)
          )
            temp.splice(index, 1)
        })
      })
      // must
      if (name === 'must') {
        console.log(res, 'res==')
        if (res) {
          if (
            this.selectAddress &&
            Object.keys(res).includes('provincesCode')
          ) {
            temp.push({
              [extraKey]: { [`${this.selectAddress}`]: res }
            })
          } else {
            temp.push({
              [extraKey]: res
            })
          }

          this.must = temp
        }
        // this.$emit('search', res === '' ? '' : temp)
        console.log(temp, 'temp==')
        this.$emit('search', temp)
        return
      }
      // should
      if (res) {
        temp.push({
          [`${extraKey}`]: `${JSON.stringify(res)}`
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  }
}
</script>
<style lang="scss" scoped>
.search-style {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.search-style {
  .el-card__body {
    padding: 0px 10px 0px 10px;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
