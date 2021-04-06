<template>
  <div class="login">
    <div class="login-content">
      <h3>用户{{ title }}</h3>
      <div class="passwordLogin">
        <van-form @submit="onSubmit">
          <van-field
            required
            name="phone"
            label-width="5.2em"
            type="text"
            label="账号"
            placeholder="请输入手机号码"
            v-model="phone"
            :rules="[{ pattern: phoneRexg, message: '请填写正确的手机号码' }]"
          />
          <van-field
            required
            name="password"
            label-width="5.2em"
            label="密码"
            placeholder="请输入密码"
            right-icon="browsing-history"
            v-model="password1"
            :type="inputType"
            @click-right-icon="inputType = inputType === 'text' ?  'password' : 'text'"
          />
          <van-field
            required
            name="password2"
            label-width="5.2em"
            label="确认密码"
            placeholder="请再次输入密码"
            right-icon="browsing-history"
            v-model="password2"
            :type="inputType"
            @click-right-icon="inputType = inputType === 'text' ?  'password' : 'text'"
          />
          <van-field
            required
            center
            name="code"
            label-width="5.2em"
            label="短信验证码"
            placeholder="请输入短信验证码"
            maxlength="6"
            v-model="code"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="!phoneRexg.test(phone) || isGetCode"
                @click.stop="onGetCode"
              >{{codeText}}</van-button>
            </template>
          </van-field>
          <div class="register-btn">
            <van-button
              block
              round
              color="#00d2c3"
              class="button"
              type="primary"
              native-type="submit"
              :disabled="!password1 || !password2 || !phone || !code"
            >{{ title }}</van-button>
          </div>
        </van-form>
      </div>
      <div class="algin-left">
        <div class="change-box" @click="backPage">返回</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVerificationCode, loginSuccess } from '../../hooks/signup'
import { phoneRexg } from '../../common/regularData'
import { registerLogin } from '../../common/api'
import { encrypt } from '../../common/function'
import { Toast } from 'vant'
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const {
      codeText,
      isGetCode,
      onGetCode,
      countDown,
      phone,
    } = getVerificationCode()
    const { toPreviousRoute, storeLoginInfomation } = loginSuccess()
    const loginOrRegister = route.params.id === 'changePassword'
    const state = reactive({
      title: loginOrRegister ? '修改密码' : '注册',
      code: '',
      password1: '',
      password2: '',
      inputType: 'password',
    })
    const logiType = loginOrRegister ? 'changePwd' : 'register'
    const onSubmit = async (obj) => {
      if (state.password1 !== state.password2) {
        return Toast('两次密码输入不一致')
      }
      const postData = {
        phone: encrypt(obj.phone),
        password: obj.password,
        code: obj.code,
        operateType: logiType,
      }
      const result = await registerLogin(postData)
      if (result.success) {
        storeLoginInfomation(result)
        Toast.success({
          type: 'success',
          message: `${state.title}成功`,
          onClose: () => {
            toPreviousRoute(router, logiType === 'register')
          },
        })
      }
    }
    const backPage = () => {
      const isLoginParams = route.query.isLogin
      if (isLoginParams) {
        toPreviousRoute(router)
      } else {
        router.go(-1)
      }
    }
    return {
      ...toRefs(state),
      codeText,
      isGetCode,
      onGetCode,
      countDown,
      phone,
      phoneRexg,
      onSubmit,
      backPage,
    }
  },
})
</script>

<style lang="scss">
.login {
  padding-top: 20%;
  .login-content {
    h3 {
      font-size: 24px;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
      text-align: center;
      padding: 40px 0;
    }
  }
  .algin-left {
    text-align: right;
  }
  .change-box {
    padding: 0 30px;
    font-size: 14px;
    color: #00d3c2;
  }
  .register-btn {
    padding: 10px 20px;
  }
}
</style>