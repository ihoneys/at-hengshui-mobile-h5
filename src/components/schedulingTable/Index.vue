<template>
  <div class="table">
    <van-swipe class="my-swipe" indicator-color="#00d2c3">
      <van-swipe-item v-for="table in tableData">
        <table class="container">
          <tr>
            <td></td>
            <td v-for="row in table.week" class="container-td-time">
              <p>{{transformWeek(row.date)}}</p>
              <p>{{transformDate(row.date)}}</p>
            </td>
          </tr>
          <tr v-for="column in table.timeTypes">
            <td class="dict-name">{{column.dictName}}</td>
            <template v-if="!isProcessData">
              <td
                v-for="(item,index) in table.week"
                class="click-active"
                :class="{'active':isIfNumber(table, item, column)}"
                @click.prevent="changeTextStatus(table, item, column) ? makeApponintment(item.date,table.date[item.date][column.dictCode],isIfNumber(table, item, column),column.dictCode,column.dictName): ''"
              >{{ !changeTextStatus(table, item, column) ? '': isIfNumber(table, item, column) ? '预约': '已满' }}</td>
            </template>
            <template v-else>
              <td
                :class="{'active':filtersText(table.date[item.date],column.dictCode)==='预约'}"
                v-for="(item,index) in table.week"
                class="click-active"
              >{{filtersText(table.date[item.date],column.dictCode)}}</td>
            </template>
          </tr>
        </table>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { transformWeek, transformDate } from '../../hooks/date'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    tableData: Array,
    isProcessData: Boolean
  },
  setup (props, ctx) {
    console.log(props.tableData, props.isProcessData, 8888)
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
    const filtersText = computed(() => {
      return function (date, dictCode) {
        if (!date || !date[dictCode] || !date[dictCode].isYuyue) return ''
        return date[dictCode].isYuyue ? '预约' : '已满'
      }
    })
    const makeApponintment = (date, data, isNumber, dictCode, dictName) => {
      console.log(date, data, isNumber, dictCode, dictName)
      if (!isNumber) return
      ctx.emit('clickItem', date, data, isNumber, dictCode, dictName)
    }
    return {
      transformWeek,
      transformDate,
      isIfNumber,
      changeTextStatus,
      makeApponintment,
      filtersText
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
    .active {
      background: #00d2c3;
      color: #fff;
    }
    .click-active:active {
      background: #cccccc;
    }
  }
}
.dict-name {
  color: #333 !important;
}
.my-swipe {
  height: 200px;
}
</style>