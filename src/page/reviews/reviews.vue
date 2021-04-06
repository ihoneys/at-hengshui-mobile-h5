<template>
  <div class="reviews">
    <custom-van-nav-bar title="就诊点评" />
    <div class="reviews-base">
      <van-image width="60px" height="60px" radius="8" fit="cover" :src="rateInfo.img" />
      <div class="reviews-doctor">
        <h4>{{rateInfo.doctorName}}</h4>
        <div class="dep-name">
          <span>{{rateInfo.hosName}}</span>
          <i style="margin:0 4px">|</i>
          <span>{{rateInfo.deptName}}</span>
        </div>
      </div>
    </div>
    <div class="reviews-contanier">
      <h3>总体评价</h3>
      <van-rate color="#ffd21e" v-model="rateVal" />
      <div class="disease-name">
        <div>疾病名称：</div>
        <input type="text" placeholder="请输入疾病名称" v-model="disease" />
      </div>
      <div class="context">
        <textarea
          class="fill-context"
          cols="30"
          rows="8"
          placeholder="分享一下您的这次看病经历吧！，您的评价将为其他患者就医提供宝贵的参考哦"
          maxlength="200"
          v-model="refundReason"
        />
        <div class="text-hint" v-show="refundReason.length < 10">
          <span>最少需要</span>
          <span style="color: red">10</span>
          <span>字，还需要输入{{ stillNumber - refundReason.length }}字</span>
        </div>
      </div>
      <div class="checked-box">
        <van-checkbox v-model="checked" checked-color="#00D3C2" shape="square">匿名评价</van-checkbox>
      </div>
    </div>
    <van-button
      round
      block
      color="#00d2c3"
      text="提 交"
      :disabled="(disease && refundReason.length < 10)"
      @click="submitReviews"
    />
  </div>
</template>

<script>
import { SessionStorage } from 'storage-manager-js'
import { Toast } from 'vant'
import { defineComponent, reactive, toRefs } from 'vue'
import { saveEvaluate } from '../../common/api'
export default defineComponent({
  setup () {
    const state = reactive({
      rateVal: 0,
      disease: '',
      refundReason: '',
      stillNumber: 10,
      checked: true
    })
    const rateInfo = SessionStorage.get('currentOrderDetail')
    const submitReviews = async () => {
      const postData = {
        disease: state.disease,
        content: state.refundReason,
        score: state.rateVal,
        orderId: rateInfo.orderId,
        doctorId: rateInfo.doctorId,
        evaluateName: state.checked ? '' : rateInfo.patientName
      }
      const { success, message } = await saveEvaluate(postData)
      if (success) {
        Toast.success('评价成功')
      } else {
        Toast.fail(message)
      }
    }
    return {
      ...toRefs(state),
      submitReviews,
      rateInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.reviews {
  background-color: #f5f5f5;
  height: 100vh;
}
.reviews-base {
  padding: 14px;
  display: flex;
  align-items: center;
  background-color: #fff;
}
.reviews-contanier {
  background-color: #fff;
  padding: 14px;
  text-align: center;
  margin-top: 10px;
  h3 {
    margin-bottom: 10px;
  }
}
.context {
  background: #f5f5f5;
  border-radius: 5px;
}
.fill-context {
  box-sizing: border-box;
  width: 100%;
  height: 150px;
  line-height: 1.5;
  padding: 10px;
  background: rgba(245, 245, 245, 1);
  border: none;
  border-radius: 4px;
  resize: none;
}
.disease-name {
  background-color: #f5f5f5 !important;
  display: flex;
  align-items: baseline;
  border-radius: 5px;
  padding: 10px;
  color: #999;
  margin-bottom: 10px;
  margin-top: 10px;
  input {
    outline: none;
    border: none;
    background-color: rgba(245, 245, 245, 1);
    columns: #333;
  }
}
.reviews-doctor {
  margin-left: 20px;
}
.checked-box {
  margin-top: 10px;
}
.text-hint {
  text-align: right;
  padding: 0 10px 10px 0;
}
.dep-name {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
</style>