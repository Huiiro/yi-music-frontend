import {createApp} from 'vue'
import './styles/main.css'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './plugins/i18n.ts'

import {Buffer} from 'buffer'

import 'element-plus/dist/index.css'

// SvgIcon 注册
// @ts-ignore
import 'virtual:svg-icons-register'

import SvgIcon from '@/components/svg/SvgIcon.vue'

(window as any).Buffer = Buffer

const app = createApp(App)
app.use(store)
app.use(router)
app.use(i18n)
app.component('SvgIcon', SvgIcon)
app.mount('#app')