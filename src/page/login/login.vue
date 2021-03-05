<template>
  <div class="login">
    <div class="login-content">
      <h3>login</h3>
      <div v-show="!loginType">
        <div class="p-phone">
          <img src="../../assets/tell.png" alt />
          <van-field
            v-model="phone"
            placeholder="请输入手机号码"
            maxlength="11"
            type="tel"
            :formatter="formatter"
            clearable
          />
        </div>
        <div class="auth-code">
          <img src="../../assets/msg.png" alt />
          <van-field v-model="resCode" maxlength="6" center clearable placeholder="请输入短信验证码">
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="isGetCode || !phone"
                @click.stop="onGetCode"
              >{{codeText}}</van-button>
            </template>
          </van-field>
        </div>
        <div style="padding: 10px 20px">
          <van-button
            :loading="isloading"
            type="primary"
            loading-type="spinner"
            @click.stop="onNextStep"
            size="large"
            round
            :disabled="!resCode || !phone"
          >登 录</van-button>
        </div>
      </div>
      <div v-show="loginType">
        <van-cell-group>
          <van-field
            v-model="phone"
            type="text"
            label="账号"
            placeholder="请输入用户名"
            :label-width="40"
            required
          />
        </van-cell-group>
        <van-cell-group>
          <form>
            <van-field
              v-model="password"
              :type="inputType ? 'text': 'password'"
              label="密码"
              placeholder="请输入密码"
              :label-width="40"
              right-icon="browsing-history"
              @click-right-icon="checkPassword"
              autocomplete="off"
              required
            />
          </form>
        </van-cell-group>
        <div style="padding: 10px 20px">
          <van-button
            :loading="isloading"
            type="primary"
            size="large"
            round
            loading-type="spinner"
            @click.stop="onNextStep2"
            :disabled="!password || !phone"
          >登 录</van-button>
        </div>
      </div>

      <div class="change-box">
        <div @click="changeLoginType" v-text="typeName?'验证码登录': '账号密码登录'"></div>
        <div>
          <router-link
            class="signup"
            style="margin-right: 10px"
            to="/register/1"
            v-show="loginType"
          >忘记密码</router-link>
          <router-link class="signup" to="/register/2">用户注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createMessage, encrypt } from '../../common/function'
import { getPhoneCode, getLogin, loginByPwd, getToken } from '../../common/api'
import { LocalStorage } from 'storage-manager-js'
import { Dialog, Toast } from 'vant'
export default defineComponent({
  setup(props, ctx) {
    const titleName = ref('验证码登录')
    const codeText = ref('获取验证码')
    const typeName = ref(false)
    const isGetCode = ref(false)
    const isloading = ref(false)
    const loginType = ref(false)
    const inputType = ref(false)
    const countDown = ref(29)
    const resCode = ref('')
    const phone = ref('')
    const password = ref('')
    const $router = useRouter()
    const countTime = () => {
      isGetCode.value = true
      let timer = setInterval(() => {
        if (countDown.value !== 0) {
          codeText.value = `重新发送${countDown.value--}`
        } else {
          isGetCode.value = false
          codeText.value = '获取验证码'
          countDown.value = 29
          clearInterval(timer)
        }
      }, 1000)
    }
    const isValidtePhone = () => {
      const pattern = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!pattern.test(phone.value)) {
        createMessage('请重新输入正确的手机号码！')
        return false
      } else {
        return true
      }
    }
    const onGetCode = async () => {
      isValidtePhone()
      const { success, infor } = await getPhoneCode(encrypt(phone.value))
      if (success) {
        countTime()
        Toast.success(infor)
      } else {
        Toast.fail(infor)
      }
    }
    const onNextStep = async () => {
      isValidtePhone()
      const sendData = {
        phone: encrypt(phone.value),
        code: resCode.value,
        openidKey: null,
        appType: 1,
      }
      const res = await getLogin(sendData)
      if (res.success) {
        LocalStorage.set('userInfo', res)
        backToPageHome()
      } else {
        Toast.fail(res.message)
      }
    }
    const backToPageHome = () => {
      $router.go(-1)
    }
    const toRegister = (isNewUser) => {
      $router.push({
        name: 'register',
        params: {
          isNewUser,
        },
      })
    }
    const checkPassword = () => {
      inputType.value = !inputType.value
    }
    const onNextStep2 = async () => {
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
          LocalStorage.set('userInfo', userInfo)
          LocalStorage.set('token', userInfo.token)
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
              backToPageHome()
            })
        }
      } else {
        createMessage(res.message)
      }
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
      isloading,
      countDown,
      resCode,
      phone,
      password,
      typeName,
      loginType,
      inputType,
      onGetCode,
      onNextStep,
      checkPassword,
      onNextStep2,
      changeLoginType,
      formatter,
      codeText,
      isGetCode,
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  padding-top: 20%;
  box-sizing: border-box;
  background-color: #fff;

  .login-content {
    height: calc(100% - 50px);

    h3 {
      height: 28px;
      font-size: 24px;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
      text-align: center;
      padding: 40px 0;
    }

    .login-title {
      font-size: 20px;
      line-height: 1.5;
      background-color: #fafbfa;
      text-align: center;
    }

    .p-phone {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #e7e7e7;
      border-image: svg(1px-border param(--color #e7e7e7)) 2 2 stretch;
      // padding-bottom: 10px;
      padding-left: 20px;
      img {
        height: 30px;
        margin-right: 10px;
      }
    }

    .login-telphone {
      font-size: 20px;
      color: #666666;
    }

    input {
      width: 90%;
      font-size: 14px;
      border: none;
      background-color: transparent;
    }

    .auth-code {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e7e7e7;
      border-image: svg(1px-border param(--color #e7e7e7)) 2 2 stretch;
      padding-left: 20px;
      img {
        height: 30px;
        margin-right: 10px;
      }
    }

    // 获取验证码 按钮
    .login-count-down {
      width: 120px;
      font-size: 14px;
      color: #00d3c2;
      -webkit-border-radius: 28;
      -moz-border-radius: 28;
      border-radius: 28px;
      text-decoration: none;
      border: solid 1px #00d3c2;
      padding: 5px 0;
    }

    // 登录按钮
    .login-btn {
      width: 86%;
      margin-bottom: 20px;
      margin-left: 7%;
      font-size: 20px;
      padding: 15px 0;
      text-align: center;
      outline: none;
      letter-spacing: 10px;
      border: 0;
      color: #ffffff;
      background: rgba(0, 210, 195, 0.5);
      border-radius: 100px;
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

.footer-tag {
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: #ccc;
  letter-spacing: 3px;
}
.signup {
  font-size: 14px;
  color: #00d3c2;
}
</style>