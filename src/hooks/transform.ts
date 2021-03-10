import { computed } from 'vue'
import { sm4Decrypt } from '../common/function'
export const tranformStatus = computed(() => {
  return function (value) {
    const statusObj = {
      1: '已取消',
      2: '已停诊',
      3: '预约成功',
      4: '已爽约',
      5: '已取号',
      6: '已就诊',
      7: '出号中',
      8: '出号失败',
    }
    return statusObj[value]
  }
})

export const tranformPayStatus = computed(() => {
  return function (value) {
    const payStatus = {
      1: '未支付',
      2: '已付款',
      3: '待退款',
      4: '已退款',
      5: '已支付确费中',
      6: '已支付确费失败',
    }
    return payStatus[value]
  }
})

export const tranformDecrypt = computed(() => {
  return function (value) {
    return sm4Decrypt(value)
  }
})

export const isCanelReserve = computed(() => {
  return (status) => status != 1 && status != 4 && status != 5 && status != 6
})
