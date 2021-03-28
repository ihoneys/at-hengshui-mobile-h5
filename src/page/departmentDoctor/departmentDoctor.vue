<template>
  <div class="doctor-container" id="container" v-if="Object.values(dateDoctorList).length > 0">
    <custom-van-nav-bar :title="depName" />
    <van-tabs color="#00D2C3" title-active-color="#00D2C3" :ellipsis="false" :line-width="30">
      <van-tab v-for="(value,name,index) in dateDoctorList" :key="name">
        <template v-if="index===0" #title>
          <span>全部</span>
          <br />
          <span>日期</span>
        </template>
        <template v-else #title>
          {{transformWeek(name)}}
          <br />
          {{transformDate(name)}}
        </template>
        <DoctorList :class="{'doctor-list-mt':depNotice}" :doctorList="value" />
        <teleport to="#container">
          <NoData v-if="!value.length" message="该科室暂无值班医生！" />
        </teleport>
      </van-tab>
    </van-tabs>
    <div class="dep-notice">
      <van-notice-bar
        left-icon="volume-o"
        v-if="depNotice"
        :class="[ depAbout ? 'notice-bar' : 'notice-bar-100']"
        :text="depNotice"
      />
      <router-link
        :class="[depNotice ? 'about-text' : 'only-dep-about']"
        v-if="depAbout"
        to="/depIntroduce"
      >
        <div class="about-flex">
          <van-icon name="balance-list" class="gh-tb" />
          <div>科室介绍</div>
        </div>
        <van-icon v-if="!depNotice" class="gh-tb" name="arrow" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getDepAllDoctor, getDepartmentNotice } from '../../common/api'
import { getCustomDate, isObjEmpty, getUrlParams } from '../../common/function'
import { transformWeek, transformDate } from '../../hooks/date'
import { SessionStorage } from 'storage-manager-js'
import DoctorList from '@/components/DoctorList/Index.vue'
import NoData from '@/components/NoData/Index.vue'
interface SendParams {
  depId: string
  hosId: string
}
export default defineComponent({
  name: 'DepartmentDoctor',
  components: {
    DoctorList,
    NoData,
  },
  setup() {
    onMounted(() => {
      getDepDoctors()
      getDepNotice()
    })
    let urlParams = {} as any
    if (!isObjEmpty(getUrlParams())) {
      urlParams = getUrlParams()
    } else {
      urlParams = SessionStorage.get('sendParams')
    }
    console.log(urlParams, 'urlParams')
    const state = reactive({
      dateDoctorList: [],
      Alldoctor: [],
      noData: false,
      depNotice: '',
      depAbout: '',
    })
    const depName = SessionStorage.get('currentDep')
    const getDepDoctors = async () => {
      const requestParams = {
        depId: urlParams.deptId,
        unitId: urlParams.hosId,
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
    const getDepNotice = async () => {
      const { success, data } = await getDepartmentNotice({
        depId: urlParams.deptId,
      })
      if (success) {
        state.depNotice = data.deptNotice
        state.depAbout = data.deptScope
        if (data.deptScope) {
          SessionStorage.set('depArticle', data.deptScope)
        }
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
  min-height: 100vh;
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
.notice-bar {
  width: 70%;
}
.notice-bar-100 {
  width: 100%;
}
.dep-notice {
  width: 100%;
  display: flex;
  position: absolute;
  top: 90px;
}
.only-dep-about {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  flex: 1;
  padding: 10px;
}
.about-text {
  display: flex;
  align-items: center;
  background-color: #ffcc99;
  color: #666;
  flex: 1;
}
.about-flex {
  display: flex;
  align-items: center;
}
.doctor-list-mt {
  margin-top: 50px;
}
</style>