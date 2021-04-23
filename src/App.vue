<template>
  <!-- <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view> -->
  <router-view />
  <TabBar v-if="this.$route.meta.isTabBar && !runEnvApp" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getUrlParams } from './common/function'
import { Cookie, SessionStorage } from 'storage-manager-js'
import initTypeData from './init'
import TabBar from '@/components/Tabbar/Index.vue'
export default defineComponent({
  name: 'App',
  components: {
    TabBar,
  },
  setup() {
    let runEnvApp = false
    const { from, others } = getUrlParams()
    if (from || others) {
      /**app外部链接进入  */
      runEnvApp = true
      Cookie.set('isApp', runEnvApp, { useSecure: false })
    }

    if (Cookie.has('isApp')) {
      runEnvApp = true
    }

    const { getDictionarys } = initTypeData() // 默认获取医生等级、身份证基础数据
    if (!SessionStorage.has('dictionarys')) {
      getDictionarys()
    }
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
