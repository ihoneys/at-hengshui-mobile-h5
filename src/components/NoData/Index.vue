<template>
  <div class="no-data">
    <img width="100" height="100" lazy-load src="@/assets/nothing_2.png" />
    <p>{{message}}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    message: String,
  },
})
</script>

<style>
</style>