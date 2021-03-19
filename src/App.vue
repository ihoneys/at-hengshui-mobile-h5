<template>
  <div id="app">
    <router-view />
    <TabBar v-if="this.$route.meta.isTabBar" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TabBar from '@/components/Tabbar/Index.vue'
export default defineComponent({
  name: 'App',
  components: {
    TabBar,
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
