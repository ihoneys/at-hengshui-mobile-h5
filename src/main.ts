import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'
import store from './store'
import router from './router'
import { Tabbar, TabbarItem, Image as VanImage, Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.js'
const app = createApp(App)
app
  .use(store)
  .use(router)
  .use(Tabbar)
  .use(TabbarItem)
  .use(VanImage)
  .use(Lazyload)
  .mount('#app')
// import FastClick from 'fastclick'
// FastClick.attach(document.body)
