<template>
  <div class="headlth-records submit-order">
    <MemberList :memberList="memberList" @seleckedPatient="seleckedPatient" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import getUserMemberHooks from '../../hooks/user'
import MemberList from '../../components/MemberList/Index.vue'
export default defineComponent({
  components: {
    MemberList,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      hasQueue: false,
    })
    const { unitId } = route.params
    const { memberList } = getUserMemberHooks()
    const seleckedPatient = (obj) => {
      const { memberId } = obj
      router.push({
        path: `/queueList`,
        query: {
          unitId,
          memberId,
        },
      })
    }
    return {
      ...toRefs(state),
      memberList,
      seleckedPatient,
    }
  },
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
