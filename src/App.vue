<template>
  <div id="app">
    <router-view />
    <TabBar v-if="this.$route.meta.isTabBar && !runEnvApp" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getUrlParams } from './common/function'
import { SessionStorage } from 'storage-manager-js'
import initTypeList from './init'
import TabBar from '@/components/Tabbar/Index.vue'
export default defineComponent({
  name: 'App',
  components: {
    TabBar,
  },
  setup() {
    const runEnvApp = ref(false)
    const { from, tokenKey, others } = getUrlParams()
    if (from || tokenKey || others) { // app外部链接进入
      SessionStorage.set('isApp', true)
      runEnvApp.value = true
    }
    initTypeList() // 默认获取医生等级、身份证基础数据
    return {
      runEnvApp,
    }
  },
})
</script>

<style lang="scss">
#app {
  font-size: 15px;
}
h1,
h2,
h3,
h4 {
  margin-top: 0px;
  margin-bottom: 0px;
}
.click-active:active {
  background: #cccccc;
}
</style>
