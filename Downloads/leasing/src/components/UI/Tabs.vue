<template>
   <div>
      <div class="tabs" :class="{'tax-settings-tabs': tabsOf == 'taxSettings' }">
        <ul>
            <li v-for="(tab, index) in tabs" :key="index" :class="{ 'is-active': tab['isActive'] }">
                <a v-if="tabsOf == 'taxSettings'" @click="selectTab(tab['name'])">{{ $t('_taxSettings.year') }} {{ tab['name'] }}</a>
                <a v-else @click="selectTab(tab['name'])">{{ $t(`_companies.${tab['name']}`) }}</a>
            </li>
        </ul>
      </div>
      <div class="tabs-details">
        <slot></slot>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Tabs',
  emits: ['selectedTab'],
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    tabsOf: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    const selectTab = (selectedTab) => {
       emit('selectedTab', selectedTab)
    }
    return { selectTab }
  }
})
</script>
<style lang="sass" scoped>
.tax-settings-tabs
  margin: 0 3em 0
.tabs
  border-bottom: 1px solid $colorHubbleGreyLines  
  ul
    display: flex
    list-style: none
    padding: 0
    margin: 0
    li
      margin: 0 3em 0 0
      display: flex
      flex-direction: column 
      a
       font-size: 14px
       color: $colorHubbleDarkGrey
       font-family: 'Lato-semibold'
    .is-active
      a
        color: $colorHubbleDarkBlue
      &:after
        content: "";
        background-color: $colorHubbleDarkBlue
        width: 100%
        height: 3px
        border-radius: 3px
        margin-bottom: -2px 
</style>