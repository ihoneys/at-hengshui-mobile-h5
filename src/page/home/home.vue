<template>
  <div class="home">
    <div v-if="hospitalData != null">
      <van-search shape="round" placeholder="搜索医生、科室、医院" disabled @click="isSearch = true" />
      <van-dropdown-menu active-color="#00d2c3">
        <van-dropdown-item v-model="defaultVal" :options="defaultOptions" />
        <van-dropdown-item v-model="sortVal" :options="sortOptions" />
      </van-dropdown-menu>
      <div class="recommend-doctor">
        <hospital :hospitals="hospitalData"></hospital>
      </div>
    </div>
    <Search :is-search="isSearch" @cancel="isSearch = false" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { getHospitalList, dictionaryQuery } from '../../common/api'
import { SessionStorage } from 'storage-manager-js'
import Hospital from '@/components/Hospital/Index.vue'
import Search from '../search/search.vue'
export default defineComponent({
  components: {
    Hospital,
    Search,
  },
  setup() {
    let hospitalData = ref([])
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
    onMounted(async () => {
      const params = { page: 1, size: 10000 }
      const { data: res } = await getHospitalList(params)
      hospitalData.value = res.list
      if (!SessionStorage.has('dictionarys')) {
        getDictionarys()
      }
    })
    const getDictionarys = async () => {
      const { success, data } = await dictionaryQuery()
      if (success && !SessionStorage.has('dictionarys')) {
        SessionStorage.set('dictionarys', data)
        const needArray = [
          { setName: 'id_type', getName: 'id_type' },
          { setName: 'payTypeArr', getName: 'pay_type' },
          { setName: 'orderTypeArr', getName: 'order_status' },
        ]
        needArray.forEach((v) => {
          const baseData = data.filter((el) => el.dictType == v.getName)
          SessionStorage.set(v.setName, baseData)
        })
      }
    }
    return {
      hospitalData,
      isSearch,
      sortOptions,
      defaultOptions,
      defaultVal,
      sortVal,
    }
  },
})
</script>

<style scoped>
</style>