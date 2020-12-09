<!--
 * @Descripttion: 新增或编辑自定义人群组 抽屉
 * @version: 2.2.0
 * @Author: YangJiyong
 * @Date: 2020-07-10 14:53:10
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-29 00:37:56
-->
<template>
  <!-- :before-close="handelCancel" -->
  <el-drawer
    :visible.sync="drawerStatus"
    :direction="direction"
    :size="drawerWidth"
    :destroy-on-close="false"
    custom-class="custom-drawer"
    @close="handelCancel"
  >
    <div class="title" slot="title">
      <span @click="handelCancel(false)"
        ><i class="el-icon-arrow-left"></i>{{ title }}</span
      >
      <el-tooltip
        class="title-tips"
        effect="dark"
        placement="right"
        v-if="activeType !== 'ADVANCEDSEARCH'"
      >
        <svg class="iconfont" aria-hidden="true" style="fill: #999">
          <use xlink:href="#iconwenhao"></use>
        </svg>
        <p slot="content">
          说明：根据设定条件创建人群组后，可以通过人群组快速筛选符合条件的学员
        </p>
      </el-tooltip>
    </div>
    <div
      class="custom-drawer__content"
      :class="{ 'advance-search': activeType === 'ADVANCEDSEARCH' }"
    >
      <!-- tab 组员不显示；编辑的情况下不显示tab -->
      <!-- <el-tabs
        v-model="activeTab"
        v-if="
          rankId !== 3 &&
            !this.currentGroup.id &&
            activeType !== 'ADVANCEDSEARCH'
        "
        @tab-click="handleTab"
      >
        <el-tab-pane label="个人自定义" name="PERSONAL"></el-tab-pane>
        <el-tab-pane label="部门自定义" name="DEPARTMENT"></el-tab-pane>
      </el-tabs> -->
      <div class="tips" v-if="activeType !== 'ADVANCEDSEARCH'">
        <p v-if="rankId !== 3 && activeTab === 'DEPARTMENT'">
          *部门自定义的人群说明：若组长设置的，则只有自己组内人员可以看到；若经理设置的，则只有其管理的人员可看到
        </p>
      </div>

      <!-- form -->
      <el-form
        :model="form"
        label-position="left"
        size="small"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="人群组命名"
          :label-width="formLabelWidth"
          prop="name"
          class="group-name"
          v-if="activeType !== 'ADVANCEDSEARCH'"
        >
          <el-input
            v-model="form.name"
            maxlength="15"
            show-word-limit
            auto-complete="off"
            placeholder="请添加人群组名称"
            append="0979709"
          ></el-input>
          <p class="mg-l-10" v-if="activeTab === 'PERSONAL'">
            个人自定义人群组上限【3】
          </p>
        </el-form-item>
        <el-form-item
          :label="activeType !== 'ADVANCEDSEARCH' ? '满足条件' : ''"
          class="expression-el-form"
          :label-width="activeType !== 'ADVANCEDSEARCH' ? formLabelWidth : ''"
          :required="activeType !== 'ADVANCEDSEARCH'"
        >
          <!-- <div> -->
          <!-- 条件选项 -->
          <div class="expression-section">
            <h3>基本信息</h3>
            <div class="expression-section-row">
              <!-- 0/默认 1/男 2/女  3/保密 -->
              <el-form-item
                label="性别"
                :label-width="innerFormLabelWidth"
                prop="sex"
              >
                <el-radio v-model="form.sex" label="">全部</el-radio>
                <el-radio v-model="form.sex" label="1">男</el-radio>
                <el-radio v-model="form.sex" label="2">女</el-radio>
                <el-radio v-model="form.sex" label="0">无</el-radio>
              </el-form-item>
              <el-form-item
                label="城市"
                size="mini"
                :label-width="innerFormLabelWidth"
                prop="city"
              >
                <custom-select-regions
                  multiple
                  simple-province
                  need-return-show
                  return-type="name"
                  :level="2"
                  :current="currentCity"
                  @result="getRegion"
                />
              </el-form-item>
            </div>
            <div class="expression-section-row">
              <el-form-item
                label="渠道"
                :label-width="innerFormLabelWidth"
                prop="pay_channel"
                size="mini"
                v-if="rankId !== 3"
              >
                <channel
                  placeholder="请选择"
                  name="pay_channel"
                  :current="form.pay_channel"
                  @result="getChannel"
                />
              </el-form-item>
              <el-form-item
                label="美术基础"
                :label-width="innerFormLabelWidth"
                prop="base_painting"
              >
                <!-- <el-radio v-model="form.base_painting" label="">全部</el-radio>
                <el-radio v-model="form.base_painting" label="1"
                  >无基础</el-radio
                >
                <el-radio v-model="form.base_painting" label="3"
                  >1年以上</el-radio
                >
                <el-radio v-model="form.base_painting" label="2"
                  >1年以下</el-radio
                > -->
                <el-select v-model="form.base_painting" size="mini" clearable>
                  <el-option value="1" label="无基础"></el-option>
                  <el-option value="2" label="1年以下"></el-option>
                  <el-option value="3" label="1年以上"></el-option>
                </el-select>
              </el-form-item>
            </div>

            <h3>课前准备</h3>
            <div class="expression-section-row">
              <el-form-item
                label="加微情况"
                :label-width="innerFormLabelWidth"
                prop="added_wechat"
              >
                <el-radio v-model="form.added_wechat" label="">全部</el-radio>
                <el-radio v-model="form.added_wechat" label="0"
                  >未添加</el-radio
                >
                <el-radio v-model="form.added_wechat" label="1"
                  >已添加</el-radio
                >
              </el-form-item>
              <el-form-item
                label="公众号"
                :label-width="innerFormLabelWidth"
                prop="follow"
              >
                <el-radio v-model="form.follow" label="">全部</el-radio>
                <el-radio v-model="form.follow" label="0">未关注</el-radio>
                <el-radio v-model="form.follow" label="1">已关注</el-radio>
              </el-form-item>
            </div>
            <div class="expression-section-row">
              <el-form-item
                label="是否进群"
                :label-width="innerFormLabelWidth"
                prop="added_group"
              >
                <el-radio v-model="form.added_group" label="">全部</el-radio>
                <el-radio v-model="form.added_group" label="0">未进群</el-radio>
                <el-radio v-model="form.added_group" label="1">已进群</el-radio>
              </el-form-item>
              <el-form-item
                label="APP"
                :label-width="innerFormLabelWidth"
                prop="is_login"
              >
                <el-radio v-model="form.is_login" label="">全部</el-radio>
                <el-radio v-model="form.is_login" label="0">未登录</el-radio>
                <el-radio v-model="form.is_login" label="1">已登录</el-radio>
              </el-form-item>
            </div>
            <div class="expression-section-row">
              <el-form-item
                label="盒子物流"
                :label-width="innerFormLabelWidth"
                prop="express_status"
              >
                <!-- <el-checkbox-group v-model="form.express_status">
                  <el-checkbox label="0">无地址</el-checkbox>
                  <el-checkbox label="1,2,4,5,6,7,8,9">未送达</el-checkbox>
                  <el-checkbox label="3">已完成</el-checkbox>
                </el-checkbox-group> -->
                <el-select
                  v-model="form.express_status"
                  placeholder="请选择"
                  size="mini"
                  clearable
                  multiple
                  collapse-tags
                >
                  <el-option
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"
                    v-for="item in expressList"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <h3>上课准备</h3>
            <div class="expression-section-row">
              <!-- <form-item-number
                :current="form['all_join_course_count']"
                name="all_join_course_count"
                label="参课总次数"
                @result="getItemNumber"
              /> -->
              <form-item-number
                :current="form['join_course_count']"
                name="join_course_count"
                label="参课节数"
                @result="getItemNumber"
                :key="now + 5"
              />
              <form-item-number
                :current="form['complete_course_count']"
                name="complete_course_count"
                label="完课节数"
                @result="getItemNumber"
                :key="now + 6"
              />
            </div>
            <!-- <div class="expression-section-row">
              <form-item-number
                :current="form['all_complete_course_count']"
                name="all_complete_course_count"
                label="完课总次数"
                @result="getItemNumber"
              />
              <form-item-number
                :current="form['complete_course_count']"
                name="complete_course_count"
                label="完课节数"
                @result="getItemNumber"
              />
            </div> -->
            <div class="expression-section-row">
              <!-- <form-item-number
                :current="form['all_join_course_count']"
                name="all_join_course_count"
                label="上课总时长"
                input-placeholder="输入数字(分钟)"
                :custom-input-style="{ width: '110px' }"
                @result="getItemNumber"
              /> -->
              <form-item-number
                :current="form['task_count']"
                name="task_count"
                label="上传作品"
                @result="getItemNumber"
                :key="now + 3"
              />
              <form-item-number
                :current="form['listen_comment_count']"
                name="listen_comment_count"
                label="听点评作品"
                @result="getItemNumber"
                :key="now + 4"
              />
            </div>
            <!-- <div class="expression-section-row">
              <el-form-item label="最近使用设备" prop="device_type">
                <el-checkbox-group v-model="form['device_type']">
                  <el-checkbox label="iPad">iPad</el-checkbox>
                  <el-checkbox label="Phone">安卓Pad</el-checkbox>
                  <el-checkbox label="iPhone">iPhone</el-checkbox>
                  <el-checkbox label="Pad">安卓手机</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div> -->
            <!-- <div class="expression-section-row">
              <form-item-number
                :current="form['join_course_rate']"
                name="join_course_rate"
                label="参课率"
                type="float"
                @result="getItemNumber"
                ><template slot="append">%</template></form-item-number
              >
              <form-item-number
                :current="form['complete_course_rate']"
                name="complete_course_rate"
                label="完课率"
                type="float"
                @result="getItemNumber"
                ><template slot="append">%</template></form-item-number
              >
            </div>
            <div class="expression-section-row">
              <form-item-number
                :current="form['task_rate']"
                name="task_rate"
                label="上传作品率"
                type="float"
                @result="getItemNumber"
                ><template slot="append">%</template></form-item-number
              >
              <form-item-number
                :current="form['']"
                name="listen_comment_rate"
                label="听点评率"
                type="float"
                @result="getItemNumber"
                ><template slot="append">%</template></form-item-number
              >
            </div> -->

            <h3>活跃行为</h3>
            <div class="expression-section-row">
              <!-- <form-item-date
                name="last_login_time"
                label="APP活跃时间"
                :current="form.last_login_time"
                :key="now"
                @result="getItemNumber"
              /> -->
              <form-item-date
                name="last_join_time"
                label="最近参课时间"
                :current="form.last_join_time"
                :key="now + 1"
                @result="getItemNumber"
              />
              <form-item-date
                name="last_complete_time"
                label="最近完课时间"
                :current="form.last_complete_time"
                :key="now + 2"
                @result="getItemNumber"
              />
            </div>
            <!-- <div class="expression-section-row">
              <form-item-date
                name="last_complete_time"
                label="最近完课时间"
                :current="form.last_complete_time"
                :key="now + 2"
                @result="getItemNumber"
              />
            </div> -->

            <h3>转化情况</h3>
            <div class="expression-section-row">
              <el-form-item label="购系统课" prop="user_status">
                <el-checkbox-group v-model="form.user_status">
                  <el-checkbox label="0">未购买</el-checkbox>
                  <el-checkbox label="3">已年系统课</el-checkbox>
                  <el-checkbox label="2">已半年系统课</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <!-- </div> -->
        </el-form-item>

        <el-form-item
          label="跟进策略备注"
          prop="remark"
          :label-width="formLabelWidth"
          v-if="activeType !== 'ADVANCEDSEARCH'"
          class="remark"
        >
          <el-input
            type="textarea"
            placeholder="跟进策略备注，可在左侧对应人群组操作中查看"
            v-model="form.remark"
            maxlength="200"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>

        <!-- 高级筛选操作 只能保存为个人自定义人群组，如果超过3个，不显示此功能 -->
        <el-form-item
          v-if="activeType === 'ADVANCEDSEARCH' && personalCount < 4"
        >
          <p>
            <span style="margin-right: 15px;"
              >是否将筛选条件保存到左侧个人自定义的人群分组中</span
            >
            <el-radio v-model="isAddPersonalGroup" :label="false">否</el-radio>
            <el-radio v-model="isAddPersonalGroup" :label="true">是</el-radio>
          </p>
        </el-form-item>
        <template v-if="isAddPersonalGroup && personalCount < 4">
          <el-form-item
            :label-width="formLabelWidth"
            prop="name"
            class="group-name"
          >
            <el-input
              v-model="form.name"
              maxlength="15"
              show-word-limit
              auto-complete="off"
              placeholder="请添加人群组名称"
              append="0979709"
            ></el-input>
            <p class="mg-l-10">
              个人自定义人群组上限【3】
            </p>
          </el-form-item>
          <el-form-item
            class="remark"
            prop="remark"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              placeholder="跟进策略备注，可在左侧对应人群组操作中查看"
              v-model="form.remark"
              maxlength="200"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
        </template>
      </el-form>

      <div class="drawer__footer">
        <!-- 高级筛选时，清空筛选项 -->
        <el-button
          size="small"
          v-if="activeType === 'ADVANCEDSEARCH'"
          @click="handelReset('ruleForm')"
          >清空筛选</el-button
        >
        <el-button size="small" @click="handelCancel(false)">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSubmit('ruleForm')"
          :loading="loading"
          :disabled="
            personalCount >= 4 &&
              activeTab === 'PERSONAL' &&
              !this.currentGroup.id
          "
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { isToss, deepClone, getDataType } from '@/utils/index'
import Channel from '@/components/MSearch/searchItems/channel.vue'
import CustomSelectRegions from '@/components/MSearch/searchItems/customSelectRegions.vue'
import FormItemNumber from './FormItemNumber'
import FormItemDate from './FormItemDate'
import { FOLLOW_EXPRESS_STATUS_LIST } from '@/utils/enums'
export default {
  components: {
    Channel,
    CustomSelectRegions,
    FormItemNumber,
    FormItemDate
  },
  props: {
    // 当前登录人身份 1-经理，2-组长，3-组员
    rankId: Number,
    drawer: {
      type: Boolean,
      default: false
    },
    // 人群组类型 PERSONAL, DEPARTMENT, ADVANCEDSEARCH
    activeType: {
      type: String,
      default: ''
    },
    // 个人自定义群组的数量，最多3个
    personalCount: {
      type: Number,
      default: 0
    },
    // 编辑时的当前组数据
    currentGroup: {
      type: Object,
      default: () => {}
    },
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    title() {
      // return this.activeType === 'ADVANCEDSEARCH'
      //   ? '高级筛选'
      //   : '自定义人群分组'
      let t = ''
      switch (this.activeType) {
        case 'ADVANCEDSEARCH':
          t = '高级筛选'
          break
        case 'PERSONAL':
          t = '个人自定义人群分组'
          break
        case 'DEPARTMENT':
          t = '部门自定义人群分组'
          break
      }
      return t
    },
    drawerWidth() {
      // return this.activeType === 'ADVANCEDSEARCH' ? '50%' : '50%'
      return '50%'
    },
    currentGroupData() {
      return this.activeType && this.activeType !== 'ADVANCEDSEARCH'
        ? this.currentGroup
        : {}
    }
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (value && !Number.isInteger(value)) {
        const { field } = rule
        console.log(field)
        this.form[field] = ''
        // callback(new Error('请输入数字'))
        // this.$message.error('请输入数字')
      }
      callback()
    }
    return {
      drawerStatus: this.drawer,
      direction: 'rtl',
      loading: false,
      activeTab: this.activeType,
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
      expressList: FOLLOW_EXPRESS_STATUS_LIST,
      form: {
        name: '',
        remark: '',
        sex: '',
        pay_channel: [],
        base_painting: '',
        added_wechat: '',
        added_group: '',
        follow: '',
        is_login: '',
        express_status: [],
        mobile_province: '',
        mobile_city: '',
        city: '', // 自定义字段，临时存放 城市
        // all_complete_course_count: '',
        complete_course_count: '',
        join_course_count: '',
        // all_join_course_count: '',
        task_count: '',
        // device_type: [],
        // join_course_rate: '',
        // complete_course_rate: '',
        // task_rate: '',
        // listen_comment_rate: '',
        last_login_time: '',
        last_join_time: '',
        last_complete_time: '',
        user_status: []
      },
      rules: {
        name: [
          {
            required: true,
            message: '请添加人群组名称',
            trigger: 'blur'
          }
        ]
      },
      // 数字（整数）rules
      numberRules: [
        { validator: checkNumber, trigger: ['change', 'blur'] }
        // { max: 6, message: '最大6位数字', trigger: 'blur' }
      ],
      formLabelWidth: '100px',
      innerFormLabelWidth: '80px',
      timer: null,
      now: 0,
      currentCity: [],
      isAddPersonalGroup: false,
      showAdd: false
    }
  },
  watch: {
    currentGroupData(val, old) {
      console.log(val, 'currentGroup')

      this.handelReset()
      // if (val === old) return
      // 编辑时
      if (val.id && this.activeType !== 'ADVANCEDSEARCH' && val.isGroup) {
        const { name, expression, remark } = val
        const obj = JSON.parse(expression)
        const expressionObj = deepClone(obj)
        console.log(expressionObj)

        // 城市处理
        if (expressionObj.city) {
          const city = JSON.parse(expressionObj.city)
          this.currentCity = (city && city.data) || []
        }
        Object.assign(this.form, {
          name,
          ...expressionObj,
          remark
        })
        this.now = Date.now()
      }
      if (this.activeType === 'ADVANCEDSEARCH' && this.searchParams) {
        const search = this.searchParams
        const searchObj = deepClone(search)
        // 城市处理
        if (searchObj.city) {
          const city = JSON.parse(searchObj.city)
          this.currentCity = (city && city.data) || []
        }
        Object.assign(this.form, {
          name: '',
          remark: '',
          ...searchObj
        })
      }
    },

    // 是否将高级搜索条件保存为个人自定义人群组
    isAddPersonalGroup(val) {
      this.form.name = ''
      this.form.remark = ''
    },

    drawer(val) {
      this.drawerStatus = val
    }
  },
  methods: {
    // handleTab() {
    //   console.log(this.activeTab)

    //   if (this.personalCount >= 4 && this.activeTab === 'PERSONAL') {
    //     this.$message.warning('个人自定义人群组只支持添加3个')
    //   }
    // },

    // 获取输入数据返回的表达式
    getItemNumber(res) {
      console.log(res, 'expression')
      Object.assign(this.form, res.ex)
      console.log(this.form)
    },

    // 获取渠道
    getChannel(res) {
      console.log(res, '渠道')
      Object.assign(this.form, res)
    },

    // 获取城市
    getRegion(res) {
      console.log(res, '城市')
      Object.assign(this.form, {
        city: res.data && res.data.length > 0 ? JSON.stringify(res) : ''
      })
    },

    handleSubmit(formName) {
      console.log('submit')

      if (this.loading) {
        return
      }
      this.$refs[formName].validate((valid) => {
        console.log(valid, 'valid')

        if (valid) {
          // const api = ['addTeacherFollowGroup', 'updateTeacherFollowGroup']
          let api = 'addTeacherFollowGroup'
          console.log(this.form)
          const form = deepClone(this.form)

          this.loading = true
          /**
           * 处理数据
           * * teacherId -老师ID
           * name - 组名
           * expression - 条件数据 String
           * remark - 备注
           * type - 自定义类型: PERSONAL(个人)，DEPARTMENT(部门)，ADVANCEDSEARCH(高级搜索)
           */
          const teacherId = isToss()
          const { name, remark } = this.form
          delete form.name
          delete form.remark
          const expression = {}
          // 不为空的保存.为空的去掉。如果都为空，提示选择条件
          for (const key in form) {
            if (Object.keys(form).includes(key)) {
              const item = form[key]
              console.log(item)

              if ((!item && item !== 0) || item.length === 0) continue
              Object.assign(expression, { [`${key}`]: item })
            }
          }

          /**
           * 高级筛选
           * 是否添加到个人自定义人群组
           */
          // 不添加到个人自定义群组，直接搜索，条件可以为空
          if (this.activeType === 'ADVANCEDSEARCH') {
            this.$emit('advanced-search', expression)
            if (!this.isAddPersonalGroup) {
              this.handelCancel(false)
              return
            }
          }
          /**
           * 高级筛选 结束
           */

          if (Object.keys(expression).length === 0) {
            this.$message.error('请选择过滤条件')
            this.loading = false
            return
          }

          const params = {
            teacherId,
            type:
              this.activeType === 'ADVANCEDSEARCH'
                ? 'PERSONAL'
                : this.activeTab, // 用 activeTab
            name,
            remark,
            // expression
            expression: JSON.stringify(expression)
          }

          /**
           * 如果是编辑，组装参数
           */
          if (this.currentGroup && this.currentGroup.id) {
            const { id, teacherId } = this.currentGroup
            const edit = {
              id,
              teacherId
            }
            Object.assign(params, edit)
            api = 'updateTeacherFollowGroup'
            delete params.type
          }

          console.log(params, 'params')

          this.$http.User[`${api}`](params)
            .then((res) => {
              console.log(res)
              if (res && res.code === 0) {
                this.$message.success('提交成功')
                this.handelCancel(JSON.stringify(expression))
              }
              this.loading = false
            })
            .catch((_) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 关闭
    // handleClose() {
    //   this.$confirm('确定关闭？')
    //     .then((_) => {
    //       this.handelCancel()
    //     })
    //     .catch((_) => {})
    // },

    // 取消
    handelCancel(status = false) {
      this.loading = false
      // if (this.activeType !== 'ADVANCEDSEARCH') {
      //   this.handelReset('ruleForm')
      // }
      this.$emit('close', status)
    },

    // 清空表单
    handelReset(formName, isOut = false) {
      // this.$refs[formName].resetFields()
      // if (this.activeType !== 'ADVANCEDSEARCH') return
      const { form } = this
      for (const key in form) {
        if (Object.keys(form).includes(key)) {
          const item = form[key]
          const type = getDataType(item)
          if (type === 'Array') {
            form[key] = []
            // } else if (type === 'Object') {
            // form[key] = {}
          } else {
            form[key] = ''
          }
        }
      }
      this.currentCity = []
      this.now = Date.now()
      // this.isAddPersonalGroup = false

      // 如果是外部清空
      if (isOut) {
        console.log('close')
        this.handelCancel(`{}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-drawer {
  .title {
    cursor: pointer;
    &-tips {
      position: relative;
      top: 2px;
      margin-left: 10px;
    }
  }
  &__content {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    &::v-deep {
      .el-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        > .el-form-item {
          > .el-form-item__label {
            position: absolute;
            width: inherit;
            font-size: 13px;
          }
          > .el-form-item__content {
            margin-left: 0 !important;
            margin-top: 25px;
            height: 100%;
          }
        }
      }
    }
    p {
      ::v-deep {
        .el-radio__label {
          font-size: 12px;
        }
      }
    }
    .expression-el-form {
      flex: 1;
      overflow: hidden;
      ::v-deep {
        > .el-form-item__content {
          overflow: auto;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          margin-top: 40px !important;
        }
      }
    }
    .remark {
      ::v-deep {
        > .el-form-item__content {
          margin-top: 40px !important;
        }
      }
    }
    .tips {
      margin: 0 0 15px 0;
      line-height: 24px;
      .red-color {
        color: #ff8b8c;
        font-weight: bold;
      }
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }

    .mg-l-10 {
      margin-left: 10px;
    }

    .group-name {
      width: 550px;
      ::v-deep {
        .el-form-item__content {
          display: flex;
          align-items: center;
          .el-input {
            flex: 1;
          }
        }
        .el-form-item__error {
          margin-top: -13px;
        }
      }
    }

    .w-80 {
      width: 80px;
    }
    .w-100 {
      width: 100px;
    }

    .expression-section {
      padding-bottom: 50px;
      padding-left: 20px;
      // padding: 0 0 0 20px;
      // overflow: auto;
      // height: 100%;
      // border: 1px solid #dcdfe6;
      // border-radius: 4px;
      h3 {
        position: relative;
        padding-left: 10px;
        margin-bottom: 0;
        font-size: 12px;
        &::before {
          content: '';
          position: absolute;
          width: 3px;
          height: 12px;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background-color: #606266;
          color: #606266;
        }
      }
      &-row {
        display: flex;
        justify-content: space-around;
        .flex-item {
          ::v-deep {
            .el-form-item__content {
              display: flex;
            }
          }
        }
        ::v-deep {
          .el-form-item {
            margin-bottom: 0;
            flex: 1;
            // &:first-child {
            //   width: 45%;
            // }
            // &:last-child {
            //   flex: 1;
            // }
            .el-form-item__content,
            label,
            span {
              font-size: 12px;
              // font-weight: normal;
            }
            span {
              font-weight: normal;
            }
          }
          .el-checkbox,
          .el-radio {
            margin-right: 10px;
            &__label {
              padding-left: 5px;
            }
          }
        }
      }
    }
    .drawer__footer {
      padding-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .advance-search {
    .expression-el-form,
    .group-name,
    .remark {
      ::v-deep {
        > .el-form-item__content {
          margin-top: 0 !important;
        }
        .el-form-item__error {
          margin-top: 0;
        }
      }
    }
  }
}
::v-deep {
  .el-drawer__header {
    padding: 10px 20px;
    margin-bottom: 0;
  }
  .el-drawer__body {
    overflow: hidden;
  }
  .el-input__count {
    background: transparent;
    line-height: 20px;
  }
}
</style>
