<template>
  <div class="home" ref="homeBox">
    <div v-if="hospitalData != null && !isSearch">
      <van-search shape="round" placeholder="搜索医生、科室、医院" @focus="onFocus" />
      <div class="recommend-doctor">
        <hospital :hospitals="hospitalData"></hospital>
      </div>
    </div>
    <Search :is-search="isSearch" @cancel="onCancel" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { getHospitalList, dictionaryQuery } from '../../common/api'
import { SessionStorage } from 'storage-manager-js'
import Hospital from '@/components/Hospital/Index.vue'
import Search from '@/components/Search/Index.vue'
export default defineComponent({
  components: {
    Hospital,
    Search,
  },
  setup() {
    let hospitalData = ref([])
    const isSearch = ref(false)
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
        const idTypeArr = data.filter((el) => el.dictType == 'id_type')
        SessionStorage.set('id_type', idTypeArr)
        const payTypeArr = data.filter((el) => el.dictType == 'pay_type')
        SessionStorage.set('payTypeArr', payTypeArr)
        const orderTypeArr = data.filter((el) => el.dictType == 'order_status')
        SessionStorage.set('orderTypeArr', orderTypeArr)
      }
    }
    const onCancel = () => {
      isSearch.value = false
    }
    const onSearch = () => {

    }
    const onFocus = () => {
      isSearch.value = true
    }
    return {
      hospitalData,
      onCancel,
      isSearch,
      onFocus,
    }
  },
})
</script>

<style scoped>
</style>