<template>
  <div class="doctor-container">
    <van-tabs line-width="0" line-height="0" title-active-color="#1989fa">
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
        <router-link
          class="doctor-list"
          v-for="column in value"
          :key="column.unitId"
          to="/docPage"
          @click.native="saveItem(column)"
        >
          <van-image width="60" height="80" radius="6" :src="column.image" />
          <div class="base-info">
            <div class="base-name">
              <span class="base-doc-name">{{column.doctorName}}</span>
              <span class="base-doc-color pd-left">{{getGrade(column.zcid)}}</span>
            </div>
            <div class="base-doc-color doctor-explain">{{column.introduction}}</div>
            <div>
              <span class="base-doc-color">接诊量</span>
              <span class="no-number pd-left">{{column.qty || '暂无'}}</span>
            </div>
          </div>
          <van-button
            class="column-button"
            type="primary"
            size="small"
            round
          >{{changeButtonName(column.isYuyue)}}</van-button>
        </router-link>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getDepAllDoctor, dictionaryQuery } from '../../common/api'
import { getCustomDate, isObjEmpty } from '../../common/function'
import { transformWeek, transformDate } from '../../hooks/date'
import { SessionStorage } from 'storage-manager-js'
export default defineComponent({
  name: 'departmentDoctor',
  setup() {
    onMounted(() => {
      getDepDoctors()
      getDictionarys()
    })
    const route = useRoute()
    const { depId, unitId } = route.params
    console.log(depId, unitId)
    const state = reactive({
      dateDoctorList: [],
      Alldoctor: [],
      noData: false,
    })
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
      console.log(result, '科室排班')
      if (!isObjEmpty(result)) {
        state.Alldoctor = result.all
        let allScheling = JSON.parse(JSON.stringify(result))
        delete allScheling.all
        state.dateDoctorList = allScheling
        console.log(allScheling, result)
      } else {
        state.noData = true
      }
    }
    const changeButtonName = computed(() => {
      return function (value) {
        return value == 1 ? '预约' : '已满'
      }
    })

    const getGrade = computed(() => {
      return function (value) {
        const dictionarys = SessionStorage.get('dictionarys')
        const arr = dictionarys.filter((el) => {
          return el.dictCode == value && el.dictType === 'order_level'
        })
        return arr.length > 0 ? arr[0].dictName : null
      }
    })

    const getDictionarys = async () => {
      const { success, data } = await dictionaryQuery()
      if (success && !SessionStorage.has('dictionarys')) {
        SessionStorage.set('dictionarys', data)
        const idTypeArr = data.filter((el) => el.dictType == 'id_type')
        SessionStorage.set('id_type', idTypeArr)
        const payTypeArr = data.filter((el) => el.dictType == 'pay_type')
        SessionStorage.set('payTypeArr', payTypeArr)
        const orderTypeArr = data.filter((el) => el.dictType == 'order_status')
        SessionStorage.set('orderTypeArr', orderTypeArr)
      }
    }
    const saveItem = (item) => {
      SessionStorage.set('currentDoctorInfo', item)
    }
    const clickTab = () => {}
    return {
      ...toRefs(state),
      clickTab,
      changeButtonName,
      transformDate,
      transformWeek,
      getGrade,
      saveItem,
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
  height: 100%;
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

.transparent {
  background-color: red !important;
}
//评分颜色
.grade-color {
  color: #ff9f4f;
}
p {
  margin: 0;
  margin-bottom: 5px;
  padding: 0;
  span {
    margin-right: 5px;
  }
}
//底部文字
.foot-text {
  text-align: center;
  color: #999999;
  background-color: transparent;
  margin-top: 15px;
}
//选择所有日期的按钮的颜色
.btnColor {
  color: #00d3c2;
}
// }
.subscribe {
  color: #00d3c2;
}
</style>