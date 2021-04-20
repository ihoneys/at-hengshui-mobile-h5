<template>
  <custom-van-nav-bar />
  <ColumnList :columnList="recordList" />
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import ColumnList from '@/components/ColumnList/Index.vue'
export default defineComponent({
  components: {
    ColumnList,
  },
  setup() {
    const state = reactive({
      recordList: [
        {
          path: 'recordData',
          label: '指标采集',
          isLeftIcon: true,
          iconName: 'notes-o',
        },
      ],
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style></style>
