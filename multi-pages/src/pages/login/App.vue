<!--
 * @Descripttion: 
 * @version: 
 * @Author: Shentong
 * @Date: 2020-03-16 17:04:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-30 17:01:19
 -->
<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'login',
  components: {}
}
</script>
