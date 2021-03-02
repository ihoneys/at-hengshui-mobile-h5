<template>
  <div class="app">
    <TabBar v-if="this.$route.meta.isTabBar" />
  </div>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import TabBar from '@/components/Tabbar/Index.vue'
export default defineComponent({
  name: 'App',
  components: {
    TabBar,
  },
  setup(props) {
    const store = useStore<GlobalDataProps>()
  },
})
</script>

<style lang="scss">
div {
  font-size: 16px;
}
h1,h2,h3,h4{
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
