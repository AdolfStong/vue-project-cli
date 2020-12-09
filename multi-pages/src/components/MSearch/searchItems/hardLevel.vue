<!--
 * @Descripttion: 难度级别 S1-S5
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-14 17:33:01
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="supData"
      class="item-style"
      clearable
      v-if="name"
      size="mini"
      :multiple="multiple"
      :placeholder="placeholder"
      :style="myStyle"
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
  </div>
</template>

<script>
// import axios from '@/api/axiosConfig'
import { mapState } from 'vuex'
import {
  SUP_LEVEL_LIST,
  SUP_LEVEL_LIST_LOWER,
  SUP_LEVEL_LIST_UPPER
} from '@/utils/supList'

// import {}

export default {
  props: {
    placeholder: {
      type: String,
      default: '难度'
    },
    name: {
      type: String,
      default: 'sup'
    },
    addSupS: {
      type: Boolean,
      default: false
    },
    // s大小写 - 默认小写
    upper: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    // 自定义style样式
    myStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      stageList: [],
      scheduleList: [],
      supList: [],
      levelList: [],
      stageData: null,
      schedule: null,
      supData: null,
      levelData: null
    }
  },
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      },
      typeStage: (state) => {
        return state.leftbar.typeStage
      }
    })
  },
  async created() {
    // await this.getSup()
    this.supList = this.addSupS
      ? !this.upper
        ? SUP_LEVEL_LIST_LOWER
        : SUP_LEVEL_LIST_UPPER
      : SUP_LEVEL_LIST
  },
  methods: {
    // 难度
    // async getSup() {
    //   axios
    //     .post('/graphql/filter', {
    //       query: `{
    //         courseSupList{
    //             id
    //             name
    //           }
    //         }
    //       `
    //     })
    //     .then((res) => {
    //       this.supList = res.data ? res.data.courseSupList || [] : []
    //       this.supList.splice(
    //         res.data.courseSupList.filter((item) => +item.id === 0),
    //         1
    //       )
    //     })
    // },

    supChange(data) {
      console.log(data)
      // 如果是体验课难度，查询订单的话，需要关联tg_student_team,根据id关联o_order的trial_team_id
      if (this.name === 'trial_team_id') {
        const supArr = data.map((item) => `S${item}`)
        this.$http.StudentTerm.searchTeamBySup(supArr).then((res) => {
          console.log(res)
          if (res && res.data && res.data.StudentTeamList) {
            const result = res.data.StudentTeamList.map((item) => item.id)
            this.$emit(
              'result',
              result.length > 0 ? { [this.name]: result } : ''
            )
            return
          }
          this.$emit('result', '')
        })
      } else {
        this.$emit(
          'result',
          data.length > 0 ? { [this.name]: this.supData } : ''
        )
      }
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
