<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-29 15:33:10
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-29 15:49:11
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      placeholder="物流状态"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in typeList"
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
      typeList: [
        {
          id: 0,
          text: '无地址'
        },
        {
          id: 1,
          text: '待发货'
        },
        {
          id: 2,
          text: '已发货'
        },
        {
          id: 3,
          text: '已签收'
        },
        {
          id: 4,
          text: '签收失败'
        },
        {
          id: 5,
          text: '已退货'
        },
        {
          id: 6,
          text: '确认待发货'
        },
        {
          id: 7,
          text: '无效'
        },
        {
          id: 8,
          text: '疑难'
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
