<template>
  <div class="login">
    <div class="login-content">
      <h3>用户{{ title }}</h3>
      <div class="passwordLogin">
        <van-form @submit="onSubmit">
          <van-cell-group>
            <van-field
              required
              name="phone"
              label-width="5em"
              type="text"
              label="账号"
              placeholder="请输入手机号码"
              v-model="phone"
              :rules="[{ pattern: phoneRexg, message: '请填写正确的手机号码' }]"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              required
              name="password"
              label-width="5em"
              label="密码"
              placeholder="请输入密码"
              right-icon="browsing-history"
              v-model="password1"
              :type="inputType"
              @click-right-icon="look"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              required
              name="password2"
              label-width="5em"
              label="确认密码"
              placeholder="请再次输入密码"
              right-icon="browsing-history"
              v-model="password2"
              :type="inputType"
              @click-right-icon="look"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              required
              center
              name="code"
              label-width="5em"
              label="短信验证码"
              placeholder="请输入短信验证码"
              maxlength="6"
              v-model="code"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  color="#00d3c2"
                  :disabled="!phoneRexg.test(phone) || isGetCode"
                  @click.stop="onGetCode"
                >{{codeText}}</van-button>
              </template>
            </van-field>
          </van-cell-group>
          <van-button
            style="margin-top: 10px"
            class="button"
            type="primary"
            native-type="submit"
            :disabled="!password1 || !password2 || !phone || !code"
          >{{ title }}</van-button>
        </van-form>
      </div>
      <div class="algin-left">
        <div class="change-box" @click="router.go(-1)">返回</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVerificationCode } from '../../hooks/signup'
import { phoneRexg } from '../../common/regularData'
import { registerUser } from '../../common/api'
import { encrypt } from '../../common/function'
export default defineComponent({
  setup() {
    const route = useRoute()
    const {
      codeText,
      isGetCode,
      onGetCode,
      countDown,
      phone,
    } = getVerificationCode()

    const state = reactive({
      title: route.params.id === '1' ? '修改密码' : '注册',
      code: '',
      password1: '',
      password2: '',
      inputType: 'text',
      look: () => {},
    })
    const logiType = route.params.id === '1' ? 'changePwd' : 'register'
    const onSubmit = async (obj) => {
      const postData = {
        phone: encrypt(obj.phone),
        password: obj.password,
        code: obj.code,
        operateType: logiType,
      }
      const { success } = await registerUser(postData)
      if (success) {
      }
    }
    const router = useRouter()
    return {
      ...toRefs(state),
      codeText,
      isGetCode,
      onGetCode,
      countDown,
      phone,
      router,
      phoneRexg,
      onSubmit,
    }
  },
})
</script>

<style lang="scss">
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
      padding-left: 20px;
      padding-right: 20px;
      img {
        height: 30px;
        margin-right: 10px;
      }
      padding-bottom: 10px;
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

    // 登录按钮 register
    .button {
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
.algin-left {
  text-align: right;
}
.change-box {
  padding: 0 30px;
  font-size: 14px;
  color: #00d3c2;
}
.passwordLogin {
  padding: 0 15px;
}
</style>