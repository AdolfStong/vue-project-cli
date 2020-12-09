<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-28 19:30:08
 -->
<template>
  <div class="search-item small">
    <el-input
      placeholder="商品名称查询"
      size="mini"
      v-model="input"
      clearable
      @input="handleDebounce"
    >
    </el-input>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    name: {
      type: String,
      default: 'product_name'
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
      this.$emit('result', data ? { [this.name]: this.input } : '')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 160px !important;
  }
}
</style>
