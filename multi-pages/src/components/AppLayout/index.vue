<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />
    <div class="main-container" :style="hiddenTopAndSidebar">
      <div :class="{ 'fixed-header': fixedHeader }">
        <topbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import Topbar from './Topbar.vue'
import TagsView from './TagsView/index'
import Sidebar from './Sidebar/index.vue'
import AppMain from './AppMain.vue'
// import MultiTabbed from './MultiTabbed.vue'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'Layout',
  components: {
    Topbar,
    Sidebar,
    TagsView,
    AppMain
    // MultiTabbed
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    // 不显示topbar和sidebar时样式
    hiddenTopAndSidebar() {
      return this.isFrom1v1 ? { 'margin-left': 0, 'margin-top': '-50px' } : {}
    },
    // from 1v1 查看用户详情时
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  },
  created() {
    if (sessionStorage.getItem('store')) {
      // 页面加载前读取sessionStorage里的状态信息
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(decodeURIComponent(sessionStorage.getItem('store')))
        )
      )
    }
    window.addEventListener('beforeunload', () => {
      // 在页面刷新前将vuex里的信息保存到sessionStorage里
      sessionStorage.setItem(
        'store',
        encodeURIComponent(JSON.stringify(this.$store.state))
      )
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';
// @import '~@/assets/styles/sidebar.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
