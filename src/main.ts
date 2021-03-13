import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'
import store from './store'
import router from './router'
import {
  Tabbar,
  TabbarItem,
  Image as VanImage,
  Lazyload,
  Button,
  Field,
  CellGroup,
  Toast,
  Form,
  TreeSelect,
  NavBar,
  Tab,
  Tabs,
  Popup,
  RadioGroup,
  Radio,
  ActionSheet,
  Icon,
  Cell,
  List,
  CountDown,
  DatetimePicker,
  Picker,
} from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.js'
import 'babel-polyfill'
import '@/common/public.css'

// import VConsole from 'vconsole'
// let vconsole = new VConsole()
// export default vconsole

console.log(import.meta.env.MODE, '环境变量')
const app = createApp(App)
app
  .use(store)
  .use(router)
  .use(Tabbar)
  .use(TabbarItem)
  .use(VanImage)
  .use(Lazyload)
  .use(Button)
  .use(Field)
  .use(CellGroup)
  .use(Toast)
  .use(Form)
  .use(TreeSelect)
  .use(NavBar)
  .use(Tab)
  .use(Tabs)
  .use(Popup)
  .use(Radio)
  .use(RadioGroup)
  .use(ActionSheet)
  .use(Icon)
  .use(Cell)
  .use(List)
  .use(CountDown)
  .use(DatetimePicker)
  .use(Picker)
  .mount('#app')
// import FastClick from 'fastclick'
// FastClick.attach(document.body)
