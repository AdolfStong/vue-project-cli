<template>
  <div>
    <!-- 只有一级目录 -->
    <el-menu-item
      :index="resolvePath(item.path)"
      @click="handleOpen(item, `${index.toString()}`)"
      v-if="!item.children"
    >
      <Item :icon="item.meta.icon" :title="item.meta.title" />
    </el-menu-item>
    <!-- 多级目录 -->
    <el-submenu :index="resolvePath(item.path)" v-else>
      <template slot="title">
        <Item :icon="item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'
import { mapGetters } from 'vuex'
import FixiOSBug from './FixiOSBug'
import path from 'path'

export default {
  name: 'SidebarItem',
  components: { Item },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    opened: {
      type: Array,
      default: () => []
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  data() {
    return {
      clicked: false
    }
  },
  methods: {
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    // 展开更多
    handleOpen(item, index = 0, hasChildren = false) {
      const { path, meta } = item
      const pathname = location.pathname
      let baseUrl = ''
      // const tabItem = {}
      const environment = ['dev', 'test']
      const enFlag = environment.some((item, index) => {
        return pathname.includes(item)
      })

      if (this.clicked && hasChildren) return
      this.clicked = hasChildren

      if (enFlag) {
        const pathArr = pathname.split('/')
        baseUrl = '/' + [pathArr[1]].join('/') // , pathArr[2]
      }

      if (this.$route.path === `${path}`) return
      // 同一模块,hash
      let pathUrl
      let pathUrl2
      if (pathname.includes(meta.module)) {
        if (path.split('/')[1] !== meta.module) {
          pathUrl = path
          pathUrl2 = `${baseUrl}/${meta.module}/#${path}`
        } else if (this.$route.path !== '/') {
          pathUrl = '/'
          pathUrl2 = `${baseUrl}${path}/#/`
        }
        this.$router.push(pathUrl)
      } else {
        if (path.split('/')[1] !== meta.module) {
          pathUrl2 = `${baseUrl}/${meta.module}/#${path}`
        } else {
          pathUrl2 = `${baseUrl}${path}/#/`
        }
        location.href = pathUrl2
      }
    },

    // 弹出二级导航的浮层
    handleMouseEndter() {
      // 如果菜单是收起状态，不执行此逻辑
      if (!this.sidebar.opened) return

      // TODO: 兼容性完善
      const { right, top, width, bottom } = this.$el.getBoundingClientRect()
      const height =
        document.body.clientHeight || document.documentElement.clientHeight
      const payload = {
        show: true,
        itemMenu: this.item,
        left: (right || width) - 6,
        top,
        bottom: 0
      }
      if (bottom > height - 20) {
        Object.assign(payload, {
          bottom: 10
        })
      }
      this.$store.commit('app/TOGGLE_POPMENU', payload)
    },
    // 隐藏二级浮层
    handleMouseLeave(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
