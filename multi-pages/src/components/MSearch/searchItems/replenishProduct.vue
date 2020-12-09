<template>
  <div>
    <el-select
      v-model="selectedInData"
      clearable
      size="mini"
      multiple
      :disabled="!replenishType"
      placeholder="补发商品"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in replenishProductList"
        :key="item.id"
        :label="item.desc"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    replenishType: {
      type: String,
      default: ''
    },
    replenishProduct: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedInData: null, // 下拉框选择内容
      replenishProductList: []
    }
  },
  methods: {
    onChange(val) {
      this.$emit('result', { [this.replenishProduct]: val })
    },
    onClear() {
      this.$emit('result', { [this.replenishProduct]: '' })
    }
  },
  watch: {
    replenishType(val) {
      if (!val) {
        this.selectedInData = ''
        this.$emit('result', { [this.replenishProductType]: '' })
      } else if (val) {
        this.$http.Express.getTopicRelationProduct({ topicIds: val }).then(
          (res) => {
            if (res.code === 0) {
              this.replenishProductList = res.payload
            }
          }
        )
      }
    }
  }
}
</script>
