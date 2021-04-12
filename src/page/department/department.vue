<template>
  <div class="alldepartment-tree">
    <van-nav-bar
      :title="isView ? '医院主页' : `${unitName}——预约挂号`"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="top-search">
      <button class="yiyuan" @click.stop="isView = true">医 院 主 页</button>
      <div class="search-box">
        <div class="search-nav-icon" @click.prevent="isSearch = true">
          <img width="20" src="../../assets/search.png" />
          <span>查询医院、科室、医生</span>
        </div>
      </div>
    </div>
    <div class="box-main">
      <van-tree-select
        :items="treeData"
        :main-active-index="mainActiveIndex"
        @click-nav="onClickNav"
        @click-item="onClickItem"
      />
    </div>
    <Search :is-search="isSearch" @cancel="isSearch = false" />
    <ViewHospital :is-view="isView" />
  </div>
</template>

<script lang="ts">
import { getDepartmentList, getHospitalNotice } from '../../common/api'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import Search from '../search/search.vue'
import ViewHospital from './viewCurHospital.vue'
import moment from 'moment'
import { SessionStorage } from 'storage-manager-js'
import { createMessage, getUrlParams, isObjEmpty } from '../../common/function'
export default defineComponent({
  name: 'department',
  components: {
    Search,
    ViewHospital,
  },
  setup() {
    const state = reactive({
      treeData: [],
      mainActiveIndex: 0,
      isSearch: false,
      isView: false,
    })
    onMounted(() => {
      getDepartmentData()
      getNotice()
    })
    const route = useRoute()
    const router = useRouter()
    const { unitName } = SessionStorage.get('currentHospital')
    const { id: unitId } = route.params
    const params = {
      unitId,
      beginTime: moment(new Date()).format('YYYY-MM-DD'),
      endTime: moment(new Date()).add(30, 'd').format('YYYY-MM-DD'),
      timeType: '',
    }
    const { homePageEntrance } = getUrlParams()
    const getDepartmentData = async () => {
      const { success, data } = await getDepartmentList(params)
      if (success && Array.isArray(data) && data.length > 0) {
        if (homePageEntrance) {
          const filterList = data.filter(
            (item) => item.depName.indexOf('核酸') > -1
          )
          console.log(filterList)
          state.treeData = transformList(filterList)
        } else {
          state.treeData = transformList(data)
        }
      } else {
        Toast.fail({
          message: '未查询到科室数据',
          onClose: () => {
            router.go(-1)
          },
        })
      }
    }

    const getNotice = async () => {
      const { unitNotice } = await getHospitalNotice(params)
      if (isObjEmpty(unitNotice)) return
      const { content, noticeTitle } = unitNotice
      createMessage(content, noticeTitle)
    }

    const transformList = (data) => {
      data.forEach((item) => {
        const children = [] as any[]
        const objs = Object.create(null)
        item.text = item.depName
        Object.assign(objs, item)
        objs.text = !!item.sonDepts ? item.sonDepts : (objs.text = item.depName)
        children.push(objs)
        item.children = children
      })
      return data
    }
    const onClickNav = (index) => {
      state.mainActiveIndex = index
    }
    const onClickItem = ({ depName, depId, unitId }) => {
      SessionStorage.set('currentDep', depName)
      SessionStorage.set('sendParams', { hosId: unitId, deptId: depId })
      router.push({
        name: 'DepartmentDoctor',
      })
    }
    const onClickLeft = () => {
      if (state.isView) {
        state.isView = false
      } else {
        router.go(-1)
      }
    }
    return {
      ...toRefs(state),
      onClickItem,
      onClickNav,
      onClickLeft,
      unitName,
    }
  },
})
</script>

<style lang="scss">
.alldepartment-tree {
  width: 100%;
  background: #f5f5f5;
  .van-tree-select {
    height: 100% !important;
  }
  .top-search {
    height: 50px;
    padding: 14px;
    margin-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: #fff;
    button {
      border-radius: 5px;
      color: #ffffff;
      font-size: 3vw;
      background: #00d2c3;
      width: 90px;
      height: 35px;
      border: none;
      margin-right: 4vw;
    }
    .search-box {
      width: 70%;
      background-color: #f5f5f5;
      border-radius: 5px;
      padding: 2vw;
      color: #666666;
      .search-nav-icon {
        * {
          vertical-align: middle;
        }
        span {
          margin-left: 6px;
          font-size: 14px;
          font-weight: lighter;
        }
      }
    }
  }
}
.box-main {
  height: calc(100vh - 106px);
  overflow-y: scroll;
}
.van-tree-select__item {
  color: #00d2c3 !important;
}
.van-tree-select__nav-item--active {
  color: #00d2c3 !important;
}
.van-sidebar-item--select::before {
  background-color: #00d2c3;
}
</style>