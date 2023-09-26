<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="car-policy-wrap">
    <div class="left-area">
      <div class="policy-text">
        <span>{{ $t('_DriverAccount.leaseCategory') }} </span> <span>/</span>
        <h1>
          {{ getBreadCrumbTitle() }}
        </h1>
      </div>
      <div class="save-policy">
        <Button :text="$t('_generalTerms.save')" buttonType="dark" @onClick="publishLeaseCategory" />
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardLeaseCategory" />
        <Button
          v-if="route.params.id"
          :text="$t('_generalTerms.delete')"
          buttonType="light delete-button"
          @onClick="deleteLeaseCategory"
        />
      </div>
    </div>
    <div class="center-area">
      <div class="car-policy-steps">
        <div class="common-header">
          <h2>{{ $t('_carPolicy.generalInformation') }}</h2>
        </div>
        <div class="data-section">
          <div v-if="!loader">
            <div class="general-infomation step">
              <div class="error-block" v-if="Array.isArray(updateLeaseCategoryResponse)">
                <span v-for="(item, index) in updateLeaseCategoryResponse" :key="index">
                  {{ $t(`leaseCategories.${item}`) }}*
                </span>
              </div>
              <div class="error-block" v-else>
                <span>{{ $t(`leaseCategories.${updateLeaseCategoryResponse}`) }}</span>
              </div>
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="leaseCategory['value']['leaseCategoryTitle']"
                    @update:value="onUpdateLeaseCategory"
                  >
                    {{ $t('leaseCategories.leaseCategoryTitle') }}
                  </InputElement>
                </div>
                <div class="half-width">
                  <InputElement
                    type="text"
                    currencyPlaceholder="€"
                    :value="ConvertToCommas(leaseCategory['value']['leasePersonalContribution'])"
                    @update:value="onUpdatePersonalContribution"
                  >
                    {{ $t('_DriverAccount.personalContribution') }}
                  </InputElement>
                </div>
                <div class="half-width no-margin">
                  <InputElement
                    type="text"
                    currencyPlaceholder="%"
                    currencyPlaceholderPosition="right"
                    :value="ConvertToCommas(leaseCategory['value']['leasePrivateRate'])"
                    @update:value="onUpdatePrivateRate"
                  >
                    {{ $t('_DriverAccount.personalContributionPercent') }}
                  </InputElement>
                </div>
              </div>
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    currencyPlaceholder="%"
                    currencyPlaceholderPosition="right"
                    :value="ConvertToCommas(leaseCategory['value']['leaseUndershoot'])"
                    @update:value="onUpdateundershoot"
                  >
                    {{ $t('_DriverAccount.undershoot') }}
                  </InputElement>
                </div>
                <div class="half-width overrun-block">
                  <div class="input-block">
                    <InputElement
                      type="text"
                      :value="ConvertToCommas(leaseCategory['value']['leaseOverrun'])"
                      @update:value="onUpdateoverrun"
                    >
                      {{ $t('_DriverAccount.overrun') }}
                    </InputElement>
                  </div>
                  <div class="dropdown-block">
                    <Dropdown
                      :items="overrunItems"
                      :selectedOption="leaseCategory['value']['leaseSelectedOverrunItem']"
                      @onChange="selectOverrunItem"
                    />
                  </div>
                </div>
                <div class="half-width no-margin co2-emissions">
                  <InputElement
                    type="text"
                    currencyPlaceholder="gr/km"
                    :value="leaseCategory['value']['leaseMaxC02'] != null ? leaseCategory['value']['leaseMaxC02'] : '-'"
                    @update:value="onUpdateMaxCo2"
                  >
                    {{ $t('_DriverAccount.maxCo2') }}
                  </InputElement>
                </div>
              </div>
              <div class="row" v-if="!leaseBudgetPerFuelType.value.length">
                <div class="half-width">
                  <InputElement
                    type="text"
                    currencyPlaceholder="€"
                    :value="ConvertToCommas(leaseCategory['value']['leaseAmount'])"
                    @update:value="onUpdateLeaseAmount"
                  >
                    {{ $t('_DriverAccount.leaseAmount') }}
                  </InputElement>
                </div>
                <div class="half-width button-wrap no-margin">
                  <Button
                    :text="$t(`_generalTerms.addExceptionPerFuel`)"
                    class="add-button active"
                    buttonType="light add--left"
                    @onClick="addLeaseBudgetPerFuelType"
                  />
                </div>
              </div>
              <div class="row" v-else>
                <div class="fuel-types-container">
                  <div class="half-width" v-for="(item, index) in leaseBudgetPerFuelType.value" :key="index">
                    <InputElement
                      type="text"
                      currencyPlaceholder="€"
                      :name="item.fuelType"
                      :value="ConvertToCommas(item.amount)"
                      @update:value="onLeaseBudgetPerFuelTypeInput"
                    >
                      {{ $t(`leaseCategories.${item.fuelType}`) }}
                    </InputElement>
                    <span class="error-message" v-if="fuelTypeExceptionsErrors[item.fuelType + 'Error']">
                      {{ $t('_errorCodes.requiredError') }}
                    </span>
                    <span class="error-message" v-if="fuelTypeExceptionsErrors[item.fuelType + 'ValidationError']">
                      {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
                    </span>
                  </div>
                </div>
                <div class="half-width button-wrap no-margin">
                  <Button
                    :text="$t(`_generalTerms.deleteExceptionsPerFuelType`)"
                    class="add-button active delete"
                    buttonType="light add--left"
                    @onClick="deleteLeaseBudget"
                  />
                </div>
              </div>
            </div>
            <div class="next-block">
              <Button
                :text="$route.params.id ? $t('leaseCategories.updateLease') : $t('leaseCategories.publishLease')"
                @onClick="publishLeaseCategory"
                buttonType="dark arrow--right"
              />
            </div>
          </div>
          <div v-else class="loader-block">
            <Loader />
          </div>
        </div>
      </div>
    </div>
    <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
      <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
      <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
    </Popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, onUnmounted } from 'vue'
