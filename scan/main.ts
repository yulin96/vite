import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setToastDefaultOptions } from 'vant'
import { checkWebpFeature } from '~/utils/isSupportWebp'

checkWebpFeature((_, result) => {
  if (result) document.documentElement.classList.add('webp')
}, 'lossless')

import '~/assets/css/tailwind.css'

import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'
// import 'vant/es/notify/style'
import 'vant/es/toast/style'

import '~/assets/css/fixPlugin.css'
import '~/assets/css/main.css'

setToastDefaultOptions({
  forbidClick: true,
  overlay: true,
  duration: 1200,
  overlayClass: 'center_toast_overlay',
  transition: 'center_fromTop_toast',
  position: 'middle',
  className: 'center_toast',
})

setToastDefaultOptions('loading', { duration: 0 })

const app = createApp(App)

app.directive('focus', (el: HTMLElement) => el.focus())

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

app.mount('#app')
