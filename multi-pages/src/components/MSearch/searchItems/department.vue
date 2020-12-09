<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 19:38:35
 * @Last Modified by:   songyanan
 * @Last Modified time: 2020-07-06 16:07:00
 * @Description: 社群销售 组织机构， 默认 根据选择的机构ID，返回对应的老师ID
 * onlyDept === 1，返回departmentID
 -->
<template>
  <div class="search-item small threeSelect" :style="myStyle">
    <el-cascader
      size="mini"
      class="item-style"
      :placeholder="placeholder"
      :options="departmentList"
      :disabled="isDisabled"
      :props="{
        multiple: true,
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: false
      }"
      :show-all-levels="false"
      clearable
      @change="onSelect"
      ref="dept"
    ></el-cascader>
  </div>
</template>

<script>
import { sortByKey, isToss } from '@/utils/index'

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '销售部'
    },
    // 有时只需获取 deptid，无须获取teacherids
    onlyDept: {
      type: Number,
      default: 0
    },
    departmentId: {
      type: String,
      default: '0'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    myStyle: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    currentDepartmentId() {
      return this.departmentId && this.departmentId !== '0'
        ? this.departmentId
        : this.teacherDepartmentId
    }
  },
  data() {
    return {
      // 当前登录老师的部门ID
      teacherDepartmentId: '',
      teacherId: '',
      departmentList: []
    }
  },
  created() {
    const teacher = isToss(true)
    this.teacherDepartmentId = (teacher && teacher.departmentId) || '0'
    this.teacherId = teacher && teacher.id
    // 组员不请求 rankId: 1-经理 2-组长 3-组员
    // teacher.rankId !== '3' && this.getDepartment()
    this.getDepartment()
  },
  methods: {
    getDepartment() {
      // this.$http.Department.getDepartmentList(this.currentDepartmentId).then(
      this.$http.Department.getDepartmentList().then(
        // this.$http.Department.getDepartmentListByRole(this.teacherId).then(
        (res) => {
          const arr = res.payload || []
          const department = sortByKey(arr, 'id')
          department.sort(this.handle('sort'))
          this.recursive(department)
          this.departmentList = department
        }
      )
    },
    async onSelect(data) {
      // TODO: 根据选择的销售组，获取销售ID
      // const ids = { department_id: data || [] }
      // 返回选择的节点本身及其包含的了节点
      const allNodes = this.$refs.dept.getCheckedNodes()
      const allNodesId = allNodes.map((item) => item.value)
      const ids = { department_id: allNodesId || [] }
      if (this.onlyDept === 1) {
        this.$emit('result', { [this.name]: allNodesId })
      } else {
        const teacher = await this.$http.Department.getDepartmentTeacher(
          JSON.stringify(ids)
        )
        const teacherIds = teacher.data.TeacherList.map((item) => item.id)
        this.$emit('result', data.length > 0 ? { [this.name]: teacherIds } : '')
      }
    },
    handle(property) {
      return function(a, b) {
        const val1 = a[property]
        const val2 = b[property]
        return val2 - val1
      }
    },
    recursive(value) {
      value.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.sort(this.handle('sort'))
          this.recursive(item.children)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.threeSelect {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
.search-item {
  .item-style {
    min-width: 140px;
    width: 100%;
  }
}
.el-cascader-panel {
  max-height: 300px !important;
}
</style>
