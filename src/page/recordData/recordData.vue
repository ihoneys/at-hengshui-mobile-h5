<template>
  <div class="record-data">
    <van-nav-bar
      title="指标采集"
      left-text="返回"
      left-arrow
      fixed
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="add"
    >
      <template #right>
        <span style="color: #07c160" v-show="!isIncreased">新增</span>
      </template>
    </van-nav-bar>
    <div v-show="!isIncreased">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        @load="loadMore"
        :immediate-check="false"
      >
        <van-cell
          is-link
          v-for="(column, index) in dataList"
          :key="index"
          @click="handleList(column)"
        >
          <template #title>
            <span class="custom-title"
              >{{ transformFormateDate(column.createDate) }}
              {{ transformWeek(column.createDate) }}</span
            >
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="form-data" v-show="isIncreased">
      <van-form @submit="onSubmit">
        <van-field
          v-model="formData.systolicPressure"
          type="number"
          :disabled="isDisabled"
          name="systolicPressure"
          label="收缩压"
          placeholder="请输入收缩压"
          :required="true"
          :rules="[{ required: true, message: '请输入收缩压' }]"
        >
          <template #extra>
            <div class="extra-div">mmHg</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.diastolicPressure"
          type="number"
          :disabled="isDisabled"
          name="diastolicPressure"
          label="舒张压"
          placeholder="请输入舒张压"
          :required="true"
          :rules="[{ required: true, message: '请输入舒张压' }]"
        >
          <template #extra>
            <div class="extra-div">mmHg</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.bloodSugar"
          type="number"
          :disabled="isDisabled"
          name="bloodSugar"
          label="血糖"
          placeholder="请输入血糖"
          :required="true"
          :rules="[{ required: true, message: '请输入血糖' }]"
        >
          <template #extra>
            <div class="extra-div">mmlo/l</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.electrocardiograph"
          type="number"
          :disabled="isDisabled"
          name="electrocardiograph"
          label="心率"
          placeholder="请输入心率"
          :required="true"
          :rules="[{ required: true, message: '请输入心率' }]"
        >
          <template #extra>
            <div class="extra-div">次/分</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.height"
          type="number"
          :disabled="isDisabled"
          name="height"
          label="身高"
          placeholder="请输入身高"
          :required="true"
          :rules="[{ required: true, message: '请输入身高' }]"
        >
          <template #extra>
            <div class="extra-div">cm</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.weight"
          type="number"
          :disabled="isDisabled"
          name="weight"
          label="收体重"
          placeholder="请输入体重"
          :required="true"
          :rules="[{ required: true, message: '请输入体重' }]"
        >
          <template #extra>
            <div class="extra-div">kg</div>
          </template>
        </van-field>
        <van-field
          v-model="formData.temperature"
          type="number"
          :disabled="isDisabled"
          name="temperature"
          label="体温"
          placeholder="请输入体温"
          :required="true"
          :rules="[{ required: true, message: '请输入体温' }]"
        >
          <template #extra>
            <div class="extra-div">°c</div>
          </template>
        </van-field>
        <div class="add-btn">
          <van-button round block native-type="submit" color="#07c160">{{ submit }}</van-button>
        </div>
      </van-form>
    </div>
    <div class="no-data" v-if="!dataList.length && !isIncreased">
      <img width="100" height="100" lazy-load src="@/assets/nothing_2.png" />
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import { getCollectionList, saveCollectionData, deleteIndexCollection } from '../../common/api'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { LocalStorage } from 'storage-manager-js'
import { Toast } from 'vant'
import { transformWeek, transformFormateDate } from '../../hooks/date'
import Input from '@/components/Input/Index.vue'
export default defineComponent({
  components: {
    Input,
  },
  setup() {
    const state = reactive({
      dataList: [],
      formData: {
        systolicPressure: '',
        diastolicPressure: '',
        bloodSugar: '',
        electrocardiograph: '',
        height: '',
        weight: '',
        temperature: '',
      },
      finished: false,
      loading: false,
      isIncreased: false,
      isDisabled: false,
      submit: '提交',
    })
    const router = useRouter()
    onMounted(() => {
      getDataList()
    })
    const getDataList = async () => {
      state.dataList = []
      const params = {
        page: 0,
        size: 10,
        userId: LocalStorage.get('userInfo').userId,
      }
      const { success, data, message } = await getCollectionList(params)
      if (success) {
        state.dataList = [...state.dataList, ...data.list]
      } else {
        Toast.fail(message)
      }
    }
    const loadMore = () => { }
    const onSubmit = async (validate) => {
      if (state.isDisabled) {
        const { success, message } = await deleteIndexCollection(state.formData.id)
        if (success) {
          Toast({
            type: 'success',
            message: '删除成功',
            onClose: () => {
              setValueStatus(false)
              getDataList()
            },
          })
        } else {
          Toast.fail(message)
        }
        return
      }
      const { success, message } = await saveCollectionData(validate)
      if (success) {
        Toast({
          type: 'success',
          message: '录入成功',
          onClose: () => {
            state.isIncreased = false
            getDataList()
          },
        })
      } else {
        Toast.fail(message)
      }
    }
    const handleList = (obj) => {
      setValueStatus(true, true, '删除', obj)
    }
    const add = () => {
      setValueStatus(true, false)
    }
    const setValueStatus = (isIncreased, isDisabled = false, submit = '新增', obj = {}) => {
      state.isIncreased = isIncreased
      state.isDisabled = isDisabled
      state.submit = submit
      state.formData = obj
    }
    const onClickLeft = () => {
      if (state.isIncreased) {
        state.isIncreased = false
      } else {
        router.go(-1)
      }
    }
    return {
      ...toRefs(state),
      loadMore,
      transformWeek,
      transformFormateDate,
      onSubmit,
      handleList,
      add,
      onClickLeft,
    }
  },
})
</script>

<style>
.add-btn {
  padding: 14px;
}
</style>
