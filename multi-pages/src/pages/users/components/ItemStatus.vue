<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-21 22:16:32
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-21 22:16:32
 * @Description: 是否已加好友、已进群状态
 -->
<template>
  <span>
    <i
      v-if="type === '1'"
      class="icon-status"
      :class="{
        'el-icon-error': +row.added_wechat === 0,
        'el-icon-success': +row.added_wechat === 1
      }"
    ></i>
    <i
      v-if="type === '2'"
      class="icon-status"
      :class="{
        'el-icon-error': +row.added_group === 0,
        'el-icon-success': +row.added_group === 1
      }"
    ></i>
    <i
      v-if="type === '3'"
      class="icon-status"
      :class="{
        'el-icon-error': +row.follow === 0 || !row.follow,
        'el-icon-success': +row.follow === 1
      }"
    ></i>
  </span>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-status {
  font-size: 20px;
  &.el-icon-success {
    color: #42b983;
  }
  &.el-icon-error {
    color: rgb(151, 151, 151);
  }
}
</style>
