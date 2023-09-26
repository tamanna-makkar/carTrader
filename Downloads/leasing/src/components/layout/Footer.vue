<template>
  <footer>
    <div class="navigation">
      <router-link to="/"> {{ $t('_footer.contact') }} </router-link>
      <router-link to="/"> {{ $t('_footer.privacy') }} </router-link>
      <router-link to="/"> {{ $t('_footer.cookies') }} </router-link>
      <a @click="setLocale($t('_header.LanguageKeyword'))"> {{ $t('_footer.language') }} </a>
    </div>
    <router-link class="image" to="/">
      <img src="@/assets/logo-full.svg" />
    </router-link>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const setLocale = (lang) => {
      locale.value = lang
      localStorage.setItem('locale', lang)
    }
    return { setLocale }
  }
})
</script>

<style lang="sass" scoped>
footer
  display: none
  border-top: 1px solid $colorHubbleGreyIcons
  padding: 1.3em 0 2em 0
  justify-content: space-between
  align-items: center
  .navigation
    display: flex
    align-items: center
    a
      margin-right: 4em
      &:last-child
        margin-right: 0px
  a
    font-size: 1.4rem
    line-height: 1.8rem

@media only screen and (min-width: $mdBreakpoint)
  footer
    display: flex
</style>