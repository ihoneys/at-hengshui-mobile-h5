<template>
  <div class="center-wrapper">
    <div class="column-item">
      <div class="column-header">
        <div class="custom-title-flex">
          <van-image width="60" height="60" round src="https://img01.yzcdn.cn/vant/cat.jpeg" />
          <div class="mg-left">未填写名字</div>
        </div>
        <van-icon name="arrow" />
      </div>
      <van-cell-group>
        <van-cell v-for="(column,index) in columnList" :key="index" :to="column.path">
          <template #title>
            <div class="custom-title-flex">
              <van-icon class="gh-tb" v-if="column.isLeftIcon" :name="column.iconName" />
              <span class="custom-totle">{{column.label}}</span>
            </div>
          </template>
          <template #right-icon>
            <van-icon class="arrow-size" name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="member-list">
      <div class="add-home-member">
        <div>家庭成员</div>
        <div>+添加家庭成员</div>
      </div>
      <div class="member-contanier">
        <ul class="member-list-group">
          <li v-for="(column,index) in memberList" :key="index">
            <div class="custom-title-flex">
              <img v-if="column.sex === 0" src="../../assets/icon_people.png" />
              <img v-if="column.sex===1" src="../../assets/icon_people-2.png" />
              <span class="mg-right mg-left member-name">{{tranformDecrypt(column.patientName)}}</span>
              <span>{{column.age}}岁</span>
            </div>
            <div>
              <span class="mg-right">身份证</span>
              <span>| {{transformIdEncrypt(column.patientId)}}</span>
            </div>
            <div>
              <span class="mg-right">手机号</span>
              <span>| {{transformTelEncrypt(column.phone)}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import { sm4Decrypt, idEncrypt, telEncrypt } from '../../common/function'
import getUserMemberHooks from '../../hooks/user'
import { tranformDecrypt } from '../../hooks/transform'

export default defineComponent({
  setup() {
    const columnList = [
      {
        path: 'orderList',
        label: '我的挂号',
        isLeftIcon: true,
        iconName: 'balance-list',
      },
      {
        path: 'orderList',
        label: '个人记录',
        isLeftIcon: true,
        iconName: 'manager',
      },
      {
        path: 'orderList',
        label: '服务协议',
        isLeftIcon: false,
      },
      {
        path: 'orderList',
        label: '隐私政策',
        isLeftIcon: false,
      },
    ]
    const { memberList } = getUserMemberHooks()
    const transformTelEncrypt = computed(() => {
      return (val) => telEncrypt(sm4Decrypt(val))
    })
    const transformIdEncrypt = computed(() => {
      return (val) => idEncrypt(sm4Decrypt(val))
    })
    return {
      columnList,
      memberList,
      transformTelEncrypt,
      transformIdEncrypt,
      tranformDecrypt,
    }
  },
})
</script>

<style lang="scss" scoped>
.gh-tb {
  font-size: 20px;
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
  font-size: 16px;
  line-height: inherit;
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
}
</style>