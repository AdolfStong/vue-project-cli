<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-29 14:04:37
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-29 14:34:32
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="versionId"
      size="mini"
      clearable
      placeholder="商品类型"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="(item, i) in productVersion"
        :key="i"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productVersion: [
        { name: '课程随材', value: '0' },
        { name: '随材散件', value: '1' },
        { name: '关单赠品', value: '2' }
      ],
      versionId: null
    }
  },
  methods: {
    onChange(data) {
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 150px !important;
  }
}
</style>
