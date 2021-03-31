<template>
  <div class="patient-list-content">
    <van-radio-group v-model="radio">
      <div
        class="patient-card"
        v-for="(item, index) in memberList"
        :key="index"
        @click.stop="seleckedPatient(item, index)"
      >
        <div>
          <p>
            <img src="@/assets/icon_people.png" v-if="item.sex == 0" />
            <img src="@/assets/icon_people-2.png" v-if="item.sex == 1" />
            <span>{{ item.patientName }}</span>
          </p>
          <p>
            <span>证件号</span>
            <span>{{ item.patientId }}</span>
          </p>
        </div>
        <van-radio :name="index"></van-radio>
      </div>
    </van-radio-group>
    <NoData v-if="!memberList.length" message="暂无就诊人，请添加就诊人" />
    <div class="add-btn">
      <router-link :to="routerPath">
        <van-button type="primary" round block color="#00D2C3">添加患者</van-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import NoData from '../NoData/Index.vue'
export default defineComponent({
  components: {
    NoData,
  },
  props: {
    memberList: Array,
    routerPath: {
      type: String,
      default: () => '/addMember/add'
    }
  },
  setup (_, { emit }) {
    const state = reactive({
      radio: '',
    })
    const seleckedPatient = (item, i) => {
      state.radio = i
      emit('seleckedPatient', item, i)
    }
    return {
      ...toRefs(state),
      seleckedPatient
    }
  }
})
</script>

<style lang="scss">
.patient-list-content {
  padding-bottom: 100px;
  .patient-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .no-patient {
    img {
      display: block;
      width: 150px;
      height: auto;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      color: #999;
      text-align: center;
      padding-bottom: 20px;
    }
  }
}
.add-btn {
  position: fixed;
  bottom: 44px;
  padding: 0 10px;
  width: 100%;
  transform: translateX(-10px);
  box-sizing: border-box;
}
.patient-card {
  padding: 30px 15px;
  background-color: #fff;
  p {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  img {
    width: 20px;
    height: auto;
    margin-right: 10px;
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: normal;
    color: #666;
    span {
      margin-right: 10px;
    }
  }
}
</style>