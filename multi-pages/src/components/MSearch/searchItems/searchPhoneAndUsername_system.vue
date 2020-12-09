<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-22 20:07:47
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-22 20:07:47
 * @Description: 模糊搜索用户手机号和用户名称 username
 * 通过 u_user表中的 status 区分体验课用户和系统课用户
    status = 1 或 status = 2, 体验课
    status > 2, 体验课
 -->
<template>
  <div class="search-item small">
    <el-select
      class="item-style"
      :style="customStyle"
      v-model="value"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="placeholder"
      :remote-method="handleDebounce"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="(item, index) in dataList"
        :key="index"
        :label="`${item.mobile}/${item.username}`"
        :value="item.studentid"
      ></el-option>
    </el-select>
    <i class="el-icon-search"></i>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  props: {
    customStyle: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    // 1-系统课，0-体验课 2-全部
    type: {
      type: String,
      default: '0'
    },
    placeholder: {
      type: String,
      default: '请输入学员手机号或昵称'
    },
    // 默认搜索u_user表。特殊情况传入对应graphql表, 如体验课学员列表：‘StudentTrialStatisticsList’
    tablename: {
      type: String,
      default: 'StudentSystemStatisticsListEx'
    },
    teacherId: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      value: '',
      dataList: []
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  created() {
    // this.getData()
  },
  methods: {
    getData(value = '') {
      if (!value) return
      const val = value.replace(/\s*/g, '')
      this.loading = true
      // 系统课
      const range = {
        range: { user_status: { gte: 2 } }
      }
      // // 体验课
      // if (this.type === '0') {
      //   range = { terms: { status: ['1', '2'] } }
      // }
      // // 全部
      // if (this.type === '2') {
      //   range = {
      //     range: { status: { gt: 0 } }
      //   }
      // }
      let _q, query
      if (this.teacherId.length) {
        _q = { terms: { teacherid: this.teacherId } }
        query = `{"bool":{"must":[${JSON.stringify(range)},${JSON.stringify(
          _q
        )}],"filter":{"bool":{"should":[{"wildcard":{"username.keyword":"*${val}*"}},{"wildcard":{"mobile.keyword":"*${val}*"}},{"wildcard":{"user_num_text.keyword":"*${val}*"}}]}}}}`
      } else {
        _q = ''
        query = `{"bool":{"must":[${JSON.stringify(
          range
        )}],"filter":{"bool":{"should":[{"wildcard":{"username.keyword":"*${val}*"}},{"wildcard":{"mobile.keyword":"*${val}*"}},{"wildcard":{"user_num_text.keyword":"*${val}*"}}]}}}}`
      }
      const q = JSON.stringify(query)

      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  ${this.tablename}(query: ${q}, sort: ${JSON.stringify(sort)}){
                    username
                    mobile
                    user_num_text
                    studentid
                  }
                }`
        })
        .then((res) => {
          this.loading = false
          this.dataList = res.data[`${this.tablename}`]
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取选中的
    onChange(data) {
      console.log(data, '=-=-=-=-=-=-=-=')
      this.$emit('result', data ? { [this.name]: data } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  position: relative;
  .item-style {
    width: 140px;
    /deep/ input {
      padding-left: 25px;
    }
  }
  i {
    position: absolute;
    left: 10px;
    top: 7px;
    color: #999;
  }
}
</style>