import Button from '@/components/UI/Button.vue'
import InputElement from '@/components/UI/Input.vue'
import { ref, reactive } from 'vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import { useStore } from '@/store'
import { leaseActionTypes } from '@/store/leaseCategories/actions'
import { VueCookieNext } from 'vue-cookie-next'
import { useRoute } from 'vue-router'
import ConvertToCommas from '@/filters/ConvertToCommas'
import CurrencyFormat from '@/filters/CurrencyFormat'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Popup from '@/components/Popup.vue'
import { MutationTypes } from '@/store/leaseCategories/mutations'
import Loader from '@/components/UI/Loader.vue'
import MessageBar from '@/components/UI/MessageBar.vue'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  components: {
    Button,
    InputElement,
    Dropdown,
    Popup,
    Loader,
    MessageBar
  },
  name: 'Edit lease categorie',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const showPopup = ref(false)
    const fuelTypeExceptionsErrors = reactive({})
    const leaseCategoryByID = computed(() => store.state.leaseCategories.leaseCategoryByID)
    const loader = computed(() => store.state.leaseCategories.loader)
    const updateLeaseCategoryResponse = computed(() => store.state.leaseCategories.updateLeaseCategoryResponse)
    const roles = VueCookieNext.getCookie('roles')
    const { compId, companyDetailState } = getCompany()
    const leaseCategory = reactive({
      value: {
        leaseCategoryTitle: '',
        leaseAmount: '',
        leaseOverrun: '',
        leaseUndershoot: '',
        leasePersonalContribution: '',
        leasePrivateRate: '',
        leaseMaxC02: '',
        leaseSelectedOverrunItem: '%'
      }
    })
    const leaseBudgetPerFuelType = reactive({
      value: []
    })
    const overrunItems = reactive(['%', '€'])
    const selectedOverrunItem = ref('%')
    const onUpdateLeaseCategory = (value) => {
      leaseCategory.value['leaseCategoryTitle'] = value
    }
    const onUpdateLeaseAmount = (value) => {
      leaseCategory.value['leaseAmount'] = value
    }
    const onUpdateoverrun = (value) => {
      leaseCategory.value['leaseOverrun'] = value
    }
    const onUpdateundershoot = (value) => {
      leaseCategory.value['leaseUndershoot'] = value
    }
    const onUpdatePersonalContribution = (value) => {
      leaseCategory.value['leasePersonalContribution'] = value
    }
    const onUpdatePrivateRate = (value) => {
      leaseCategory.value['leasePrivateRate'] = value
    }
    const onUpdateMaxCo2 = (value) => {
      leaseCategory.value['leaseMaxC02'] = value
    }
    const selectOverrunItem = (value) => {
      leaseCategory.value['leaseSelectedOverrunItem'] = value
    }
    const getBreadCrumbTitle = () => {
      let title = t('leaseCategories.newleaseCategory')
      if (route.params.id) {
        title = leaseCategoryByID.value.title
      }
      return title
    }
    const convertToNumber = (selectedOption) => {
      return parseFloat(selectedOption.replace('€', '').replace(',', '.'))
    }
    const validateFloat = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = /^\d+([\,]\d+)*([\.]\d+)?$/gm
      return regex.test(value)
    }
    const validateFuelTypeExceptions = () => {
      delete fuelTypeExceptionsErrors['petrolError']
      delete fuelTypeExceptionsErrors['dieselError']
      delete fuelTypeExceptionsErrors['electricError']
      delete fuelTypeExceptionsErrors['hydrogenError']
      delete fuelTypeExceptionsErrors['otherError']
      delete fuelTypeExceptionsErrors['petrolValidationError']
      delete fuelTypeExceptionsErrors['dieselValidationError']
      delete fuelTypeExceptionsErrors['electricValidationError']
      delete fuelTypeExceptionsErrors['hydrogenValidationError']
      delete fuelTypeExceptionsErrors['otherValidationError']
      if (leaseBudgetPerFuelType.value.length) {
        leaseBudgetPerFuelType.value.forEach((item) => {
          if (!item.amount) {
            fuelTypeExceptionsErrors[item.fuelType + 'Error'] = 'required'
          }
          if (item.amount && !validateFloat(item.amount)) {
            fuelTypeExceptionsErrors[item.fuelType + 'ValidationError'] = 'required'
          }
        })
      }
      if (Object.getOwnPropertyNames(fuelTypeExceptionsErrors).length === 0) {
        return true
      }
    }
    const validateBlock = () => {
      const errorString = []
      if (leaseCategory.value.leasePrivateRate) {
        if (!validateFloat(leaseCategory.value.leasePrivateRate))
          errorString.push('Max personal contribution percentage must be a number or left empty')
        if (convertToNumber(leaseCategory.value.leasePrivateRate) > 100)
          errorString.push('Max personal contribution percentage should contain number from 0 to 100')
      }
      if (leaseCategory.value.leaseUndershoot) {
        if (!validateFloat(leaseCategory.value.leaseUndershoot))
          errorString.push('Undershoot payout percentage must be a number or left empty')
        if (convertToNumber(leaseCategory.value.leaseUndershoot) > 100)
          errorString.push('Undershoot payout percentage should contain number from 0 to 100')
      }
      if (errorString.length > 0) {
        store.commit(MutationTypes.SET_UPDATELEASECATEGORYRESPONSE, errorString)
        return false
      } else return true
    }
    const publishLeaseCategory = () => {
      if (validateFuelTypeExceptions() && validateBlock()) {
        const leaseData = {
          title: leaseCategory.value.leaseCategoryTitle,
          amount: leaseBudgetPerFuelType.value.length ? '0' : convertToNumber(leaseCategory.value.leaseAmount),
          overrun: leaseCategory.value.leaseOverrun ? convertToNumber(leaseCategory.value.leaseOverrun) : null,
          undershootPayoutPercentage: leaseCategory.value.leaseUndershoot
            ? convertToNumber(leaseCategory.value.leaseUndershoot)
            : null,
          overrunType:
            leaseCategory.value.leaseSelectedOverrunItem == '€' ? '$' : leaseCategory.value.leaseSelectedOverrunItem,
          personalContribution: convertToNumber(leaseCategory.value.leasePersonalContribution),
          maxPersonalContributionPercentage: leaseCategory.value.leasePrivateRate
            ? convertToNumber(leaseCategory.value.leasePrivateRate)
            : null,
          co2Emission:
            leaseCategory.value.leaseMaxC02 != null ? convertToNumber(leaseCategory.value.leaseMaxC02) : null,
          multipleFuelTypesAmount: leaseBudgetPerFuelType.value.map((item) => {
            return { fuelType: item.fuelType, amount: convertToNumber(item.amount) }
          })
        }
        if (route.params.id) {
          store.dispatch(leaseActionTypes.UPDATE_LEASEBYID, {
            companyId: compId,
            leaseCategoryId: leaseCategoryByID.value.id,
            data: leaseData
          })
        } else {
          store.dispatch(leaseActionTypes.ADD_LEASECATEGORY, {
            companyId: compId,
            data: leaseData
          })
        }
      }
    }
    const deleteLeaseCategory = () => {
      if (route.params.id) {
        showPopup.value = true
      } else {
        router.push({ name: 'LeaseCategoryOverview' })
      }
    }
    const discardLeaseCategory = () => {
      router.push({ name: 'LeaseCategoryOverview' })
    }
    const closePopup = () => {
      showPopup.value = false
    }
    const onProceed = () => {
      store.dispatch(leaseActionTypes.DELETE_LEASEBYID, {
        companyId: compId,
        leaseCategoryId: leaseCategoryByID.value.id
      })
      showPopup.value = false
    }
    const initialize = async () => {
      await store.dispatch(leaseActionTypes.GET_LEASEBYID, {
        companyId: compId,
        leaseCategoryId: route.params.id
      })
    }
    const addLeaseBudgetPerFuelType = () => {
      leaseBudgetPerFuelType.value.push(
        { fuelType: 'petrol', amount: '' },
        { fuelType: 'diesel', amount: '' },
        { fuelType: 'electric', amount: '' },
        { fuelType: 'hydrogen', amount: '' },
        { fuelType: 'other', amount: '' }
      )
    }
    const onLeaseBudgetPerFuelTypeInput = (value, key) => {
      const selectedFuelTypeIndex = leaseBudgetPerFuelType.value.findIndex((item) => item['fuelType'] == key)
      leaseBudgetPerFuelType.value[selectedFuelTypeIndex]['amount'] = value
    }
    const deleteLeaseBudget = () => {
      leaseBudgetPerFuelType.value = []
    }
    onMounted(async () => {
      if (route.params.id) {
        await initialize()
        leaseCategory.value['leaseCategoryTitle'] = leaseCategoryByID.value.title
        leaseCategory.value['leaseAmount'] = leaseCategoryByID.value.amount.toString()
        leaseCategory.value['leaseOverrun'] =
          leaseCategoryByID.value.overrun == null ? null : leaseCategoryByID.value.overrun.toString()
        leaseCategory.value['leaseUndershoot'] =
          leaseCategoryByID.value.undershootPayoutPercentage == null
            ? null
            : leaseCategoryByID.value.undershootPayoutPercentage.toString()
        leaseCategory.value['leasePersonalContribution'] = leaseCategoryByID.value.personalContribution.toString()
        leaseCategory.value['leasePrivateRate'] =
          leaseCategoryByID.value.maxPersonalContributionPercentage == null
            ? null
            : leaseCategoryByID.value.maxPersonalContributionPercentage.toString()
        leaseCategory.value['leaseMaxC02'] =
          leaseCategoryByID.value.co2Emission !== null
            ? ConvertToCommas(leaseCategoryByID.value.co2Emission.toString())
            : null
        if (leaseCategoryByID.value.multipleFuelTypesAmount == null) {
          leaseBudgetPerFuelType.value = []
        } else {
          leaseBudgetPerFuelType.value = leaseCategoryByID.value.multipleFuelTypesAmount.map((item) => {
            return { fuelType: item.fuelType, amount: item.amount.toString() }
          })
        }
        if (leaseCategoryByID.value.overrunType == '$') {
          leaseCategory.value['leaseSelectedOverrunItem'] = '€'
        } else {
          leaseCategory.value['leaseSelectedOverrunItem'] = leaseCategoryByID.value.overrunType
        }
      }
    })
    onUnmounted(() => {
      store.commit(MutationTypes.SET_UPDATELEASECATEGORYRESPONSE, [])
    })
    return {
      onUpdateLeaseCategory,
      onUpdateoverrun,
      onUpdateundershoot,
      onUpdateLeaseAmount,
      onUpdatePersonalContribution,
      onUpdatePrivateRate,
      onUpdateMaxCo2,
      publishLeaseCategory,
      overrunItems,
      selectOverrunItem,
      selectedOverrunItem,
      leaseCategory,
      ConvertToCommas,
      CurrencyFormat,
      leaseCategoryByID,
      getBreadCrumbTitle,
      showPopup,
      deleteLeaseCategory,
      closePopup,
      onProceed,
      updateLeaseCategoryResponse,
      loader,
      discardLeaseCategory,
      route,
      addLeaseBudgetPerFuelType,
      leaseBudgetPerFuelType,
      deleteLeaseBudget,
      onLeaseBudgetPerFuelTypeInput,
      fuelTypeExceptionsErrors,
      companyDetailState,
      roles
    }
  }
})
</script>
<style lang="sass" scoped>
.error-message
  line-height: 13px
  top: 110%
