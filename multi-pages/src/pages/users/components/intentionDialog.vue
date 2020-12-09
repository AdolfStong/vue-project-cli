<template>
  <div class="intent-dialog-box">
    <el-dialog
      class="dialog-class"
      title="沟通备注"
      :visible.sync="showIntentDialog"
      @closed="closed"
    >
      <el-form
        ref="intentForm"
        class="form-class"
        label-position="right"
        label-width="100px"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item label="意向度" prop="radio">
          <el-radio-group v-model="formData.radio" size="small">
            <el-radio-button label="高"></el-radio-button>
            <el-radio-button label="中"></el-radio-button>
            <el-radio-button label="低"></el-radio-button>
            <el-radio-button label="无"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="textarea">
          <el-input
            type="textarea"
            class="textarea-class"
            placeholder="请输入内容"
            v-model="formData.textarea"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <!-- v2.1 -->
        <el-form-item label="下次跟进提醒">
          <ul class="track-list clearfix">
            <li>
              <el-tag
                size="mini"
                :type="currentTag === 0 ? '' : 'info'"
                effect="dark"
                @click="handleTag(0)"
                >不提醒</el-tag
              >
            </li>
            <li>
              <el-tag
                size="mini"
                :type="currentTag === 1 ? '' : 'info'"
                effect="dark"
                @click="handleTag(1)"
                >今天（{{ todayText }}）</el-tag
              >
            </li>
            <li>
              <el-tag
                size="mini"
                :type="currentTag === 2 ? '' : 'info'"
                effect="dark"
                @click="handleTag(2)"
                >明天（{{ tomorrowText }}）</el-tag
              >
            </li>
          </ul>
          <p class="tips">
            说明“跟进提醒”会显示在左侧待跟进人群分组中（设置提醒成功后，数据更新延时1至3分钟）
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showIntentDialog = false">
          取 消
        </el-button>
        <el-button size="small" type="primary" @click="confirm">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { todayTimestamp, tomorrowTimestamp } from '../utils'
export default {
  name: 'intentionDialog',
  data() {
    return {
      formRules: {
        radio: [
          { required: true, message: '请选择意向度等级', trigger: 'blur' }
        ]
        // textarea: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      },
      showIntentDialog: false,
      formData: {
        radio: '',
        textarea: ''
      },
      currentTag: 0
    }
  },
  computed: {
    todayText() {
      return dayjs.unix(new Date() / 1000).format('MM月DD日')
    },
    tomorrowText() {
      const dd = new Date()
      dd.setDate(dd.getDate() + 1)
      return dayjs.unix(new Date(dd) / 1000).format('MM月DD日')
    },
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    },
    trackParams() {
      const params = {}
      if (this.currentTag === 0) {
        Object.assign(params, { isTrack: 0 })
      }
      if (this.currentTag === 1) {
        Object.assign(params, {
          isTrack: 1,
          today: this.today
        })
      }
      if (this.currentTag === 2) {
        // 明天
        Object.assign(params, {
          isTrack: 1,
          today: this.tomorrow // ！！！ 统一使用 today 存时间
        })
      }
      return params
    }
  },
  methods: {
    showDialog(data) {
      console.log(data, 'data')
      this.currentTag = 0
      this.showIntentDialog = true
      this.$nextTick(() => {
        if (data) {
          const arr = ['低', '中', '高', '无']
          this.formData.radio = arr[data.type - 1]
          this.formData.textarea = data.describe
          if (data.is_track === 0) this.currentTag = 0
          if (+data.today === this.today) this.currentTag = 1
          if (+data.today === this.tomorrow) this.currentTag = 2
        } else {
          this.currentTag = 0
        }
      })
    },
    confirm() {
      this.$refs.intentForm.validate((valid) => {
        if (valid) {
          this.showIntentDialog = false
          this.$emit('intentConfirm', {
            radio: this.formData.radio,
            textarea: this.formData.textarea,
            track: this.trackParams
          })
        } else {
          return false
        }
      })
    },
    closed() {
      this.$refs.intentForm.resetFields()
      this.$refs.intentForm.clearValidate()
    },

    handleTag(data) {
      this.currentTag = data
    }
  }
}
</script>

<style lang="scss" scoped>
.intent-dialog-box {
  .dialog-class {
    ::v-deep {
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .form-class {
      .textarea-class {
        width: calc(100% - 60px);
      }
      /deep/ .el-form-item__error {
        margin-left: 57px;
      }
    }
  }
  .track-list {
    margin: 0;
    padding: 0;
    li {
      float: left;
      margin-right: 10px;
      list-style: none;
      ::v-deep {
        .el-tag {
          min-width: 100px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
  .tips {
    font-size: 12px;
    color: #aaa;
  }
}
</style>
