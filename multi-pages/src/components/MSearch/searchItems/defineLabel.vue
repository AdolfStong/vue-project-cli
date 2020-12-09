<!--
 * @Descripttion: 老师自定义的标签搜索及列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-18 12:15:49
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-22 21:42:00
-->
<template>
  <div class="search-item small" :style="myStyle">
    <el-form @submit.native.prevent>
      <el-select
        v-model="label"
        :multiple="isMultiple"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        :placeholder="placeholder"
        :remote-method="getData"
        :loading="loading"
        @change="onChange"
        @clear="onClear"
      >
        <el-option
          v-for="item in labelList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </el-form>
  </div>
</template>

<script>
import { isToss } from '@/utils/index'
export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    name: {
      type: String,
      default: 'user_label'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 自定义style样式
    myStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      label: '',
      labelList: [],
      teacherIds: []
    }
  },
  created() {
    this.getAllTeacherByRoleIds()
  },
  methods: {
    // toss
    getAllTeacherByRoleIds() {
      const teacherid = isToss()
      this.$http.Permission.getAllTeacherByRole({
        teacherId: teacherid
      }).then((res) => {
        this.teacherIds = res
        setTimeout(() => {
          this.getData()
        }, 200)
      })
    },
    getData(query = '') {
      this.loading = true
      // const q = [
      //   {
      //     terms: { teacher_id: this.teacherIds }
      //   },
      //   { wildcard: { 'name.keyword': `*${query}*` } }
      // ]
      // const params = {
      //   bool: {
      //     must: q
      //   }
      // }
      const params = {
        del: 0,
        'name.like': {
          'name.keyword': `*${query}*`
        },
        teacher_id: this.teacherIds.concat[0]
      }
      this.$http.User.getDefineLabelListEx(params)
        .then((res) => {
          this.labelList = res && res.data && res.data.DefineLabelList
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(item) {
      // console.log(item)
      this.$emit('result', item ? { [this.name]: item } : '')
    },
    onClear() {
      this.getData()
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
