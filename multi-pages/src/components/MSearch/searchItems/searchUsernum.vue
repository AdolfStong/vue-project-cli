<template>
  <div class="">
    <el-select
      v-model="value"
      filterable
      remote
      clearable
      reserve-keyword
      size="mini"
      placeholder="ID搜索"
      :remote-method="handleDebounce"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.user_num_text"
        :value="item.user_num_text"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  name: 'searchUsernum',
  props: {
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      value: '',
      loading: true,
      dataList: []
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  methods: {
    getData(value = '') {
      if (!value) return
      const val = value.replace(/\s*/g, '')
      this.loading = true
      const query = { user_status: { gt: 0 } }
      Object.assign(query, {
        'user_num_text.like': { 'user_num_text.keyword': `*${val}*` }
      })
      const q = JSON.stringify(query)
      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
            StudentTrialV2StatisticsList(query: ${JSON.stringify(
              q
            )}, sort: ${JSON.stringify(sort)}){
              id
              user_num_text
              mobile
            }
          }`
        })
        .then((res) => {
          this.loading = false
          this.dataList = res.data.StudentTrialV2StatisticsList
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(data) {
      // console.log(data)
      this.$emit(
        'result',
        data ? { user_num_text: data } : { user_num_text: '' }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
