<template>
  <div class="navigation">
    <div class="navlink-wrapper" :class="{ active: $route.name === 'Employees' || $route.name === 'Employee' }">
      <span class="navlink"
        ><router-link to="/employees?page=1">{{ $t('_header.employees') }}</router-link></span
      >
      <div v-if="$route.name === 'Employees' || $route.name === 'Employee'" class="border"></div>
    </div>
    <div
      class="navlink-wrapper"
      :class="{ active: $route.name === 'CarPolicyOverview' || $route.name === 'carPolicy' }"
    >
      <span class="navlink"
        ><router-link to="/car-policies">{{ $t('_header.carPolicies') }}</router-link></span
      >
      <div v-if="$route.name === 'CarPolicyOverview' || $route.name === 'carPolicy'" class="border"></div>
    </div>
    <div
      class="navlink-wrapper"
      :class="{ active: $route.name === 'LeaseCategoryOverview' || $route.name === 'LeaseCategory' }"
    >
      <span class="navlink"
        ><router-link to="/lease-categories">{{ $t('_header.leaseCategories') }}</router-link></span
      >
      <div v-if="$route.name === 'LeaseCategoryOverview' || $route.name === 'LeaseCategory'" class="border"></div>
    </div>
    <div
      class="navlink-wrapper"
      :class="{ active: $route.name === 'Discount' }"
      v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')"
    >
      <span class="navlink"
        ><router-link to="/discount">{{ $t('_header.navDiscount') }}</router-link></span
      >
      <div v-if="$route.name === 'Discount'" class="border"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
export default defineComponent({
  setup() {
    const store = useStore()
    const roles = computed(() => store.state.auth.currentUser?.roles)
    return { roles }
  }
})
</script>
<style lang="sass" scoped>
.navigation
  display: none
  flex-direction: row
  @media screen and (min-width: $mdBreakpoint)
    display: flex
  .navlink-wrapper
    display: flex
    flex-direction: column
    margin-right: 4rem
    @media screen and (max-width: $lgBreakpoint)
      margin-right: 2rem
    &.active
      .navlink
        margin-bottom: 1.7rem
      .border
        margin-bottom: -1.7rem
    .navlink
      font-size: 1.6rem
      line-height: 1.9rem
      a
        @media screen and (max-width: $lgBreakpoint)
          font-size: 14px
    .border
      border: 2px solid $colorHubble
      border-radius: 3px
    &:last-child
      margin-right: 0px
</style>
