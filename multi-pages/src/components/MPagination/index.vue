<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 19:18:17
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-03-21 19:18:17
 * @Description: 分页组件
 * 参数同 el-pagination
 -->

<template>
  <el-row
    class="m-pagination"
    :class="{ opened: !isCollapse, close: isCollapse }"
    :style="{ width: isCollapse ? close : open }"
    type="flex"
  >
    <el-col>
      <!-- 这里是自定义的附加信息 -->
      <slot></slot>
    </el-col>
    <el-col>
      <el-pagination
        :layout="defaultLayout"
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        :pager-count="pagerCount"
        :page-sizes="
          pageSizeArr && pageSizeArr.length !== 0
            ? pageSizeArr
            : [10, 20, 30, 40, 50, 100]
        "
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <span class="page-slot"> {{ page }} / 共{{ totalPage }}页</span>
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex' // 帮助方法不省事啊
export default {
  props: {
    // 每页显示条数
    pageSizeArr: {
      type: Array,
      default: null
    },
    // width动态传参
    open: {
      type: String,
      default: `calc(100vw - 180px - 240px - 170px - 30px)`
    },
    close: {
      type: String,
      default: `calc(100vw - 180px - 240px - 50px - 30px)`
    },
    // 是否需要显示页码，设置 pager
    showPager: {
      type: Boolean,
      default: false
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 20
    },
    // 总条数 与 pageCount 先其一传值
    total: {
      type: Number,
      default: 0
    },
    // 总页数
    pageCount: {
      type: Number,
      default: 0
    },
    // 最多显示几个页码，showPager为true时有效
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    },
    defaultLayout() {
      // 这里是有顺序的 ！！！
      let layout = this.showPager
        ? 'prev, slot, pager, next, total'
        : 'prev, slot, next, total'
      if (this.pageSizeArr) {
        layout = layout.concat(',sizes')
      }
      return layout
    },
    // 总页数. 如果有 pageCount 用 pageCount, 没有用 total / pageSize
    totalPage() {
      return Math.ceil(this.total / this.sizePage) || 1
    },
    page: {
      get() {
        return this.currentPage
      },
      set(val) {
        return val
      }
    }
  },
  data() {
    return {
      sizePage: this.pageSize
    }
  },
  methods: {
    // 选择不同条数数
    handleSizeChange(page) {
      this.sizePage = page
      this.$emit('current-pagesizes', this.sizePage)
    },
    handleCurrentChange(page) {
      this.page = page
      // 回调
      this.$emit('current-change', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-pagination {
  background: #fff;
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  color: #4d4d4d;
  transition: width 0.3s;
  // &.opened {
  //   width: calc(100vw - 180px - 240px - 170px - 30px);
  // }
  // &.close {
  //   width: calc(100vw - 180px - 240px - 50px - 30px);
  // }
  .el-pagination {
    display: flex;
    justify-content: flex-end;
  }
  .page-slot {
    font-weight: normal;
  }
}
</style>
