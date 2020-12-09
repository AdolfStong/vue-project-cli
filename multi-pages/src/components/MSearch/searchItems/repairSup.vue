<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-29 18:47:14
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-23 16:20:09
 -->
<template>
  <div class="container">
    <el-select
      v-model="supDataInner"
      class="item-style"
      clearable
      size="mini"
      placeholder="选择难度"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
// import axios from '@/api/axiosConfig'
import { SUP_LEVEL_LIST, SUP_LEVEL_LIST_TRIAL } from '@/utils/supList'

export default {
  props: {
    supData: {
      type: String,
      default: ''
    },
    isTrial: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // supList: null,
      supDataInner: ''
    }
  },
  computed: {
    supList() {
      return this.isTrial ? SUP_LEVEL_LIST_TRIAL : SUP_LEVEL_LIST
    }
  },
  created() {
    // this.getSup()
    // this.supList = this.isTrial ? SUP_LEVEL_LIST_TRIAL : SUP_LEVEL_LIST
  },
  mounted() {
    this.$root.$on('qingkong', () => {
      this.supDataInner = ''
    })
  },
  methods: {
    // async getSup() {
    //   axios
    //     .post('/graphql/filter', {
    //       query: `{
    //         courseSupList{
    //             id
    //             name
    //           }
    //         }
    //       `
    //     })
    //     .then((res) => {
    //       const supList = res.data.courseSupList

    //       this.supList = supList.filter((item) => {
    //         return +item.id < 4 && +item.id > 0
    //       })
    //     })
    // },
    supChange(data) {
      console.log(data, 'data')
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 138px !important;
}
</style>
