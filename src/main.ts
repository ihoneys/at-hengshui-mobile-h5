import { createApp } from 'vue'
// TypeScript error? Run VSCode command
// TypeScript: Select TypeScript version - > Use Workspace Version
import App from './App.vue'
import store from './store'
const app = createApp(App)
app.use(store).mount('#app')
