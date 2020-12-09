<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-13 22:00:22
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-13 22:00:22
 * @Description: 多页签打开
 -->
<template>
  <section class="multi-tabbed-container d-flex">
    <div class="tab-list">
      <ul class="d-flex">
        <li
          :class="{ current: k === tabbed.currentTabbed }"
          v-for="(tab, k) in tabbedData"
          :key="k"
        >
          <span @click="goto(k)">{{ tab.meta.title }}</span>
          <i
            class="el-icon-close"
            @click="handleClose(k)"
            v-if="k !== currentTabbed"
          ></i>
        </li>
      </ul>
    </div>
    <!-- <div class="btn-close-all">关闭全部</div> -->
  </section>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      tabList: {},
      current: ''
    }
  },
  computed: {
    ...mapGetters(['tabbed']),
    tabbedData() {
      console.log(this.tabbed)

      return this.tabbed.tabbedList || this.tabList
    },
    currentTabbed() {
      return this.tabbed.currentTabbed || this.current
    }
  },
  mounted() {
    this.getTabs()
    // this.current = sessionStorage.getItem('currentMultiTab')
  },
  methods: {
    ...mapActions('tabbed', ['setCurrentTabbed', 'setTabbedList']),
    getTabs() {
      const multiTabbed = sessionStorage.getItem('multiTabbed')
      const currentMultiTab =
        this.tabbed.currentTabbed | sessionStorage.getItem('currentMultiTab') ||
        ''
      const tabs = JSON.parse(multiTabbed || '{}')
      const len = Object.keys(tabs).length
      this.tabList = tabs
      this.setTabbedList(tabs)
      if (len === 0 || !len) return
      // 如果有选中的tab则使用; 如果当前页面已有打开页签测选中，没有默认选中第一个
      if (currentMultiTab) {
        this.current = currentMultiTab
      } else {
        const { pathname, hash } = location
        const path = `${pathname}${hash}`
        if (_.has(tabs, path)) {
          this.current = path
        }
        this.setCurrentTabbed(this.current)
        sessionStorage.setItem('currentMultiTab', this.current)
      }
    },
    goto(k) {
      this.setCurrentTabbed(k)
      sessionStorage.setItem('currentMultiTab', k)
      this.current = k
      location.href = k
    },

    handleClose(k) {
      delete this.tabbedData[k]
      this.setTabbedList(this.tabbedData)
      // TODO: 如果删除的是当前选中tab，设置选中的值，并跳转
      if (Object.keys(this.tabbedData).length > 0) {
        sessionStorage.setItem('multiTabbed', JSON.stringify(this.tabbedData))
        this.getTabs()
        return
      }
      sessionStorage.removeItem('multiTabbed')
    }
  }
}
</script>

<style lang="scss" scoped>
$gray: #d8dce5;
.multi-tabbed-container {
  align-items: center;
  padding: 0 10px;
  height: 34px;
  border-bottom: 1px solid $gray;
  background-color: #fff;
  font-size: 12px;
  .tab-list {
    flex: 1;
    overflow-x: auto;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    padding: 4px 10px 2px;
    list-style: none;
    border: 1px solid $gray;
    max-width: 140px;
    margin-left: 5px;
    cursor: pointer;
    &:hover {
      color: #2a75ed;
    }
    &.current {
      color: #fff;
      background-color: #2a75ed;
    }
    span {
      flex: 1;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    i {
      margin-left: 5px;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      line-height: 16px;
      text-align: center;
      overflow: hidden;
      &:hover {
        background-color: $gray;
      }
      &::before {
        transform: scale(0.6);
      }
    }
  }
}
</style>
