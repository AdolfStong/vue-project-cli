<template>
  <div>
    <el-select
      v-model="selectedInData"
      clearable
      size="mini"
      multiple
      placeholder="补发原因"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in replenishReasonList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { replenishReasonSearchList } from '@/utils/expressItemConfig'
export default {
  data() {
    return {
      selectedInData: null, // 下拉框选择内容
      replenishReasonList: replenishReasonSearchList
    }
  },
  methods: {
    onChange(val) {
      this.$emit('result', { replenish_reason: val })
    },
    onClear() {
      this.$emit('result', { replenish_reason: '' })
    }
  },
  created() {},
  mounted() {}
}
</script>
