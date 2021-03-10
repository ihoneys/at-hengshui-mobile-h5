<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    class="order-list-wrapper"
    offset="10"
  >
    <ul class="order-list">
      <li
        class="item-li"
        v-for="(item,index) in orderList"
        :key="index"
        @click.stop="handleOrder(item)"
      >
        <div class="item-flex">
          <div class="order-status">订单状态：</div>
          <div class="order-status-text">{{tranformStatus(item.orderStatus)}}</div>
        </div>
        <div class="pd-16">
          <div class="order-doctor-info">
            <van-image width="70" height="70" radius="6" :src="item.img" fit="cover"></van-image>
            <div class="order-doctor-colum">
              <div>{{item.doctorName}}</div>
              <div>{{item.hosName}}</div>
              <div>{{item.deptName}}</div>
            </div>
          </div>
          <ul class="order-list-info">
            <li class="order-list-info-li">
              <div class="item-color">就诊人</div>
              <div>{{tranformDecrypt(item.trueName)}}</div>
            </li>
            <li class="order-list-info-li">
              <div class="item-color">门诊费用</div>
              <div>{{item.orderAmt}}</div>
            </li>
            <li class="order-list-info-li">
              <div class="item-color">创建时间</div>
              <div>{{item.orderTime}}</div>
            </li>
            <li class="order-list-info-li">
              <div class="item-color">就诊时间</div>
              <div>{{ item.toDate }} {{ item.beginTime }}-{{item.endTime}}</div>
            </li>
            <li class="order-list-info-li">
              <div class="item-color">支付状态</div>
              <div>{{tranformPayStatus(item.payStatus)}}</div>
            </li>
          </ul>
        </div>
        <div class="click-btn">
          <van-button
            round
            plain
            color="#00d2c3"
            size="small"
            class="status-btn"
            @click.stop="payOrder(item)"
          >立即支付</van-button>
          <van-button
            v-if="item.orderStatus == 1 || item.orderStatus == 6 "
            round
            plain
            color="#00d2c3"
            size="small"
            class="status-btn"
            @click.stop="handleAgin(item)"
          >再次预约</van-button>
        </div>
      </li>
    </ul>
  </van-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { getOrderList, getSystemTime, checkOrderStatus } from '../../common/api'
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import {
  tranformStatus,
  tranformPayStatus,
  tranformDecrypt,
} from '../../hooks/transform'
import { isObjEmpty, createMessage } from '../../common/function'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const state = reactive({
      orderList: [] as any[],
      finished: false,
      loading: false,
      list: [] as any[],
    })
    const router = useRouter()
    const { userId } = LocalStorage.get('userInfo')
    const requestParams = {
      userId,
      page: 0,
      size: 10,
    }
    const currentStamp = new Date().getTime()
    const onLoad = async () => {
      requestParams.page++
      const { success, data } = await getOrderList(requestParams)
      const { data: times } = await getSystemTime()
      if (success && !isObjEmpty(data.list)) {
        state.loading = false
        // state.orderList = calculatePayTime(
        //   [...state.orderList, ...data.list],
        //   times.systemTimeStamp
        // )
        state.orderList = [...state.orderList, ...data.list]
        if (state.orderList.length >= data.total) {
          state.finished = true
        }
      }
    }
    const calculatePayTime = (arr, systemTimeStamp) => {
      const SET_TIME = 5 * 60 * 1000
      arr.forEach((obj) => {
        const transformStamp = Date.parse(obj.orderTime.replace(/-/g, '/'))
        console.log(systemTimeStamp - transformStamp <= SET_TIME)
        if (obj.orderAmt === 0 || obj.orderAmt * 1 === 0) {
          obj.isPayButton = false
        }
        if (
          systemTimeStamp - transformStamp <= SET_TIME &&
          obj.orderStatus === 3 &&
          obj.payStatus === 1
        ) {
          obj.isPayButton = true
        } else {
          obj.isPayButton = false
        }
      })
      return arr
    }
    const handleAgin = (objs) => {
      const obj = Object.create(null)
      obj.depId = objs.depId
      obj.doctorId = objs.doctorId
      obj.unitId = objs.unitId
      if (SessionStorage.has('currentDoctorInfo')) {
        SessionStorage.delete('currentDoctorInfo')
      }
      SessionStorage.set('currentDoctorInfo', objs)
      router.push('docPage')
    }
    const handleOrder = (orderDetail) => {
      setOrderStore(orderDetail)
      router.push('orderDetail')
    }
    const payOrder = async (item) => {
      const { success, message } = await checkOrderStatus(item)
      if (success) {
        setOrderStore(item)
        router.push('orderPay')
      } else {
        createMessage(message, '订单错误')
      }
    }
    const setOrderStore = (obj) => {
      SessionStorage.set('currentOrderDetail', obj)
    }
    return {
      ...toRefs(state),
      onLoad,
      tranformStatus,
      tranformPayStatus,
      tranformDecrypt,
      handleAgin,
      handleOrder,
      payOrder,
    }
  },
})
</script>

<style lang="scss" scoped>
.item-flex {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
}
.pd-16 {
  padding: 16px;
}
.item-li {
  margin-bottom: 10px;
  background-color: #fff;
}
.order-list-wrapper {
  font-size: 14px;
  background-color: #f5f5f5;
  height: auto;
}
.order-doctor-info {
  display: flex;
}
.order-list-info {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  line-height: 30px;
}
.item-color {
  color: #666;
  width: 80px;
}
.order-list-info-li {
  display: flex;
  align-items: center;
}
.order-doctor-colum {
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
}
.click-btn {
  display: flex;
  justify-content: flex-end;
}
.status-btn {
  margin-bottom: 14px;
  margin-right: 14px;
  text-align: right;
}
</style>