<template>
  <div v-if="!loader">
    <div class="details-inner-wrap">
      <h2>{{ $t('_DriverAccount.myProfile') }}</h2>
      <div class="company-info-wrap">
        <div class="left-block">
          <div class="company-info">
            <div class="row">
              <div class="half-width">
                <InputElement type="text" :value="user['name']" :readonly="true">{{
                  $t(`_DriverAccount.name`)
                }}</InputElement>
              </div>
              <div class="half-width">
                <InputElement type="text" :value="user['email']" :readonly="true">{{
                  $t(`_DriverAccount.emailAddress`)
                }}</InputElement>
              </div>
            </div>
            <div class="row">
              <div class="half-width">
                <InputElement
                  type="text"
                  :value="user['userStatus'] ? $t(`_employees.${user['userStatus']}`) : '-'"
                  :readonly="true"
                  >{{ $t(`_DriverAccount.userStatus`) }}</InputElement
                >
              </div>
              <div class="half-width">
                <InputElement type="text" :value="user['employeeNumber']" :readonly="true">{{
                  $t(`_DriverAccount.employeeNo`)
                }}</InputElement>
              </div>
            </div>
            <div v-if="!adminClientRole" class="row">
              <div class="half-width">
                <label>{{ $t(`_DriverAccount.privateUseOfCar`) }}</label>
                <Dropdown
                  :items="useOfCarOptions"
                  :selectedOption="user['privateUse'] == false ? $t('_DriverAccount.no') : $t('_DriverAccount.yes')"
                  @onChange="selectUseOfCarOption"
                />
                <p v-if="privateUserMessageVisible" class="green-text">
                  {{ $t('_generalTerms.saveChangesMessage') }}
                </p>
              </div>
              <div class="half-width">
                <label>{{ $t(`_DriverAccount.taxPercentage`) }}</label>
                <Dropdown
                  :items="incomeTaxPercentages"
                  :selectedOption="selectedIncomeTaxPercentage"
                  @onChange="selectPercentage"
                />
                <p v-if="taxMessageVisible" class="green-text">
                  {{ $t('_generalTerms.saveChangesMessage') }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="right-block">
          <div class="grey-area">
            <p>{{ $t('_DriverAccount.myProfileInfo') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="details-inner-wrap">
      <h2>{{ $t('_DriverAccount.contactInfo') }}</h2>
      <div class="company-info-wrap">
        <div class="left-block">
          <div class="company-info">
            <div class="row">
              <div class="half-width">
                <InputElement type="text" :value="user['street']" :readonly="true">{{
                  $t(`_DriverAccount.streetName`)
                }}</InputElement>
              </div>
              <div class="half-width">
                <InputElement type="text" :value="user['houseNumber']" :readonly="true">{{
                  $t(`_DriverAccount.houseNumber`)
                }}</InputElement>
              </div>
            </div>
            <div class="row">
              <div class="half-width">
                <InputElement type="text" :value="user['postalCode']" :readonly="true">{{
                  $t(`_DriverAccount.postalCode`)
                }}</InputElement>
              </div>
              <div class="half-width">
                <InputElement type="text" :value="user['city']" :readonly="true">{{
                  $t(`_DriverAccount.city`)
                }}</InputElement>
              </div>
            </div>
            <div class="row">
              <div class="half-width">
                <InputElement type="text" :value="user['phoneNumber']" :readonly="true">{{
                  $t(`_DriverAccount.phoneNumber`)
                }}</InputElement>
              </div>
              <div class="half-width"></div>
            </div>
          </div>
        </div>
        <div class="right-block">
          <div class="grey-area">
            <p>{{ $t('_DriverAccount.myContactInfo') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="details-inner-wrap lease-section">
      <h2>{{ $t('_DriverAccount.leaseCar') }}</h2>
      <div class="company-info-wrap">
        <div class="left-block">
          <div class="company-info">
            <div class="row">
              <div class="half-width">
                <InputElement
                  type="text"
                  :value="
                    user['leaseValidUntil'] ? user['leaseValidUntil'].split(' ')[0].split('-').reverse().join('-') : '-'
                  "
                  :readonly="true"
                  >{{ $t(`_DriverAccount.currentLeaseEndDate`) }}</InputElement
                >
              </div>
              <div class="half-width">
                <InputElement
                  type="text"
                  :value="user['licensePlate'] && user['licensePlate'].length > 0 ? user['licensePlate'] : '-'"
                  :readonly="true"
                  >{{ $t(`_DriverAccount.numberPlate`) }}</InputElement
                >
              </div>
            </div>
          </div>
        </div>
        <div class="right-block">
          <div class="grey-area">
            <p>{{ $t('_DriverAccount.myContactInfo') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="details-inner-wrap update-password-section">
      <h2>{{ $t('_companyDetails.updatePassword') }}</h2>
      <div class="company-info-wrap">
        <div class="left-block">
          <div class="company-info">
            <div class="row">
              <div class="half-width">
                <InputElement
                  type="password"
                  :value="passwordFields['oldPassword']"
                  @update:value="updateExistingPassword"
                  >{{ $t(`_companyDetails.existingPassword`) }}</InputElement
                >
                <span v-if="passwordErrors.emptyPassword" class="error-message">
                  {{ $t('_errorCodes.requiredError') }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="half-width">
                <InputElement
                  type="password"
                  :value="passwordFields['newPassword']"
                  @update:value="updateNewPassword"
                  >{{ $t(`_companyDetails.enterNewPassword`) }}</InputElement
                >
                <span v-if="passwordErrors.emptyNewPassword" class="error-message">
                  {{ $t('_errorCodes.requiredError') }}
                </span>
                <span v-else-if="passwordErrors.invalidPassword" class="error-message wide">
                  {{ $t('_errorCodes.invalidPassword') }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="half-width">
                <InputElement
                  type="password"
                  :value="passwordFields['confirmPassword']"
                  @update:value="updateRepeatNewPassword"
                  >{{ $t(`_companyDetails.repeatNewPassword`) }}</InputElement
                >
                <span v-if="passwordErrors.emptyConfirmPassword" class="error-message">
                  {{ $t('_errorCodes.requiredError') }}
                </span>
                <span v-else-if="passwordErrors.confirmPasswordSame" class="error-message">
                  {{ $t('_errorCodes.sameConfirmPassword') }}
                </span>
              </div>
            </div>
            <div class="error-block">
              <span v-for="item of updatePasswordErrors" :key="item"> {{ $t(`_errorCodes.${item}`) }}</span>
            </div>
          </div>
        </div>
        <div class="right-block">
          <div class="grey-area">
            <p>
              {{ $t('_companyDetails.passwordConsistOf') }}
            </p>
            <ul>
              <li>{{ $t('_companyDetails.8chars') }}</li>
              <li>{{ $t('_companyDetails.1CapitalLetter') }}</li>
              <li>{{ $t('_companyDetails.1LowerLetter') }}</li>
              <li>{{ $t('_companyDetails.1number') }}</li>
            </ul>
          </div>
        </div>
      </div>
      <Button @onClick="updatePassword" :text="$t('_companyDetails.updatePassword')" buttonType="dark" />
    </div>
  </div>
  <div class="loader-block" v-else>
    <Loader />
  </div>
  <transition name="fade">
    <info-popup v-if="showPopup" @closePopup="closePopup">
      <template v-slot:header>{{ $t('_generalTerms.passwordUpdated') }}</template>
    </info-popup>
  </transition>
</template>
<script lang="ts">
import { defineComponent, ref, computed, reactive, watch, onMounted } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Button from '@/components/UI/Button.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import { AuthActionTypes } from '@/store/auth/actions'
import { taxSettingsActionTypes } from '@/store/taxSettings/actions'
import Loader from '@/components/UI/Loader.vue'
import InfoPopup from '@/components/UI/InfoPopup.vue'
import rolesMapping from '@/composables/rolesMapping'
import _ from 'lodash'
export default defineComponent({
  name: 'Driver Account Details',
  setup() {
    const store = useStore()
    const { locale, t } = useI18n({ useScope: 'global' })
    const incomeTaxPercentages = ref([])
    const selectedIncomeTaxPercentage = ref(`${t('_generalTerms.pleaseSelect')}`)
    const useOfCarOptions = ref([
      { label: t('_generalTerms.yes'), value: true },
      { label: t('_generalTerms.no'), value: false }
    ])
    const privateUserMessageVisible = ref(false)
    const taxMessageVisible = ref(false)
    const user = computed(() => store.state.auth.currentUser)
    const roles = computed(() => store.state.auth.currentUser.roles)
    const getTaxSettingsByYear = computed(() => store.state.taxSettings.getTaxSettingsByYear)
    const adminClientRole = computed(() => !roles.value.includes('ROLE_EMPLOYEE'))
    const loader = computed(() => store.state.auth.loader)
    const showPopup = ref(false)
    const updatePasswordErrors = computed(() => store.state.auth.passwordErrors)
    const passwordErrors = reactive({
      passwordRegex: false,
      confirmPasswordSame: false,
      emptyPassword: false,
      emptyNewPassword: false,
      emptyConfirmPassword: false,
      invalidPassword: false
    })

    const selectPercentage = (payload) => {
      if (!user.value.incomeTax || (user.value.incomeTax && payload.value !== user.value.incomeTax.id)) {
        let incomeTaxObj = {}
        getTaxSettingsByYear.value.incomeTaxSettings.map((item, index) => {
          if (item.id == payload.value) {
            incomeTaxObj = Object.assign({}, incomeTaxObj, getTaxSettingsByYear.value.incomeTaxSettings[index])
          }
        })
        const newObj = Object.assign({}, user.value, {
          incomeTax: incomeTaxObj,
          leaseValidUntil: user.value.leaseValidUntil && user.value.leaseValidUntil ? user.value.leaseValidUntil : null,
          carPolicy: user.value.carPolicy ? user.value.carPolicy.id?.toString() : null,
          leaseCategory: user.value.leaseCategory ? user.value.leaseCategory.id.toString() : null
        })
        newObj['roles'] = rolesMapping(user.value.roles)
        delete newObj['company']
        store.dispatch(AuthActionTypes.UPDATE_USER, {
          companyId: user.value.company.id,
          userId: user.value.id,
          body: newObj
        })
        taxMessageVisible.value = true
        incomeTaxPercentages.value.map((item) => {
          if (item.value == payload.value) {
            selectedIncomeTaxPercentage.value = item.label
          }
        })
      } else {
        taxMessageVisible.value = false
      }
    }
    const selectUseOfCarOption = (payload) => {
      if (payload.value !== user.value.privateUse) {
        const newObj = Object.assign({}, user.value, {
          leaseValidUntil: user.value.leaseValidUntil && user.value.leaseValidUntil ? user.value.leaseValidUntil : null,
          carPolicy: user.value.carPolicy ? user.value.carPolicy.id?.toString() : null,
          leaseCategory: user.value.leaseCategory ? user.value.leaseCategory.id.toString() : null,
          privateUse: payload.value == 1
        })
        delete newObj['company']
        newObj['roles'] = rolesMapping(user.value.roles)
        store.dispatch(AuthActionTypes.UPDATE_USER, {
          companyId: user.value.company.id,
          userId: user.value.id,
          body: newObj
        })
        privateUserMessageVisible.value = true
      } else {
        privateUserMessageVisible.value = false
      }
    }
    const passwordFields = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const updateExistingPassword = (value) => {
      passwordFields.value['oldPassword'] = value
    }
    const updateNewPassword = (value) => {
      passwordFields.value['newPassword'] = value
    }
    const updateRepeatNewPassword = (value) => {
      passwordFields.value['confirmPassword'] = value
    }

    const closePopup = () => {
      showPopup.value = !showPopup.value
    }

    const updatePassword = async () => {
      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      passwordErrors.passwordRegex = false
      passwordErrors.confirmPasswordSame = false
      passwordErrors.emptyPassword = false
      passwordErrors.emptyConfirmPassword = false
      passwordErrors.emptyNewPassword = false
      passwordErrors.invalidPassword = false

      if (passwordFields.value.oldPassword === '') {
        passwordErrors.emptyPassword = true
      }
      if (passwordFields.value.newPassword === '') {
        passwordErrors.emptyNewPassword = true
      }
      if (passwordFields.value.confirmPassword === '') {
        passwordErrors.emptyConfirmPassword = true
      }
      if (passwordFields.value.newPassword !== passwordFields.value.confirmPassword) {
        passwordErrors.confirmPasswordSame = true
      }
      if (!regex.test(passwordFields.value.newPassword)) {
        passwordErrors.invalidPassword = true
      }
      if (Object.values(passwordErrors).every((v) => v === false)) {
        const res = await store.dispatch(AuthActionTypes.UPDATE_PASSWORD, {
          id: +user.value.id,
          body: passwordFields.value
        })
        if (res.status === 'success') {
          showPopup.value = true
        }
      }
    }
    const getIncometaxPercentage = () => {
      if (getTaxSettingsByYear.value.incomeTaxSettings.length) {
        getTaxSettingsByYear.value.incomeTaxSettings.map((item, index) => {
          let showLabel = ''
          if (getTaxSettingsByYear.value.incomeTaxSettings[index + 1]) {
            showLabel =
              '€ ' + item.fromValue + ' - € ' + (getTaxSettingsByYear.value.incomeTaxSettings[index + 1].fromValue - 1)
          } else {
            showLabel = '> € ' + item.fromValue
          }
          if (user.value.incomeTax && item.id == user.value.incomeTax.id) selectedIncomeTaxPercentage.value = showLabel
          incomeTaxPercentages.value.push({ label: showLabel, value: item.id })
        })
      }
    }

    onMounted(async () => {
      await store.dispatch(taxSettingsActionTypes.GET_TAXSETTINGS, { year: new Date().getFullYear() })
      getIncometaxPercentage()
    })
    watch(
      () => _.cloneDeep(locale.value),
      () => {
        useOfCarOptions.value = [
          { label: t('_generalTerms.yes'), value: true },
          { label: t('_generalTerms.no'), value: false }
        ]
        getIncometaxPercentage()
      }
    )
    return {
      incomeTaxPercentages,
      selectPercentage,
      passwordFields,
      updateExistingPassword,
      updateNewPassword,
      updateRepeatNewPassword,
      useOfCarOptions,
      selectUseOfCarOption,
      user,
      loader,
      privateUserMessageVisible,
      taxMessageVisible,
      updatePassword,
      passwordErrors,
      updatePasswordErrors,
      closePopup,
      showPopup,
      adminClientRole,
      selectedIncomeTaxPercentage
    }
  },
  components: {
    InputElement,
    Button,
    Dropdown,
    Loader,
    InfoPopup
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
.loader-block
  display: flex
  flex: 1
  justify-content: space-around
.driver-account
.right-area
  .details-inner-wrap
    margin: 0 0 3em 0
    h2
      @media screen and (max-width: $mdBreakpoint)
        margin: 1.4em 0 1.4em 0
    .company-info-wrap
      .left-block
        flex: 2
        .company-info
          .row
            .half-width
              position: relative
              margin-right: 5%
              @media screen and (max-width: $mdBreakpoint)
                margin-bottom: 2em
              label
                font-size: 14px
                color: $colorHubbleDarkGrey
                display: flex
                margin-bottom: 0.4em
              .dropdown
                margin-left: 0
    .lease-section
      padding-bottom: 3.5em
    .update-password-section
    @media screen and (min-width: $mdBreakpoint)
      padding: 0 3em 5em 3em
      .half-width
        width: 45%
    .company-info-wrap
      @media screen and (max-width: $mdBreakpoint)
        margin: 0 0 2em 0
.green-text
  color: $colorHubbleDarkGreen
  font-size: 14px
  margin-top: 2%
.error-block
  position: relative
  color: red
  margin: 1rem 0
  font-size: 14px
.wide
  width: max-content
</style>
