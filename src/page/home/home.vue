<template>
  <div class="home">
    <van-search
      shape="round"
      placeholder="搜索医生、科室、医院"
      disabled
      @click="isSearch = true"
    />
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUrlParams } from '../../common/function'
import useOperationSequencing from './useOperationSequencing'
import useInitHospitalData from './useInitHospitalData'
import Hospital from '@/components/Hospital/Index.vue'
import Search from '../search/search.vue'
import MyInput from '@/components/Input/Index.vue'
export default defineComponent({
  components: {
    Hospital,
    Search,
    MyInput,
  },
  setup() {
    const router = useRouter()
    const isSearch = ref<boolean>(false)
    // 是否app核酸入口进入
    const { homePageEntrance } = getUrlParams()

    // 医院数据
    const { hospitalData } = useInitHospitalData(homePageEntrance)

    // 操作医院排序
    const { defaultVal, sortVal, defaultOptions, sortOptions, handleSort } = useOperationSequencing(
      hospitalData
    )

    // 路由跳转
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

<style scoped></style>
