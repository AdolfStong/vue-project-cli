<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 21:13:24
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 21:13:24
 * @Description: 搜索系统课班级名
 /**
 * 体验课
 */
T1,
/**
 *系统课
 */
T2,
/**
 * 大师互动课--互消课
 */
T3,
/**
 * 名师直播课
 */
T4,
/**
 * 大师互动课-试听课
 */
T5,
/**
 * 节日主题课
 */
T6,
/**
 * 大师互动课-正式课
 */
T7,
/**
 * 互消课 日期格式
 */
T8,
/**
 * TV-SHOW试听课  日期格式
 */
T9,
/**
 * TV-SHOW-系统课 日期格式
 */
T10,
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="teamName"
      multiple
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="placeholder"
      :remote-method="getCourse"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="item in courseList"
        :key="item.id"
        :label="item.title"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { isToss } from '@/utils/index'
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
    // placeholder: {
    //   type: String,
    //   default: '系统课名称'
    // }
    // 课程类型
    // typeNo: {
    //   type: String,
    //   default: '1'
    // }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getCourse, 500)
    },
    placeholder() {
      return +isToss(true).dutyId === 1 ? '体验课名称' : '系统课名称'
    },
    // 课程类型；0-体验课 1-系统课 8-tv体验课 9-tv系统课
    typeNo() {
      return +isToss(true).dutyId === 1 ? [0, 8] : [1, 9]
    }
  },
  data() {
    return {
      loading: false,
      teamName: '',
      courseList: []
    }
  },
  created() {
    this.getCourse()
  },
  watch: {},
  methods: {
    getCourse(query) {
      // if (query !== '') {
      this.loading = true
      this.$http.Courseware.getCoursewareSearch(query, this.typeNo)
        .then((res) => {
          this.courseList = res.data.CoursewareListEx || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // }
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
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
