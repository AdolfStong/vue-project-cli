<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-09 16:18:29
 -->
<template>
  <div class="search-item">
    <el-select
      v-model="topicData"
      size="mini"
      clearable
      placeholder="全部类别"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in pruductTopicList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'productType'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pruductTopicList: [
        {
          id: '2',
          name: '小熊商城'
        },
        {
          id: '3',
          name: '推荐有奖'
        },
        {
          id: '4',
          name: '邀请有奖'
        },
        {
          id: '6',
          name: '关单赠品'
        },
        {
          id: '7',
          name: '转介绍'
        },
        {
          id: '9',
          name: '邀请有奖-抽奖'
        },
        {
          id: '10',
          name: '市场活动'
        }
      ],
      topicData: null
    }
  },
  watch: {
    topicData(val) {
      console.log(val, 'newTopic')
    }
  },
  methods: {
    onChange(data) {
      console.log(data, 'data--')
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 138px !important;
  }
}
</style>