.hide
  display: none !important
.general-infomation
  @media screen and (max-width: $mdBreakpoint - 1)
    flex-direction: column
    .half-width
      &:first-child
        margin-right: 0 !important
        margin-bottom: 5em
  .half-width
    margin-right: 3em
    &.no-margin
      margin-right: 0
  > div
    margin-bottom: 2em
.car-policy-wrap
  display: flex
  flex: 1
  position: relative
  @media screen and (max-width: $xxlBreakpoint)
    flex-direction: column
    padding: 0 15px
  .left-area
    position: absolute
    left: 0
    @media screen and (max-width: $xxlBreakpoint)
      position: relative
      margin: 2em 0 0
    .policy-text
      display: flex
      align-items: center
      @media screen and (max-width: $mdBreakpoint - 1)
        h1
          font-size: 14px
      span
        font-family: 'Lato-semibold'
        font-size: 15px
        margin-right: 0.8em
      span, h1
        color: $colorHubble
    .save-policy
      margin: 2em 0 0
      @media screen and (max-width: $mdBreakpoint - 1)
        button
          font-size: 12px
      button.dark
        padding: 0.9em 1.4em
      button.light
        padding: 0.9em 1.4em
        margin-top: 0.7em
  .center-area
    display: flex
    max-width: 970px
    margin: auto
    width: 100%
    .car-policy-steps
      display: flex
      flex: 1
      flex-direction: column
      margin: 5.5em 0 18em
      @media screen and (max-width: $mdBreakpoint - 1)
        margin: 3.5em 0 5em
      .general-infomation
        label
          font-size: 14px
          color: $colorHubbleDarkGrey
          display: flex
          margin-bottom: 0.4em
      .step
        max-width: 670px
        margin: auto
        width: 100%
        display: flex
        margin-top: 3.1em
        box-sizing: border-box
        padding: 0 15px
        flex-direction: column
        @media screen and (max-width: $mdBreakpoint - 1)
          flex-direction: column
        .row
          display: flex
          &:first-child
            margin: 0 0 3.2em 0
            @media screen and (max-width: $mdBreakpoint - 1)
              margin: 0
          @media screen and (max-width: $mdBreakpoint - 1)
            flex-direction: column
        h3
          text-align: center
          width: 100%
        .half-width
          width: 30%
          position: relative
          display: flex
          flex-direction: column
          max-width: 100%
          &.button-wrap
            width: calc(100% / 3)
            justify-content: button-wrap
            button
              width: 142%
              height: 49px
              @media screen and (max-width: $lgBreakpoint)
                width: 100%
                max-width: 320px
          @media screen and (max-width: $mdBreakpoint - 1)
            width: 100% !important
            max-width: 100% !important
            height: 48px
            margin-bottom: 2em
            margin-right: 0
        .overrun-block
          flex-direction: row
          .input-block
            width: 73%
          .dropdown-block
            width: 27%
            align-self: flex-end
            .dropdown
              margin-left: 0.9em
              margin-right: 0
        .fuel-types-container
          display: flex
          flex-wrap: wrap
          width: calc((100% / 3) * 2 + 6em)
          @media screen and (max-width: $mdBreakpoint - 1)
            width: 100%
          .half-width
            width: 50%
            max-width: calc(50% - 3em)
            margin-bottom: 3em
      .next-block
        margin: 3.9em 0 5em
        display: flex
        justify-content: center
        @media screen and (max-width: $mdBreakpoint - 1)
          margin: 2em 0 4em

.data-section
  padding: 0 0 1em 0
  background: $colorWhite
  box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
  border-bottom-left-radius: 5px
  border-bottom-right-radius: 5px
  min-height: 350px
  .loader-block
    align-items: center
    height: 100%
.common-header
  background-color: $colorHubble
  color: $colorWhite
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 1em 0 3.3em
  border-top-left-radius: 5px
  border-top-right-radius: 5px
  @media screen and (max-width: $mdBreakpoint)
    padding: 0 1em 0 15px
    h2
      font-size: 18px
      font-family: 'Lato-semibold'
      margin: 0.5em 0
      @media screen and (max-width: $mdBreakpoint)
        font-size: 16px
        flex: 1
div.text
  text-align: center
  padding: 2em 0 0 0
.error-block
  display: flex
  flex-direction: column
  span
    font-size: 12px
    color: $colorHubbleRed
.add-button.active
  pointer-events: visible
  color: $colorHubble
  &:before
    background-image: url(~@/assets/dark-plus.svg) !important
.add-button.delete.active
  &:before
    background-image: url(~@/assets/close.svg) !important
</style>
