<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 21:13:24
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 21:13:24
 * @Description: 搜索系统课班级名
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
      :placeholder="teamnameType === '0' ? '体验课班级' : '系统课班级'"
      :remote-method="getTeam"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="item in teamList"
        :key="item.id"
        :label="item.team_name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 需要查询的类型
    teamnameType: {
      type: String,
      default: '1' // 0：体验课。 >0系统课
    },
    // 老师ID - 加老师权限
    teacherId: {
      type: Array,
      default: () => null
    },
    // 排期id
    term: {
      type: Array,
      default: () => null
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getTeam, 500)
    }
  },
  data() {
    return {
      loading: false,
      teamName: '',
      teamList: []
    }
  },
  created() {
    this.getTeam()
  },
  watch: {
    teacherId(val, old) {
      this.teamName = ''
      this.getTeam()
    },
    term(val, old) {
      this.teamName = ''
      this.getTeam()
    }
  },
  methods: {
    getTeam(query) {
      // if (query !== '') {
      this.loading = true
      const teamType =
        this.teamnameType === '0'
          ? { term: { team_type: 0 } }
          : { range: { team_type: { gt: 0 } } }
      const q = {
        bool: {
          must: query
            ? [{ wildcard: { 'team_name.keyword': `*${query}*` } }]
            : []
        }
      }
      q.bool.must.push(teamType)
      q.bool.must.push({
        term: { subject: this.$store.getters.subjects.subjectCode }
      })
      this.teacherId &&
        q.bool.must.push({ terms: { teacher_id: this.teacherId } })
      this.term &&
        this.term.length &&
        q.bool.must.push({ terms: { term: this.term } })
      this.$http.Team.getStudentTeamV1Search(JSON.stringify(q))
        .then((res) => {
          this.teamList = res.data.StudentTeamListEx || []
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
