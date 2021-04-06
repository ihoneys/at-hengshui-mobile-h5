<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  setup(props, ctx) {
    let title = ref('')
    const route = useRoute()
    const router = useRouter()

    ctx.emit('click-left')
    const onClickLeft = () => {
      console.log(route.name)
      router.go(-1)
    }
    title.value = route.meta.title as string
    return {
      onClickLeft,
      title,
    }
  },
})
</script>

<style>
</style>