<template>
  <div class="order-detail">
    <custom-van-nav-bar />
    <div class="item-flex">
      <div class="order-status">订单状态：</div>
      <div class="order-status-text" style="color: #00d2c3">
        {{ $filters.transformOrderStatus(item.orderStatus) }}
      </div>
    </div>
    <div class="order-doctor-info">
      <van-image
        width="70"
        height="70"
        radius="6"
        :src="item.img ? item.img : defaultImg"
        fit="cover"
      ></van-image>
      <div class="order-doctor-colum">
        <div>{{ item.doctorName }}</div>
        <div>{{ item.hosName }}</div>
        <div>{{ item.deptName }}</div>
      </div>
    </div>
    <ul class="order-list-info">
      <li class="order-list-info-li">
        <div class="item-color">就诊人</div>
        <div class="flex-1">{{ $filters.decrypt(item.trueName) }}</div>
      </li>
      <li class="order-list-info-li">
        <div class="item-color">门诊费用</div>
        <div class="flex-1">{{ item.orderAmt }}</div>
      </li>
      <li class="order-list-info-li">
        <div class="item-color">创建时间</div>
        <div class="flex-1">{{ item.orderTime }}</div>
      </li>
      <li class="order-list-info-li">
        <div class="item-color">就诊时间</div>
        <div class="flex-1">{{ item.toDate }} {{ item.beginTime }}-{{ item.endTime }}</div>
      </li>
      <li class="order-list-info-li">
        <div class="item-color">支付状态</div>
        <div class="flex-1">{{ $filters.transformPayStatus(item.payStatus) }}</div>
      </li>
      <li class="order-list-info-li">
        <div class="item-color">取号密码</div>
        <div class="flex-1" style="color: red; font-weight: bold">
          {{ item.platformPassword || '无' }}
        </div>
      </li>
      <li>
        <img id="barcode" src="" alt="" />
      </li>
    </ul>
    <div class="bottom-btn">
      <div class="bottom-btn-special">
        <router-link class="ml-10" to="/reviews">
          <van-button round text="写点评" color="#00d2c3" size="small" v-if="!item.isEvaluate" />
        </router-link>
        <van-button
          class="ml-10"
          round
          text="再次预约"
          color="#00d2c3"
          size="small"
          @click.stop="handleAgin(item)"
        />
      </div>
      <router-link class="ml-10" to="/orderCancel">
        <van-button
          round
          plain
          text="取消预约"
          color="#ddd"
          size="small"
          class="status-btn"
          v-if="$filters.isCanelReserve(item.orderStatus)"
        />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { SessionStorage } from 'storage-manager-js'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { queryOrderDetails } from '../../common/api'
import defaultImg from '../../assets/defaultDoc.png'
import JsBarcode from "jsbarcode"
export default defineComponent({
  setup() {
    const item = ref<any>({})
    const router = useRouter()
    item.value = SessionStorage.get('currentOrderDetail')
    onMounted(async () => {
      const { success, data } = await queryOrderDetails(item.value)
      if (success) {
        item.value.orderStatus = data.orderStatus
        loadCodeImage(item.value.platformPassword)
      } else {
        router.go(-1)
      }
    })
    const loadCodeImage = (platformPassword) => {
      if (!platformPassword) return
      JsBarcode("#barcode", platformPassword, {
        format: "CODE128",
        displayValue: false, //是否在条形码下方显示文字
        textPosition: "bottom", //设置文本的垂直位置
      });
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
      router.push('DoctorPage')
    }
    return {
      handleAgin,
      item,
      defaultImg,
    }
  },
})
</script>

<style lang="scss">
.item-flex,
.order-doctor-info,
.order-list-info,
.bottom-btn {
  background-color: #fff;
  font-size: 14px !important;
}
.order-detail {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 100%;
  background-color: #f5f5f5;
}
.item-flex {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
}
.order-doctor-info {
  padding: 14px;
  display: flex;
  border-bottom: 1px solid #f5f5f5;
}
.order-list-info {
  padding: 14px;
  border-radius: 4px;
  line-height: 30px;
}
.item-color {
  color: #666;
  width: 90px;
}
.order-list-info-li {
  display: flex;
}
.flex-1 {
  flex: 1;
  word-break: break-all;
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
.bottom-btn {
  text-align: right;
  padding: 20px 14px;
  margin-top: 10px;
}
.status-btn {
  color: #666 !important;
}
.bottom-btn-special {
  display: inline;
}
</style>
