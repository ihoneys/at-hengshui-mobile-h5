<template>
  <div class="login">
    <div class="login-content">
      <h3>用户{{ title }}</h3>
      <div class="passwordLogin">
        <van-form @submit="onSubmit">
          <van-cell-group>
            <van-field
              label-width="5em"
              v-model="phone"
              type="text"
              label="账号"
              placeholder="请输入手机号码"
              :label-width="80"
              :required="true"
              :rules="[{ pattern: pattern1, message: '请填写正确的手机号码' }]"
              clearable
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              label-width="5em"
              v-model="password"
              :type="inputType"
              label="密码"
              placeholder="请输入密码"
              :label-width="50"
              right-icon="browsing-history"
              @click-right-icon="look"
              required
              clearable
              :rules="[{ required: true, message: '密码不能为空' }]"
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              label-width="5em"
              v-model="password1"
              :type="inputType"
              label="确认密码"
              placeholder="请再次输入密码"
              :label-width="80"
              right-icon="browsing-history"
              @click-right-icon="look"
              required
              :rules="[{ required: true, message: '密码不能为空' }]"
              clearable
            />
          </van-cell-group>
          <van-cell-group>
            <van-field
              label-width="5em"
              v-model="code"
              center
              clearable
              label="短信验证码"
              placeholder="请输入短信验证码"
              maxlength="6"
              required
              :rules="[{ required: true, message: '验证码不能为空' }]"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  color="#00d3c2"
                  :disabled="codeDisabled"
                  @click.stop="onGetCode"
                >{{codeMsg}}</van-button>
              </template>
            </van-field>
          </van-cell-group>
          <van-button
            style="margin-top: 10px"
            class="button"
            :loading="isloading"
            type="primary"
            loading-type="spinner"
            :disabled="!password || !password1 || !phone"
          >{{ title }}</van-button>
        </van-form>
      </div>
      <div class="algin-left">
        <router-link to="/login" class="change-box">返回</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  setup(props, ctx) {
    const data = reactive({
      codeMsg: '获取验证码',
      codeDisabled: false,
      title: '',
      code: '',
      password: '',
      password1: '',
      pattern1: '',
      phone: '',
      isloading: false,
      inputType: '',
      look: () => {},
      onGetCode: () => {},
      onSubmit: () => {},
    })
    const route = useRoute()
    console.log(route.params)
    const resData = toRefs(data)
    return { ...resData }
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