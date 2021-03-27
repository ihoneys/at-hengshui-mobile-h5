<template>
  <div class="doctor-page" v-if="schedulingData.length > 0">
    <custom-van-nav-bar />
    <div class="doctor-info">
      <van-image width="64" height="64" :src="doctorInfo.image" round></van-image>
      <div class="doctor-name">
        <div class="name">{{doctorInfo.doctorName}}</div>
        <div class="doctor-level">{{doctorInfo.zcName}}</div>
      </div>
    </div>
    <div class="doctor-expert" v-if="doctorInfo.expert">
      <h3>擅长:</h3>
      <p class="doctor-expert-color">{{doctorInfo.expert}}</p>
    </div>
    <div class="table-wrapper">
      <div>{{doctorInfo.unitName}}</div>
      <div class="depName">{{doctorInfo.depName}}</div>
      <TableComponent
        v-if="requestCount >= 1"
        :tableData="schedulingData"
        @clickItem="clickItem"
        :isProcessData="isProcess"
      />
      <div class="doctor-experts">
        <div class="table-bottom">
          <h3 v-if="doctorInfo.introduction" class="table-bottom-title">简介</h3>
          <div class="contorl-tips">左右滑动日历查看其他日期排班</div>
        </div>
        <p
          class="doctor-expert-color"
          :class="{'introContent': isFolding}"
          :ref="refIntroduction"
        >{{doctorInfo.introduction}}</p>
        <div
          v-if="isShowCollapse"
          class="folding"
          @click.stop="isFolding = !isFolding"
        >{{isFolding?'展开':'折叠'}}</div>
      </div>
    </div>
    <div class="evaluate">
      <h3>患者点评(0)</h3>
    </div>
    <van-popup
      round
      closeable
      teleport="#app"
      position="bottom"
      class="popup-wrapper"
      duration="0.2"
      v-model:show="show"
      :style="{height:'auto'}"
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
    <van-popup
      round
      class="popup-container-time"
      teleport="#app"
      position="bottom"
      duration="0.2"
      v-model:show="periodShow"
      :style="{ height: 'auto' }"
    >
      <div class="period-header">请选择就诊时间段</div>
      <ul class="popup-container">
        <li
          style="padding-top:14px;padding-bottom:14px"
          class="popup-times click-active"
          v-for="(item,index) in allTimeList"
          :key="index"
          @click.stop="clickTime(item)"
        >
          <span>{{item.beginTime}}-{{item.endTime}}</span>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, nextTick } from 'vue'
import {
  getSchedulingData,
  getSelectSchedulingTime,
  getDoctorInfo,
} from '../../common/api'
import {
  getCustomDate,
  parsingSchedulingData,
  isObjEmpty,
  createMessage,
  getUrlParams,
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
  name: 'DoctorPage',
  components: {
    TableComponent,
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      schedulingData: [] as any[],
      timesArray: [] as any[],
      allTimeList: [],
      doctorInfo: {},
      isFolding: true,
      show: false,
      currentTimesInfo: {} as CurrentTimes,
      requestCount: 0,
      isShowCollapse: true,
      isProcess: false,
      periodShow: false,
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
    let currentDoctorInfo
    onMounted(() => {
      const { doctorId } = getUrlParams()
      if (doctorId) {
        // 从智能导诊进入
        getDoctorBaseInfo(doctorId)
      } else {
        // 正常入口进入
        currentDoctorInfo = SessionStorage.get('currentDoctorInfo')
        getSchedulingDatas(currentDoctorInfo)
      }
    })

    const getSchedulingDatas = async (
      currentDoctorInfo,
      beginDate = getCustomDate(),
      endDate = getCustomDate(6),
      currentWeek = 0
    ) => {
      const sendData = {
        doctorId: currentDoctorInfo.doctorId,
        depId: currentDoctorInfo.depId,
        unitId: currentDoctorInfo.unitId,
        beginDate,
        endDate,
        currentWeek,
      }
      const res = await getSchedulingData(sendData)
      const { isProcess, newData } = parsingSchedulingData(
        JSON.parse(res.data[0].schedules)
      )
      console.log(isProcess, 'isProcess')
      state.isProcess = isProcess
      if (!res.success && isObjEmpty(newData)) {
        createMessage('暂无排班数据！', '提示', () => {
          router.push('/home')
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
        let schedulingList = [] as SchedulingInfo[]
        objs.data = res.data
        objs.timeTypes = res.timeTypes
        objs.week = res.week
        objs.date = newData
        schedulingList.push(objs)
        state.schedulingData = [...state.schedulingData, ...schedulingList]
        state.doctorInfo = res.data[0]
        if (state.requestCount <= 0) {
          state.requestCount++
          sendData.beginDate = getCustomDate(7)
          sendData.endDate = getCustomDate(13)
          sendData.currentWeek = 1
          setTimeout(() => {
            getSchedulingDatas(
              currentDoctorInfo,
              getCustomDate(7),
              getCustomDate(13),
              1
            )
          }, 100)
        }
      }
    }

    const getDoctorBaseInfo = async (doctorId) => {
      const params = { doctorId }
      const res = await getDoctorInfo(params)
      console.log(res)
      if (!isObjEmpty(res)) {
        getDoctorBaseInfo(res.all[0])
      }
    }

    const refIntroduction = (el: HTMLElement) => {
      if (el) {
        nextTick(() => {
          const rowsHeight = 48
          let textHeight = window.getComputedStyle(el).height
          textHeight = textHeight.replace('px', '')
          if (Number(textHeight) < rowsHeight) {
            state.isShowCollapse = false
          }
        })
      }
    }
    const clickItem = (date, data, isNumber, dictCode, dictName) => {
      if (state.isProcess) {
        state.periodShow = true
        state.allTimeList = data.list
        console.log(333)
      } else {
        orderInfo.date = date
        orderInfo.dictCode = dictCode
        state.currentTimesInfo.date = date
        state.currentTimesInfo.dictName = dictName
        getSourceNo(data)
      }
    }
    const getSourceNo = async (data) => {
      const params = {
        beginDate: data.toDate,
        scheduleId: data.scheduleId,
        timeType: data.timeType,
        unitId: data.unitId,
        depId: data.depId,
        doctorId: data.doctorId,
      }
      const res = await getSelectSchedulingTime(params)
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
    const clickTime = (datas) => {
      state.periodShow = false
      getSourceNo(datas)
    }
    return {
      ...toRefs(state),
      clickItem,
      transformWeek,
      selectTimes,
      refIntroduction,
      clickTime,
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
.time-list {
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -10px;
  li {
    font-size: 16px;
    width: 78px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.period-header {
  font-size: 16px;
}
.popup-container-time {
  padding: 14px;
  box-sizing: border-box;
  * {
    vertical-align: middle;
  }
}
</style>