<template>
  <div v-if="!carOrderLoader && Object.keys(carOrderDetailsById).length" class="wrap">
    <div class="main-wrap">
      <div class="step-wrap step1 common-step hide-on-desktop">
        <h4>{{ $t('_configure.carSelectorWizard') }}</h4>
        <span class="checked"></span>
      </div>
      <div class="step-wrap step2 common-step hide-on-desktop">
        <h4>{{ $t('_configure.pickYourCar') }}</h4>
        <span class="checked"></span>
      </div>
      <div class="step-wrap step3 common-step hide-on-desktop">
        <h4>{{ $t('_configure.configureYourCar') }}</h4>
        <span class="checked"></span>
      </div>
      <div class="step-wrap step4 common-step active">
        <h4>{{ $t('_configure.approve') }}</h4>
        <div class="mobile-back">
          <BackButton @onBack="$router.go(-1)" />
        </div>
      </div>
      <toggleableContent id="specificationSection">
        <template v-slot:header> {{ $t('_configure.selectedCar.title') }} </template>
        <div class="options-wrap">
          <h3>{{ $t('_configure.selectedCar.specifications') }}</h3>
          <div class="full-width">
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.brandModelVersion') }}</span>
              <span class="value">
                {{ vehicleDetails['local_make_name_128'] }}
                {{ vehicleDetails['local_model_name_129'] }}
                {{ vehicleDetails['model_year_108'] }},
                {{ vehicleDetails['local_version_name_131'] }}
              </span>
              <div class="price">
                <span class="icon">€</span>
                <span class="amount">{{ formatCurrency(vehicleDetails['retail_price_902']) }}</span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.co2Emissions') }}</span>
              <span class="value">{{ vehicleDetails['combined_62203'] }} gr/km</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_DriverAccount.expectedMileage') }}</span>
              <span class="value" v-if="carOrderDetailsById['user']['expectedMileage']"
                >{{ carOrderDetailsById['user']['expectedMileage'] }} km</span
              >
              <span class="value" v-else>-</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.fuelType') }}</span>
              <span class="value"
                >{{ $t(getTranslatedFuelType(vehicleDetails['fuel_type_8702'])) }}
                <i v-if="vehicleDetails['type_48602'] && vehicleDetails['type_48602'] == 'hybrid'">
                  / {{ $t('_wizard.step2.Hybrid') }}
                </i>
                <i v-else-if="vehicleDetails['type_48602'] && vehicleDetails['type_48602'] == 'plug_in_hybrid'">
                  / {{ $t('_wizard.step2.PlugInHybrid') }}
                </i>
              </span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.bodyType') }}</span>
              <span class="value">{{ $t(getTranslatedBodyType(vehicleDetails['body_type_603'])) }}</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.transmission') }}</span>
              <span class="value" v-if="vehicleDetails['transmission_type_20602'] == 'Automatic'">{{
                $t('_sidebar.automatic')
              }}</span>
              <span class="value" v-else>{{ $t('_sidebar.manual') }}</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.amountDoors') }}</span>
              <span class="value">{{ vehicleDetails['number_of_doors_602'] }}</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.amountSeats') }}</span>
              <span class="value">{{ vehicleDetails['seating_capacity_702'] }}</span>
              <div class="price">
                <span class="icon"></span>
                <span class="amount"></span>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.colorExterior') }}</span>
              <div class="nested-block">
                <div class="nested-inner-block" v-for="(item, index) in groupByColors('Exterior colour')" :key="index">
                  <span class="value">
                    <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }} </i>
                    <i v-else>{{ item['titleEn'] }} </i> ({{ item['code'] }})
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == null || item['price'] == 0" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.colorInterior') }}</span>
              <div class="nested-block">
                <div class="nested-inner-block" v-for="(item, index) in groupByColors('Interior colour')" :key="index">
                  <span class="value">
                    <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }} </i>
                    <i v-else>{{ item['titleEn'] }} </i> ({{ item['code'] }})
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == null || item['price'] == 0" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.options') }}</span>
              <div class="nested-block">
                <div class="nested-inner-block" v-for="(item, index) in groupByOptions()" :key="index">
                  <span class="value">
                    <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }} </i>
                    <i v-else>{{ item['titleEn'] }} </i> ({{ item['code'] }})
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == null || item['price'] == 0" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.accessories') }}</span>
              <div class="nested-block">
                <div
                  class="nested-inner-block"
                  v-for="(item, index) in carOrderDetailsById['mandatoryAccessories']"
                  :key="index"
                >
                  <span class="value">
                    {{ item['accessory'] }}
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == '0'" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
                <div
                  class="nested-inner-block"
                  v-for="(item, index) in carOrderDetailsById['otherAccessories']"
                  :key="index"
                >
                  <span class="value">
                    {{ item['accessory'] }}
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == '0'" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="specification">{{ $t('_configure.selectedCar.chargingfacility') }}</span>
              <div class="nested-block">
                <div
                  class="nested-inner-block"
                  v-for="(item, index) in carOrderDetailsById['chargingFacilities']"
                  :key="index"
                >
                  <span class="value">
                    {{ item['accessory'] }}
                  </span>
                  <div class="price">
                    <span class="icon">€</span>
                    <span v-if="item['price'] == '0'" class="amount">0,00</span>
                    <span v-else class="amount">{{ formatCurrency(item['price']) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="confirm-block">
            <div class="checkbox-wrapper">
              <!-- checkbox -->
              <Checkbox theme="step4" :item="checkboxes[0]" :isChecked="checkboxes[0]['isActive']">
                <template v-slot:value> {{ $t('_configure.selectedCar.checkboxText') }} </template>
              </Checkbox>
            </div>
            <span class="sub-text">
              {{ $t('_configure.selectedCar.endDisclaimer') }}
            </span>
            <span class="error-message" v-if="checkboxesErrors['specificationError']">
              {{ $t('_errorCodes.requiredError') }}
            </span>
          </div>
        </div>
      </toggleableContent>
      <toggleableContent id="financialSection">
        <template v-slot:header> {{ $t('_configure.financialImpact.title') }} </template>
        <div class="options-wrap">
          <div class="financial-impact">
            <span class="disclaimer">
              {{ $t('_configure.financialImpact.disclaimer') }}
            </span>
            <h3>{{ $t('_configure.financialImpact.totalCostsOfCar') }}</h3>
            <div class="full-width">
              <div class="row">
                <span class="specification">{{ $t('_configure.financialImpact.consumerPriceCar') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(vehicleDetails['retail_price_902']) }}</span>
                </span>
              </div>
              <div class="row">
                <span class="specification">{{ $t('_configure.financialImpact.totalAmountOptions') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(carOrderDetailsById['totalOptionsPrice']) }}</span>
                </span>
              </div>
              <div class="row">
                <span class="specification">{{ $t('_configure.financialImpact.totalAmountAccessories') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(carOrderDetailsById['totalAccessoriesPrice']) }}</span>
                </span>
              </div>
              <div class="row" v-if="currentUserDetails['privateUse']">
                <span class="specification">{{ $t('_configure.financialImpact.fiscalValue') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(carOrderDetailsById['fiscalValue']) }}</span>
                </span>
              </div>
              <div class="row" v-if="currentUserDetails['privateUse']">
                <span class="specification">{{ $t('_configure.financialImpact.fiscalTaxAddition') }}</span>
                <span class="price">
                  <span class="icon"></span>
                  <span class="amount">{{ carOrderDetailsById['fiscalTax'] }}%</span>
                </span>
              </div>
            </div>
            <h3>{{ $t('_configure.financialImpact.calculateNetMonthlyCosts') }}</h3>
            <div class="full-width">
              <div class="row">
                <span class="specification">{{ $t('_configure.financialImpact.incomeTax') }}</span>
                <span class="price">
                  <span class="icon"></span>
                  <span class="amount" v-if="currentUserDetails['incomeTax']['incomeTaxPercent']"
                    >{{ ConvertToCommas(currentUserDetails['incomeTax']['incomeTaxPercent'].toString()) }}%</span
                  >
                </span>
              </div>
              <div class="row big-space">
                <span class="specification">{{ $t('_configure.financialImpact.privateUse') }}</span>
                <span class="price">
                  <span class="icon"></span>
                  <span class="amount" v-if="currentUserDetails['privateUse']">{{
                    $t('_configure.financialImpact.yes')
                  }}</span>
                  <span class="amount" v-else>{{ $t('_configure.financialImpact.no') }}</span>
                </span>
              </div>
              <div class="row big-space bold">
                <span class="specification">{{ $t('_configure.financialImpact.budgetUserPerMonth') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span
                    class="amount"
                    v-if="
                      currentUserDetails['leaseCategory']['multipleFuelTypesAmount'] &&
                      currentUserDetails['leaseCategory']['multipleFuelTypesAmount'].length
                    "
                  >
                    <span
                      v-for="(item, index) in currentUserDetails['leaseCategory']['multipleFuelTypesAmount']"
                      :key="index"
                    >
                      <span v-if="item['fuelType'] == vehicleDetails['fuel_type_8702']">
                        {{ formatCurrency(item['amount']) }}
                      </span>
                    </span>
                  </span>
                  <span class="amount" v-else>{{ formatCurrency(currentUserDetails['leaseCategory']['amount']) }}</span>
                </span>
              </div>
              <div class="row">
                <span class="specification sub-field">{{ $t('_configure.financialImpact.leaseRate') }}</span>
                <span class="price">
                  <span class="icon sub-field normal-font-block">€</span>
                  <span class="amount sub-field normal-font-block">{{
                    formatCurrency(carOrderDetailsById['totalLeaseRateWithoutFuelAdvance'])
                  }}</span>
                </span>
              </div>
              <div class="row">
                <span class="specification sub-field">{{ $t('_configure.financialImpact.fuelAdvance') }}</span>
                <span class="price">
                  <span class="icon sub-field normal-font-block">€</span>
                  <span class="amount sub-field normal-font-block">{{
                    formatCurrency(carOrderDetailsById['fuelAdvance'])
                  }}</span>
                </span>
              </div>
              <div class="line total"></div>
              <div class="row">
                <span class="specification">{{ $t('_configure.financialImpact.totalLeaseRate') }}</span>
                <span class="price">
                  <span class="icon normal-font-block">€</span>
                  <span class="amount normal-font-block">{{
                    formatCurrency(carOrderDetailsById['totalLeaseRate'])
                  }}</span>
                </span>
              </div>
              <div class="line"></div>
              <div class="row big-space bold">
                <span class="specification">{{ $t('_configure.financialImpact.variableContribution') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(carOrderDetailsById['variableContribution']) }}</span>
                </span>
              </div>
              <div class="row" v-if="currentUserDetails['privateUse']">
                <span class="specification">{{ $t('_configure.financialImpact.fixedContribution') }}</span>
                <span class="price">
                  <span class="icon normal-font-block">€</span>
                  <span class="amount normal-font-block">{{
                    formatCurrency(carOrderDetailsById['personalContribution'])
                  }}</span>
                </span>
              </div>
              <div class="line"></div>
              <div class="row bold">
                <span class="specification">{{ $t('_configure.financialImpact.netMonthlyCosts') }}</span>
                <span class="price">
                  <span class="icon">€</span>
                  <span class="amount">{{ formatCurrency(carOrderDetailsById['netMonthlyCost']) }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="confirm-block">
            <div class="checkbox-wrapper">
              <!-- checkbox -->
              <Checkbox theme="step4" :item="checkboxes[1]" :isChecked="checkboxes[1]['isActive']">
                <template v-slot:value>{{ $t('_configure.financialImpact.checkboxText') }}</template>
              </Checkbox>
            </div>
            <span class="sub-text">
              {{ $t('_configure.financialImpact.endDisclaimer') }}
            </span>
            <span class="error-message" v-if="checkboxesErrors['financialImpactError']">
              {{ $t('_errorCodes.requiredError') }}
            </span>
          </div>
        </div>
      </toggleableContent>
      <toggleableContent id="documentSection">
        <template v-slot:header> {{ $t('_configure.carPolicyDocument.title') }} </template>
        <div class="options-wrap">
          <div class="car-policy-doc">
            <!-- <span class="disclaimer">
              {{ $t('_configure.carPolicyDocument.disclaimer') }}
            </span> -->
            <div class="full-width">
              <Button
                :text="$t('_configure.carPolicyDocument.downloadButton')"
                class="download"
                buttonType="grey arrow--rightDown"
                @onClick="downloadCarPolicyDocument"
              />
              <Checkbox theme="step4" :item="checkboxes[2]" :isChecked="checkboxes[2]['isActive']">
                <template v-slot:value>{{ $t('_configure.carPolicyDocument.checkboxText') }}</template>
                <span class="error-message" v-if="checkboxesErrors['documentError']">
                  {{ $t('_errorCodes.requiredError') }}
                </span>
              </Checkbox>
            </div>
            <div class="confirm-block">
              <Button :text="$t('_configure.approve')" @onClick="approveCarOrder(2)" buttonType="dark arrow--right" />
              <span class="sub-text last">
                {{ $t('_configure.carPolicyDocument.endDisclaimer') }}
              </span>
            </div>
          </div>
        </div>
      </toggleableContent>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from 'vue'
import formatCurrency from '@/filters/CurrencyFormatWithCurrencyHidden'
import BackButton from '@/components/UI/BackButton.vue'
import ToggleableContent from '@/components/toggleableContent.vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import Button from '@/components/UI/Button.vue'
import { ActionTypes } from '@/store/options/actions'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { VueCookieNext } from 'vue-cookie-next'
import Loader from '@/components/UI/Loader.vue'
import ConvertToCommas from '@/filters/ConvertToCommas'
import getTranslatedFuelType from '@/filters/getTranslatedFuelType'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import { mandatoryAccessoriesType } from '@/types'
export default defineComponent({
  components: {
    BackButton,
    ToggleableContent,
    Checkbox,
    Button,
    Loader
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const carOrderDetailsById = computed(() => store.state.options.carOrderDetailsById)
    const vehicleDetails = computed(() => store.state.options.carOrderDetailsById.vehicleDetails)
    const carOrderLoader = computed(() => store.state.options.carOrderLoader)
    const currentUserDetails = computed(() => store.state.auth.currentUser)
    const filteredColorsOptions = reactive({ value: [] })
    const carOrderAdd = reactive({
      vehicleId: route.params.vehicleId,
      monthlyCost: 13.74,
      carPrice: 12.25,
      chargingFacilities: [] as mandatoryAccessoriesType[]
    })
    const checkboxesErrors = reactive({})
    const checkboxes = reactive([
      { id: 0, isActive: false },
      { id: 1, isActive: false },
      { id: 2, isActive: false }
    ])
    onMounted(async () => {
      await store.dispatch(ActionTypes.GET_CARORDERBYID, {
        id: JSON.parse(VueCookieNext.getCookie('latestcarOrderId'))
      })
      const noDuplicatesObject = {}
      filteredColorsOptions.value = carOrderDetailsById.value['options']
        .map((item) => {
          return [item, ...item['children']]
        })
        .flat()
        .filter((obj) => !noDuplicatesObject[obj.optionId] && (noDuplicatesObject[obj.optionId] = true))
    })
    const scrollToSection = (sectionId) => {
      const element = document.querySelector(`#${sectionId}`) as HTMLElement
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
    const validateCheckboxes = () => {
      delete checkboxesErrors['specificationError']
      delete checkboxesErrors['financialImpactError']
      delete checkboxesErrors['documentError']
      let sectionId = ''
      if (!checkboxes[0]['isActive']) {
        checkboxesErrors['specificationError'] = 'required'
        sectionId = 'specificationSection'
      }
      if (!checkboxes[1]['isActive']) {
        checkboxesErrors['financialImpactError'] = 'required'
        if (!sectionId) {
          sectionId = 'financialSection'
        }
      }
      if (!checkboxes[2]['isActive']) {
        checkboxesErrors['documentError'] = 'required'
        if (!sectionId) {
          sectionId = 'documentSection'
        }
      }
      if (Object.getOwnPropertyNames(checkboxesErrors).length === 0) {
        return true
      } else {
        scrollToSection(sectionId)
      }
    }
    const approveCarOrder = async (status) => {
      if (validateCheckboxes()) {
        carOrderAdd['co2Emission'] = vehicleDetails.value.combined_62203
        carOrderAdd['options'] = carOrderDetailsById.value.options
        carOrderAdd['otherAccessories'] = carOrderDetailsById.value.otherAccessories
        carOrderAdd['mandatoryAccessories'] = carOrderDetailsById.value.mandatoryAccessories
        carOrderAdd['chargingFacilities'] = carOrderDetailsById.value.chargingFacilities
        carOrderAdd['status'] = status
        await store.dispatch(ActionTypes.ADD_CARORDER, { carOrderData: carOrderAdd })
      }
    }
    const downloadCarPolicyDocument = () => {
      store.dispatch(carPolicyActionTypes.DOWNLOAD_CARPOLICYDOCUMENT, {
        companyId: VueCookieNext.getCookie('companyId'),
        carPolicyId: VueCookieNext.getCookie('employeeCarPolicyId')
      })
    }
    const groupByColors = (choice) => {
      return filteredColorsOptions.value.filter((item) => item['category'] == choice)
    }
    const groupByOptions = () => {
      return filteredColorsOptions.value.filter(
        (item) => item.category != 'Exterior colour' && item.category != 'Interior colour'
      )
    }
    return {
      checkboxes,
      formatCurrency,
      carOrderDetailsById,
      carOrderLoader,
      ConvertToCommas,
      vehicleDetails,
      getTranslatedFuelType,
      getTranslatedBodyType,
      currentUserDetails,
      approveCarOrder,
      checkboxesErrors,
      downloadCarPolicyDocument,
      groupByColors,
      groupByOptions
    }
  }
})
</script>
<style lang="sass" scoped>
.main-wrap
  display: flex
  flex-direction: column
  @media screen and (max-width: $mdBreakpoint)
    padding-bottom: 8em
  .step-wrap.hide-on-desktop
    @media screen and (max-width: $mdBreakpoint)
      display: none
  .step4
    display: flex
    justify-content: space-between
    @media screen and (max-width: $mdBreakpoint)
      padding: 1.5em 15px !important
  .step1, .step2, .step3
    justify-content: space-between
    &:before
      background-color: $colorHubbleGreyLines
      color: $colorWhite
  .nested-block
    flex: 4
    display: flex
    flex-direction: column
    .nested-inner-block
      display: flex
      margin-bottom: 5px
      i
        margin-right: 0.2em
  .step-wrap
    background-color: $colorWhite
    border-radius: 5px
    margin: 0 0 0.3em 0
    box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
    &:before
      @media screen and (max-width: $mdBreakpoint)
        left: 15px
    .checked
      @include backgroundImage('checkmark.png')
      background-color: $colorHubbleDarkGreen
      width: 1.5em
      height: 1.5em
      border-radius: 100%
  .step4
    margin: 0
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    h4
      font-size: 18px
      margin: 1em 0
      @media screen and (max-width: $mdBreakpoint)
        font-size: 15px
        padding-left: 2.5em
    .mobile-back
      @media screen and (min-width: $mdBreakpoint)
        display: none
  .options-wrap
    margin: 2rem 3.3rem 3rem 3rem
    &.column
      display: flex
      flex-direction: column
    @media screen and (max-width: $mdBreakpoint)
      margin: 1.4em 1em 2.1em 10px
    span.price
      font-size: 14px
    h3
      font-size: 1.6em
      color: $colorHubble
      border-bottom: 1px solid $colorHubbleGreyIcons
      padding-bottom: 0.3em
      margin: 0 0 1.1em 0.3em
    .full-width
      display: flex
      flex-direction: column
      width: 100%
      max-width: 639px
      margin-left: 0.3rem
      position: relative
      .row
        display: flex
        flex-direction: row
        margin-bottom: 5px
        &:last-child
          margin-bottom: 30px
        span
          font-size: 1.4rem
          line-height: 2.2rem
        .options
          display: flex
          flex-direction: column
          flex: 4
          .option
            display: flex
            margin-bottom: 5px
            &:last-child
              margin-bottom: 0
        .accessories
          display: flex
          flex-direction: column
          flex: 4
          .accessory
            display: flex
            margin-bottom: 5px
            &:last-child
              margin-bottom: 0
        .specification
          display: flex
          flex: 2
          color: $colorHubbleDarkGrey
        .sub-field
          font-style: italic
        .normal-font-block
            font-weight: 400
        .value-wrapper
          display: flex
          flex-direction: column
        .value
          display: flex
          flex: 3
          font-family: 'Lato'
          font-weight: 700
          i
            font-style: normal
        .sub-value
          display: flex
          font-size: 1.3rem
          align-items: center
          color: $colorHubbleDarkGrey
          &:before
            display: flex
            content: '-'
            margin-right: 8px
        .price
          display: flex
          flex: 1
          justify-content: flex-end
          font-family: 'Lato'
          font-weight: 700
          .icon
            width: 13px
            margin-right: 8px
          .amount
            display: flex
            justify-content: flex-end
            width: 72px
    .confirm-block
      display: flex
      flex-direction: column
      border-top: 1px solid $colorHubbleGreyIcons
      padding-top: 15px
      position: relative
      .error-message
        margin-left: calc(0.5rem + 2.4em)
        font-size: 12px
      span
        font-size: 1.4rem
      .checkbox-wrapper
        display: flex
        flex-direction: row
      .sub-text
        margin-left: calc(0.5rem + 2.4em)
        color: $colorHubbleDarkGrey
        &.last
          margin-left: 20px
    .disclaimer
      display: flex
      margin-left: 0.3em
      font-size: 1.4rem
      color: $colorHubbleDarkGrey
      margin-bottom: 20px
      width: 100%
      max-width: 639px
    .financial-impact
      .full-width
        .row
          justify-content: space-between
          &:last-child
            margin-bottom: 20px
          .specification
        .big-space
          margin-bottom: 20px
        .bold
          font-weight: 700
        .line
          margin: 10px 0
          border-top: 1px solid $colorHubbleGreyIcons
          &.total
            margin: 5px 0
    .car-policy-doc
      .full-width
        display: flex
        width: 100%
        max-width: 100%
        border-top: 1px solid $colorHubbleGreyIcons
        border-bottom: 1px solid $colorHubbleGreyIcons
        padding: 20px 0 30px 0
        .download
          display: flex
          max-width: 194px
          padding: 1.35rem 1.9rem 1.35rem 2rem
          margin-bottom: 30px
      .confirm-block
        display: flex
        flex-direction: row
        align-items: center
        border-top: none
        margin-top: 15px
</style>
