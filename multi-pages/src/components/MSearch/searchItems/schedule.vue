<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-28 17:20:57
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-autocomplete
        size="mini"
        name="vals"
        clearable
        class="inline-input"
        v-model="input"
        :fetch-suggestions="querySearch"
        :placeholder="tip"
        :trigger-on-focus="false"
        :popper-class="dataDetail ? 'ppName' : ''"
        @select="inputHandler"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div style="display:flex">
            <div class="name">{{ item.period_name || '-' }}</div>
          </div>
        </template></el-autocomplete
      >
    </el-form>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'
import { getAppSubjectCode } from '@/utils/index'
export default {
  props: {
    name: {
      type: String,
      default: 'id'
    },
    tip: {
      type: String,
      default: '排期'
    }
  },
  components: {},
  data() {
    return {
      input: '',
      dataDetail: [],
      type: '',
      subjectCode: '0'
    }
  },
  watch: {
    typeStage(val) {
      this.type = val
    },
    input(val, old) {
      console.log(val !== old && !val)
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      const reg = /^[0-9]+/
      if (!reg.test(queryString)) {
        this.input = ''
        return
      }
      const teamList = await this.createFilter(queryString)
      // 调用 callback 返回建议列表的数据
      cb(teamList)
    },

    createFilter(queryString) {
      const queryParams = {
        bool: {
          must: [
            { wildcard: { 'period_name.keyword': `*${queryString}*` } },
            { term: { subject: this.subjectCode } }
          ]
        }
      }
      if (this.type) {
        queryParams.bool.must.push({ term: { type: `${this.type}` } })
      }
      const q = JSON.stringify(queryParams)
      return axios
        .post('/graphql/v1/toss', {
          query: `{
                  ManagementListEx(query:${JSON.stringify(q)}){
                    id
                    period
                    period_name
                  }
                }`
        })
        .then((res) => {
          this.dataDetail = res.data.ManagementListEx
          return this.dataDetail
        })
    },
    inputHandler(data) {
      this.input = data.period_name
      this.$emit('result', { [this.name]: data.period })
    }
  },
  created() {
    this.subjectCode = getAppSubjectCode()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
<style lang="scss">
.ppName {
  width: 150px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 90%;
  }
}
</style>
