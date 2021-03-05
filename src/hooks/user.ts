import { onMounted, reactive, toRefs } from 'vue'
import { getUserMember } from '../common/api'
import { LocalStorage } from 'storage-manager-js'
import {
  sm4Decrypt,
  idEncrypt,
  telEncrypt,
  computedAge,
} from '../common/function'
export default () => {
  const state = reactive({
    memberList: [],
  })
  const { userId } = LocalStorage.get('userInfo')
  const params = { userId }
  const getUserMemberList = async () => {
    const { success, data } = await getUserMember(params)
    if (success) {
      state.memberList = tranformData(data)
    }
  }
  const tranformData = (data) => {
    data.forEach((obj) => {
      obj.patientName = sm4Decrypt(obj.patientName)
      obj.patientId = idEncrypt(sm4Decrypt(obj.patientId))
      obj.phone = telEncrypt(sm4Decrypt(obj.phone))
      obj.age = computedAge(obj.birthDay)
      if (!!obj.diagnosticCardNo) {
        obj.diagnosticCardNo = idEncrypt(sm4Decrypt(obj.diagnosticCardNo))
      }
    })
    return data
  }
  onMounted(() => {
    getUserMemberList()
  })
  return {
    ...toRefs(state),
  }
}
