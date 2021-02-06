<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Test />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import Test from '@/components/Test.vue'
export default defineComponent({
  name: 'App',
  components: {
    Test,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const { count, name } = store.state
    console.log(count, name)
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>