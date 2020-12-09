<!--
 * @Descripttion: 带下拉快速选择时间按钮的时间选择组件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-28 10:06:51
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-13 22:03:19
-->
<template>
  <div class="search-item">
    <el-select
      size="mini"
      class="search-type"
      @change="handleChange"
      v-model="searchType"
      v-show="slectShow"
    >
      <el-option
        v-for="item in searchTypeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span class="dataText" v-show="!slectShow && labelText">
      {{ labelText }}</span
    >
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
      <!-- 自定义快捷操作 -->
      <slot name="quick-prev"></slot>
      <!-- 自定义快捷操作 END -->
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
    slectShow: {
      type: Boolean,
      default: true
    },
    // 没有下拉选择时，显示的labelText
    labelText: {
      type: String,
      default: '' // 参课时间
    },
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
    },
    /**
     * 给组件传默认参数时，默认选中快捷按钮，需要调用对应的方法
     * quickBtn的值
     */
    defaultQuickBtn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchType: 'join',
      searchTypeList: [
        {
          value: 'join',
          label: '参课时间'
        },
        {
          value: 'over',
          label: '完课时间'
        }
      ],
      timeData: [],
      currentBtn: this.defaultQuickBtn || null
    }
  },
  watch: {
    timeData(val) {
      this.currentBtn = null
      this.changeHandler(val)
    }
  },
  created() {
    // 设置默认quickBtn时
    if (this.defaultQuickBtn && this.quickBtn.includes(this.defaultQuickBtn)) {
      this.quickHandle(this.defaultQuickBtn)
    }
  },
  methods: {
    handleChange() {
      console.log('测试完成')
      this.timeData = ''
      // this.$emit('result', '')
    },
    //  选择时间
    changeHandler(data) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        // this.$emit('result', { [this.searchType]: octime })
        // 如果有下拉选项，根据下拉选择值返回。没有就name返回
        if (this.slectShow) {
          this.$emit('result', { [this.searchType]: octime })
        } else {
          this.$emit('result', { [this.name]: octime })
        }
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
.dataText {
  color: #dcdfe6;
  text-align: center;
  background: white;
  width: 70px;
  margin-right: 10px;
  // border: 1px solid #dcdfe6;
  height: 26px;
  line-height: 26px;
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
