import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from '@/store'
import { createI18n } from 'vue-i18n'
import messages from './lang'

const app = createApp(App).use(router)

const i18n = createI18n({
    locale: localStorage.getItem('locale') || 'nl',
    legacy: false,
    globalInjection: true,
    fallBackLocale: 'en',
    messages
})
app.use(i18n)
app.provide('i18n', i18n)
app.use(store, key)
app.mount('#app')
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(const registration of registrations) {
            registration.unregister()
        }
    })
}