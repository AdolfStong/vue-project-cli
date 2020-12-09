<template>
  <el-tag :size="size" :closable="closable" class="tag-class" @close="closeTag">
    {{ text }}
  </el-tag>
</template>

<script>
export default {
  name: 'tagsItem',
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    text: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    closeTag() {
      this.$emit('closeTag', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-class {
  margin: 3px 4px;
  border: none;
  color: #f56c6c;
  border: 1px solid #f9d7d7;
  background-color: #fdfbfb;
  padding: 0 3px;
  height: 16px;
  line-height: 16px;
}
/deep/ {
  .el-icon-close {
    color: #a8b3cb;
    right: 0px;
  }
}
</style>
