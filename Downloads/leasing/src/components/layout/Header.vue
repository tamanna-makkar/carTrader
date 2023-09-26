<template>
  <header :class="{ mobile: toggleOpen }">
    <div class="wrap mobile-wrap">
      <div class="main-container">
        <div class="header_images mobile-header">
          <div class="empty"></div>
          <router-link :to="{ name: 'Dashboard' }">
            <div v-if="isLoggedIn && Object.keys(user).length" class="logo-block">
              <img v-if="user.company.logo" :src="companyLogo" />
              <img v-else src="@/assets/logo-hubble.svg" />
              <span class="car-selector-text">{{ $t('_header.carConfigurator') }}</span>
            </div>
            <div class="logout-block" v-else>
              <h1>{{ $t('_header.carConfigurator') }}</h1>
            </div>
          </router-link>
          <div class="hamburger-cross" @click="toggleHamburger" :class="{ open: toggleOpen }">
            <span class="menu-hamburger-bar"></span>
            <span class="menu-hamburger-bar"></span>
            <span class="menu-hamburger-bar"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="main-container">
      <div v-if="isLoggedIn && Object.keys(user).length" class="wrap">
        <div v-if="$route.name == 'UserProfile' || $route.name == 'compareCars'" class="exit-wrap">
          <div v-if="toggleOpen" class="button-wrapper">
            <Button
              :text="$t('_header.backToDashboard')"
              :class="{ show: toggleOpen }"
              @onClick="goToDashboard"
              class="header_button"
              buttonType="transparent arrow--left"
            />
          </div>
          <Button
            v-if="!toggleOpen"
            :text="$t('_header.backToDashboard')"
            :class="{ show: toggleOpen }"
            @onClick="goToDashboard"
            class="header_button"
            buttonType="light arrow--left"
          />
        </div>
        <div
          v-else-if="
            $route.name === 'Step1' ||
            $route.name === 'Step2' ||
            $route.name === 'Step3' ||
            $route.name === 'step1Wizard'
          "
          class="exit-wrap"
        >
          <div v-if="toggleOpen" class="button-wrapper">
            <Button
              :text="$t('_header.exitSelector')"
              @onClick="onClick"
              :class="{ show: toggleOpen }"
              class="header_button"
              buttonType="transparent arrow--left"
            />
          </div>
          <Button
            v-if="!toggleOpen"
            :text="$t('_header.exitSelector')"
            @onClick="onClick"
            :class="{ show: toggleOpen }"
            class="header_button"
            buttonType="light arrow--left"
          />
        </div>
        <!-- Show when role is company admin -->
        <div
          v-if="
            (roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_CLIENT')) &&
            ($route.name === 'CarPolicyOverview' ||
              $route.name === 'LeaseCategoryOverview' ||
              $route.name === 'Employees' ||
              $route.name === 'carPolicy' ||
              $route.name === 'LeaseCategory' ||
              $route.name === 'Employee' ||
              $route.name === 'companyDetails' ||
              $route.name === 'Discount')
          "
          class="header_icon"
        >
          <router-link :to="{ name: 'Employees', query: { page: 1 } }">
            <img v-if="user.company.logo" :src="companyLogo" />
            <img v-else src="@/assets/logo-hubble.svg" />
            <span class="car-selector-text">{{ $t('_header.carConfigurator') }}</span>
          </router-link>
        </div>
        <!-- Show when role is super admin -->
        <div
          v-else-if="
            roles.includes('ROLE_SUPER_ADMIN') &&
            ($route.name === 'CarPolicyOverview' ||
              $route.name === 'LeaseCategoryOverview' ||
              $route.name === 'Employees' ||
              $route.name === 'carPolicy' ||
              $route.name === 'LeaseCategory' ||
              $route.name === 'Employee' ||
              $route.name === 'companyDetails' ||
              $route.name === 'superAdminCompanyDetails' ||
              $route.name === 'Companies' ||
              $route.name === 'Company' ||
              $route.name == 'externalData' ||
              $route.name == 'taxSettings' ||
              $route.name === 'Discount' ||
              $route.name == 'Orders')
          "
          class="header_icon"
        >
          <router-link :to="{ name: 'Companies', query: { page: 1 } }">
            <img v-if="user.company.logo" :src="companyLogo" />
            <img v-else src="@/assets/logo-hubble.svg" />
            <span class="car-selector-text">{{ $t('_header.carConfigurator') }}</span>
          </router-link>
        </div>
        <!-- Show when not on company admin pages -->
        <div v-else class="desktop-header header_images logo-block">
          <router-link :to="{ name: 'Dashboard' }">
            <img v-if="user.company.logo" :src="companyLogo" />
            <img v-else src="@/assets/logo-hubble.svg" />
            <span class="car-selector-text">{{ $t('_header.carConfigurator') }}</span>
          </router-link>
        </div>
        <!-- only show navigation when role is superAdmin -->
        <superAdminNavigation
          v-if="
            roles.includes('ROLE_SUPER_ADMIN') &&
            ($route.name === 'Companies' ||
              $route.name == 'Company' ||
              $route.name == 'superAdminCompanyDetails' ||
              $route.name == 'externalData' ||
              $route.name == 'taxSettings' ||
              $route.name == 'Orders')
          "
        >
        </superAdminNavigation>
        <!-- Only show navigation when role is company admin-->
        <Navigation
          v-if="
            (roles.includes('ROLE_COMPANY_ADMIN') ||
              roles.includes('ROLE_CLIENT') ||
              roles.includes('ROLE_SUPER_ADMIN')) &&
            ($route.name === 'CarPolicyOverview' ||
              $route.name == 'LeaseCategoryOverview' ||
              $route.name == 'Employees' ||
              $route.name === 'companyDetails' ||
              $route.name === 'carPolicy' ||
              $route.name === 'LeaseCategory' ||
              $route.name === 'Employee' ||
              $route.name === 'Discount')
          "
        />
        <div :class="{ show: toggleOpen }" class="header_profile">
          <div ref="el" class="account">
            <div class="image-wrapper" @click="isDropdownOpen = !isDropdownOpen">
              <img src="@/assets/account.svg" />
            </div>
            <span class="show-mobile">{{ $t('_header.loggedInAs') }} {{ user.name }}</span>
            <span class="hide-mobile">{{ user.name }}</span>
          </div>
          <router-link v-if="toggleOpen" @click="toggleHamburger" :to="{ name: 'UserProfile' }">
            {{ $t('_header.myProfile') }}
          </router-link>
          <router-link
            v-if="
              toggleOpen &&
              (roles.includes('ROLE_COMPANY_ADMIN') ||
                roles.includes('ROLE_CLIENT') ||
                roles.includes('ROLE_SUPER_ADMIN'))
            "
            @click="toggleHamburger"
            :to="{ name: 'companyDetails' }"
          >
            {{ $t('_header.companyDetails') }}
          </router-link>
          <router-link v-if="toggleOpen" @click=";[toggleHamburger(), logOut()]" :to="{ name: 'login' }">
            {{ $t('_header.logOut') }}
          </router-link>
          <a @click="setLocale($t('_header.LanguageKeyword'))" class="show-mobile">
            <span class="dutch" :class="{ english: $i18n.locale == 'nl' }"></span>
            {{ $t('_footer.language') }}
          </a>
          <!-- Dropdown desktop -->
          <div v-if="isDropdownOpen" class="header-dropdown">
            <ul>
              <router-link
                v-if="
                  roles.includes('ROLE_SUPER_ADMIN') &&
                  ($route.name === 'CarPolicyOverview' ||
                    $route.name === 'LeaseCategoryOverview' ||
                    $route.name === 'Employees' ||
                    $route.name === 'carPolicy' ||
                    $route.name === 'LeaseCategory' ||
                    $route.name === 'Employee' ||
                    $route.name === 'companyDetails' ||
                    $route.name === 'Discount')
                "
                @click=";[closeHamburger(), removeSuperAdminCompany()]"
                :to="{ name: 'Companies' }"
              >
                <li><span class="dashboard-home"></span>{{ $t('_header.goToMyDashboard') }}</li>
              </router-link>
              <!-- For superadmin to navigate company dashboard -->
              <router-link
                v-if="
                  roles.includes('ROLE_SUPER_ADMIN') &&
                  ($route.name === 'Company' || $route.name === 'superAdminCompanyDetails')
                "
                @click=";[closeHamburger(), setSuperAdminCompany(route.params.id)]"
                :to="{ name: 'Employees' }"
              >
                <li><span class="dashboard-home"></span>{{ $t('_header.goToCompanyDashboard') }}</li>
              </router-link>

              <router-link :to="{ name: 'UserProfile' }">
                <li><span class="my-account"></span>{{ $t('_header.MyAccount') }}</li>
              </router-link>
              <router-link
                v-if="
                  roles.includes('ROLE_COMPANY_ADMIN') ||
                  roles.includes('ROLE_CLIENT') ||
                  (roles.includes('ROLE_SUPER_ADMIN') && getSuperAdmin)
                "
                :to="{ name: 'companyDetails' }"
              >
                <li><span class="company-details"></span>{{ $t('_header.companyDetails') }}</li>
              </router-link>
              <li @click="setLocale($t('_header.LanguageKeyword'))">
                <span class="dutch" :class="{ english: $i18n.locale == 'nl' }"></span>{{ $t('_header.Language') }}
              </li>
              <router-link @click="logOut" :to="{ name: 'login' }">
                <li><span class="logout"></span>{{ $t('_header.Logout') }}</li>
              </router-link>
            </ul>
          </div>
        </div>
        <div v-if="toggleOpen" class="header_footer">
          <router-link
            v-if="
              roles.includes('ROLE_COMPANY_ADMIN') ||
              roles.includes('ROLE_CLIENT') ||
              roles.includes('ROLE_SUPER_ADMIN')
            "
            @click="toggleHamburger"
            :to="{ name: 'Employees', query: { page: 1 } }"
          >
            {{ $t('_header.navEmployees') }}
          </router-link>
          <router-link
            v-if="
              roles.includes('ROLE_COMPANY_ADMIN') ||
              roles.includes('ROLE_CLIENT') ||
              roles.includes('ROLE_SUPER_ADMIN')
            "
            @click="toggleHamburger"
            :to="{ name: 'CarPolicyOverview' }"
          >
            {{ $t('_header.navCarPolicies') }}
          </router-link>
          <router-link
            v-if="
              roles.includes('ROLE_COMPANY_ADMIN') ||
              roles.includes('ROLE_CLIENT') ||
              roles.includes('ROLE_SUPER_ADMIN')
            "
            @click="toggleHamburger"
            :to="{ name: 'LeaseCategoryOverview' }"
          >
            {{ $t('_header.navLeaseCategories') }}
          </router-link>
          <router-link
            v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')"
            @click="toggleHamburger"
            :to="{ name: 'Discount' }"
          >
            {{ $t('_header.navDiscount') }}
          </router-link>
          <router-link @click="toggleHamburger" :to="{ name: 'Dashboard' }"> {{ $t('_footer.contact') }} </router-link>
          <router-link @click="toggleHamburger" :to="{ name: 'Dashboard' }"> {{ $t('_footer.privacy') }} </router-link>
          <router-link @click="toggleHamburger" :to="{ name: 'Dashboard' }"> {{ $t('_footer.cookies') }} </router-link>
          <router-link @click="toggleHamburger" :to="{ name: 'Dashboard' }">
            <img src="@/assets/logo-full.svg" />
          </router-link>
        </div>
      </div>
      <div v-else class="wrap not-loggedIn">
        <div class="desktop-header header_images">
          <router-link :to="{ name: 'Dashboard' }"
            ><h1>{{ $t('_header.carConfigurator') }}</h1>
          </router-link>
        </div>
        <div class="hide-mobile switch-language">
          <a @click="setLocale($t('_header.LanguageKeyword'))">
            <span class="dutch" :class="{ english: $i18n.locale == 'nl' }"></span>
            {{ $t('_footer.language') }}
          </a>
        </div>
        <div v-if="toggleOpen" class="open-dropdown">
          <div class="switch-language button-wrapper">
            <a @click="setLocale($t('_header.LanguageKeyword'))">
              <span class="dutch" :class="{ english: $i18n.locale == 'nl' }"></span>
              {{ $t('_footer.language') }}
            </a>
          </div>
          <div class="header_footer">
            <router-link :to="{ name: 'Dashboard' }"> {{ $t('_footer.contact') }} </router-link>
            <router-link :to="{ name: 'Dashboard' }"> {{ $t('_footer.privacy') }} </router-link>
            <router-link :to="{ name: 'Dashboard' }"> {{ $t('_footer.cookies') }} </router-link>
            <router-link :to="{ name: 'Dashboard' }">
              <img src="@/assets/logo-full.svg" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Popup v-if="showPopUp" @onClick="closePopup" @onProceed="onProceed">
      <div class="title h3">{{ $t('_warningPopup.title') }}</div>
      <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
    </Popup>
  </header>
</template>

<script lang="ts">
import Button from '@/components/UI/Button.vue'
import Popup from '@/components/Popup.vue'
import Navigation from '@/components/UI/Navigation.vue'
import superAdminNavigation from '@/components/UI/superAdminNavigation.vue'
import { ref, computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store'
import { MutationTypes } from '@/store/options/mutations'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { VueCookieNext } from 'vue-cookie-next'
export default defineComponent({
  components: {
    Button,
    Popup,
    Navigation,
    superAdminNavigation
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })
    const el = ref<HTMLDivElement>(document.createElement('div'))
    const isDropdownOpen = ref(false)
    const loader = computed(() => store.state.auth.loader)
    const user = computed(() => store.state.auth.currentUser)
    const companyLogo = computed(() => `data:${user.value.company?.logoType};base64,${user.value.company?.logo}`)
    const role = computed(() =>
      store.state.auth.currentUser && store.state.auth.currentUser.roles ? store.state.auth.currentUser.roles[0] : ''
    )
    const roles = computed(() => store.state.auth.currentUser?.roles)
    const toggleOpen = computed(() => store.state.options.toggleOpen)
    const showPopUp = computed(() => store.state.options.showPopUp)
    const isLoggedIn = computed(() => store.state.options.isLoggedIn)
    const getSuperAdmin = computed(() => VueCookieNext.getCookie('adminCompanyId'))
    const goToDashboard = () => {
      router.push({ name: 'Dashboard' })
    }
    const onClick = () => {
      store.commit(MutationTypes.SET_POPUP, true)
    }
    const closePopup = () => {
      store.commit(MutationTypes.SET_POPUP, false)
    }
    const toggleHamburger = () => {
      store.commit(MutationTypes.TOGGLE_HAMBURGER)
    }
    const closeHamburger = () => {
      store.commit(MutationTypes.CLOSE_HAMBURGER, false)
    }
    const setLocale = (lang) => {
      locale.value = lang
      localStorage.setItem('locale', lang)
    }
    const closeDropdown = (e) => {
      const target = e.target
      if (el.value && el.value !== target && !el.value.contains(target)) {
        isDropdownOpen.value = false
      }
    }
    const onProceed = () => {
      // removed only user input
      sessionStorage.removeItem('budget')
      sessionStorage.removeItem('selectedIndex')
      sessionStorage.removeItem('plug_in_hybrid')
      sessionStorage.removeItem('hybrid')
      sessionStorage.removeItem('plug_in_hybrid_drive_range')
      sessionStorage.removeItem('electric_drive_range')
      sessionStorage.removeItem('fuel_type')
      sessionStorage.removeItem('body_type')
      sessionStorage.removeItem('transmission')
      sessionStorage.removeItem('engine_power')
      sessionStorage.removeItem('cargo_space')
      sessionStorage.removeItem('towing_capacity')
      sessionStorage.removeItem('seats')
      sessionStorage.removeItem('doors')
      sessionStorage.removeItem('brands')
      router.push({ name: 'Dashboard' })
      store.commit(MutationTypes.SET_POPUP, false)
    }
    const logOut = () => {
      VueCookieNext.removeCookie('companyId')
      VueCookieNext.removeCookie('adminCompanyId')
      VueCookieNext.removeCookie('employeeCarPolicyId')
      VueCookieNext.removeCookie('roles')
      VueCookieNext.removeCookie('latestcarOrderId')
      VueCookieNext.removeCookie('status')
      sessionStorage.clear()
      localStorage.clear()
    }
    const setSuperAdminCompany = (id) => {
      VueCookieNext.setCookie('adminCompanyId', id, {
        expire: '24h',
        path: '/',
        domain: '',
        secure: '',
        sameSite: ''
      })
    }
    const removeSuperAdminCompany = () => {
      VueCookieNext.removeCookie('adminCompanyId')
    }
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    return {
      locale,
      showPopUp,
      onClick,
      goToDashboard,
      toggleOpen,
      toggleHamburger,
      closeHamburger,
      isDropdownOpen,
      role,
      user,
      setLocale,
      closeDropdown,
      el,
      closePopup,
      isLoggedIn,
      onProceed,
      logOut,
      companyLogo,
      loader,
      roles,
      route,
      setSuperAdminCompany,
      removeSuperAdminCompany,
      getSuperAdmin
    }
  }
})
</script>

