<template>
  <!-- <div>科室信息</div> -->
  <div class="alldepartment-tree">
    <van-nav-bar title="科室" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="top-search">
      <button @click.stop="showHospitalInfo" class="yiyuan">医 院 主 页</button>
      <div class="search-box">
        <div class="search-nav-icon" @click.prevent="isShowSearchPanel(true)">
          <img src="../../assets/search.png" />
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
      <!-- <div class="hospita-info" v-show="showInfo">
        <div v-if="HospitalInfo">
          <div class="title">
            <div class="photo-name">
              <p class="img-box">
                <img v-lazy="HospitalInfo.image" alt="被吃掉来了" />
              </p>
              <div class="name-info">
                <div>
                  <p>{{ HospitalInfo.unitName }}</p>
                  <p>
                    <span>{{ HospitalInfo.unitLevel | oo }}</span>
                    <span>{{ HospitalInfo.unitClass | oo }}</span>
                  </p>
                </div>
                <p class="address">
                  <van-icon name="location" />
                  <span>{{ HospitalInfo.address }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="tell-info common">
            <p>
              <span>别名 :</span>
              <span>{{ HospitalInfo.unitTags }}</span>
            </p>
            <p>
              <span>电话 :</span>
              <span>{{ HospitalInfo.phone | getNum }}</span>
            </p>
            <p>
              <span>网站 :</span>
              <span>{{ HospitalInfo.webUrl | getNum }}</span>
            </p>
          </div>
          <div class="intro common">
            <h3>简介</h3>
            <div :class="{ introContent: changeshow }">
              {{ HospitalInfo.detail }}
            </div>
            <div class="ck-btn" @click="changeBtn" v-if="showBtn">{{ changeshow ? "展开" : "收起" }}</div>
          </div>
          <div class="common">
            <h3>公共交通</h3>
            <p>{{ HospitalInfo.busLine }}</p>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { getDepartmentList } from '../../common/api'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as moment from 'moment'
export default defineComponent({
  name: 'department',
  setup() {
    const state = reactive({
      treeData: [],
      mainActiveIndex: 0,
    })
    onMounted(() => {
      getDepartmentData()
    })
    const route = useRoute()
    const router = useRouter()
    const getDepartmentData = async () => {
      const { id: unitId } = route.params
      const params = {
        unitId,
        beginTime: moment(new Date()).format('YYYY-MM-DD'),
        endTime: moment(new Date()).add(30, 'd').format('YYYY-MM-DD'),
        timeType: '',
      }
      const res = await getDepartmentList(params)
      state.treeData = transformList(res.data)
      console.log(res.data)
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
    const onClickItem = (data) => {
      router.push({
        name: 'departmentDoctor',
        params: {
          depId: data.depId,
          unitId: data.unitId,
        },
      })
    }
    const showHospitalInfo = () => {}
    return {
      ...toRefs(state),
      onClickItem,
      onClickNav,
      showHospitalInfo,
    }
  },
})
</script>

<style lang="scss">
.alldepartment-tree {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background: #e6e6e6;
  box-sizing: border-box;
  // 医院信息弹窗
  .hospita-info {
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #f5f5f5;
    font-size: 16px;

    // 公共样式
    .common {
      background-color: #fff;
      padding: 4vw;
      margin-bottom: 3vw;
      font-size: 16px;
      line-height: 1.3;
      color: #666;
      h3 {
        font-weight: 600;
        margin-bottom: 2vw;
      }
    }
    .title {
      padding: 4vw;
      background-color: #00d2c3;

      p {
        font-size: 5vw;
        font-weight: 600;
        color: #fff;
        margin-bottom: 5px;
        span {
          font-size: 4vw;
          font-weight: normal;
          color: #fff;
          margin-right: 1vw;
        }
      }
      .photo-name {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .img-box {
          width: 26vw;
          height: 22vw;
          border-radius: 6px;
          overflow: hidden;
          margin-right: 10px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .name-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          > div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        .address {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }
    }
    .tell-info {
      padding: 0;
      p {
        display: flex;
        justify-content: space-between;
        padding: 0 4vw;
        line-height: 3;
        border-bottom: 1px solid #f5f5f5;
        span:last-child {
          padding-left: 3vw;
        }
      }
      p:last-child {
        border: none;
      }
    }
    .intro {
      // 收起、隐藏按钮
      .ck-btn {
        text-align: center;
        color: rgba(126, 223, 216, 1);
      }

      //信息展示和隐藏
      .introContent {
        // height: 5vh;
        overflow: hidden;
        text-overflow: -o-ellipsis-lastline;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; //几行
        -webkit-box-orient: vertical;
      }
    }
  }
  .van-tree-select {
    height: 100% !important;
  }
  //顶部搜索栏
  .top-search {
    height: 50px;
    padding: 4vw;
    margin-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
    > button {
      border-radius: 5px;
      color: #ffffff;
      font-size: 3vw;
      background: #00d2c3;
      padding: 3vw;
      text-decoration: none;
      border: none;
      margin-right: 4vw;
    }
    .search-box {
      width: 70%;
      background-color: #f5f5f5;
      border-radius: 5px;
      .search-nav-icon {
        display: flex;
        padding: 2vw;
        padding-left: 5vw;

        align-items: center;
        img {
          width: 20px;
        }
        span {
          color: #666666;
          margin-left: 6px;
          font-size: 14px;
          font-weight: lighter;
        }
      }
    }
  }
  //主体内容
  .box-main {
    height: calc(100vh - 106px);
    box-sizing: border-box;
    overflow-y: scroll;
  }
}
.bottom-div {
  position: absolute;
  bottom: 0;
  left: 20%;
}
tell-info common .conter {
  display: flex;
  justify-content: space-between;
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