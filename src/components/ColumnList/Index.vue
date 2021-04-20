<template>
  <van-cell-group>
    <van-cell v-for="(column, index) in columnList" :key="index" :to="column.path">
      <template #title>
        <div class="custom-title-flex">
          <van-icon class="gh-tb" v-if="column.isLeftIcon" :name="column.iconName" />
          <span class="custom-totle">{{ column.label }}</span>
        </div>
      </template>
      <template #right-icon>
        <van-icon class="arrow-size" name="arrow" />
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    columnList: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style>
.gh-tb {
  font-size: 20px !important;
  color: #3ec1fd;
  margin-right: 3px;
}
.custom-totle {
  vertical-align: middle;
}
.custom-title-flex {
  display: flex;
  align-items: center;
}
.arrow-size {
  line-height: inherit;
}
</style>
