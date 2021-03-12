<template>
  <div class="order-pay">
    <div class="pay-tpis">
      <div>订单提交成功，请您尽快支付！</div>
      <div class="count-time">
        <van-count-down :time="time" @finish="onFinish" />
        <span>内未完成支付订单将自动关闭</span>
      </div>
    </div>
    <div class="order-number">
      <div>订单编号：{{currentOrder.orderId}}</div>
      <div>
        支付金额：
        <span class="order-price">￥{{currentOrder.orderAmt}}元</span>
      </div>
    </div>
    <div class="pay-way">
      <div>支付方式</div>
      <div class="weChat-icon">
        <van-icon color="rgb(13, 184, 28)" size="60" name="wechat" />
        <span>微信支付</span>
      </div>
      <van-button round block :disabled="!time" color="#00d2c3" text="立即支付" @click="toPay" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { SessionStorage } from 'storage-manager-js'
import { tranformDecrypt } from '../../hooks/transform'
import { isWeixinBrower } from '../../common/function'
import { invokingPrepaid, weChatCallback } from '../../common/api'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup () {
    const currentOrder = SessionStorage.get('currentOrderDetail')
    const initTimeValue = () => {
      let SET_TIME = 1300 * 60 * 1000
      const transformStamp = Date.parse(currentOrder.orderTime.replace(/-/g, '/'))
      const currentTime = new Date().getTime()
      const surplusTime = currentTime - transformStamp
      return SET_TIME = surplusTime <= SET_TIME ? SET_TIME - surplusTime : 0
    }
    const initTimeVal = initTimeValue()
    const state = reactive({
      time: initTimeVal,
      currentOrder
    })
    const router = useRouter()
    const toPay = async () => {
      const isWeChatBrowser = isWeixinBrower()
      const orderParams = {
        orderNo: currentOrder.orderId,
        tradeType: "JSAPI"
      }
      if (isWeChatBrowser) {
        const { signParam, success, message } = await invokingPrepaid(orderParams)
        if (!success) return Toast.fail(message)
        delete signParam.packages
        signParam.orderNo = currentOrder.orderId
        pullWechatPay(signParam)
      }
    }
    const onBridgeReadyPayFor = (signParam) => {
      console.log(signParam, 'currentOrder.orderId')
      WeixinJSBridge.invoke('getBrandWCPayRequest', signParam, res => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          const backParams = {
            orderId: currentOrder.orderId
          }
          weChatCallback(backParams).then(res => { })
          Toast({
            type: 'success',
            message: '支付成功',
            onClose: () => {
              router.push('orderList')
            }
          })
        } else {
          Toast.fail('未完成支付')
        }
      })
    }
    const pullWechatPay = (signParam) => {
      if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReadyPayFor, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReadyPayFor);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReadyPayFor);
        }
      } else {
        console.log(666)
        onBridgeReadyPayFor(signParam);
      }
    }
    const onFinish = () => {
      state.time = 0
    }
    return {
      ...toRefs(state),
      onFinish,
      tranformDecrypt,
      toPay
    }
  }
})
</script>

<style lang="scss" scoped>
.order-pay {
  background-color: #f5f5f5;
  height: 100vh;
  padding: 14px;
}
.pay-tpis {
  padding: 50px 30px;
  line-height: 30px;
  background-color: #f0e2d2;
  .van-count-down {
    color: red;
  }
}
.order-number {
  margin: 10px 0;
  background-color: #ffff;

  div {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
    &:last-child {
      border-bottom: none;
    }
  }
}
.order-price {
  color: red;
  font-weight: bold;
}
.pay-way {
  padding: 14px 14px 70px;
  background-color: #ffff;
}
.weChat-icon {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.count-time {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>