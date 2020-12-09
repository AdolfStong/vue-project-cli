<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-28 19:06:33
 -->
<template>
  <div class="search-item small">
    <el-input
      placeholder="订单号查询"
      size="mini"
      v-model="input"
      clearable
      @input="handleDebounce"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
    </el-input>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    name: {
      type: String,
      default: 'out_trade_no'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      input: ''
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.inputHandler, 500)
    }
  },
  watch: {
    input(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    inputHandler(data) {
      const reg = /^[0-9]*$/
      if (!reg.test(data)) {
        this.input = ''
        return
      }
      // 模糊搜索
      this.$emit('result', data ? { [this.name]: `*${this.input}*` } : '')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 135px !important;
  }
}
</style>
