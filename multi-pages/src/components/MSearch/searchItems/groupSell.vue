<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-03 18:32:39
 -->
<template>
  <div class="search-item small" :style="myStyle">
    <el-form @submit.native.prevent>
      <el-select
        v-model="teacherId"
        :multiple="isMultiple"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        :placeholder="tip"
        :remote-method="getTeacher"
        :disabled="isDisabled"
        :loading="loading"
        @change="onChange"
      >
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.realname"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  props: {
    name: {
      type: String,
      default: 'pay_teacher_id'
    },
    tip: {
      type: String,
      default: '社群销售'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    teacherscope: {
      type: Array,
      default: () => {
        return null
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    myStyle: {
      type: Object,
      default: () => {}
    },
    // 当前选中的老师，回显用
    current: {
      type: String,
      default: ''
    },
    // 每页显示条数，默认20
    pageSize: {
      type: Number,
      default: 20
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      input: '',
      teacherId: '',
      teacherList: [],
      currentFirst: true,
      wholeTeacherList: []
    }
  },
  created() {
    this.getTeacher()
    this.$emit('result', this.current ? { [this.name]: this.current } : '')
  },
  watch: {
    teacherscope(val, old) {
      this.teacherId = ''
      this.getTeacher()
    }
    // teacherId(val, old) {
    //   if (val !== old && !val) {
    //     this.$emit('result', '')
    //   }
    // }
  },
  methods: {
    selectFocus(e) {
      this.getTeacher()
    },
    getTeacher(query = '') {
      const { getDepartmentTeacherEx } = this.$http.Department
      this.loading = true
      const q = {
        bool: {
          must: query
            ? [
                { wildcard: { 'realname.keyword': `*${query}*` } },
                {
                  wildcard: {
                    'subject.keyword': `*${this.$store.getters.subjects.subjectCode}*`
                  }
                }
              ]
            : [
                {
                  wildcard: {
                    'subject.keyword': `*${this.$store.getters.subjects.subjectCode}*`
                  }
                }
              ]
        }
      }
      this.teacherscope &&
        // this.teacherscope.length &&
        q.bool.must.push({ terms: { id: this.teacherscope } })
      getDepartmentTeacherEx(JSON.stringify(q), this.pageSize)
        .then((res) => {
          const teacherList = res.data.TeacherListEx || []
          this.teacherList = []
          teacherList.forEach((item) => {
            if (item.status === '0') {
              this.teacherList.push(item)
            }
          })
          if (this.current && this.currentFirst) {
            this.wholeTeacherList = cloneDeep(this.teacherList)
            this.teacherId = this.current
            this.currentFirst = false
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(item) {
      // 如果有传入的默认选中老师，清空时返回权属的所有老师 TODO:
      if (!item && this.current) {
        this.teacherList = this.wholeTeacherList
        const teacherId = this.wholeTeacherList.map((item) => item.id)
        this.$emit('result', { [this.name]: teacherId })
        return
      }
      this.$emit('result', item ? { [this.name]: item } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    max-width: 140px !important;
    width: 100%;
  }
  ::v-deep {
    .el-select {
      max-width: inherit;
      width: 100%;
    }
  }
}
</style>