<style lang="sass" scoped>
h1
  color: $colorHubble
  text-align: center
  @media screen and (max-width: $lgBreakpoint)
    font-size: 21px
.car-selector-text
  font-family: Lato-BoldItalic
  font-size: 22px
  color: $logoColor
  @media screen and (max-width: $lgBreakpoint)
    font-size: 17px
.logout-block
  display: flex
.exit-wrap
  @media screen and (max-width: $mdBreakpoint)
    width: 100%
  @media screen and (min-width: $mdBreakpoint)
    width: auto
.show
  display: flex !important
.mobile-wrap
  padding: 0 1.5em
.mobile
  .mobile-wrap
    border-bottom: 1px solid $colorHubbleGreyIcons
.exit-wrap
  @media screen and (max-width: $mdBreakpoint)
    width: 100%
.mobile
  position: absolute
  left: 0
  right: 0
  height: 100%
  box-sizing: border-box
  padding: unset
  z-index: 2
  .main-container
    background-color: $colorWhite
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 15px
    .header_images
      padding: 1.75em 0
    .button-wrapper
      display: flex
      justify-content: center
      width: 100%
      padding: 2em 0
      border-bottom: 1px solid $colorHubbleGreyIcons
    .header_profile
      width: 100%
      padding-top: 2.9em
      padding-bottom: 2.9em
      text-align: center
      border-bottom: 1px solid $colorHubbleGreyIcons
      .hide-mobile
        display: none
      .show-mobile
        display: flex
        justify-content: center
        align-items: center
        span
          display: flex
          width: 30px
          &:after
            content: ""
      .account
        margin-bottom: 3em
        .image-wrapper
          display: none
        span
          font-size: 1.4rem
          color: $colorHubbleDarkGrey
      a
        width: 100%
        margin-bottom: 3rem
        font-size: 1.5rem
        font-family: 'Lato-semibold'
        &:last-child
          margin-bottom: 0
        img
          width: 20px
          height: 15px
          margin-right: 10px
    .header_footer
      display: flex
      width: 100%
      flex-direction: column
      padding: 2.9em 0 8.4em 0
      a
        width: 100%
        margin-bottom: 3rem
        text-align: center
        font-size: 1.5rem
        font-family: 'Lato-semibold'
        &:nth-last-child(2)
          margin-bottom: 8.5rem
        &:last-child
          margin-bottom: 0
