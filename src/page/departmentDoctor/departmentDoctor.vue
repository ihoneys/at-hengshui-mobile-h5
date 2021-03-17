<template>
  <div class="doctor-container" v-if="Object.values(dateDoctorList).length > 0">
    <custom-van-nav-bar :title="depName" />
    <van-tabs color="#00D2C3" title-active-color="#00D2C3" :ellipsis="false" :line-width="30">
      <van-tab v-for="(value,name,index) in dateDoctorList" :key="name">
        <template v-if="index===0" #title>
          全部
          <br />日期
        </template>
        <template v-else #title>
          {{transformWeek(name)}}
          <br />
          {{transformDate(name)}}
        </template>
        <DoctorList :doctorList="value" />
        <div class="no-data" v-if="!value.length">
          <img width="120" height="120" src="../../assets/nothing_2.png" alt />
          <div>该科室暂无值班医生！</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getDepAllDoctor } from '../../common/api'
import { getCustomDate, isObjEmpty } from '../../common/function'
import { transformWeek, transformDate } from '../../hooks/date'
import { SessionStorage } from 'storage-manager-js'
import DoctorList from '@/components/DoctorList/Index.vue'
export default defineComponent({
  name: 'departmentDoctor',
  components: {
    DoctorList,
  },
  setup() {
    onMounted(() => {
      getDepDoctors()
    })
    const route = useRoute()
    const { depId, unitId } = route.params
    const state = reactive({
      dateDoctorList: [],
      Alldoctor: [],
      noData: false,
    })
    const depName = SessionStorage.get('currentDep')
    const getDepDoctors = async () => {
      const requestParams = {
        depId,
        unitId,
        beginDate: getCustomDate(0),
        endDate: getCustomDate(30),
        timeType: '',
        doctorId: '',
      }
      const result = await getDepAllDoctor(requestParams)
      if (!isObjEmpty(result)) {
        state.Alldoctor = result.all
        let allScheling = JSON.parse(JSON.stringify(result))
        delete allScheling.all
        state.dateDoctorList = allScheling
      } else {
        state.noData = true
      }
    }
    return {
      ...toRefs(state),
      transformDate,
      transformWeek,
      depName,
    }
  },
})
</script>

<style lang="scss" scoped>
.doctor-list {
  padding: 30px 15px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin-top: 10px;
  .doctor-explain {
    width: 205px;
    line-height: 1.5;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .base-info {
    line-height: 25px;
    .base-doc-color {
      color: #999999;
    }
    .base-doc-name {
      font-weight: bold;
      color: #333333;
    }
    .no-number {
      color: #ff9f4f;
    }
    .pd-left {
      padding-left: 10px;
    }
  }
  .column-button {
    width: 64px;
    align-self: center;
  }
}
.doctor-container {
  position: relative;
  width: 100%;
  height: 100vh;
  font-size: 14px;
  color: #999999;
  background-color: #f5f5f5;
}
.bottom-div {
  position: absolute;
  bottom: 0;
  left: 20%;
}
.doctor-header {
  box-sizing: border-box;
}
.no-data {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>