import { createApp } from 'vue';
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import { LocalStorage, SessionStorage } from 'storage-manager-js';
import VanNavBar from './components/NavBar/Index.vue';
import App from './App.vue';
// import store from './store'
import router from './router';

import { encrypt, sm4Decrypt } from './common/function';
import componentsHandler from '../src/config/vant.config';

import { LOCALSTORAGE_SYMBOL, SESSIONSTORAGE_SYMBOL } from './symbol/index';
import 'vant/lib/index.css';
import 'amfe-flexible/index.js';
import './common/public.css';
const app = createApp(App);

// import VConsole from 'vconsole'
// let vconsole = new VConsole()
// export default vconsole

console.log(import.meta.env.MODE, '环境变量');

app.component('CustomVanNavBar', VanNavBar);
app
  // .use(store)
  .use(router)
  .use(componentsHandler)
  .mount('#app');
// app.provide('LOCALSTORAGE_SYMBOL', LocalStorage)
// app.provide('SESSIONSTORAGE_SYMBOL', SessionStorage)

app.config.globalProperties.$LocalStorage = LocalStorage;
app.config.globalProperties.$SessionStorage = SessionStorage;

app.config.globalProperties.$filters = {
  decrypt(value) {
    return sm4Decrypt(value);
  },
  encrypt(value) {
    return encrypt(value);
  },
  transformPayStatus(status) {
    const payStatus = {
      1: '未支付',
      2: '已付款',
      3: '待退款',
      4: '已退款',
      5: '已支付确费中',
      6: '已支付确费失败',
    };
    return payStatus[status];
  },
  transformOrderStatus(status) {
    const statusObj = {
      1: '已取消',
      2: '已停诊',
      3: '预约成功',
      4: '已爽约',
      5: '已取号',
      6: '已就诊',
      7: '出号中',
      8: '出号失败',
    };
    return statusObj[status];
  },
  isCanelReserve(status) {
    return status !== 1 && status !== 4 && status !== 5 && status !== 6;
  },
};
// import FastClick from 'fastclick'
// FastClick.attach(document.body)
