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
          v-model="account.birthday"
          :required="true"
          :rules="[{ required: true, message: '请选择出生日期' }]"
          :disabled="hasValue"
          @click-input="isPickerDate = true"
        />
        <van-field
          label="证件类型"
          placeholder="点击选择证件类型"
          input-align="right"
          readonly
          :clickable="false"
          v-model="account.idName"
          :required="true"
          :rules="[{ required: true, message: '请选择证件类型' }]"
          :disabled="hasValue"
          @click-input="showPicker = true"
        />
        <van-field
          v-model="account.patientId"
          maxlength="50"
          label="证件号码"
          placeholder="请输入证件号码"
          input-align="right"
          :required="true"
          :rules="[{ required: true, message: '请输入正确的证件号码',pattern: patternRegEXP}]"
          :disabled="hasValue"
        />
        <div class="pd-14">
          <van-button
            class="mt-20"
            round
            block
            native-type="submit"
            color="#18c0b5"
            text="保 存"
            :disabled="hasValue"
          />
        </div>
      </van-form>
      <div class="pd-14">
        <van-button class="mt-20" round block color="#18c0b5" text="修改密码" />
        <van-button class="mt-20" round block color="#18c0b5" text="退 出" @click="handleExit" />
      </div>
    </div>
    <van-popup v-model:show="isPickerDate" position="bottom" :disabled="hasValue">
      <van-datetime-picker
        v-model="pickerDate"
        type="date"
        title="选择年月日"
        @cancel="isPickerDate = false"
        @confirm="confirmDate"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="patientTypeList"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :disabled="hasValue"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import {
  formateDate,
  encrypt,
  sm4Decrypt,
  isObjEmpty,
  tranformPickerType,
} from '../../common/function'
import { patternObj as pattern } from '../../common/regularData'
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import { saveUserMember, queryMemberInfo } from '../../common/api'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
const date = new Date()
const patternObj = pattern
export default defineComponent({
  setup(props, ctx) {
    const router = useRouter()
    const state = reactive({
      account: {
        patientName: '',
        sex: '',
        birthday: '',
        idName: '',
        idType: '',
        patientId: '',
      },
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      hasValue: false,
      pickerDate: '',
      isPickerDate: false,
      showPicker: false,
      patientTypeList: [],
      patternRegEXP: '',
    })
    onMounted(() => {
      isCheckUserInfo()
    })
    const { userId } = LocalStorage.get('userInfo')
    let patientType = SessionStorage.get('id_type')
    state.patientTypeList = tranformPickerType(patientType)
    const isCheckUserInfo = async () => {
      const { success, data } = await queryMemberInfo()
      if (success && !isObjEmpty(data)) {
        state.hasValue = true
        state.account.patientName = sm4Decrypt(data.patientName)
        state.account.sex = data.sex + ''
        state.account.birthday = data.birthDay
        state.account.patientId = sm4Decrypt(data.patientId)
        state.account.idName = patternObj[data.idType]?.name || '居民身份证'
      }
    }
    const saveAccountInfo = async (data) => {
      const sendData = {
        idType: state.account.idType,
        patientId: encrypt(state.account.patientId),
        patientName: encrypt(state.account.patientName),
        sex: state.account.sex,
        birthDay: state.account.birthday,
        userId: userId,
      }
      const { success, message } = await saveUserMember(sendData)
      if (success) {
        Toast({
          type: 'success',
          message: '保存成功',
          onClose: () => {
            router.go(-1)
          },
        })
      } else {
        Toast.fail(message)
      }
    }
    const confirmDate = (value) => {
      const date = formateDate(value, false)
      state.isPickerDate = false
      state.account.birthday = date
    }
    const onConfirm = (current) => {
      state.showPicker = false
      state.account.idName = current.text
      state.account.idType = current.value
      state.patternRegEXP = patternObj[current.value].rules
    }
    const handleExit = () => {
      LocalStorage.deleteAll()
      router.push('login')
    }
    return {
      ...toRefs(state),
      saveAccountInfo,
      confirmDate,
      onConfirm,
      handleExit,
    }
  },
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
.mt-20 {
  margin-top: 20px;
}
.pd-14 {
  padding: 0 14px;
}
</style>