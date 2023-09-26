<template>
  <div class="driver-account">
    <div class="left-area">
      <ul class="tabs-list">
        <li @click="setTab('accountDetails')" :class="{ active: isSelected('accountDetails') }">
          {{ $t('_DriverAccount.accountDetails') }}
        </li>
        <li @click="setTab('carPolicy')" :class="{ active: isSelected('carPolicy') }">
          {{ $t('_DriverAccount.carPolicy') }}
        </li>
      </ul>
    </div>
    <div class="right-area">
      <div v-if="isSelected('accountDetails')" class="account-details">
        <AccountDetails />
      </div>
      <div v-if="isSelected('carPolicy')" class="car-policy-details">
        <UserCarPolicy />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AccountDetails from '@/components/UserProfile/AccountDetails.vue'
import UserCarPolicy from '@/components/UserProfile/UserCarPolicy.vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'UserProfile',
  setup() {
    const route = useRoute()
    const activeTab = route.params.tab ? ref(route.params.tab) : ref('accountDetails')
    const setTab = (currentTab) => {
      activeTab.value = currentTab
    }
    const isSelected = (currentTab) => {
      return activeTab.value == currentTab
    }
    return { activeTab, setTab, isSelected }
  },
  components: {
    AccountDetails,
    UserCarPolicy
  }
})
</script>
<style lang="sass" scoped>
.driver-account
  .left-area
    @media screen and (min-width: $xlBreakpoint)
      position: absolute
      left: 0
      width: 15%
      background: $colorWhite
      height: 100%
      top: 0
    ul
      padding: 1.9em 0 0 0
      @media screen and (max-width: $xlBreakpoint)
        display: flex
        padding: 0
        border-bottom: 1px solid $colorHubbleGreyIcons
        margin: 1em 0 2.2em 0
      li
        color: $colorHubbleDarkGrey
        font-family: 'Lato-semibold'
        font-size: 14px
        list-style: none
        padding: 0.9em 1em 1em 2.4em
        width: 93%
        box-sizing: border-box
        border-top-right-radius: 30px
        border-bottom-right-radius: 30px
        cursor: pointer
        @media screen and (max-width: $xlBreakpoint)
          color: $colorHubble
          font-size: 15px
          font-weight: 800
          padding: 0.7em 0
          width: auto
          border-radius: 0
          position: relative
          margin: 0 15px
        &.active
          background-color: rgba(0, 56, 250, 0.1)
          color: $colorHubble
          @media screen and (max-width: $xlBreakpoint)
            background: none
            &:after
              border-bottom: 3px solid $colorHubbleDarkBlue
              content: ""
              width: 100%
              height: 3px
              display: flex
              position: absolute
              bottom: -2px
              left: 0
              right: 0
  .right-area
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 15px
</style>
