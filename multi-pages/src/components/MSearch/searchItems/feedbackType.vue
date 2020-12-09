<!--
 * @Author: shasen
 * @Email: shasen@meishubao.com
 * @Date: 2020-11-05 17:46:53
 * @Last Modified by:   shasen
 * @Last Modified time: 2020-11-05 17:46:53
 * @Description: 点评反馈
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      :multiple="isMultipe"
      placeholder="点评反馈"
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
          id: '0',
          text: '不满意'
        },
        {
          id: '1',
          text: '一般'
        },
        {
          id: '2',
          text: '满意'
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
