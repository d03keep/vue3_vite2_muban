console.log('当前环境：', __ENV__, '当前版本：', __VERSION__)

import { createApp } from 'vue'
import router from '@/router';
import store from '@/store'
import webp from "@/directives/webp";
import App from './App.vue'
import { initialHtmlStyle } from '@/utils/initialHtmlStyle'
import * as utils from '@/utils/common'
import '@/css/index.less'
import 'vant/es/toast/index.css'

initialHtmlStyle()

const APP = createApp(App)

APP.config.globalProperties.$utils = utils

APP.directive('webp', webp)
    .use(store)
    .use(router)
    .mount('#app')
