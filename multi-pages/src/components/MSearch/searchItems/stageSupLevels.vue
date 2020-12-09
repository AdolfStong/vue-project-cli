<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-14 15:50:46
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="stageData"
      class="item-style"
      v-if="stageName"
      clearable
      multiple
      size="mini"
      placeholder="期数"
      @change="stageChange"
    >
      <el-option
        v-for="item in stageList"
        :key="item.stage"
        :label="item.stage_text"
        :value="item.stage"
      >
      </el-option>
    </el-select>

    <el-select
      v-model="supData"
      class="item-style"
      clearable
      v-if="supName"
      size="mini"
      multiple
      :placeholder="supPlaceholder"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="levelData"
      class="item-style"
      clearable
      v-if="levelName"
      multiple
      size="mini"
      placeholder="级别"
      @change="levelChange"
    >
      <el-option
        v-for="item in levelList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'
import { SUP_LEVEL_LIST, SUP_LEVEL_LIST_LOWER } from '@/utils/supList'

export default {
  props: {
    stageName: {
      type: String,
      default: ''
    },
    scheduleName: {
      type: String,
      default: ''
    },
    supName: {
      type: String,
      default: ''
    },
    levelName: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    },
    addSupS: {
      type: Boolean,
      default: false
    },
    supPlaceholder: {
      type: String,
      default: '难度'
    }
  },
  data() {
    return {
      stageList: [],
      scheduleList: [],
      supList: [],
      levelList: [],
      stageData: null,
      supData: null,
      levelData: null
    }
  },
  watch: {
    channelData(val) {
      console.log(val)
    },
    addSupS(val) {
      console.log(val)
    }
  },
  async created() {
    await this.getStage()
    // await this.getSup()
    await this.getLevel()
    this.supList = this.addSupS ? SUP_LEVEL_LIST_LOWER : SUP_LEVEL_LIST
  },
  methods: {
    // 期数
    async getStage() {
      axios
        .post('/graphql/filter', {
          query: `{
              teamStageList{
                stage
                stage_text
              }
            }
          `
        })
        .then((res) => {
          this.stageList = res.data.teamStageList
        })
    },
    // 难度
    async getSup() {
      axios
        .post('/graphql/filter', {
          query: `{
            courseSupList{
                id
                name
              }
            }
          `
        })
        .then((res) => {
          this.supList =
            res.data && res.data.courseSupList.filter((item) => +item.id !== 0)
        })
    },
    // 级别
    async getLevel() {
      axios
        .post('/graphql/filter', {
          query: `{
              courseLevelList{
                id,
                name
              }
            }
          `
        })
        .then((res) => {
          this.levelList = res.data.courseLevelList
        })
    },
    stageChange(data) {
      this.$emit(
        'stageCallBack',
        data.length > 0 ? { [this.stageName]: this.stageData } : ''
      )
    },

    supChange(data) {
      console.log(data)

      this.$emit(
        'supCallBack',
        data.length > 0 ? { [this.supName]: this.supData } : ''
      )
    },
    levelChange(data) {
      this.$emit(
        'levelCallBack',
        data.length > 0 ? { [this.levelName]: this.levelData } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
<style lang="scss">
.el-select__tags {
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
