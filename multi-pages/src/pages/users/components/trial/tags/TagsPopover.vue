<template>
  <div class="popover-box">
    <h4>学员当前标签</h4>
    <main>
      <div v-show="personTagList" class="title">个人库标签</div>
      <tags-item
        v-for="(tag, index) in personTagList"
        :key="index"
        size="small"
        :text="tag.name"
      ></tags-item>
      <div class="title" v-show="departmentTagList">部门库标签</div>
      <div v-for="(val, key) in departmentTagList" :key="key">
        <div class="name"><span class="v-line"></span>{{ key }}</div>
        <tags-item
          v-for="item in val"
          :key="item.id"
          size="small"
          :text="item.name"
        ></tags-item>
      </div>
    </main>
  </div>
</template>

<script>
import tagsItem from './TagsItem.vue'
export default {
  name: 'tagsPopover',
  components: {
    tagsItem
  },
  props: {
    tagPopoverData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      personTagList: [],
      departmentTagList: null,
      count: 0
    }
  },
  created() {
    // console.log(this.tagPopoverData)
    // 不知为何执行了三次，先阻止了
    this.count++
    if (this.count > 1) {
      return
    }
    // 学员个人标签
    this.initPersonTag(this.tagPopoverData)
    // 学员部门标签
    this.initDepartmentTag(this.tagPopoverData)
  },
  methods: {
    initPersonTag(data) {
      this.personTagList = data.studentLabel
    },
    initDepartmentTag(data) {
      this.departmentTagList = data.stuDepLabel
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-box {
  width: 200px;
  height: 200px;
  overflow: auto;
  padding: 10px 0;
  h4 {
    margin: 0px;
    margin-bottom: 15px;
    font-size: 14px;
  }
  main {
    .title {
      color: #969495;
      margin: 10px 0;
    }
    .v-line {
      display: inline-block;
      width: 3px;
      height: 11px;
      background-color: #606266;
      vertical-align: middle;
      margin-right: 3px;
    }
    .name {
      color: #606266;
      margin: 10px 0 5px;
    }
  }
}
</style>
