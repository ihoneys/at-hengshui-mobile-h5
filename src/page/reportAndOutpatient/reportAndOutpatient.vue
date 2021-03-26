<template>
  <div class="clinic">
    <van-list>
      <van-cell
        is-link
        :title="column.unitName"
        v-for="(column,index) in payingHospitals"
        :key="index"
        @click="handleList(column)"
      />
    </van-list>
    <NoData v-if="!payingHospitals.length" :message="message[type]" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getReportList } from '../../common/api'
import { SessionStorage, LocalStorage } from 'storage-manager-js'
import NoData from '../../components/NoData/Index.vue'
import { getUrlParams, sm4Decrypt } from '../../common/function'
export default defineComponent({
  components: {
    NoData,
  },
  setup() {
    let payingHospitals = ref([])
    const message = {
      report: '未查询您在医院的检查报告！',
      outpatient: '未查询到需缴费医院！',
    }
    const isApp = SessionStorage.get('isApp') || false
    const { type } = useRoute().params
    const { mbolieType } = getUrlParams()
    const { phone } = LocalStorage.get('userInfo') || ''
    const getList = async () => {
      const params = {
        regionType: 'hengshui',
        bussType: type === 'report' ? 'report' : 'pay',
        regionId: '3025',
        clientType: isApp ? 'app' : 'weixin',
        systemType: mbolieType || '',
        mobile: phone ? sm4Decrypt(phone) : '',
      }
      const { success, data } = await getReportList(params)
      if (success) {
        payingHospitals = data
      }
    }
    getList()
    return {
      payingHospitals,
      message,
      type,
    }
  },
})
</script>

<style lang="scss" scoped>
.hospital-list {
  font-size: 18px;
  padding: 0 10px;
  .hospital-list-item {
    padding: 15px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>