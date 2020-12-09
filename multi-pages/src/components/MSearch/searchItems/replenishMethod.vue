<template>
  <div>
    <el-select
      v-model="selectedInData"
      clearable
      size="mini"
      placeholder="补发方式"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in replenishMethodList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { replenishTypeList } from '@/utils/expressItemConfig'
export default {
  props: {
    sourceType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      selectedInData: null, // 下拉框选择内容
      replenishMethodList: replenishTypeList
    }
  },
  methods: {
    onChange(val) {
      this.$emit('result', { replenish_type: val })
    },
    onClear() {
      this.$emit('result', { replenish_type: '' })
    }
  },
  created() {}
}
</script>
