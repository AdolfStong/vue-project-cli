<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      :multiple="isMultipe"
      placeholder="商品类别"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in replenishProductTypeList"
        :key="item.value"
        :value="item"
        :label="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { replenishProductTypeList } from '@/utils/expressItemConfig'
export default {
  props: {
    replenishProductType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isMultipe: true,
      result: null,
      replenishProductTypeList: replenishProductTypeList
    }
  },
  methods: {
    onChange(items) {
      const productType = []
      const ids = []
      items.map((item) => {
        productType.push(item.value)
        ids.push(item.id)
      })
      this.$emit(
        'result',
        items ? { [this.replenishProductType]: productType, id: ids } : ''
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 120px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