header
  padding: 1.75em 0
  background-color: $colorWhite
  border-bottom: 1px solid $colorHubbleGreyIcons
  button
    padding: 0.6rem 2rem
  .wrap
    display: flex
    position: relative
    flex-direction: column
    align-items: center
    justify-content: center
    .header_images.desktop-header
      display: none
    .logo-block
      display: flex
      align-items: center
      a
        align-items: center
      span
        margin: 0 0 0 0.4em
    .header_icon
      flex-direction: row
      position: absolute
      left: 0
      display: none
      a
        display: flex
        align-items: center
        img
          max-width: 109px
          max-height: 45px
      span
        margin: 0 0 0 0.4em
      @media screen and (min-width: $mdBreakpoint)
          display: flex
      @media screen and (max-width: $lgBreakpoint)
        img
          max-width: 80px
    .header_images
      display: flex
      width: 100%
      justify-content: space-between
      align-items: center
      order: -1
      .empty
        display: flex
      a
        display: flex
        img
          max-width: 109px
          max-height: 45px
      .hamburger-cross
        display: inline-block
        position: relative
        width: 2em
        max-width: 20px
        width: 100%
        cursor: pointer
        .menu-hamburger-bar
          display: inline-block
          background: $colorHubble
          height: 0.2rem
          width: 100%
          float: left
          margin-bottom: 0.4rem
          transition: all ease-out 0.1s
          &:nth-child(3)
            margin-bottom: 0
        &.open
          .menu-hamburger-bar:nth-child(1)
            -webkit-transform: translateY(6px) rotate(45deg)
            transform: translateY(6px) rotate(45deg)
          .menu-hamburger-bar:nth-child(2)
            opacity: 0
          .menu-hamburger-bar:nth-child(3)
            -webkit-transform: translateY(-6px) rotate(-45deg)
            transform: translateY(-6px) rotate(-45deg)
            margin-bottom: 0.4rem
            width: 100% !important
    .header_button
      display: none
    .header_profile
      display: none
      flex-direction: column
      align-items: center
      .hide-mobile
        display: flex
      .show-mobile
        display: none
      .account
        display: flex
        flex-direction: column
        align-items: center
        .image-wrapper
          display: flex
          @include backgroundImage('account-wrapper.svg')
          height: 40px
          width: 40px
          border-radius: 100%
          align-items: center
          justify-content: center
          cursor: pointer

