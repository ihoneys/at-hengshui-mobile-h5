<template>
  <div class="doctor-component">
    <router-link
      class="doctor-list"
      v-for="column in doctorList"
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
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { SessionStorage } from 'storage-manager-js'
export default defineComponent({
  props: {
    doctorList: {
      type: Array,
      required: true
    }
  },
  setup () {
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
    return {
      changeButtonName,
      getGrade
    }
  }
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
</style>