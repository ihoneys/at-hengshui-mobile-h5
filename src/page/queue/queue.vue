<template>
  <div>
    <Hospital :hospitals="hospitalData" @goRouter="goRouter" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getHospitalList } from '../../common/api'
import Hospital from '@/components/Hospital/Index.vue'
export default defineComponent({
  components: {
    Hospital,
  },
  setup() {
    const router = useRouter()
    const hospitalData = ref([])
    onMounted(async () => {
      const params = { page: 1, size: 20 }
      const { data: res } = await getHospitalList(params)
      hospitalData.value = res.list
    })
    const goRouter = (obj) => {
      router.push(`/queueSeeDoctor/${obj.hisUnitId}`)
    }
    return {
      hospitalData,
      goRouter,
    }
  },
})
</script>

<style></style>
