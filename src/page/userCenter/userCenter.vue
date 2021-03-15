<template>
  <div class="center-wrapper">
    <div class="column-item">
      <router-link class="column-header" to="/accountInfo">
        <div class="custom-title-flex">
          <van-image width="60" height="60" round src="https://img01.yzcdn.cn/vant/cat.jpeg" />
          <div class="mg-left">未填写名字</div>
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
          <li v-for="(column,index) in memberList" :key="index" @click="clickViewDetail(column)">
            <div class="custom-title-flex">
              <img v-if="column.sex === 0" src="../../assets/icon_people.png" />
              <img v-if="column.sex===1" src="../../assets/icon_people-2.png" />
              <span class="mg-right mg-left member-name">{{column.patientName}}</span>
              <span>{{column.age}}岁</span>
            </div>
            <div>
              <span class="mg-right">身份证</span>
              <span>| {{idEncrypt(column.patientId)}}</span>
            </div>
            <div>
              <span class="mg-right">手机号</span>
              <span>| {{telEncrypt(column.phone)}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { idEncrypt, telEncrypt } from '../../common/function'
import getUserMemberHooks from '../../hooks/user'
import { tranformDecrypt } from '../../hooks/transform'
import ColumnList from '@/components/ColumnList/Index.vue'
import { useRouter } from 'vue-router'
import { SessionStorage } from 'storage-manager-js'
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
      tranformDecrypt,
      clickViewDetail,
      telEncrypt,
      idEncrypt
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