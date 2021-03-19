<template>
  <van-tabbar route fixed active-color="#00d2c3" inactive-color="#333333">
    <van-tabbar-item replace to="/">
      <span>首页</span>
      <template #icon="props">
        <img :src="props.active ? home.active : home.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/user">
      <span>我的</span>
      <template #icon="props">
        <img :src="props.active? me.active : me.inactive" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
import activeMe from '@/assets/active-me.png'
import inactiveMe from '@/assets/inactive-me.png'
import activeHome from '@/assets/active-home.png'
import inactiveHome from '@/assets/inactive-home.png'
import { defineComponent, reactive, toRefs } from 'vue'
export default defineComponent({
  name: 'TabBar',
  setup() {
    const state = reactive({
      active: 'home',
      me: {
        active: activeMe,
        inactive: inactiveMe,
      },
      home: {
        active: activeHome,
        inactive: inactiveHome,
      },
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
