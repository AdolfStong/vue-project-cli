<!--
 * @Descripttion: 选择时间段
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-15 16:16:01
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-23 21:39:16
-->
<template>
  <el-form-item :label="label" :label-width="innerFormLabelWidth" size="mini">
    <el-select
      v-model="datetime"
      placeholder="请选择"
      clearable
      class="w-100 mg-l-10"
      :style="customStyle"
      @change="changeDatetime"
    >
      <el-option
        v-for="item in dateList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      ></el-option>
    </el-select>
    <p v-if="customDateText" @click="dialogFormVisible = true">
      {{ customDateText }}
    </p>

    <el-dialog
      title="自定义时间"
      :modal="false"
      :visible.sync="dialogFormVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-date-picker
        v-model="customDate"
        type="datetimerange"
        range-separator="至"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="timestamp"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
      <p class="error" v-if="customDate.length === 0 && isSet">请设置时间</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="confirmSetDate">确 定</el-button>
      </div>
    </el-dialog>
  </el-form-item>
</template>

<script>
import dayjs from 'dayjs'
import { deepClone } from '@/utils/index'
export default {
  props: {
    label: String,
    name: String,
    // 当前选中项，用于编辑回显
    current: [String, Object],
    customStyle: {
      type: Object,
      default: () => ({ width: '110px' })
    }
  },
  computed: {
    // 根据传入的 current，判断时间类型。 如果是对象，则为自定义时间
    currentType() {
      if (Object.prototype.toString.call(this.current) === '[object Object]') {
        return 'custom'
      }
      return this.current
    }
  },
  data() {
    return {
      customDate: [],
      customDateClone: [],
      customDateText: '',
      dialogFormVisible: false,
      innerFormLabelWidth: '85px',
      exList: [
        {
          id: 'eq',
          text: '等于'
        }
      ],
      dateList: [
        {
          id: 'hour',
          text: '近1小时内'
        },
        {
          id: 'today',
          text: '当天'
        },
        {
          id: 'day',
          text: '近2天'
        },
        {
          id: 'custom',
          text: '自定义时间'
        }
      ],
      ex: 'eq',
      datetime: '',
      timeExpression: {},
      isSet: false
    }
  },
  mounted() {
    // 编辑回显
    this.datetime = this.currentType
    if (this.currentType === 'custom') {
      this.customDate = [this.current.gte, this.current.lte]
      this.customDateFormat()
    }
  },
  watch: {
    timeExpression(val, old) {
      if (val !== old) {
        this.$emit('result', { name: this.name, ex: val })
      }
    }
  },
  methods: {
    changeDatetime(val) {
      console.log(val)
      const { name } = this
      if (!val) {
        this.timeExpression = { [`${name}`]: '' }
        this.customDateText = ''
        this.customDate = []
        return
      }
      if (val !== 'custom') {
        this.timeExpression = { [`${name}`]: val }
        this.customDate = []
        this.customDateText = ''
      } else {
        this.dialogFormVisible = true
      }
      console.log(this.timeExpression)
    },
    confirmSetDate() {
      this.isSet = true
      if (this.customDate.length === 0) return
      this.dialogFormVisible = false
      this.customDateFormat()
      this.customDateClone = deepClone(this.customDate)
    },

    handleCancel() {
      this.dialogFormVisible = false
      this.isSet = false
      this.customDate = this.customDateClone
    },

    customDateFormat() {
      if (this.customDate.length > 0) {
        const start = dayjs
          .unix(this.customDate[0] / 1000)
          .format('YYYY-MM-DD HH:mm:ss')
        const end = dayjs
          .unix(this.customDate[1] / 1000)
          .format('YYYY-MM-DD HH:mm:ss')
        this.customDateText = `${start} 至 ${end}`

        // 自定义时返回对象
        this.timeExpression = {
          [`${this.name}`]: { gte: this.customDate[0], lte: this.customDate[1] }
        }
        return
      }
      this.customDateText = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.w-80 {
  width: 80px;
}
.w-100 {
  width: 100px;
}
.mg-l-10 {
  margin-left: 10px;
}
.error {
  font-size: 12px;
  color: #ff8b8c;
}
</style>
