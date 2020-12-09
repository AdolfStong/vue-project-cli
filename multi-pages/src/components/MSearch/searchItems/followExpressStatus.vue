<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 14:16:21
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-20 14:16:21
 * @Description: 物流状态 - 随材物流状态
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="express_status"
      @change="onChange"
      clearable
      multiple
      :placeholder="placeholder"
      :style="myStyle"
      size="mini"
      class="item-style"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { FOLLOW_EXPRESS_STATUS_LIST } from '@/utils/enums'
export default {
  props: {
    name: {
      type: String,
      default: 'express_status'
    },
    placeholder: {
      type: String,
      default: '随材物流状态'
    },
    // 自定义style样式
    myStyle: {
      type: Object,
      default: () => {}
    },
    searchProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      express_status: [],
      dataList: FOLLOW_EXPRESS_STATUS_LIST
    }
  },
  methods: {
    onChange(data) {
      const exp = '4,5,7,8'
      let res = data
      // 包含异常物流的情况  '4,5,7,8'
      if (data.includes(exp)) {
        const arr = data.filter((item, index) => item !== exp)
        const expArr = exp.split(',')
        res = arr.concat(expArr)
      }
      this.$emit('result', res.length > 0 ? { [this.name]: res } : '')
    }
  },
  // lk
  created() {
    if (this.name === 'expressstatus') {
      this.$root.$on('expressstatus_lk', (r) => {
        console.info(r)
        this.express_status = ['' + r] // 要求是多选数组成员string(这是select multiple)
      })
    }
    if (this.searchProp && this.name === this.searchProp.name) {
      // 本期只会有一个值不会有多个值的情况
      this.express_status.push(this.searchProp.value + '')
      this.onChange(this.searchProp.value + '')
      setTimeout(() => {
        localStorage.removeItem('noticeParams')
      }, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  .item-style {
    width: 140px;
  }
}
</style>
