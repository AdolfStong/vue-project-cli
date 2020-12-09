<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 12:17:21
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 12:17:21
 * @Description: 系统课类型：月系统课-1、季系统课-2、半年系统课-3、年系统课-4、两年系统课
-->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      placeholder="全部系统课类型"
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
    teamType: {
      type: String
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: null,
      typeList: [
        // {
        //   id: '0',
        //   text: '体验课'
        // },
        {
          id: '1',
          text: '月系统课'
        },
        {
          id: '2',
          text: '季系统课'
        },
        {
          id: '3',
          text: '半年系统课'
        },
        {
          id: '4',
          text: '年系统课'
        },
        {
          id: '5',
          text: '两年系统课'
        }
      ]
    }
  },
  created() {
    if (this.teamType) {
      this.typeList.push({ id: '6', text: '系统课升级' })
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
