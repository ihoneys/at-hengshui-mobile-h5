<template>
  <div class="login">
    <div class="login-content">
      <h3>健康衡水</h3>
      <div v-show="!loginType">
        <div class="p-phone">
          <img height="30" src="../../assets/tell.png" alt />
          <van-field
            clearable
            placeholder="请输入手机号码"
            maxlength="11"
            type="tel"
            v-model="phone"
            :formatter="formatter"
          />
        </div>
        <div class="auth-code">
          <img height="30" src="../../assets/msg.png" alt />
          <van-field
            center
            clearable
            maxlength="6"
            type="number"
            v-model="resCode"
            placeholder="请输入短信验证码"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="isGetCode || !phoneRexg.test(phone)"
                @click.stop="onGetCode"
              >{{codeText}}</van-button>
            </template>
          </van-field>
        </div>
        <div style="padding: 10px 20px">
          <van-button
            round
            block
            type="primary"
            color="#00d3c2"
            @click.stop="verificationCodeLogin"
            :disabled="!resCode || !phone"
          >登 录</van-button>
        </div>
      </div>
      <div v-show="loginType">
        <div class="same-style">
          <van-field
            v-model="phone"
            type="text"
            label="账号"
            placeholder="请输入用户名"
            :label-width="40"
            required
          />
        </div>
        <div class="same-style">
          <van-field
            required
            label="密码"
            placeholder="请输入密码"
            :label-width="40"
            right-icon="browsing-history"
            @click-right-icon="inputType = !inputType"
            v-model="password"
            :type="inputType ? 'text': 'password'"
          />
        </div>
        <div class="mt-10" style="padding: 10px 20px">
          <van-button
            block
            round
            type="primary"
            loading-type="spinner"
            color="#00d3c2"
            @click.stop="passwordLogin"
            :disabled="!password || !phoneRexg.test(phone)"
          >登 录</van-button>
        </div>
      </div>

      <div class="change-box mt-10">
        <div @click="changeLoginType" v-text="typeName?'验证码登录': '账号密码登录'"></div>
        <div>
          <router-link
            class="signup"
            style="margin-right: 10px"
            to="/register/changePassword"
            v-show="loginType"
          >忘记密码</router-link>
          <router-link class="signup" to="/register/registered">用户注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { encrypt } from '../../common/function'
import { getLogin, loginByPwd, getToken } from '../../common/api'
import { getVerificationCode, loginSuccess } from '../../hooks/signup'
import { Dialog } from 'vant'
import { phoneRexg } from '../../common/regularData'
export default defineComponent({
  setup() {
    const titleName = ref('验证码登录')
    const typeName = ref(false)
    const loginType = ref(false)
    const inputType = ref(false)
    const resCode = ref('')
    const password = ref('')
    const router = useRouter()
    const {
      phone,
      onGetCode,
      codeText,
      countDown,
      isGetCode,
    } = getVerificationCode()
    const { toPreviousRoute, storeLoginInfomation } = loginSuccess()

    const verificationCodeLogin = async () => {
      const sendData = {
        phone: encrypt(phone.value),
        code: resCode.value,
        openidKey: null,
        appType: 1,
      }
      const result = await getLogin(sendData)
      if (result.success) {
        storeLoginInfomation(result)
        toPreviousRoute(router, true)
      }
    }
    const passwordLogin = async () => {
      const params = {
        phone: encrypt(phone.value),
        password: encrypt(password.value),
        appType: 1,
      }
      const res = await loginByPwd(params)
      if (res.success) {
        const userParams = {
          tokenKey: res.data,
        }
        const { success, data: userInfo } = await getToken(userParams)
        if (success) {
          storeLoginInfomation(Object.assign(userInfo, res))
        }
        if (res.modifySecret === 1 && success) {
          Dialog.confirm({
            title: '温馨提示',
            message: '您的密码已经3个月没更新了，是否立即更新？',
          })
            .then(() => {
              toRegister(1)
            })
            .catch(() => {
              toPreviousRoute(router)
            })
        } else {
          toPreviousRoute(router)
        }
      }
    }
    const toRegister = (isNewUser) => {
      router.push({
        name: 'register',
        params: {
          isNewUser,
        },
      })
    }
    const changeLoginType = () => {
      loginType.value = !loginType.value
      typeName.value = !typeName.value
    }
    const formatter = (value: any) => {
      return value.replace(/[^\d]/g, '')
    }
    return {
      titleName,
      countDown,
      resCode,
      phone,
      password,
      typeName,
      loginType,
      inputType,
      onGetCode,
      verificationCodeLogin,
      passwordLogin,
      changeLoginType,
      formatter,
      codeText,
      isGetCode,
      phoneRexg,
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  padding-top: 20%;
  .login-content {
    h3 {
      height: 28px;
      font-size: 24px;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
      text-align: center;
      padding: 40px 0;
    }
    .p-phone {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e7e7e7;
      padding-left: 20px;
    }
    .auth-code {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e7e7e7;
      padding-left: 20px;
    }
  }
}
.change-box {
  padding: 0 30px;
  padding-bottom: 20px;
  font-size: 14px;
  color: #00d3c2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.signup {
  font-size: 14px;
  color: #00d3c2;
}
.same-style {
  padding-left: 20px;
  border-bottom: 1px solid #e7e7e7;
}
</style>