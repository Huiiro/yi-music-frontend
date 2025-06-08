import { createI18n } from 'vue-i18n'
import en from '@/locales/en.ts'
import zh from '@/locales/zh.ts'

const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages: {
        en,
        zh,
    },
})

export default i18n
