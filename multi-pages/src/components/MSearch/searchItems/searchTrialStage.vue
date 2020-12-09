<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-25 14:26:01
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-25 14:26:01
 * @Description: 体验课排期
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="stage"
      multiple
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="type === '1' ? '系统课排期' : '体验课排期'"
      :remote-method="handleDebounce"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.period_name"
        :value="item.period"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 1-系统课，0-体验课
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      loading: false,
      stage: '',
      dataList: []
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(queryString = '') {
      this.loading = true
      const queryParams = {
        bool: {
          must: [
            { wildcard: { 'period_name.keyword': `*${queryString}*` } },
            { term: { subject: this.$store.getters.subjects.subjectCode } }
          ]
        }
      }
      if (this.type) {
        queryParams.bool.must.push({ term: { type: `${this.type}` } })
      }
      const q = JSON.stringify(queryParams)
      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  ManagementListEx(query:${JSON.stringify(
                    q
                  )}, sort: ${JSON.stringify(sort)}){
                    id
                    period
                    period_name
                  }
                }`
        })
        .then((res) => {
          this.loading = false
          this.dataList = res.data.ManagementListEx
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取选中的
    onChange(data) {
      this.$emit('result', data.length > 0 ? { [this.name]: data } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
