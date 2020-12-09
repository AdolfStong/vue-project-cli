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
            <div class="name">{{ item.team_name || '-' }}</div>
          </div>
        </template></el-autocomplete
      >
    </el-form>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'

export default {
  props: {
    name: {
      type: String,
      default: 'last_team_name'
    },
    tip: {
      type: String,
      default: '班级名'
    }
  },
  components: {},
  data() {
    return {
      input: '',
      dataDetail: []
    }
  },
  computed: {},
  watch: {
    input(val, old) {
      console.log(val !== old && !val)
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      const reg = /^[\s\-\S\0-9_\-\u4e00-\u9fa5]+/
      if (!reg.test(queryString)) {
        this.input = ''
        return
      }
      const teamList = await this.createFilter(queryString)
      // 调用 callback 返回建议列表的数据
      cb(teamList)
    },

    createFilter(queryString) {
      const st = queryString.toUpperCase()
      const queryParams = JSON.stringify(`
      {"bool":{"must":[{"wildcard":{"team_name.keyword":"*${st}*"}},{"term":{"subject":"${this.$store.getters.subjects.subjectCode}"}}]}}
      `)
      return axios
        .post('/graphql/v1/toss', {
          query: `{
                  StudentTeamListEx(query: ${queryParams}) {
                    id
                    team_name
                  }
                }`
        })
        .then((res) => {
          this.dataDetail = res.data.StudentTeamListEx
          return this.dataDetail
        })
    },
    inputHandler(data) {
      console.log(data)

      this.input = data.team_name
      this.$emit('result', { [this.name]: data.id })
    }
  },
  created() {},
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
