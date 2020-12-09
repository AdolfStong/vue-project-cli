<!--
 * @Author: zhouzebin
 * @Email: zhouzebin@meishubao.com
 * @Date: 2020-05-13 17:46:53
 * @Last Modified by:   zhouzebin
 * @Last Modified time: 2020-05-13 17:46:53
 * @Description: 物流类型
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      :multiple="isMultipe"
      placeholder="物流类型"
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
      isMultipe: false,
      result: null,
      typeList: [
        {
          id: '1',
          text: '体验课补发'
        },
        {
          id: '2,3',
          text: '系统课补发'
        },
        {
          id: '4,5,6',
          text: '活动商品补发'
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
