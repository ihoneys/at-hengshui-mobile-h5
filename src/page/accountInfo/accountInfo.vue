<template>
  <div class="account">
    <div class="user-photo">
      <div>头像</div>
      <van-image round width="60" height="60" src />
    </div>
    <div class="user-info">
      <van-form @submit="saveAccountInfo">
        <van-field
          v-model="account.patientName"
          maxlength="50"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
          :required="true"
          :rules="[{ required: true, message: '请填写用户名' }]"
          :disabled="hasValue"
        />
        <van-field
          name="radio"
          label="性别"
          input-align="right"
          :required="true"
          :rules="[{ required: true, message: '请填写性别' }]"
          :disabled="hasValue"
        >
          <template #input>
            <van-radio-group v-model="account.sex" direction="horizontal">
              <van-radio name="0" checked-color="#00D2C3" :disabled="hasValue">男</van-radio>
              <van-radio name="1" checked-color="#00D2C3" :disabled="hasValue">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          readonly
          :clickable="false"
          name="datetimePicker"
          label="出生日期"
          placeholder="点击选择时间"
          input-align="right"
          v-model="account.birthDay"
          :required="true"
          :rules="[{ required: true, message: '请选择出生日期' }]"
          :disabled="hasValue"
          @click-input="selectBirthday"
        />
        <van-field
          maxlength="50"
          label="证件类型"
          placeholder="点击选择证件类型"
          input-align="right"
          readonly
          :value="account.idName"
          :required="true"
          :rules="[{ required: true, message: '请选择证件类型' }]"
          :disabled="hasValue"
        />
        <van-field
          v-model="account.patientNumber"
          maxlength="50"
          label="证件号码"
          placeholder="请输入证件号码"
          input-align="right"
          :required="true"
          :rules="[{ required: true, message: '请输入正确的证件号码' }]"
          :disabled="hasValue"
        />

        <van-button
          round
          block
          native-type="submit"
          color="#18c0b5"
          text="保 存"
          :disabled="hasValue"
        />
      </van-form>
    </div>
    <van-popup v-model:show="isPickerDate" position="bottom" :disabled="hasValue">
      <van-datetime-picker
        v-model="pickerDate"
        type="date"
        title="选择年月日"
        @cancel="cancelDate"
        @confirm="confirmDate"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="option1"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :disabled="disabledA"
      />
    </van-popup>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { formateDate } from '../../common/function'
import { SessionStorage } from 'storage-manager-js'
const date = new Date()
export default defineComponent({
  setup (props, ctx) {
    const state = reactive({
      account: {
        patientName: '',
        sex: '',
        birthday: '',
        idName: '',
        patientId: '',
      },
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      hasValue: false,
      pickerDate: '',
      isPickerDate: false,
      patientTypeList: []
    })
    const patientType = SessionStorage.get('id_type')
    const saveAccountInfo = (data) => {
      console.log(data)
    }
    const selectBirthday = () => {
      state.isPickerDate = true
    }
    const cancelDate = () => {
      state.isPickerDate = false
    }
    const confirmDate = (value) => {
      const date = formateDate(value, false)
      state.isPickerDate = false
      state.account.birthDay = date
    }
    return {
      ...toRefs(state),
      saveAccountInfo,
      selectBirthday,
      cancelDate,
      confirmDate,
    }
  }
})
</script>

<style scoped>
.user-info >>> .van-field__error-message {
  text-align: right;
}
.account {
  background-color: #f5f5f5;
  height: 100vh;
}
.user-photo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px;
}
.user-info {
  margin-top: 10px;
}
</style>