<template>
  <div class="home">
    <van-search shape="round" placeholder="搜索医生、科室、医院" disabled @click="isSearch = true" />
    <van-dropdown-menu active-color="#00d2c3">
      <van-dropdown-item v-model="defaultVal" :options="defaultOptions" @close="handleSort()" />
      <van-dropdown-item v-model="sortVal" :options="sortOptions" @close="handleSort()" />
    </van-dropdown-menu>
    <div class="recommend-doctor">
      <hospital :hospitals="hospitalData" @goRouter="goRouter"></hospital>
    </div>
    <Search :is-search="isSearch" @cancel="isSearch = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getHospitalList } from '../../common/api'
import { initMap, countDistance } from '../../hooks/userPosition'
import Hospital from '@/components/Hospital/Index.vue'
import Search from '../search/search.vue'
import { getUrlParams } from '../../common/function'
interface RequestParams {
  size: number
  page: number
  homePageEntrance?: string | number
}
export default defineComponent({
  components: {
    Hospital,
    Search,
  },
  setup() {
    const router = useRouter()
    const hospitalData = ref([])
    const isSearch = ref(false)
    const defaultVal = ref(0)
    const sortVal = ref('a')
    const defaultOptions = [
      { text: '默认排序', value: 0 },
      { text: '距离排序', value: 1 },
    ]
    const sortOptions = [
      { text: '升序', value: 'a' },
      { text: '降序', value: 'b' },
    ]
    const { homePageEntrance } = getUrlParams()
    const position: any = initMap() // 获取地理位置信息
    console.log(position, 'position')
    onMounted(async () => {
      const params: RequestParams = { page: 1, size: 20 }
      if (homePageEntrance) {
        params.homePageEntrance = homePageEntrance
      }
      const { data: res } = await getHospitalList(params)
      if (position.lat && position.lng) {
        hospitalData.value = addDistance(res.list, position.lat, position.lng)
      } else {
        hospitalData.value = res.list
      }
    })
    const addDistance = (list, lat, lng) => {
      list.forEach((item) => {
        if (item.map) {
          const [hos_lng, hos_lat] = item.map.split(',')
          item.distance = countDistance(
            hos_lat,
            hos_lng,
            Number(lat),
            Number(lng)
          )
        } else {
          item.distance = 0
        }
      })
      return list
    }
    watch(position, (state, preState) => {
      if (state.lat && state.lng && state.isPosition) {
        hospitalData.value = addDistance(
          hospitalData.value,
          state.lat,
          state.lng
        )
      }
    })
    const handleSort = () => {
      const generateRules = (a, b) => {
        return {
          '0_a': a.qty - b.qty,
          '0_b': a.distance - b.distance,
          '1_a': b.qty - a.qty,
          '1_b': b.distance - a.distance,
        }
      }
      hospitalData.value = hospitalData.value.sort((a, b) => {
        const selectVal = `${defaultVal.value}_${sortVal.value}`
        return generateRules(a, b)[selectVal]
      })
    }
    const goRouter = (obj) => {
      const routing: any = {
        path: `/department/${obj.hisUnitId}`,
      }
      if (homePageEntrance) {
        routing.query = {
          homePageEntrance,
        }
      }
      router.push(routing)
    }
    return {
      hospitalData,
      isSearch,
      sortOptions,
      defaultOptions,
      defaultVal,
      sortVal,
      handleSort,
      goRouter,
    }
  },
})
</script>

<style scoped>
</style>