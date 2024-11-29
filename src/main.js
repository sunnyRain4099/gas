import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/icon/iconfont.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/base.scss'
import '@/assets/main.scss'
import './index.css'

import Verify from '@/utils/Verify'
import Message from '@/utils/Message'
import Request from '@/utils/Request'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(ElementPlus)

app.config.globalProperties.Verify = Verify
app.config.globalProperties.Message = Message
app.config.globalProperties.Request = Request
app.mount('#app')
