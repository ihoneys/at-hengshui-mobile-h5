<template>
  <div class="search" v-if="isSearch">
    <van-search
      shape="round"
      placeholder="搜索医生、科室、医院"
      :show-action="true"
      :ref="refSearch"
      v-model="searchValue"
      @cancel="onCancel"
      @search="onSearch"
      @clear="onClear"
    />
    <div class="search-history" v-show="hasValue && searchHoistoryList.length > 0">
      <div>搜索记录</div>
      <ul class="histor-list">
        <li v-for="(item, index) in searchHoistoryList" :key="index" @click="handleItem(item)">
          {{ item }}
        </li>
      </ul>
      <div class="empty" v-if="searchHoistoryList.length > 0">
        <button class="empty-btn" @click="clearSearchHistory">清空搜索记录</button>
      </div>
    </div>
    <div class="hospital" v-if="hospitalData.length > 0">
      <h3>医院</h3>
      <Hospital :hospitals="hospitalData" />
    </div>
    <div class="doctors" v-if="doctorList.length > 0">
      <h3>医生</h3>
      <DoctorList :doctorList="doctorList" />
    </div>
    <div class="depts" v-if="depts.length > 0">
      <h3>科室</h3>
      <van-cell-group>
        <van-cell
          class="cell-item"
          v-for="(column, index) in depts"
          :key="index"
          @click="clickCell(column)"
        >
          <template #title>
            <div class="custom-totle">{{ column.depName }}</div>
          </template>
          <template #right-icon>
            <van-icon class="arrow-size" name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { finSearchContent } from '../../common/api'
import { LocalStorage } from 'storage-manager-js'
import Hospital from '@/components/Hospital/Index.vue'
import DoctorList from '@/components/DoctorList/Index.vue'
import ColumnList from '@/components/ColumnList/Index.vue'
import { Toast } from 'vant'
import { SessionStorage } from 'storage-manager-js'
interface DeptsObj {
  path: string
  label: string
  isLeftIcon: boolean
}
export default defineComponent({
  components: {
    Hospital,
    DoctorList,
    ColumnList,
  },
  props: {
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, ctx) {
    const state = reactive({
      searchValue: '',
      hospitalData: [],
      doctorList: [],
      depts: [] as DeptsObj[],
      searchHoistoryList: [] as string[],
      hasValue: true,
    })
    const router = useRouter()
    if (LocalStorage.has('searchHoistoryList')) {
      state.searchHoistoryList = LocalStorage.get('searchHoistoryList') as string[]
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }
    const closeSearchData = () => {
      state.hospitalData = []
      state.doctorList = []
      state.depts = []
      state.hasValue = true
    }
    const onClear = () => {
      closeSearchData()
    }
    watch(
      () => state.searchValue,
      (state) => {
        if (!state) {
          closeSearchData()
        }
      }
    )
    const onSearch = () => {
      if (!state.searchValue) return
      getSearchContent()
    }
    const getSearchContent = async () => {
      const params = {
        param: state.searchValue,
      }
      const { data, success } = await finSearchContent(params)
      if (success) {
        const { depts, doctors, hospitals } = data
        state.depts = depts
        state.hospitalData = hospitals
        state.doctorList = doctors
        state.hasValue = false
        state.searchHoistoryList.push(state.searchValue)
        state.searchHoistoryList = [...new Set(state.searchHoistoryList)]
        LocalStorage.set('searchHoistoryList', state.searchHoistoryList)

        if (!depts.length && !doctors.length && !hospitals.length) {
          Toast('未查询到内容,换换关键词吧！')
        }
      }
    }
    const handleItem = (currVal) => {
      state.searchValue = currVal
      getSearchContent()
    }
    const refSearch = (el) => {
      if (el) {
        el.focus()
      }
    }
    const clearSearchHistory = () => {
      LocalStorage.delete('searchHoistoryList')
    }
    const clickCell = ({ depName, unitId, depId }) => {
      SessionStorage.set('currentDep', depName)
      SessionStorage.set('sendParams', { hosId: unitId, deptId: depId })
      router.push({
        name: 'DepartmentDoctor',
      })
    }
    return {
      ...toRefs(state),
      onCancel,
      onSearch,
      onClear,
      handleItem,
      refSearch,
      clearSearchHistory,
      clickCell,
    }
  },
})
</script>

<style lang="scss">
.search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  h3 {
    padding: 14px;
    background-color: #f5f5f5;
  }
}
.search-history {
  margin-top: 20px;
  color: #aaa;
  padding: 14px;
}
.histor-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -20px;
  li {
    color: #666;
    background-color: #ededed;
    border-radius: 8px;
    font-size: 12px;
    padding: 2px 6px;
    margin-left: 20px;
    margin-top: 10px;
  }
}
.empty {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .empty-btn {
    border-radius: 50px;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #999;
    padding: 4px 18px;
  }
}
.cell-item {
  display: flex;
  align-items: center;
}
</style>
