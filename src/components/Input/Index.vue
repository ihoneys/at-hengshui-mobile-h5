<template>
  <van-field
    v-model="value"
    type="number"
    v-bind="$attrs"
    :disabled="isDisabled"
    :name="data.model"
    :label="data.label"
    :placeholder="'请输入' + data.label"
    :required="true"
    :rules="[{ required: true, message: `请输入${data.label}` }]"
  >
    <template #extra>
      <div class="extra-div">{{data.unit}}</div>
    </template>
  </van-field>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String
    }
  },
  setup (props, ctx) {
    const value = ref(props.modelValue)
    watch(value, (newVal, oldVal) => {
      ctx.emit('input', newVal)
    }, { lazy: true })
    return {
      value
    }
  }
})
</script>

<style>
</style>