<template>
  <div class="search-item small threeSelect">
    <el-cascader
      size="mini"
      :options="options"
      :show-all-levels="false"
      :props="{ multiple: true }"
      clearable
      @change="onChange"
    >
    </el-cascader>
  </div>
</template>

<script>
export default {
  name: 'defineLabelV2',
  props: {
    name: {
      type: String,
      default: 'user_label'
    }
  },
  data() {
    return {
      options: [
        {
          value: '0',
          label: '部门标签库',
          children: []
        },
        {
          value: '1',
          label: '个人标签库',
          children: []
        }
      ]
    }
  },
  created() {
    this.getOptionsData()
  },
  methods: {
    async getOptionsData() {
      const data = await this.getTeacherLabel()
      if (!data) {
        return
      }
      this.initOptionsData(data)
      // 整理成模版需要的数据
    },
    getTeacherLabel() {
      const query = {
        userId: '',
        teacherId: JSON.parse(localStorage.getItem('teacher')).id,
        teacherIds: [JSON.parse(localStorage.getItem('teacher')).id]
      }
      return this.$http.Setting.getTeacherLabel(query).then((res) => {
        if (res.code === 0 && res.status === 'OK') {
          return res.payload
        } else {
          return false
        }
      })
    },
    initOptionsData(data) {
      this.options = [
        {
          value: '0',
          label: '部门标签库',
          children: []
        },
        {
          value: '1',
          label: '个人标签库',
          children: []
        }
      ]
      data.teacherLabel &&
        data.teacherLabel.forEach((item) => {
          item.label = item.name
          item.value = item.labelInfoId
          this.options[1].children.push(item)
        })
      Object.keys(data.teaDepLabel).forEach((key) => {
        const item = {
          label: key,
          value: key,
          children: []
        }
        data.teaDepLabel[key].forEach((child) => {
          child.label = child.name
          child.value = child.labelInfoId
          item.children.push(child)
        })
        this.options[0].children.push(item)
      })
    },
    async onChange(list) {
      const listLength = list.length
      // console.log(listLength)
      const query = []
      // 只需要层级筛选器的最后一项，所以把返回数据的最后一项都给挑出来
      list.forEach((item) => {
        query.push(item[item.length - 1])
      })
      const uids = await this.JLLabelRecordInfoList(query)
      const idList = []
      const idMap = new Map()
      if (!uids) {
        // console.log(listLength)
        if (!listLength) {
          this.$emit('result', { [this.name]: [] })
        } else {
          this.$emit('result', { [this.name]: ['0'] })
        }
        return
      }
      uids.forEach((item) => {
        if (!idMap.get(item.uid)) {
          idMap.set(item.uid, 1)
          if (listLength === 1) {
            idList.push(item.uid)
          }
        } else {
          let num = idMap.get(item.uid)
          num++
          idMap.set(item.uid, num)
          if (num === listLength) {
            idList.push(item.uid)
          }
        }
      })
      if (!idList.length) {
        idList.push('0')
      }
      // console.log(idList)
      // console.log(idMap)
      this.$emit('result', { [this.name]: idList })
    },
    JLLabelRecordInfoList(query) {
      return this.$http.User.JLLabelRecordInfoList(query)
        .then((res) => {
          if (
            res.data &&
            res.data.JLLabelRecordInfoList &&
            res.data.JLLabelRecordInfoList.length
          ) {
            return res.data.JLLabelRecordInfoList
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.threeSelect {
  width: 140px;
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
.el-cascader-panel {
  max-height: 300px !important;
}
/deep/ .el-input--mini .el-input__icon {
  line-height: 24px;
}
</style>
