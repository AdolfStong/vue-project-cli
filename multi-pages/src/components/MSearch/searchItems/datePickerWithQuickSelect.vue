<!--
 * @Descripttion: 带快速选择时间按钮的时间选择组件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-28 10:06:51
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-28 11:48:16
-->
<template>
  <div class="search-item">
    <el-date-picker
      class="small"
      size="mini"
      v-model="timeData"
      :default-time="['00:00:00', '23:59:59']"
      value-format="timestamp"
      type="datetimerange"
      prefix-icon="none"
      range-separator="至"
      :start-placeholder="`${startPlaceholder}`"
      :end-placeholder="`${endPlaceholder}`"
      align="right"
    ></el-date-picker>
    <!-- @change="changeHandler" -->
    <div class="quick-btn-group">
      <el-button
        size="mini"
        plain
        :class="{ 'current-btn': currentBtn === 'day' }"
        @click="quickHandle('day')"
        v-if="quickBtn.includes('day')"
        >今日</el-button
      >
      <el-button
        size="mini"
        plain
        :class="{ 'current-btn': currentBtn === 'yesterday' }"
        @click="quickHandle('yesterday')"
        v-if="quickBtn.includes('yesterday')"
        >昨天</el-button
      >
      <el-button
        size="mini"
        plain
        :class="{ 'current-btn': currentBtn === 'week' }"
        @click="quickHandle('week')"
        v-if="quickBtn.includes('week')"
        >本周</el-button
      >
      <el-button
        size="mini"
        plain
        :class="{ 'current-btn': currentBtn === 'month' }"
        @click="quickHandle('month')"
        v-if="quickBtn.includes('month')"
        >本月</el-button
      >
    </div>
    <!-- 其他 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'octime'
    },
    // 自定义返回一个对象。e.g. {startTime: 0, endTime: 0}
    // returnObject: {
    //   type: Array,
    //   default: () => []
    // },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    // 需求显示的快捷按钮 ['day', 'yesterday', 'week', 'month']
    quickBtn: {
      type: Array,
      default: () => ['day', 'yesterday', 'week', 'month']
    }
  },
  data() {
    return {
      timeData: [],
      currentBtn: null
    }
  },
  watch: {
    timeData(val) {
      this.currentBtn = null
      this.changeHandler(val)
    }
  },
  methods: {
    //  选择时间
    changeHandler(data) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        this.$emit('result', { [this.name]: octime })
        return
      }
      this.$emit('result', '')
    },
    /**
     * 快速选择时间段
     */
    quickHandle(type = 'day') {
      const now = new Date()
      let start
      let end
      if (type === 'day') {
        //   今天
        start = new Date(new Date().toLocaleDateString()).getTime() // 设定日期,时间默认0点
        end = Date.now()
      } else if (type === 'yesterday') {
        // 昨天
        now.setDate(new Date().getDate() - 1)
        now.toLocaleDateString()
        start = new Date(now.toLocaleDateString() + ' 00:00:00').valueOf()
        end = new Date(now.toLocaleDateString() + ' 23:59:59').valueOf()
      } else if (type === 'week') {
        //   本周
        const reverseDays = now.getDay() ? now.getDay() - 1 : 6
        start =
          new Date(now.toLocaleDateString()).getTime() - reverseDays * 86400000
        end = new Date().getTime()
      } else {
        //   本月
        now.setDate(1)
        start = new Date(new Date(now).toLocaleDateString()).getTime()
        end = end = new Date().getTime()
      }
      this.timeData = [start, end]
      this.$nextTick(() => {
        this.currentBtn = type
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  display: flex;
  align-items: center;
  .small {
    width: 330px !important;
  }
  .quick-btn-group {
    margin-left: 10px;
  }
}
.current-btn {
  background-color: #fff;
  border: 1px solid #2a75ed;
  color: #2a75ed;
}
</style>
<style lang="scss">
.search-item {
  .el-range__icon {
    display: none;
  }
  .el-range-input {
    width: 50%;
  }
  .el-range-separator {
    color: #c0c4cc;
  }
}
</style>
