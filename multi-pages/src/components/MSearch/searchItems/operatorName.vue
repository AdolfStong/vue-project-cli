<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-select
        v-model="id"
        filterable
        remote
        reserve-keyword
        placeholder="申请人"
        :remote-method="getOperatorNameList"
        @change="onChange"
        :loading="loading"
        size="mini"
        clearable
      >
        <el-option
          v-for="item in operatorNameList"
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
export default {
  props: {
    name: {
      type: String,
      default: 'name'
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      input: '',
      id: '',
      operatorNameList: []
    }
  },
  methods: {
    getOperatorNameList(name) {
      this.loading = true
      const q = `{"name": ${JSON.stringify(name)}}`
      this.$http.Department.getOperatorNameList(q)
        .then((res) => {
          this.operatorNameList = res.data.operator || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(item) {
      this.$emit('result', item ? { [this.name]: item } : '')
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
<style lang="scss">
.ppName {
  width: 140px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 100%;
  }
}
</style>
