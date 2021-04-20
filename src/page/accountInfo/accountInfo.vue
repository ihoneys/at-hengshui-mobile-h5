<template>
  <div class="account">
    <custom-van-nav-bar />

    <div class="user-photo mt-10">
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
          name="datetimePicker"
          label="出生日期"
          placeholder="点击选择时间"
          input-align="right"
          v-model="account.birthDay"
          :clickable="false"
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
          v-model="account.idName"
          :required="true"
          :clickable="false"
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
          :rules="[
            {
              required: true,
              message: '请输入正确的证件号码',
              pattern: patternRegEXP,
            },
          ]"
          :disabled="hasValue"
          @blur="onBlur"
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
        <router-link to="/register/changePassword">
          <van-button class="mt-20" round block color="#ff976a" text="修改密码" />
        </router-link>
        <van-button class="mt-20" round block color="#AAAAAA" text="退 出" @click="handleExit" />
      </div>
    </div>
    <van-popup v-model:show="isPickerDate" position="bottom" :disabled="hasValue">
      <van-datetime-picker
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isPickerDate = false"
        @confirm="confirmDate"
      />
    </van-popup>
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="patientTypeList"
        :disabled="hasValue"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import {
  formateDate,
  encrypt,
  sm4Decrypt,
  tranformPickerType,
  protectName,
  idEncrypt,
  byPatientIdGetBrithdayAndSex,
} from '../../common/function'
import { patternObj as pattern } from '../../common/regularData'
import { LocalStorage, SessionStorage } from 'storage-manager-js'
import { saveUserMember } from '../../common/api'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { sendToAppMessage } from '../../common/uniPostMessage'
const date = new Date()
const patternObj = pattern
export default defineComponent({
  setup(props, ctx) {
    const router = useRouter()
    const state = reactive({
      account: {
        patientName: '',
        sex: '',
        birthDay: '',
        idName: '',
        idType: '',
        patientId: '',
      },
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      hasValue: false,
      isPickerDate: false,
      showPicker: false,
      patientTypeList: [],
      patternRegEXP: '',
    })
    onMounted(() => {
      isCheckUserInfo()
    })
    const { userId } = LocalStorage.get('userInfo')
    const isApp = SessionStorage.get('isApp') || false
    let patientType = SessionStorage.get('id_type')
    state.patientTypeList = tranformPickerType(patientType)
    const isCheckUserInfo = () => {
      const data = SessionStorage.get('accountInfo') || {}
      console.log(data)
      if (data.patientId) {
        state.hasValue = true
        state.account.patientName = protectName(sm4Decrypt(data.patientName))
        state.account.sex = data.sex + ''
        state.account.birthDay = data.birthDay
        state.account.patientId = idEncrypt(sm4Decrypt(data.patientId))
        state.account.idName = patternObj[data.idType].name || '居民身份证'
      }
    }
    const saveAccountInfo = async () => {
      const sendData = {
        idType: state.account.idType,
        patientId: encrypt(state.account.patientId),
        patientName: encrypt(state.account.patientName),
        sex: state.account.sex,
        birthDay: state.account.birthDay,
        userId: userId,
      }
      const { success } = await saveUserMember(sendData)
      if (success) {
        Toast({
          type: 'success',
          message: '保存成功',
          onClose: () => {
            SessionStorage.delete('accountInfo')
            router.go(-1)
          },
        })
      }
    }
    const confirmDate = (value) => {
      const date = formateDate(value, false)
      state.isPickerDate = false
      state.account.birthDay = date
    }
    const onConfirm = (current) => {
      state.showPicker = false
      state.account.idName = current.text
      state.account.idType = current.value
      if (patternObj[current.value]) {
        state.patternRegEXP = patternObj[current.value].rules
      }
    }
    const handleExit = () => {
      LocalStorage.deleteAll()
      router.push({ path: '/login', replace: true })
      if (isApp) {
        sendToAppMessage('_', '_', true) //登出
      }
    }
    const onBlur = computed(() => {
      if (state.account.idType !== '01') return
      const { birthDay, radio } = byPatientIdGetBrithdayAndSex(state.account.patientId)
      if (birthDay || radio) {
        state.account.birthDay = birthDay
        state.account.sex = radio
      }
    })
    return {
      ...toRefs(state),
      saveAccountInfo,
      confirmDate,
      onConfirm,
      handleExit,
      protectName,
      onBlur,
    }
  },
})
</script>

<style scoped>
.user-info :deep() .van-field__error-message {
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
