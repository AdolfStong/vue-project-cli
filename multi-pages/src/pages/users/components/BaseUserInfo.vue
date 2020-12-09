<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 21:37:01
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-20 21:37:01
 * @Description: 用户基础信息 - 头像，用户名，手机号，性别，生日，基础
 *  性别
    0: '',
    1: '男',
    2: '女',
    3: '保密'
 -->
<template>
  <div class="user-info">
    <!-- <div class="user-info-l">
      <div class="user-info-head">
        <img :src="head" alt="" />
      </div>
      <i class="el-icon-male" v-if="user && +user.sex === 1"></i>
      <i class="el-icon-female female" v-if="user && +user.sex === 2"></i>
    </div> -->
    <div>
      <p class="primary-text">
        <span @click="onClick">{{ (user && user.mobile) || '' }}</span> -
        <span @click="onClick" class="username">{{
          (user && user.username) || '-'
        }}</span>
      </p>
      <p>
        <i
          v-if="user && user.mobile"
          class="el-icon-document-copy"
          @click="handLeCopy(user.mobile)"
        ></i>
        <!-- vip -->
        <svg class="iconfont-vip" v-if="is_sys_label_vip">
          <use xlink:href="#iconvip"></use>
        </svg>
        <i class="el-icon-male male" v-if="user && +user.sex === 1"></i>
        <i class="el-icon-female female" v-if="user && +user.sex === 2"></i>
        {{ birthday }} · {{ basePainting || '' }} ·
        <span v-if="user && user.send_id > 0" style="color: rgb(255, 139, 140);"
          >R</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { GetAgeByBrithday, copyText } from '@/utils/index'
import { BASE_PAINTING } from '@/utils/enums'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    // 用户系统标签
    sysLabel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
    }
  },
  computed: {
    // 头像
    head() {
      const head = (this.user && this.user.head) || this.defaultHead
      return `${head}?x-oss-process=image/resize,l_100`
    },

    // 生日
    birthday() {
      return this.user && this.user.birthday
        ? GetAgeByBrithday(this.user.birthday)
        : '-'
    },
    // 绘画基础
    basePainting() {
      const base = this.user
        ? this.user.base_painting || this.user.basepainting
        : ''
      return base ? BASE_PAINTING[base] : '-'
    },
    // 是不是vip标签 - 固定标签: vip
    is_sys_label_vip() {
      if (!this.sysLabel || this.sysLabel === '-') return false
      const label = this.sysLabel.split(',')
      return label.includes('vip')
    }
  },
  methods: {
    // 点击用户信息事件回调, 参数是用户ID
    onClick() {
      // this.$emit('handle-click', this.user.id || this.user.studentid)
      this.$emit('handle-click', this.user)
    },

    // 复制学员手机号
    handLeCopy(mobile) {
      copyText(mobile, '手机号不存在')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/mixin.scss';
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  // &-l {
  //   position: relative;
  //   i {
  //     position: absolute;
  //     right: 10px;
  //     bottom: 0;
  //     background-color: #369bff;
  //     display: block;
  //     width: 18px;
  //     height: 18px;
  //     line-height: 18px;
  //     border-radius: 100%;
  //     overflow: hidden;
  //     color: #fff;
  //     text-align: center;
  //     font-weight: bolder;
  //     &.male {
  //       color: #59cbff;
  //     }
  //     &.female {
  //       background-color: #f23589;
  //     }
  //   }
  // }
  // &-head {
  //   margin-right: 16px;
  //   width: 36px;
  //   height: 36px;
  //   border-radius: 100%;
  //   overflow: hidden;
  //   background-color: #eee;
  //   img {
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
  p {
    margin: 0;
    // position: relative;
    i {
      position: relative;
      top: 5px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 100%;
      overflow: hidden;
      text-align: center;
      font-weight: bolder;
      color: #369bff;
      &.male {
        color: #59cbff;
      }
      &.female {
        color: #f23589;
      }
    }
    .iconfont-vip {
      position: relative;
      top: 2px;
      width: 14px;
      height: 14px;
      fill: #f96137;
    }
    .username {
      position: relative;
      top: 4px;
      width: 60px !important;
      display: inline-block;
      @include ellipsis();
    }
  }
}
</style>
