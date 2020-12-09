<!--
 * @Descripttion: 自定义选择省市区层级和是否多选; 默认显示三级、多选
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-18 15:26:35
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-23 16:06:16
//  TODO: 支持四级
  * 返回格式 Object
    {
      province:[],
      city: [],
      area: []
    }

    e.g.: 
    <custom-select-regions
      multiple
      simple-province
      return-type="name"
      :level="2"
      @result="getRegion"
    />
-->
<template>
  <div class="custom_region">
    <el-cascader
      v-model="selectData"
      :placeholder="placeholder"
      :options="areaLists"
      :props="props"
      :size="size"
      filterable
      clearable
      collapse-tags
      :key="now"
      @change="handleChange"
    />
  </div>
</template>

<script>
// import areaLists from '@/utils/area.json'
export default {
  props: {
    // name: {
    //   type: String,
    //   default: ''
    // },
    // model - 用于编辑回显
    current: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: 'mini'
    },
    // 默认显示省市区三级。 1，2，3
    level: {
      type: Number,
      default: 3
    },
    // 多选/单选
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否严格的遵守父子节点不互相关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    //  省份显示简称，如 山东省 -> 山东；宁夏回族自治区 -> 宁夏
    simpleProvince: {
      type: Boolean,
      default: false
    },
    // 默认返回对应的code， 变态的情况时需要返回 name！！  type: ‘code’, 'name'
    returnType: {
      type: String,
      default: 'code'
    },
    // 默认emit到父组件一个对象，特殊情况在编辑时需要回显数据时，特殊处理。数据的解析到业务层单独处理
    needReturnShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      props: {
        multiple: this.multiple,
        checkStrictly: this.checkStrictly
      },
      areaLists: [],
      selectData: [],
      now: null
    }
  },
  mounted() {
    this.selectData = this.current
    this.getRegionData()
  },
  watch: {
    current(val) {
      this.selectData = val
    },
    // 清空已选择项时，重新渲组件。解决 cascader 组件清空数据后仍然高亮显示
    selectData(val) {
      if (val.length === 0) {
        this.now = Date.now()
      }
    }
  },
  methods: {
    //   获取省市区三级数据
    getRegionData() {
      this.$http.Base.getCenterAddressList().then((res) => {
        console.log(res)
        if (res && res.code === 0 && res.payload) {
          const { data = [] } = res.payload
          data.forEach((ele) => {
            ele.label = this.simpleProvince ? ele.simpleName : ele.provinceName
            // ele.value = ele.id
            // value 不使用ID，使用省的code。 如果定义返回name
            ele.value =
              this.returnType === 'name'
                ? ele.simpleName
                : +ele.citys[0].provinceCode
            // 二级
            if (this.level >= 2) {
              ele.children = ele.citys
              ele.children.forEach((val) => {
                val.label = val.cityName
                val.value =
                  this.returnType === 'name' ? val.cityName : +val.cityCode
                // 三级
                if (this.level === 3) {
                  val.children = val.countys
                  val.children.forEach((_value) => {
                    _value.label = _value.countyName
                    _value.value =
                      this.returnType === 'name'
                        ? _value.countyName
                        : _value.countyCode
                    // 四级
                    // _value.children = [{ label: '暂不选择', value: '' }]
                  })
                }
              })
            }
          })
          this.areaLists = data
        }
      })
    },
    handleChange(data = []) {
      // console.log(data)
      // 返回省市区
      const { level } = this
      const res = {}
      // 正常只返回数据，不需要编辑回显
      if (!this.needReturnShow) {
        const province = []
        const city = []
        const area = []
        data.forEach((item) => {
          if (level > 0) {
            if (!province.includes(item[0])) province.push(item[0])
          }
          if (level > 1) {
            if (!city.includes(item[1])) city.push(item[1])
          }
          if (level > 2) {
            if (!area.includes(item[2])) area.push(item[2])
          }
        })
        if (level > 0) {
          Object.assign(res, { province })
        }
        if (level > 1) {
          Object.assign(res, { city })
        }
        if (level > 2) {
          Object.assign(res, { area })
        }
      }
      // 需要回显的
      else {
        Object.assign(res, { level, data })
      }
      // console.log(res)

      this.$emit('result', res)

      // return res
    }
  }
}
</script>

<style lang="scss" scoped>
.custom_region {
  ::v-deep {
    .el-cascader__tags {
      flex-wrap: nowrap !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      // .el-cascader__search-input {
      // display: none;
      // height: 20px !important;
      // }
      // .el-tag {
      //   // 隐藏显示选择的数量
      //   &:nth-child(2) {
      //     display: none;
      //   }
      // }
    }
    .el-cascader--mini {
      height: 20px;
      .el-input .el-icon-arrow-down {
        line-height: 22px;
      }
      .el-cascader__tags {
        .el-cascader__search-input {
          height: 20px !important;
        }
      }
      .el-input--mini {
        height: inherit;
        .el-input__inner {
          height: 20px !important;
        }
      }
    }
  }
}
</style>
