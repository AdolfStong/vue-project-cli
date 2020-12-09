<!--
 * @Descripttion:  小熊商城是5  推荐有礼是4 邀请有奖是 6  体验课是1  系统课是2，3
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-10 01:48:20
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
import axios from '@/api/axiosConfig'
export default {
  props: {
    name: {
      type: String,
      default: 'topicType'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pruductTopicList: [],
      topicData: null
    }
  },
  watch: {
    topicData(val) {
      console.log(val, 'newTopic')
    }
  },
  methods: {
    // 获取商品主题
    async getProductTopic() {
      axios
        .post('/graphql/filter', {
          query: `{
              productTopic{
                id
                name
              }
            }
          `
        })
        .then((res) => {
          res.data.productTopic.map((item) => {
            if (+item.id === 1) {
              item.id = '5'
              this.pruductTopicList.push(item)
            } else if (+item.id === 2) {
              item.id = '4'
              this.pruductTopicList.push(item)
            } else if (+item.id === 6) {
              item.id = '6'
              this.pruductTopicList.push(item)
            }
          })
          this.pruductTopicList.push({
            id: '-1',
            name: '关单赠品'
          })
        })
    },
    onChange(data) {
      console.log(data, 'data=======')
      if (data === '-1') {
        this.$emit('result', data ? { [this.name]: '6', source_type: '4' } : '')
        console.log('11111')
      } else {
        if (data === '6') {
          this.$emit(
            'result',
            data ? { [this.name]: '6', source_type: '0,1,2,3' } : ''
          )
        } else {
          this.$emit('result', data ? { [this.name]: data } : '')
        }
      }
      // this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  },
  mounted() {
    if (this.$store.getters.subjects.subjectCode === 1) {
      this.pruductTopicList = [
        { id: 5, name: '点点商城' },
        { id: 4, name: '推荐有礼' },
        { id: 6, name: '邀请有奖' }
      ]
    } else {
      this.getProductTopic()
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
