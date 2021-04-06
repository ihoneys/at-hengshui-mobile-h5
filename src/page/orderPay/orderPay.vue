<template>
  <custom-van-nav-bar />
  <div class="order-pay">
    <div class="pay-tpis">
      <div>订单提交成功，请您尽快支付！</div>
      <!-- <div class="count-time mt-10">
        <van-count-down format="DD 天 HH 时 mm 分 ss 秒" :time="time" @finish="onFinish" />
        <span>内未完成支付订单将自动关闭</span>
      </div>-->
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
import { isWeixinBrower } from '../../common/function'
import { invokingPrepaid, weChatCallback, paymentAppH5 } from '../../common/api'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup () {
    const currentOrder = SessionStorage.get('currentOrderDetail')
    const initTimeValue = () => {
      // let SET_TIME = 1300 * 60 * 1000
      const transformStamp = Date.parse((`${currentOrder.toDate} ${currentOrder.beginTime}`).replace(/-/g, '/'))
      const currentTime = new Date().getTime()
      const surplusTime = transformStamp - currentTime
      return surplusTime > 0 ? surplusTime : 0
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
      } else {
        const postAppData = {
          appName: '健康衡水',
          appPackageName: 'com.hengshui.jkhs',
          appType: 'Android',
          orderNo: currentOrder.orderId
        }
        pullWechatPay_H5(postAppData)
      }
    }
    const onBridgeReadyPayFor = (signParam) => {
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

    // h5支付
    const pullWechatPay_H5 = async (postAppData) => {
      const { success, message, mweb_url } = await paymentAppH5(postAppData)
      if (success) {
        window.location.href = mweb_url
      } else {
        Toast.fail(message)
      }
    }
    const onFinish = () => {
      state.time = 0
    }
    return {
      ...toRefs(state),
      onFinish,
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
  font-size: 14px;
}
.pay-tpis {
  padding: 50px 30px;
  background-color: #f0e2d2;
  .van-count-down {
    display: inline-block;
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
  // display: flex;
  // align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>