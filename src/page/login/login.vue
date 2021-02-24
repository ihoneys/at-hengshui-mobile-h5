<template>
  <!-- <div class="login">
    <div class="login-content">
      <h3>{{ title }}</h3>
      <div v-show="!loginType">
        <p class="p-phone">
          <img :src="require('@/assets/images/tell.png')" alt />
          <input
            type="tel"
            ref="phone"
            placeholder="请输入您的手机号码"
            maxlength="11"
            class="login-telphone"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </p>
        <div class="auth-code">
          <img :src="require('@/assets/images/msg.png')" alt />
          <input
            type="tel"
            ref="code"
            placeholder="请输入验证码"
            maxlength="6"
            class="login-telphone"
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="resCode"
          />

          <input
            type="button"
            class="login-count-down"
            v-model="codeMsg"
            :disabled="codeDisabled"
            @click.stop="onGetCode"
          />
        </div>
        <van-button
          :loading="isloading"
          type="primary"
          loading-type="spinner"
          @click.stop="onNextStep"
        >登 录</van-button>
      </div>111

      <div class="passwordLogin" v-show="loginType">
        <van-cell-group>
          <van-field
            v-model="phone"
            type="text"
            label="账号"
            placeholder="请输入用户名"
            :label-width="40"
            :error-message="err1"
            required
          />
        </van-cell-group>
        <van-cell-group style="margin-bottom: 20px">
          <van-field
            v-model="password"
            :type="inputType"
            label="密码"
            placeholder="请输入密码"
            :label-width="40"
            right-icon="browsing-history"
            @click-right-icon="ccc"
            :error-message="err2"
            required
          />
        </van-cell-group>
        <van-button
          :loading="isloading"
          type="primary"
          loading-type="spinner"
          @click.stop="onNextStep2"
          :disabled="!password || !phone"
        >登 录</van-button>
      </div>

      <p class="change-box">
        <span @click="changeLoginType">{{ typeName }}</span>
        <span>
          <span @click="toRegister(false)" style="margin-right: 10px" v-show="loginType">忘记密码</span>
          <span @click="toRegister(true)">用户注册</span>
        </span>
      </p>
    </div>
  </div> -->
  <div>
      这是登录！    
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {},
})
</script>

<style lang="scss" scoped>
@svg 1px-border {
  height: 2px;

  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 50%;
  }
}

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

    .auth-code {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #e7e7e7;
      border-image: svg(1px-border param(--color #e7e7e7)) 2 2 stretch;
      padding: 20px;

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
      padding: 8px 10px;
      text-decoration: none;
      border: solid 1px #00d3c2;
    }

    // 登录按钮
    button {
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

.passwordLogin {
  padding: 0 15px;
}

.footer-tag {
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: #ccc;
  letter-spacing: 3px;
}
</style>