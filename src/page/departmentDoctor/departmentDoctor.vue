<template>
  <div>科室医生</div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'departmentDoctor',
  setup () {
    const route = useRoute()
  }
})
</script>

<style>
</style>