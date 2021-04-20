<template>
  <div>
    <!-- <van-field
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
        <div class="extra-div">{{ data.unit }}</div>
      </template> -->
    <div class="Input">
      <input
        type="text"
        @input="$emit('update:firstName', $event.target.value)"
        :value="firstName"
      />
      <input type="text" @input="$emit('update:lastName', $event.target.value)" :value="lastName" />
    </div>
    <!-- </van-field> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  inheritAttrs: false,
  props: {
    // data: {
    //   type: Object,
    //   required: true,
    // },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
    },
    inputVal: String,

    firstName: String,
    lastName: String,
  },
  inject: {
    book: {
      from: 'guide',
    },
  },
  setup(props, { emit }) {
    const updateValue = (e) => {
      emit('update:inputVal', e.target.value)
    }
    return {
      updateValue,
    }
  },
})
</script>

<style></style>
