<template>
  <div>
    <h1>Test</h1>
    <p>{{ count }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, reactive, toRefs, ref } from "vue"
export default defineComponent({
  setup() {
    const state = reactive({ count: 0 })
    return state
  }
})
</script>

<style>
</style>