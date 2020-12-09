<!--
 * @Descripttion: 搜索用户手机号(mobile)或者用户编号 (user_num)
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-22 12:08:17
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-11 14:51:37
-->
<template>
  <div class="search-mobile d-flex align-center">
    <el-select
      size="mini"
      class="search-type"
      @change="handleChange"
      v-model="searchType"
    >
      <el-option
        v-for="item in searchTypeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div class="search-item">
      <el-select
        class="item-style"
        :style="customStyle"
        v-model="value"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        :placeholder="placeholderText"
        :remote-method="handleDebounce"
        :loading="loading"
        @change="onChange"
      >
        <el-option
          v-for="item in dataList"
          :key="item.id"
          :label="`${item[name[searchType]]}`"
          :value="`${item[name[searchType]]}`"
        ></el-option>
      </el-select>
      <i class="el-icon-search"></i>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
import { injectSubject } from '@/utils/index'
export default {
  props: {
    customStyle: {
      type: Object,
      default: null
    },
    name: {
      type: Array,
      default: () => ['mobile', 'user_num_text']
    },
    // 1-系统课，0-体验课 2-全部
    type: {
      type: String,
      default: '0'
    },
    placeholder: {
      type: Array,
      default: () => ['输入学员手机号', '输入学员ID']
    },
    // 默认搜索u_user表。特殊情况传入对应graphql表, 如体验课学员列表：‘StudentTrialStatisticsList’，
    // 多科目全部学员-UserSubjectStatisticsList
    tablename: {
      type: String,
      default: 'UserListEx'
    },
    userNumKey: {
      type: String,
      default: 'user_num_text'
    }
  },
  data() {
    return {
      loading: false,
      value: '',
      searchType: 0,
      searchTypeList: [
        {
          value: 0,
          label: '学员手机号'
        },
        {
          value: 1,
          label: '学员ID'
        }
      ],
      dataList: []
    }
  },
  computed: {
    placeholderText() {
      return this.placeholder[this.searchType]
    },
    nameKey() {
      return this.name[this.searchType]
    },
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  created() {
    // this.getData()
  },
  methods: {
    handleChange() {
      this.value = ''
      this.$emit('result', '')
    },
    getData(value = '') {
      if (!value) return
      const val = value.replace(/\s*/g, '')
      this.loading = true
      // let range = {
      //   // user_status: { gte: 2 }
      //   user_status: { gt: 0 }
      // }
      // // 系统课
      // if (this.type === '1') {
      //   range = {
      //     user_status: { gte: 2 }
      //   }
      // }
      // // 体验课
      // if (this.type === '0') {
      //   range = { user_status: ['1', '2'] }
      // }
      // 全部
      // if (this.type === '2') {
      //   range = {
      //     user_status: { gt: 0 }
      //   }
      // }
      // const query = { ...range }
      const query = {}
      //   const query = {}
      if (this.searchType === 0) {
        Object.assign(query, {
          'mobile.like': { 'mobile.keyword': `*${val}*` }
        })
      } else {
        Object.assign(query, {
          [`${this.userNumKey}.like`]: {
            [`${this.userNumKey}.keyword`]: `*${val}*`
          }
        })
      }
      const q = JSON.stringify(query)

      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  ${this.tablename}(query: ${JSON.stringify(
            injectSubject(q)
          )}, sort: ${JSON.stringify(sort)}){
                    id
                    user_num_text
                    mobile
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
      console.log(data)
      this.$emit('result', data ? { [this.nameKey]: data } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-type {
  width: 110px;
  ::v-deep {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
    }
  }
}
.search-item {
  position: relative;
  .item-style {
    width: 140px;
    ::v-deep {
      .el-input__inner {
        padding-left: 25px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}
</style>