@media only screen and (min-width: $mdBreakpoint)
  header
    padding: 1.4em 0
    .wrap
      display: flex
      flex-direction: row
      .exit-wrap
        position: absolute
        left: 0
      .header_images.mobile-header
        display: none
      .header_images.desktop-header
        display: block
      .header_images
        order: 0
        justify-content: center
        width: unset
        .empty
          display: none
        a
          display: flex
        .hamburger-cross
          display: none
      .header_button
        display: flex
      .header_profile
        display: flex
        flex-direction: row
        position: absolute
        right: 0
        .account
          flex-direction: row
          span
            order: -1
            margin-right: 0.9em
            font-size: 1.4em
.dutch
  &:after
    width: 20px
    height: 15px
    @include backgroundImage('nl_flag.svg')
.english
  &:after
    width: 20px
    height: 15px
    @include backgroundImage('english.svg')
.header-dropdown
  position: absolute
  top: 55px
  z-index: 2
  border-radius: 5px
  width: 240px
  right: -26px
  box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
  display: none
  &:before
    content: ""
    width: 15px
    height: 15px
    position: absolute
    bottom: 94%
    right: 38px
    background: $colorWhite
    transform: rotate(45deg)
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5)
  @media screen and (min-width: $mdBreakpoint)
    display: block
  ul
    padding: 0 0 1em 0
    position: relative
    background: $colorWhite
    margin: 0
    border-radius: 5px
    li
      list-style: none
      font-size: 14px
      color: $colorHubbleDarkGrey
      font-family: 'Lato-semibold'
      display: flex
      align-items: center
      padding: 0.8em 1em
      cursor: pointer
      &:hover
        background-color: rgba(0, 56, 255, 0.08)
      span
        display: flex
        width: 30px
        margin-right: 0.8em
        &:after
          margin: auto
          content: ""
      .my-account
        &:after
          @include backgroundImage('account-grey.svg')
          width: 14px
          height: 15px
          background-size: cover !important
      .company-details
         &:after
          @include backgroundImage('company.svg')
          width: 17px
          height: 19px
          background-size: cover
      .logout
        &:after
          width: 14px
          height: 14px
          background-size: contain !important
          @include backgroundImage('logout_grey.svg')
      .dashboard-home
        &:after
          width: 14px
          height: 14px
          background-size: contain !important
          @include backgroundImage('home_grey.svg')
.wrap.not-loggedIn
  justify-content: center
  position: relative
  @media only screen and (min-width: $mdBreakpoint)
    // padding: 1.2em 0
  .switch-language
    @media only screen and (min-width: $mdBreakpoint)
      position: absolute
      right: 0
    a
      display: flex
      color: $colorHubbleDarkGrey
      font-size: 14px
      span
        display: flex
        width: 30px
        margin-right: 0.4em
        &:after
          margin: auto
          content: ""
  .hide-mobile
    display: none
    @media only screen and (min-width: $mdBreakpoint)
      display: block
  .open-dropdown
    width: 100%
</style>
