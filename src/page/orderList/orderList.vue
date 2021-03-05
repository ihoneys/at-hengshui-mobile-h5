<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    class="order-list-wrapper"
  >
    <ul class="order-list">
      <li class="item-li" v-for="(item,index) in orderList" :key="index">
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
      </li>
    </ul>
  </van-list>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getOrderList } from '../../common/api'
import { LocalStorage } from 'storage-manager-js'
import {
  tranformStatus,
  tranformPayStatus,
  tranformDecrypt,
} from '../../hooks/transform'
import { stat } from 'fs'
export default defineComponent({
  setup() {
    const state = reactive({
      orderList: [] as any[],
      finished: false,
      loading: false,
    })
    const { userId } = LocalStorage.get('userInfo')
    const requestParams = {
      userId,
      page: 1,
      size: 5,
    }
    onMounted(() => {
      getOrder()
    })
    const getOrder = async () => {
      const { success, data, total } = await getOrderList(requestParams)
      if (success) {
        if (total === state.orderList.length) return
        state.orderList = [...state.orderList, ...data.list]
        console.log(state.orderList)
      }
    }
    const onLoad = () => {
      requestParams.page++
      getOrder()
    }
    return {
      ...toRefs(state),
      onLoad,
      tranformStatus,
      tranformPayStatus,
      tranformDecrypt,
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
</style>