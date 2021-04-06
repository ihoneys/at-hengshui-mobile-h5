<template>
  <div class="headlth-records submit-order">
    <MemberList :memberList="memberList" @seleckedPatient="seleckedPatient"></MemberList>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { defineComponent, reactive, toRefs } from 'vue'
import getUserMemberHooks from '../../hooks/user'
import MemberList from '../../components/MemberList/Index.vue'
const outsiedUrl = `http://ehr.jk-hs.com:8081/#/login?card=`
export default defineComponent({
  components: {
    MemberList
  },
  setup () {
    const state = reactive({
      showAddPatient: false,
      radio: '',
      memberList: []
    })
    const seleckedPatient = (item, i) => {
      Toast.loading({
        message: "跳转中...",
        forbidClick: true,
        duration: 10000,
      })
      state.radio = i
      const { patientId } = item
      if (!patientId) {
        Toast.fail('信息不完整！')
        return
      }
      window.location.href = `${outsiedUrl}${patientId}`
    }
    const { memberList } = getUserMemberHooks()
    console.log(memberList)
    return {
      ...toRefs(state),
      seleckedPatient,
      memberList
    }

  }
})
</script>

<style lang="scss">
.headlth-records {
  background-color: #f5f5f5;
  width: 100%;
  min-height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}

</style>