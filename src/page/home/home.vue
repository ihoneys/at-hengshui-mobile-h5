<template>
  <div class="home" ref="homeBox">
    <div class="recommend-doctor" v-if="hospitalData != null">
      <hospital :hospitals="hospitalData"></hospital>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { getHospitalList } from '../../common/api'
import Hospital from '@/components/Hospital/Index.vue'
export default defineComponent({
  components: {
    Hospital,
  },
  setup() {
    let hospitalData = ref([])
    onMounted(async () => {
      const params = { page: 1, size: 10000 }
      const { data: res } = await getHospitalList(params)
      console.log(res, '8888')
      hospitalData.value = res.list
    })
    return {
      hospitalData,
    }
  },
})
</script>

<style scoped>
</style>