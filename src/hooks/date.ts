import { computed } from 'vue'
export const transformWeek = computed(() => {
  return function (week: string) {
    const weekArray: string[] = new Array(
      '周日',
      '周一',
      '周二',
      '周三',
      '周四',
      '周五',
      '周六'
    )
    const weekValue = weekArray[new Date(week).getDay()]
    return weekValue
  }
})
export const transformDate = computed(() => {
  return function (date: string) {
    return date.substring(5)
  }
})
