import { onMounted } from '@vue/runtime-core'
import { SessionStorage } from 'storage-manager-js'
import { dictionaryQuery } from './common/api'
export default () => {
  onMounted(() => {
    if (!SessionStorage.has('dictionarys')) {
      getDictionarys()
    }
  })
  const getDictionarys = async () => {
    const { success, data } = await dictionaryQuery()
    if (success && !SessionStorage.has('dictionarys')) {
      SessionStorage.set('dictionarys', data)
      const needArray = [
        { setName: 'id_type', getName: 'id_type' },
        { setName: 'payTypeArr', getName: 'pay_type' },
        { setName: 'orderTypeArr', getName: 'order_status' },
      ]
      needArray.forEach((v) => {
        const baseData = data.filter((el) => el.dictType == v.getName)
        SessionStorage.set(v.setName, baseData)
      })
    }
  }
}
