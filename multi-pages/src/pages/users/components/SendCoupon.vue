<!--
 * @Descripttion: 发放优惠券操作   copy from /pages/studentTeam/components/TabPane/components/couponPopover.vue
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-20 15:27:12
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-02 21:59:21
-->
<template>
  <div class="students-popup">
    <div>
      <el-dialog
        class="students-popup-dialog"
        title="发放优惠卷"
        :visible.sync="issueCoupons"
        width="30%"
        :append-to-body="true"
      >
        <el-form label-width="100px">
          <el-form-item label="选择优惠卷:">
            <el-select
              v-model="value"
              :placeholder="
                `${dropdownDefault.amount}元  ${dropdownDefault.name} `
              "
              popper-class="select-sty"
              no-data-text="没有更多优惠券了"
              size="mini"
            >
              <el-option
                v-for="item in couponDropdown"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置有效期:">
            <el-date-picker
              v-model="couponsTime"
              type="datetime"
              placeholder="请设置优惠券到期时间"
              :picker-options="pickerOptions"
              size="mini"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="issueCoupons = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="issueCouponsBtn">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="发放优惠券"
        :visible.sync="couponConf"
        width="30%"
        :append-to-body="true"
        top="40vh"
      >
        <i class="el-icon-warning">
          <span>
            是否确认向用户发放"{{ dropdownDefault.amount }}元
            {{ dropdownDefault.name }}"
            <br />
            <!-- 此优惠券有效期{{ dropdownDefault.expire }}天 -->
            到期时间:{{ formcouponsTime }}
          </span>
        </i>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="couponConf = false">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="couponconfBtn(dropdownDefault.id)"
          >
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div class="paid-out">
      <el-dialog
        title="发放完毕"
        :visible.sync="couponSuccessful"
        width="30%"
        :append-to-body="true"
        top="40vh"
      >
        <div
          class="coupons-successful"
          v-show="paidOut === 'OK' || paidOut === 'ALL'"
        >
          {{ paidoutOk }}张优惠券发放成功
        </div>
        <div
          class="coupons-failure"
          v-show="paidOut === 'NO' || paidOut === 'ALL'"
        >
          {{ paidoutNo }}张优惠券发放失败
        </div>
        <!-- 优惠卷发放失败原因 -->
        <div class="failure-why" v-show="paidOut === 'NO' || paidOut === 'ALL'">
          <div v-for="(item, index) in failureWhy" :key="index">
            {{ index + 1 }}.用户:{{ item.mobile }} 失败原因:{{
              item.errorReason
            }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="couponsucBtn">取 消</el-button>
          <el-button size="mini" type="primary" @click="couponsucBtn">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { formatData } from '@/utils'
export default {
  props: {
    couponData: Array,
    selectUserId: Array
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 发放优惠券弹窗
      issueCoupons: false,
      // 发放优惠券弹窗下拉菜单
      dropdownDefault: {},
      couponDropdown: [],
      // 下拉框值
      value: '',
      // 优惠卷时间
      couponsTime: '',
      // 格式化优惠券
      formcouponsTime: '',
      // 优惠券发放确认弹窗
      couponConf: false,
      // 优惠券发放成功弹窗
      couponSuccessful: false,
      // 优惠券发放显示判断
      paidOut: '',
      // 优惠卷发放成功条数
      paidoutOk: '',
      // 优惠卷发放失败条数
      paidoutNo: '',
      // 优惠卷发放失败原因
      failureWhy: []
    }
  },
  created() {},
  mounted() {},
  watch: {
    couponData(val) {
      val.forEach((data) => {
        if (data.id === '6') {
          this.dropdownDefault = data
        }
      })
    }
  },
  methods: {
    // 优惠券下拉弹窗
    issueCouponsBtn() {
      if (!this.couponsTime) {
        this.$message({
          showClose: true,
          message: '请设置优惠券到期时间',
          type: 'warning'
        })
      } else if (
        this.couponsTime &&
        new Date().getTime() > new Date(this.couponsTime).getTime()
      ) {
        this.$message({
          showClose: true,
          message: '到期时间应大于当前时间',
          type: 'warning'
        })
      } else {
        this.issueCoupons = false
        this.couponConf = true
        this.formcouponsTime = formatData(this.couponsTime, 's')
      }
    },
    // 优惠券发放确认弹窗
    couponconfBtn(id) {
      this.couponConf = false
      this.couponSuccessful = true
      this.$http.Team.sendCoupon(
        id,
        new Date(this.couponsTime).getTime(),
        this.selectUserId
      ).then((res) => {
        if (res.payload.length === 0) {
          // 成功
          this.paidoutOk = this.selectUserId.length
          this.paidOut = 'OK'
        } else if (res.payload.length === this.selectUserId.length) {
          // 失败
          this.paidoutNo = this.selectUserId.length
          this.paidOut = 'NO'
          this.failureWhy = res.payload
        } else if (res.payload.length !== this.selectUserId.length) {
          // 都显示
          this.paidoutOk = this.selectUserId.length - res.payload.length
          this.paidoutNo = res.payload.length
          this.paidOut = 'ALL'
          this.failureWhy = res.payload
        }
      })
    },
    // 优惠券发放成功弹窗
    couponsucBtn() {
      this.couponSuccessful = false
      this.$emit('couponSendSucc')
    }
  }
}
</script>
<style scoped lang="scss">
.coupons-successful {
  font-size: 14px;
  text-align: center;
  color: #606266;
}
.coupons-failure {
  font-size: 14px;
  text-align: center;
  color: #f56c6c;
}
// 优惠卷发放失败原因
.failure-why {
  margin: 10px 0 0 0;
  height: 100px;
  overflow: auto;
  border: 1px solid #eaeefb;
  text-align: center;
  font-size: 14px;
  color: #909399;
}
.students-popup-dialog {
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-select--mini {
      width: 220px;
    }
  }
}
</style>
