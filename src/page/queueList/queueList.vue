<template>
  <div class="wrapper">
    <div class="wrapper-item" v-for="item in treatmentQueueList" :key="item.orderId">
      <div class="wrapper-item-child">
        <div class="title-number">
          <div>
            <span class="number-name">单号：</span>
            <span class="number-value">{{ item.orderId }}</span>
          </div>
          <div class="number-status">{{ takeNoStatus(item.queueStatus) }}</div>
        </div>
        <div class="contanier">
          <div class="contanier-item">
            <span class="item-name">就诊医院</span>
            <span class="item-right">{{ item.hosName }}</span>
          </div>
          <div class="contanier-item">
            <span class="item-name">就诊科室</span>
            <span class="item-right">{{ item.deptName }}</span>
          </div>
          <div class="contanier-item">
            <span class="item-name">就诊医生</span>
            <span class="item-right">{{ item.doctorName }}</span>
          </div>
          <div class="contanier-item">
            <span class="item-name">就诊人</span>
            <span class="item-right">{{ sm4Decrypt(item.trueName) }}</span>
          </div>
          <div class="contanier-item">
            <span class="item-name">就诊时间</span>
            <div class="item-right item-time">
              <span>{{ item.beginTime }}</span>
              <span>-</span>
              <span>{{ item.endTime }}</span>
              <span class="date">{{ item.toDate }}</span>
            </div>
          </div>
        </div>
        <div class="queue-up">
          <div class="up-no">{{ isQueuenum(item.queueStatus, item.queuenum) }}</div>
          <div class="queue-tips" v-if="item.queuenum == 0">请前往就诊科室分诊台报到</div>
        </div>
      </div>
    </div>
    <div class="no-queue" v-if="hasQueue">
      <div class="top">当前没有可取的号</div>
      <div class="down">挂号后，可在这里取号，实时查看排队情况</div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTreatmentQueueList } from '../../common/api'
import { isObjEmpty, sm4Decrypt } from '../../common/function'
export default defineComponent({
  setup () {
    const treatmentQueueList = ref([])
    const route = useRoute()
    const hasQueue = ref(false)
    onMounted(async () => {
      const { unitId, memberId } = route.query
      const params = {
        unitId,
        memberId
      }
      const { data, success } = await getTreatmentQueueList(params)
      if (success && !isObjEmpty(data.data)) {
        treatmentQueueList.value = data.data
      } else {
        hasQueue.value = true
      }
    })
    const seleckedPatient = () => {
    }
    const takeNoStatus = computed(() => {
      return function (status) {
        return status == 0 ? '未取号' : '已取号'
      }
    })

    const isQueuenum = computed(() => {
      return function (status, num) {
        return status == 0 ? '未排队' : `排队号${num}`
      }
    })
    return {
      hasQueue,
      seleckedPatient,
      treatmentQueueList,
      takeNoStatus,
      sm4Decrypt,
      isQueuenum
    }
  }
})
</script>

<style lang="scss">
.wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
  .wrapper-item {
    padding: 20px;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 25px;
    background-image: -webkit-gradient(
        linear,
        50% 0,
        0 100%,
        from(transparent),
        color-stop(0.5, transparent),
        color-stop(0.5, #d9d9d9),
        color-stop(1.2, #fff),
        to(#fff)
      ),
      -webkit-gradient(linear, 50% 0, 100% 100%, from(transparent), color-stop(0.5, transparent), color-stop(0.5, #d9d9d9), color-stop(0.9, #fff), to(#fff));
    background-size: 12px 6px;
    background-repeat: repeat-x;
    background-position: 0 100%;
    .wrapper-item-child {
      padding-bottom: 25px;
      border-bottom: 1px solid #e5e5e5;
      .title-number {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        .number-name {
          color: #7a7a7a;
        }
        .number-value {
          color: #333333;
          font-weight: bold;
        }
        .number-status {
          color: red;
        }
      }
      .contanier {
        background-color: #fafafa;
        padding: 15px 10px;
        font-size: 14px;
        letter-spacing: 1px;
        margin: 10px 0px 20px;
        line-height: 20px;
        .contanier-item {
          text-align: justify;
          .item-name {
            display: inline-block;
            width: 60px;
            color: #7a7a7a;
            text-align-last: justify;
          }
          .item-right {
            margin-left: 10px;
          }
          .item-time {
            display: inline;
            .date {
              padding-left: 4px;
            }
          }
        }
      }
      .queue-up {
        .up-no {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .queue-tips {
          font-size: 12px;
          color: #333333;
          margin-top: 5px;
        }
      }
    }
  }
  .no-queue {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    padding-top: 80px;
    .down {
      color: #cccccc;
      margin-top: 30px;
    }
  }
}
.semicircle {
  width: 20px;
  height: 20px;
  background-color: #f0eff4;
  border-radius: 50%;
  position: absolute;
}
</style>