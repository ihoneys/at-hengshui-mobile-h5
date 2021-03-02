<template>
  <div class="table">
    <table class="container" v-for="table in tableData">
      <tr>
        <td></td>
        <td v-for="row in table.week" class="container-td-time">
          <p>{{transformWeek(row.date)}}</p>
          <p>{{transformDate(row.date)}}</p>
        </td>
      </tr>
      <tr v-for="column in table.timeTypes">
        <td>{{column.dictName}}</td>
        <td
          v-for="(item,index) in table.week"
          :class="{'active':isIfNumber(table, item, column)}"
        >{{ !changeTextStatus(table, item, column) ? '': isIfNumber(table, item, column) ? '预约': '已满' }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { transformWeek, transformDate } from '../../hooks/date'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    tableData: Array
  },
  setup (props) {
    console.log(props.tableData)
    const isIfNumber = computed(() => {
      return function (table, item, column) {
        const hasDate = table.date[item.date]
        const hasTimeShort = column.dictCode
        return (hasDate && hasDate[hasTimeShort] && hasDate[hasTimeShort].isYuyue)
      }
    })
    const changeTextStatus = computed(() => {
      return function (table, item, column) {
        const hasDate = table.date[item.date]
        const hasTimeShort = column.dictCode
        return hasDate && hasDate[hasTimeShort]
      }
    })
    return {
      transformWeek,
      transformDate,
      isIfNumber,
      changeTextStatus
    }

  }
})
</script>

<style lang="scss">
.table {
  width: 100%;
  display: flex;
  justify-content: center;
  .container {
    display: block;
    border-collapse: collapse;
    td {
      width: 40px;
      height: 40px;
      font-size: 10px;
      border: 1px solid rgba(221, 221, 221, 1);
      color: #999999;
      text-align: center;
    }
    .container-td-time {
    }
    .active {
      background: #00d2c3;
      color: #fff;
    }
  }
}
</style>