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
</style>
