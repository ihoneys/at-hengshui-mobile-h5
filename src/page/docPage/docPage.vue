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
      <table-component :tableData="schedulingData" @clickItem="clickItem"></table-component>
      <div class="doctor-experts">
        <div class="table-bottom">
          <h3 class="table-bottom-title">简介</h3>
          <div class="contorl-tips">左右滑动日历查看其他日期排班</div>
        </div>
        <p
          class="doctor-expert-color"
          :class="{'introContent': isFolding}"
        >{{doctorInfo.introduction}}</p>
        <div class="folding" @click.stop="isFolding = !isFolding">{{isFolding?'展开':'折叠'}}</div>
      </div>
    </div>
    <div class="evaluate">
      <h3>患者点评(0)</h3>
    </div>
    <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      class="popup-wrapper"
      :style="{height:'auto'}"
      teleport="#app"
      round
    >
      <div class="popup-hos-info">
        <span>{{currentTimesInfo.date}}</span>
        <span>{{transformWeek(currentTimesInfo.date)}}</span>
        <span>{{currentTimesInfo.dictName}}</span>
      </div>
      <div>{{doctorInfo.unitName}}</div>
      <div class="popup-depName">{{doctorInfo.depName}}</div>
      <div class="popup-container">
        <div
          class="popup-times click-active"
          v-for="times in timesArray"
          @click.stop="selectTimes(times)"
        >
          <div>{{times.beginTime}}-{{times.endTime}}</div>
          <div>({{times.yuyueNum}}/{{times.yuyueMax}})</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getSchedulingData, getSelectSchedulingTime } from '../../common/api'
import {
  getCustomDate,
  parsingSchedulingData,
  isObjEmpty,
  createMessage,
} from '../../common/function'
import { SessionStorage } from 'storage-manager-js'
import { transformWeek } from '../../hooks/date'
import { SchedulingInfo } from '../types/types'
import { useRouter } from 'vue-router'
import TableComponent from 'comps/schedulingTable/Index.vue'
interface CurrentTimes {
  date: string
  dictName: string
}
interface OrderInfo {
  guaHaoAmt: string | number
  zcName: string
  unitName: string
  date: string
  beginTime: string
  endTime: string
  dictCode: string
  detlId: string
  scheduleId: string
}
export default defineComponent({
  name: 'docPage',
  components: {
    TableComponent,
  },
  setup() {
    onMounted(() => {
      getSchedulingDatas()
    })
    const router = useRouter()
    const state = reactive({
      schedulingData: [] as any[],
      timesArray: [] as any[],
      doctorInfo: {},
      isFolding: true,
      show: false,
      currentTimesInfo: {} as CurrentTimes,
    })
    const orderInfo: OrderInfo = {
      guaHaoAmt: '',
      zcName: '',
      unitName: '',
      date: '',
      beginTime: '',
      endTime: '',
      dictCode: '',
      detlId: '',
      scheduleId: '',
    }
    const { depId, doctorId, unitId } = SessionStorage.get('currentDoctorInfo')
    const getSchedulingDatas = async () => {
      const sendData = {
        doctorId,
        depId,
        unitId,
        beginDate: getCustomDate(),
        endDate: getCustomDate(6),
        currentWeek: 0,
      }
      const res = await getSchedulingData(sendData)
      const parsingResult = parsingSchedulingData(res.data[0].schedules)
      console.log(res)
      if (isObjEmpty(parsingResult)) {
        createMessage('暂无排班数据！', '提示', () => {
          router.push('/')
        })
      }
      if (res.success) {
        orderInfo.guaHaoAmt = res.data[0].guaHaoAmt
        orderInfo.zcName = res.data[0].zcName
        orderInfo.unitName = res.data[0].unitName
        const objs: SchedulingInfo = {
          data: '',
          timeTypes: '',
          week: '',
          date: '',
        }
        objs.data = res.data
        objs.timeTypes = res.timeTypes
        objs.week = res.week
        objs.date = parsingResult
        state.schedulingData.push(objs)
        state.doctorInfo = res.data[0]
      }
    }
    const clickItem = (date, data, isNumber, dictCode,dictName) => {
      console.log(date, data, isNumber, dictCode)
      orderInfo.date = date
      orderInfo.dictCode = dictCode
      state.currentTimesInfo.date = date
      state.currentTimesInfo.dictName = dictName
      const params = {
        beginDate: data.toDate,
        scheduleId: data.scheduleId,
        timeType: data.timeType,
        unitId: data.unitId,
        depId: data.depId,
        doctorId: data.doctorId,
      }
      getSourceNo(params)
    }
    const getSourceNo = async (params) => {
      const res = await getSelectSchedulingTime(params)
      console.log(res)
      state.show = true
      if (res.success) {
        state.timesArray = Object.values(res.data)[0] as any[]
      }
    }
    const selectTimes = (times) => {
      const temporary = SessionStorage.get('currentDoctorInfo')
      orderInfo.beginTime = times.beginTime
      orderInfo.endTime = times.endTime
      orderInfo.detlId = times.numResId
      orderInfo.scheduleId = times.scheduleId
      SessionStorage.set(
        'currentDoctorInfo',
        Object.assign(temporary, orderInfo)
      )
      router.push('/order')
    }
    return {
      ...toRefs(state),
      clickItem,
      transformWeek,
      selectTimes,
    }
  },
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
.folding {
  text-align: center;
  font-size: 14px;
  color: #00d2c3;
}
.introContent {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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
.popup-wrapper {
  padding: 14px;
  box-sizing: border-box;
}
.popup-times {
  padding: 4px;
  width: 28.1%;
  text-align: center;
  background-color: #eee;
  border-radius: 4px;
  line-height: 20px;
  color: #333333;
  margin-bottom: 10px;
  font-size: 14px;
  margin-left: 10px;
  overflow: hidden;
}
.popup-container {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -10px;
}
.popup-depName {
  color: rgb(0, 210, 195);
  font-weight: 600;
}
.popup-hos-info {
  span {
    margin-right: 4px;
    font-weight: bold;
    color: #333333;
  }
}
</style>