<template>
  <div>
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SwitchLocale',
  data() {
    return { langs: ['en', 'nl'] }
  }
}
</script>

<style lang="sass" scoped>
.small
  width: calc(100% - 246px - 73px)
div
  height: 100%
  width: 100%
  box-shadow: $shadowHubbleDashboard
  border-radius: 5px
select
  width: 150px
  line-height: 49px
  height: 38px
  font-size: 22px
  outline: 0
  margin-bottom: 15px
</style>