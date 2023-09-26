<template>
  <div class="navigation">
    <div
      class="navlink-wrapper"
      :class="{
        active: $route.name === 'Companies' || $route.name === 'Company' || $route.name === 'superAdminCompanyDetails'
      }"
    >
      <span class="navlink"
        ><router-link to="/companies?page=1">{{ $t('_header.companies') }}</router-link></span
      >
      <div
        v-if="$route.name === 'Companies' || $route.name === 'Company' || $route.name === 'superAdminCompanyDetails'"
        class="border"
      ></div>
    </div>
    <div class="navlink-wrapper" :class="{ active: $route.name === 'externalData' }">
      <span class="navlink"
        ><router-link to="/external-data?page=1">{{ $t('_header.externalData') }}</router-link></span
      >
      <div v-if="$route.name === 'externalData'" class="border"></div>
    </div>
    <div class="navlink-wrapper" :class="{ active: $route.name === 'taxSettings' }">
      <span class="navlink"
        ><router-link to="/tax-settings">{{ $t('_header.taxSettings') }}</router-link></span
      >
      <div v-if="$route.name === 'taxSettings'" class="border"></div>
    </div>
    <div class="navlink-wrapper" :class="{ active: $route.name === 'Orders' }">
      <span class="navlink"
        ><router-link to="/orders?page=1">{{ $t('_header.orders') }}</router-link></span
      >
      <div v-if="$route.name === 'Orders'" class="border"></div>
    </div>
  </div>
</template>

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
