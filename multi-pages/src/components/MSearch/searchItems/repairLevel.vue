<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-29 18:47:14
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-22 15:01:37
 -->
<template>
  <div class="container">
    <el-select
      v-model="levelDataInner"
      class="item-style"
      clearable
      size="mini"
      placeholder="选择级别"
      @change="levelChange"
    >
      <el-option
        v-for="item in levelList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'

export default {
  props: {
    levelData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      levelDataInner: null,
      levelList: null
    }
  },
  created() {
    this.getLevel()
  },
  mounted() {
    this.$root.$on('qingkong', () => {
      this.levelDataInner = ''
    })
  },
  methods: {
    async getLevel() {
      axios
        .post('/graphql/filter', {
          query: `{
              courseLevelList{
                id,
                name
              }
            }
          `
        })
        .then((res) => {
          this.levelList = res.data.courseLevelList
        })
    },
    levelChange(data) {
      console.log(data, 'data')
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 120px !important;
}
</style>
