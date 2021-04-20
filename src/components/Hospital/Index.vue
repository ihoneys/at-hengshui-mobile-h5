<template>
  <ul class="doctor-list" v-if="hospitals != null">
    <li v-for="(item, index) in hospitals" :key="index">
      <div class="doctor-item" @click.native="goHospital(item)">
        <van-image class="doctor-image" lazy-load fit="cover" radius="4px" :src="item.image" />
        <div class="recommend">
          <div class="doctor-name">{{ item.unitName }}</div>
          <div class="describe">
            <div class="tag-span" v-if="item.unitLevelName != null">{{ item.unitLevelName }}</div>
            <div class="tag-span" v-if="item.unitClassName != null">{{ item.unitClassName }}</div>
          </div>
          <span class="distance-size" v-if="item.distance">距离{{ item.distance }}km</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SessionStorage } from 'storage-manager-js'
export default defineComponent({
  name: 'Hospital',
  props: {
    hospitals: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const goHospital = (obj) => {
      SessionStorage.set('currentHospital', obj)
      emit('goRouter', obj)
    }
    console.log(props.hospitals)
    return {
      goHospital,
    }
  },
})
</script>
<style lang="scss" scoped>
.doctor-list {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  .doctor-item {
    background-color: #fff;
    color: #999999;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    padding: 4%;
    display: flex;
    .doctor-image {
      width: 20vw;
      height: 65px;
    }
    .distance-size {
      font-size: 12px;
      color: #999999;
    }
    .recommend {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      padding-left: 3vw;
      .doctor-name {
        font-size: 14px;
        font-weight: bold;
        color: #222;
      }
      .doctor-explain {
        width: 205px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .describe {
        display: flex;
        align-items: center;
        .tag-span {
          font-size: 12px;
          margin-right: 8px;
          padding: 2px 4px;
          border-radius: 3px;
          border: 1px solid #1989fa;
          color: #1989fa;
          height: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
