<template>
  <div class="article">
    <div class="header">
      <h4 style="font-size: 18px">科室公告</h4>
      <div class="time">
        <div class="time-date">{{date}}</div>
        <div class="hospital-name" v-if="hospitalName">{{hospitalName}}</div>
      </div>
    </div>
    <div class="article-content">
      <p v-html="article"></p>
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'storage-manager-js'
import { defineComponent } from 'vue'
import { getCustomDate } from '../../common/function'
export default defineComponent({
  setup () {
    const article = SessionStorage.get('depArticle') || '',
      { unitName: hospitalName } = SessionStorage.get('currentHospital'),
      date = getCustomDate()
    return {
      article,
      hospitalName,
      date
    }
  }
})

</script>

<style lang="scss" scoped>
.article {
  min-height: 100vh;
}
.header {
  padding: 14px;
  line-height: 30px;
  border-bottom: 1px solid #f5f5f5;
}
.time {
  display: flex;
  align-items: center;
}
.time-date {
  font-size: 14px;
  color: #999;
}
.hospital-name {
  color: #00d3c2;
  font-size: 14px;
  margin-left: 10px;
}
.article-content {
  padding: 14px;
  font-size: 16px;
}
</style>