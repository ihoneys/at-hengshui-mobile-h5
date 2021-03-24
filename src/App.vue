<template>
  <div id="app">
    <router-view />
    <TabBar v-if="this.$route.meta.isTabBar && !isAppEnv" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import methodInAppEnv from './hooks/fromApp'
import initTypeList from './init'
import TabBar from '@/components/Tabbar/Index.vue'
export default defineComponent({
  name: 'App',
  components: {
    TabBar,
  },
  setup() {
    const { isAppEnv, getAuthortionLogin } = methodInAppEnv()
    initTypeList() // 默认获取医生等级、身份证基础数据
    return {
      isAppEnv,
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
