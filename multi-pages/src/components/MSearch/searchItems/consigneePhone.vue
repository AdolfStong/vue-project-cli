<template>
  <div>
    <el-autocomplete
      placeholder="收货人电话"
      v-model="value"
      size="mini"
      clearable
      :fetch-suggestions="querySearch"
      :maxlength="11"
      @select="handleSelect"
      :trigger-on-focus="false"
      ref="input"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'orderSearch',
  data() {
    return {
      value: '',
      select: '1',
      keyword: 'receipt_tel'
    }
  },
  watch: {
    value(val, old) {
      if (!val) {
        this.$emit('result', { consigneePhone: val })
      }
    }
  },
  methods: {
    onChange(val) {
      console.info(val)
      this.value = ''
    },
    querySearch(query, cb) {
      // 收货人手机号
      const reg = /^[0-9]*$/
      if (!reg.test(query)) {
        this.value = ''
        return
      }
      let result
      this.$http.Express.searchExpressByRecieptTel(query).then((res) => {
        if (res && res.data && res.data.ExpressListEx) {
          result = res.data.ExpressListEx.map((item) => {
            item.value = item.receipt_tel
            return item
          })
        }
        cb(result)
        this.$refs.input.activated = true
      })
    },
    handleSelect(data) {
      const obj = {}
      Object.assign(obj, { [this.keyword]: data.receipt_tel })
      this.$emit('result', obj)
    }
  }
}
</script>

<style lang="scss" module>
.select {
  width: 140px;
}
</style>
