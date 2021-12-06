<template>
  <div class="center-wrapper">
    <div class="column-item">
      <router-link class="column-header" to="/accountInfo">
        <div class="custom-title-flex">
          <!-- <van-image width="60" height="60" round src="https://img01.yzcdn.cn/vant/cat.jpeg" /> -->
          <van-image width="60" height="60" round src />
          <div class="mg-left" v-if="isApp && accountInfo.patientName">
            {{ encrypt(accountInfo.patientName) }}
          </div>
          <div class="mg-left" v-else>未填写名字</div>
        </div>
        <van-icon name="arrow" />
      </router-link>
      <ColumnList :columnList="columnList" />
    </div>
    <div class="member-list">
      <router-link class="add-home-member" to="/addMember/add">
        <div>家庭成员</div>
        <div>+添加家庭成员</div>
      </router-link>
      <div class="member-contanier">
        <ul class="member-list-group">
          <li v-for="(column, index) in memberList" :key="index" @click="clickViewDetail(column)">
            <div class="custom-title-flex">
              <img v-if="column.sex === 0" src="../../assets/icon_people.png" />
              <img v-if="column.sex === 1" src="../../assets/icon_people-2.png" />
              <span class="mg-right mg-left member-name">{{ column.patientName }}</span>
              <span>{{ column.age }}岁</span>
            </div>
            <div>
              <span class="mg-right">身份证</span>
              <span>| {{ idEncrypt(column.patientId) }}</span>
            </div>
            <div>
              <span class="mg-right">手机号</span>
              <span>| {{ telEncrypt(column.phone) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { idEncrypt, telEncrypt, encrypt } from '../../common/function'
import { SessionStorage, Cookie } from 'storage-manager-js'
import { queryMemberInfo } from '../../common/api'
import getUserMemberHooks from '../../hooks/user'
import ColumnList from '@/components/ColumnList/Index.vue'

export default defineComponent({
  components: {
    ColumnList,
  },
  setup() {
    const columnList = [
      {
        path: 'orderList',
        label: '我的挂号',
        isLeftIcon: true,
        iconName: 'balance-list',
      },
      {
        path: 'record',
        label: '个人记录',
        isLeftIcon: true,
        iconName: 'manager',
      },
      {
        path: '/userNotice/agreement',
        label: '服务协议',
        isLeftIcon: false,
      },
      {
        path: '/userNotice/policy',
        label: '隐私政策',
        isLeftIcon: false,
      },
    ]
    const router = useRouter()
    const isApp = Cookie.get('isApp') || false
    let accountInfo = Object.create(null)
    const getAccountInfo = async () => {
      const { success, data } = await queryMemberInfo()
      if (success) {
        accountInfo = data
        SessionStorage.set('accountInfo', data)
      }
    }
    if (!SessionStorage.has('accountInfo')) {
      getAccountInfo()
    }
    const { memberList } = getUserMemberHooks()
    const clickViewDetail = (column) => {
      SessionStorage.set('currentMember', column)
      router.push({
        name: 'addMember',
        params: {
          id: 'update',
        },
      })
    }
    return {
      columnList,
      memberList,
      clickViewDetail,
      telEncrypt,
      idEncrypt,
      accountInfo,
      isApp,
      encrypt,
    }
  },
})
</script>

<style lang="scss" scoped>
.custom-title-flex {
  display: flex;
  align-items: center;
}
.member-list {
  background-color: #f5f5f5;
}
.column-item {
  color: #666;
}
.add-home-member {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 6px;
  color: #333;
}
.member-list-group {
  li {
    padding: 16px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    color: #666;
    line-height: 30px;
    &:last-child {
      margin-bottom: 60px;
    }
    img {
      width: 20px;
      height: 20px;
      display: block;
    }
  }
}
.member-contanier {
  padding: 8px;
}
.mg-left {
  margin-left: 10px;
}
.mg-right {
  margin-right: 10px;
}
.member-name {
  font-weight: bold;
  color: #333;
}
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 32px;
  color: #333;
}
</style>
