import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')

console.clear()
console.log('%c %cXYZSAS\n%cPowered by yzITI', 'background: url(http://sas.yzzx.org/img/logo.svg) no-repeat center;padding-left:3rem;padding-top: 2rem;', 'font-size:4rem;font-weight:bold;', 'font-size:1rem;')
window.localStorage['web-user-version'] = (import.meta.env.VITE_VERSION || 'develop').substr(0, 7)
console.log('web-user-version: ' + import.meta.env.VITE_VERSION)
