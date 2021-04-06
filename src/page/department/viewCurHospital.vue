<template>
  <div class="hospital-info" v-show="isView">
    <div class="hospital-base">
      <van-image width="90" height="80" :src="content.image" />
      <div class="hospital-base-text">
        <h3>{{content.unitName}}</h3>
        <div class="hospital-flex-level">
          <p>{{content.unitLevelName}}</p>
          <p>{{content.unitClassName}}</p>
        </div>
        <div class="hospital-flex">
          <van-icon name="location" />
          <span>{{content.address}}</span>
        </div>
      </div>
    </div>
    <ul class="hospital-cloumn">
      <li>
        <p>别名</p>
        <p>{{content.unitTags}}</p>
      </li>
      <li>
        <p>电话</p>
        <p>{{content.phone}}</p>
      </li>
      <li v-if="content.webUrl">
        <p>网站</p>
        <p>{{content.webUrl}}</p>
      </li>
    </ul>
    <div class="hospital-introduction">
      <h3>简介</h3>
      <p class="hospital-introduction-text" :class="{'introContent': isFolding}">{{content.detail}}</p>
      <div class="contorl" @click="isFolding = !isFolding">{{isFolding ? '展开' : '折叠'}}</div>
    </div>
    <div class="hospital-introduction">
      <h3>公共交通</h3>
      <p>{{content.busLine}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { SessionStorage } from 'storage-manager-js'
export default defineComponent({
  props: {
    isView: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const isFolding = ref(true)
    const content = SessionStorage.get('currentHospital')
    return {
      content,
      isFolding,
    }
  },
})
</script>

<style lang="scss" scoped>
.hospital-info {
  position: absolute;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  height: calc(100vh - 46px);
}
.hospital-base {
  padding: 14px;
  background-color: #00d2c3;
  color: #fff;
  display: flex;
}
.hospital-base-text {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hospital-flex-level {
  display: flex;
  align-items: center;
}
.hospital-flex {
  * {
    vertical-align: middle;
  }
}
.hospital-cloumn {
  background-color: #fff;
  li {
    padding: 14px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
  }
}
.introContent {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.hospital-introduction {
  padding: 14px;
  background-color: #fff;
  margin-top: 10px;
}
.hospital-introduction-text {
  color: #999999;
  margin-top: 10px;
  font-size: 16px;
}
.contorl {
  text-align: center;
  color: #00d2c3;
}
</style>