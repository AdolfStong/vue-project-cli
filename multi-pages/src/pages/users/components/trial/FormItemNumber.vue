<!--
 * @Descripttion: form-item. 选择条件 + 输入数字
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-14 21:34:03
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-28 17:47:34
-->
<template>
  <el-form-item :label="label" :label-width="innerFormLabelWidth" size="mini">
    <!-- {{ exObject }} -->
    <!-- {{ current }} -->
    <!-- {{ currentObj }} -->
    <el-select
      v-model="ex"
      :placeholder="selectPlaceholder"
      clearable
      class="w-100"
      @change="onChange"
    >
      <el-option
        v-for="item in exList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      ></el-option>
    </el-select>
    <!-- 只输入整数 -->
    <el-input
      v-if="type === 'number'"
      v-model.number="value"
      type="age"
      maxlength="6"
      :placeholder="inputPlaceholder"
      :style="customInputStyle"
      class="w-80 mg-l-10"
      @input="checkNumber"
    />
    <!-- 输入浮点数 -->
    <el-input
      v-if="type === 'float'"
      v-model="value"
      maxlength="6"
      :controls="false"
      :placeholder="inputPlaceholder"
      :style="customInputStyle"
      class="w-80 mg-l-10"
      @blur="checkFloat"
      :ref="name"
    />
    <slot name="append"></slot>
  </el-form-item>
</template>

<script>
export default {
  props: {
    // 输入数字类型， number ,float
    type: {
      type: String,
      default: 'number'
    },
    // 自定义样式
    customInputStyle: Object,
    //   form 对应的字段
    name: String,
    label: String,
    selectPlaceholder: {
      type: String,
      default: '选择条件'
    },
    inputPlaceholder: {
      type: String,
      default: '输入数字'
    },
    // 编辑时用于回显
    current: [String, Object, Number]
  },
  computed: {
    currentObj() {
      let obj = {}
      if (this.current) {
        if (
          Object.prototype.toString.call(this.current) === '[object Object]'
        ) {
          Object.assign(obj, {
            ex: Object.keys(this.current)[0],
            value: Object.values(this.current)[0]
          })
        } else {
          Object.assign(obj, {
            ex: 'eq',
            value: this.current
          })
        }
      } else {
        obj = {
          ex: '',
          value: ''
        }
      }
      return obj
    },
    exObject() {
      console.log(this.value)
      // 允许输入的数字为0
      if (!this.ex || (!this.value && +this.value !== 0))
        return { [`${this.name}`]: '' }

      const obj = {}
      if (this.ex === 'eq') {
        Object.assign(obj, { [`${this.name}`]: this.value })
      } else {
        Object.assign(obj, {
          [`${this.name}`]: { [`${this.ex}`]: this.value }
        })
      }
      return obj
    }
  },
  watch: {
    exObject(val, old) {
      this.$emit('result', { name: this.name, ex: val })
    },
    // 清空筛选条件时
    currentObj(val) {
      if (!val.ex && !val.value) {
        this.ex = ''
        this.value = ''
      }
    }
  },
  data() {
    return {
      innerFormLabelWidth: '75px',
      exList: [
        {
          id: 'eq',
          text: '等于'
        },
        {
          id: 'gt',
          text: '大于'
        },
        {
          id: 'lt',
          text: '小于'
        }
      ],
      ex: '',
      value: ''
    }
  },
  mounted() {
    this.ex = this.currentObj.ex || ''
    this.value = this.currentObj.value + '' || ''
  },
  methods: {
    // check number 数字（整数）rules
    checkNumber() {
      const { value } = this
      if (value && !Number.isInteger(value)) {
        const field = this.name
        console.log(field)
        this.value = ''
        // this.$message.error('请输入数字')
      }
    },
    // 浮点数校验，可保留两位小数
    checkFloat() {
      const { value } = this
      console.log(value)
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!reg.test(value)) {
        this.$message.error('请输入合法数字，可保留两位小数')
        this.value = ''
        this.$refs[this.name].focus()
      }
    },

    onChange() {
      this.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.w-80 {
  width: 80px;
}
.w-100 {
  width: 100px;
}
.mg-l-10 {
  margin-left: 10px;
}
</style>
