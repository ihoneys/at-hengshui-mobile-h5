<template>
  <!-- <div class="box"> -->
    <van-tabbar route safe-area-inset-bottom active-color="#00d2c3" inactive-color="#333333">
      <van-tabbar-item replace to="/">
        <span>首页</span>
        <template #icon="props">
          <img
            class="tabbar-img"
            :src="props.active ? home.active : home.inactive"
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <span>我的</span>
        <template #icon="props">
          <img
            class="tabbar-img"
            :src="props.active? me.active : me.inactive"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  <!-- </div> -->
</template>

<script lang="ts">
import activeMe from '@/assets/active-me.png'
import inactiveMe from '@/assets/inactive-me.png'
import activeHome from '@/assets/active-home.png'
import inactiveHome from '@/assets/inactive-home.png'

export default {
  name: 'TabBar',
  data() {
    return {
      active: 'home',
      me: {
        active: activeMe,
        inactive: inactiveMe,
      },
      home: {
        active: activeHome,
        inactive: inactiveHome,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.colorA {
  color: #00d2c3;
}
.tabbar-img {
  width: 24px;
  height: 24px;
}
</style>
