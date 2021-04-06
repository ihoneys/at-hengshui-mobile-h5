<template>
  <div>
    <van-field v-model="inputVal" v-bind="$attrs"></van-field>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const inputVal = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      },
    })
    return {
      inputVal
    }
  }
})
</script>

<style>
</style>