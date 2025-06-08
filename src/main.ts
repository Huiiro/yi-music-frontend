import {createApp} from 'vue'
import './styles/main.css'
import App from './App.vue'
import store from "./store";
import router from "./router";

import {Buffer} from 'buffer';

(window as any).Buffer = Buffer;

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')