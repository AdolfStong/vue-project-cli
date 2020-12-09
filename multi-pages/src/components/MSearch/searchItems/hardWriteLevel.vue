<!--
 * @Descripttion: 难度级别 S1-S5
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-13 18:16:38
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="supData"
      class="item-style"
      clearable
      v-if="name"
      size="mini"
      multiple
      :subType="subType"
      :placeholder="placeholder"
      :style="myStyle"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.name"
        :value="addSupS ? item.name : item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    subType: {
      type: String,
      default: 'sup'
    },
    addSupS: {
      type: Boolean,
      default: false
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
      experList: [
        { id: 1, name: '基础(S1)' },
        { id: 2, name: '高阶(S2)' }
      ],
      systemList: [
        { id: 1, name: '一年级(S1)' },
        { id: 2, name: '二年级(S2)' },
        { id: 3, name: '三年级(S3)' },
        { id: 4, name: '四年级(S4)' },
        { id: 5, name: '五年级(S5)' },
        { id: 6, name: '六年级(S6)' }
      ],
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
  watch: {
    addSupS(val) {
      console.log(val)
    }
  },
  async created() {
    this.supList = this.subType === '1' ? this.systemList : this.experList
  },
  methods: {
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
