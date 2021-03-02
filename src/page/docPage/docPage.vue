<template>
  <div class="doctor-page">
    <div class="doctor-info">
      <van-image width="64" height="64" :src="doctorInfo.image" round></van-image>
      <div class="doctor-name">
        <div class="name">{{doctorInfo.doctorName}}</div>
        <div class="doctor-level">{{doctorInfo.zcName}}</div>
      </div>
    </div>
    <div class="doctor-expert">
      <h3>擅长:</h3>
      <p class="doctor-expert-color">{{doctorInfo.expert}}</p>
    </div>
    <div class="table-wrapper">
      <div>{{doctorInfo.unitName}}</div>
      <div class="depName">{{doctorInfo.depName}}</div>
      <table-component :tableData="schedulingData"></table-component>
      <div class="doctor-experts">
        <div class="table-bottom">
          <h3 class="table-bottom-title">简介</h3>
          <div class="contorl-tips">左右滑动日历查看其他日期排班</div>
        </div>
        <p class="doctor-expert-color">{{doctorInfo.introduction}}</p>
      </div>
    </div>
    <div class="evaluate">
      <h3>患者点评(0)</h3>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { SessionStorage } from 'storage-manager-js'
import { getCustomDate, parsingSchedulingData } from '../../common/function'
import { getSchedulingData } from '../../common/api'
import TableComponent from 'comps/schedulingTable/Index.vue'
export default defineComponent({
  name: 'docPage',
  components: {
    TableComponent
  },
  setup () {

    const state = reactive({
      schedulingData: [],
      doctorInfo: {}
    })
    onMounted(() => {
      getSchedulingDatas()
    })
    const { depId, doctorId, unitId } = SessionStorage.get('currentDoctorInfo')
    const getSchedulingDatas = async () => {
      const sendData = {
        doctorId,
        depId,
        unitId,
        beginDate: getCustomDate(),
        endDate: getCustomDate(6),
        currentWeek: 0
      }
      const res = await getSchedulingData(sendData)
      console.log(res)
      const parsingRsult = parsingSchedulingData(res.data[0].schedules)
      if (res.success) {
        const objs = Object.create(null)
        objs.data = res.data
        objs.timeTypes = res.timeTypes
        objs.week = res.week
        objs.date = parsingRsult
        state.schedulingData.push(objs)
        state.doctorInfo = res.data[0]
      }
    }

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss">
.doctor-page {
  background-color: #f5f5f5;
}
.doctor-info {
  padding: 10px;
  background: #00d2c3;
  display: flex;
  align-content: center;
  .doctor-name {
    margin-left: 20px;
    color: #fff;
  }
}
.doctor-expert {
  background-color: #fff;
  padding: 14px;
}
.doctor-experts {
  margin-top: 20px;
}
.doctor-expert-color {
  color: #999999;
  margin-top: 10px;
  font-size: 14px;
}
.table-bottom {
  display: flex;
  align-items: center;
  .table-bottom-title {
    width: 40px;
  }
  .contorl-tips {
    color: #999999;
    font-size: 14px;
    flex: 1;
    text-align: center;
  }
}
.table-wrapper {
  margin-top: 10px;
  background-color: #fff;
  padding: 20px 14px;
  .depName {
    display: inline-block;
    color: #2acea3;
    font-size: 16px;
    padding: 5px 12px;
    border-radius: 100px;
    border: 1px solid rgba(126, 223, 216, 1);
    margin: 10px 0px;
  }
}
.evaluate {
    padding: 14px;
    background-color: #fff;
    margin-top: 20px;
}
</style>