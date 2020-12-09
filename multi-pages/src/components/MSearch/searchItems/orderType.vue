<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 12:17:21
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 12:17:21
 * @Description: 订单类型：下拉选择，首单、续费两个维度 regtype: 2-首单，3-续费
-->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      placeholder="订单类型"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in orderTypeList"
        :key="item.id"
        :value="item.id"
        :label="item.text"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: null,
      orderTypeList: [
        {
          id: '2',
          text: '首单'
        },
        {
          id: '3',
          text: '续费'
        }
      ]
    }
  },
  methods: {
    onChange(item) {
      this.$emit('result', item ? { [this.name]: item } : '')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
