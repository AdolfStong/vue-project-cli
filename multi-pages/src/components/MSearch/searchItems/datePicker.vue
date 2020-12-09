<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:30:11
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-08 11:35:06
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
      :picker-options="pickerOptions"
      range-separator="至"
      :start-placeholder="`${startPlaceholder}`"
      :end-placeholder="`${endPlaceholder}`"
      align="right"
      @change="changeHandler"
    >
    </el-date-picker>
    <slot name="buttons"></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'octime'
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    }
  },
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date().getTime()
              const start = new Date(new Date().toLocaleDateString()).getTime()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end =
                new Date(new Date().toLocaleDateString()).getTime() - 1
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                24 * 60 * 60 * 1000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              var date = new Date()
              const end = new Date().getTime()
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                (date.getDay() - 1) * 86400000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const date = new Date()
              date.setDate(1)
              const end = new Date().getTime()
              const start = new Date(
                new Date(date).toLocaleDateString()
              ).getTime()
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: (res) => {
          // console.log(res, 'resdata')
          return false
        }
      },
      timeData: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    changeHandler(data, quick = false) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        this.$emit('result', { [this.name]: octime, quick })
        return
      }
      this.$emit('result', '')
    }
  },
  created() {
    this.$root.$on('fourpoint', (r) => {
      this.timeData = r
      this.changeHandler(r, true)
    })
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  .small {
    width: 380px !important;
  }
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
