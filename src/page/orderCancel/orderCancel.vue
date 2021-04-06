<template>
  <div class="order-cancel">
    <ul class="order-cancel-info">
      <li>
        <div>预约医院：</div>
        <div>{{orderInfo.hosName}}</div>
      </li>
      <li>
        <div>预约科室：</div>
        <div>{{orderInfo.deptName}}</div>
      </li>
      <li>
        <div>预约医生：</div>
        <div>{{orderInfo.doctorName}}</div>
      </li>
      <li>
        <div>预约时间：</div>
        <div>{{orderInfo.toDate}} {{orderInfo.beginTime}} - {{orderInfo.endTime}}</div>
      </li>
      <li>
        <div>订单状态：</div>
        <div>{{orderInfo.hosName}}</div>
      </li>
      <li>
        <div>支付状态：</div>
        <div>{{$filters.transformPayStatus(orderInfo.payStatus)}}</div>
      </li>
      <li class="special-tips">在线申请取消预约挂号订单，已支付的相关费用将在取消订单后自动退款</li>
    </ul>
    <div class="fill-reason">
      <div>订单取消原因：</div>
      <textarea
        name
        cols="30"
        rows="15"
        placeholder="请输入取消原因"
        maxlength="200"
        v-model="refundReason"
      />
    </div>
    <div class="handle-right">
      <van-button
        plain
        round
        type="primary"
        size="small"
        color="#00d2c3"
        text="返 回"
        style="width: 35%; margin-right: 10px"
        @click="back"
      />
      <van-button
        type="primary"
        size="small"
        round
        text="提 交"
        color="#00d2c3"
        :disabled="!refundReason"
        @click="handleCancel"
        style="width: 35%"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { SessionStorage } from 'storage-manager-js'
import { cancelOrderRefund } from '../../common/api'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
export default defineComponent({
  setup () {
    const state = reactive({
      orderInfo: {},
      refundReason: ''
    })
    const router = useRouter()
    state.orderInfo = SessionStorage.get('currentOrderDetail')
    const handleCancel = async () => {
      const params = {
        orderId: state.orderInfo.orderId,
        refundReason: state.refundReason
      }
      const { success, needRefund } = await cancelOrderRefund(params)
      if (!needRefund && needRefund !== undefined) {
        return Toast.fail('您已取消该订单')
      } else if (success) {
        Toast.success('取消成功')
      } else {
        Toast.fail(message || '取消失败')
      }
      setTimeout(() => {
        router.go(-1)
      }, 1000)
    }
    const back = () => router.go(-1)
    return {
      ...toRefs(state),
      handleCancel,
      back
    }
  }
})
</script>

<style lang="scss" scoped>
.order-cancel {
  padding: 14px;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-size: 14px;
}
.order-cancel-info {
  background-color: #fff;
  border-radius: 6px;
  padding: 14px;
  li {
    display: flex;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}
textarea {
  width: 100%;
  box-sizing: border-box;
  border: none;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
}
.handle-right {
  text-align: right;
  margin-top: 10px;
}
.fill-reason {
  margin-top: 10px;
}
.special-tips {
  color: rgb(240, 137, 137);
}
</style>