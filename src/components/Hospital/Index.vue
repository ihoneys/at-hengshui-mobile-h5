<template>
  <ul class="doctor-list" v-if="hospitals != null">
    <li v-for="(item, index) in hospitals" :key="index">
      <router-link :to="`/department/${item.hisUnitId}`">
        <div class="doctor-item">
          <div class="photo">
            <van-image
              width="100%"
              height="100%"
              radius="4px"
              lazy-load
              :src="item.image"
              @error="imgError(item)"
              alt="被吃掉了"
            />
          </div>
          <div class="recommend">
            <div>
              <span class="doctor-name">{{ item.unitName }}</span>
              <span></span>
            </div>
            <div class="describe">
              <span class="tag-span" v-if="item.unitLevelName != null">
                {{
                item.unitLevelName
                }}
              </span>
              <span class="tag-span" v-if="item.unitClassName != null">
                {{
                item.unitClassName
                }}
              </span>
            </div>
            <span v-if="item.distance != null">距离{{ item.distance | getKm }}</span>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Hospital',
  props: {
    hospitals: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    console.log(props.hospitals)
  },
})
// export default {
//   components: {},
//   props: ["hospitals"],
//   data() {
//     return { bb: 9 };
//   },
//   methods: {
//     getInfo(item) {
//       sessionStorage.setItem("currentHospitalInfo", JSON.stringify(item));
//       this.$emit("getHospitalInfo", item)
//     },
//     imgError(item) {
//       if (item.imgError) {
//         return;
//       } else {
//         item.image = item.image.replace("http", "https");
//         item.imgError = true;
//       }
//     },
//   },
//   created() { },
//   mounted() { },
//   filters: {
//     //级别转换
//     yylevel: function (value) {
//       let dictionarys = JSON.parse(sessionStorage.getItem("dictionarys"));
//       if (!dictionarys) {
//         return null;
//       }
//       let arr = dictionarys.filter((el) => {
//         return el.dictCode == value && el.dictType === "yylevel";
//       });
//       if (arr.length > 0) {
//         let temp = arr[0].dictName;
//         return temp;
//       } else {
//         return "未知";
//       }
//     },
//     yyType(value) {
//       let dictionarys = JSON.parse(sessionStorage.getItem("dictionarys"));
//       if (!dictionarys) {
//         return null;
//       }
//       let arr = dictionarys.filter((el) => {
//         return el.dictCode == value && el.dictType === "yyType";
//       });
//       if (arr.length > 0) {
//         let temp = arr[0].dictName;
//         return temp;
//       } else {
//         return "未知";
//       }
//     },

//     //距离转换
//     getKm(value) {
//       if (!value) {
//         return "";
//       }
//       let distance = value;
//       let distance_str = "";
//       if (parseInt(distance) >= 1) {
//         return (distance_str = distance.toFixed(1) - 120 + "km");//临时减去120，后续需查明距离错误的原因
//       } else {
//         return (distance_str = distance * 1000 + "m");
//       }
//     },
//   },
//   watch: {},
//   computed: {},
// };
</script>
<style lang="scss"  scoped>
// 医生列表
.doctor-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  font-size: 16px;
  .doctor-item {
    background-color: #fff;
    color: #999999;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    padding: 4%;
    display: flex;
    p {
      margin-bottom: 6px;
    }
    .photo {
      width: 20vw;
      height: 65px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .recommend {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      padding-left: 3vw;
      .doctor-name {
        font-size: 16px;
        font-weight: bold;
        color: #222;
      }
      .doctor-explain {
        width: 205px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      //医院描述
      .describe {
        display: flex;
        align-items: center;
        .tag-span {
          font-size: 12px;
          margin-right: 8px;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid #1989fa;
          color: #1989fa;
          height: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>