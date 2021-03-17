<template>
  <div class="order-wrapper">
    <custom-van-nav-bar />
    <ul class="order-info">
      <li>就诊医院： {{orderInfo.unitName}}</li>
      <li>就诊科室： {{orderInfo.depName || orderInfo.deptName}}</li>
      <li>就诊医生： {{orderInfo.doctorName}}</li>
      <li>挂号级别： {{orderInfo.zcName}}</li>
      <li>就诊费用： ￥{{orderInfo.guaHaoAmt}}元</li>
      <li>就诊日期： {{orderInfo.date}}</li>
      <li>就诊时段： {{orderInfo.endTime}}-{{orderInfo.beginTime}}</li>
      <li>支付说明： 网上支付功能已开通</li>
    </ul>
    <div class="selector" :class="{'border-bottom': !!current.patientId}" @click="show = true">
      <div>选择/申请健康卡</div>
      <img class="selector-icon" src="../../assets/tj.png" />
    </div>
    <div class="patient-card patient-outside" v-if="!!current.patientId">
      <div class="patient-card-name">
        <img v-if="current.sex === 0" src="../../assets/icon_people.png" />
        <img v-if="current.sex===1" src="../../assets/icon_people-2.png" />
        <span>{{current.patientName}}</span>
      </div>
      <div class="patient-card-number" v-if="current.patientId">
        <span>证件号</span>
        <span class="patient-card-number-no">{{idEncrypt(current.patientId)}}</span>
      </div>
    </div>
    <van-action-sheet :round="true" v-model:show="show" title="添加 / 选择就诊人">
      <div class="patient-list-content">
        <van-radio-group
          class="patient-list-group"
          v-for="(column,index) in memberList"
          @click="seleclted(column,index)"
          v-model="checked"
        >
          <div class="patient-card">
            <div class="patient-card-name">
              <img v-if="column.sex === 0" src="../../assets/icon_people.png" />
              <img v-if="column.sex===1" src="../../assets/icon_people-2.png" />
              <span>{{column.patientName}}</span>
            </div>
            <div class="patient-card-number">
              <span>证件号</span>
              <span class="patient-card-number-no">{{idEncrypt(column.patientId)}}</span>
            </div>
          </div>
          <van-radio :name="index"></van-radio>
        </van-radio-group>
        <div class="no-patient" v-if="!memberList.length">
          <img src="../../assets/nothing_2.png" />
          <p>暂无就诊人，请添加就诊人</p>
        </div>
        <router-link to="/addMember/orderAdd">
          <van-button type="primary" round block color="#00D2C3">添加就诊人</van-button>
        </router-link>
      </div>
    </van-action-sheet>
    <div class="submit-btn">
      <van-button
        type="primary"
        @click="submitOrder"
        :disabled="!(!!current.patientId)"
        round
        block
      >提交</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { SessionStorage } from 'storage-manager-js'
import { createOrder } from '../../common/api'
import { sm4Decrypt, computedAge, idEncrypt } from '../../common/function'
import getUserMemberHooks from '../../hooks/user'
interface SaveData {
  phone: string
  memberId: string
  birthDay: string
}
export default defineComponent({
  name: 'order',
  setup() {
    const state = reactive({
      current: {
        sex: '',
        patientId: '',
        patientName: '',
      },
      checked: null,
      show: false,
    })
    const store: SaveData = {
      phone: '',
      memberId: '',
      birthDay: '',
    }
    const router = useRouter()
    const { memberList } = getUserMemberHooks()
    const orderInfo = ref<any>({})
    orderInfo.value = SessionStorage.get('currentDoctorInfo')!
    const seleclted = (column, index) => {
      console.log(column, column.patientId)
      Object.assign(store, column)
      state.current.sex = column.sex
      state.current.patientName = column.patientName
      state.current.patientId = column.patientId
      state.checked = index
      state.show = false
    }
    const submitOrder = async () => {
      const submitParams = {
        patientName: state.current.patientName,
        patientId: state.current.patientId,
        sex: state.current.sex,
        memberId: store.memberId,
        phone: store.phone,
        age: computedAge(store.birthDay),
        toDate: orderInfo.value.date,
        orderAmt: orderInfo.value.guaHaoAmt,
        timeType: orderInfo.value.dictCode,
        beginDate: orderInfo.value.beginTime,
        beginTime: orderInfo.value.beginTime,
        endDate: orderInfo.value.endTime,
        endTime: orderInfo.value.endTime,
        unitId: orderInfo.value.unitId,
        numResId: orderInfo.value.detlId,
        doctorId: orderInfo.value.doctorId,
        detlId: orderInfo.value.detlId,
        depId: orderInfo.value.depId,
        scheduleId: orderInfo.value.scheduleId,
        yuyueUserType: '1',
        yuyueFrom: '7',
      }
      const { success } = await createOrder(submitParams)
      if (success) {
        router.push('orderList')
      }
    }
    const decrypt = computed(() => {
      return function (val) {
        return sm4Decrypt(val)
      }
    })
    return {
      ...toRefs(state),
      seleclted,
      orderInfo,
      decrypt,
      submitOrder,
      memberList,
      idEncrypt,
    }
  },
})
</script>

<style lang='scss' scoped>
.order-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.order-info {
  padding: 14px;
  line-height: 40px;
  background-color: #fff;
}
.selector {
  background-color: #fff;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.selector-icon {
  width: 30px;
  height: 30px;
}
.patient-list-content {
  background-color: #f5f5f5;
  padding: 10px;
}
.patient-list-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 10px;
  margin-bottom: 10px;
}

.patient-card-name {
  display: flex;
  align-items: center;
  span {
    font-weight: bold;
    color: #333;
    margin-left: 10px;
  }
  img {
    width: 20px;
    height: 20px;
    display: block;
  }
}
.patient-card-number {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  .patient-card-number-no {
    margin-left: 10px;
  }
}
.patient-outside {
  padding: 20px 10px;
  background-color: #fff;
}
.submit-btn {
  margin: 20px 10px;
}
.no-patient {
  text-align: center;
  margin-bottom: 20px;
  img {
    width: 150px;
    height: 150px;
  }
}
</style>