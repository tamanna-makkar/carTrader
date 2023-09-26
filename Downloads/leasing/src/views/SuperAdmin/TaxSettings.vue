<template>
  <div class="company-details-wrap">
    <div class="left-area">
      <div class="employee-text">
        <h1>{{ $t('_companies.taxSettings') }}</h1>
      </div>
      <div class="save-employee">
        <Button :text="$t('_generalTerms.save')" buttonType="dark" @onClick="saveTaxSettings" />
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardTaxSettings" />
      </div>
    </div>
    <div class="center-area">
      <div class="tabs-area">
        <Tabs :tabs="tabs" @selectedTab="selectedTab" tabsOf="taxSettings">
          <tab :selected="selectedTabName == new Date().getFullYear()">
            <div v-if="!loader">
              <div class="sub-wrap">
                <div class="error-message-block" v-if="Array.isArray(taxSettingErrors) && taxSettingErrors.length > 1">
                  <div v-for="(item, index) in taxSettingErrors" :key="index">{{ $t(`_errorCodes.${item}`) }}</div>
                </div>
                <div class="error-message-block" v-else-if="taxSettingErrors">
                  {{ $t(`_errorCodes.${taxSettingErrors}`) }}
                </div>
                <TaxSettingsPerYear
                  :bpmTaxSettings="bpmTaxSettings.value"
                  :plugInInfo="plugInInfo.value"
                  :electricInfo="electricInfo.value"
                  :dieselSurtaxSettings="dieselSurtaxSettings"
                  :fiscalTaxSettings="fiscalTaxSettings.value"
                  :incomeTaxSettings="incomeTaxSettings.value"
                  :settingsErrors="settingsErrors.value"
                  @addFacility="addFacility"
                  @deleteFacility="deleteFacility"
                  @onColumnInput="onColumnInput"
                  @onUpdateDieselSurtax="onUpdateDieselSurtax"
                />
              </div>
            </div>
            <div class="loader-block" v-else>
              <Loader />
            </div>
          </tab>
          <tab :selected="selectedTabName == new Date().getFullYear() + 1">
            <div v-if="!loader">
              <div class="listing-wrap">
                <div class="sub-wrap">
                  <TaxSettingsPerYear
                    :bpmTaxSettings="bpmTaxSettings.value"
                    :plugInInfo="plugInInfo.value"
                    :electricInfo="electricInfo.value"
                    :dieselSurtaxSettings="dieselSurtaxSettings"
                    :fiscalTaxSettings="fiscalTaxSettings.value"
                    :incomeTaxSettings="incomeTaxSettings.value"
                    :settingsErrors="settingsErrors.value"
                    @addFacility="addFacility"
                    @deleteFacility="deleteFacility"
                    @onColumnInput="onColumnInput"
                    @onUpdateDieselSurtax="onUpdateDieselSurtax"
                  />
                </div>
              </div>
            </div>
            <div class="loader-block" v-else>
              <Loader />
            </div>
          </tab>
        </Tabs>
      </div>
    </div>
  </div>
  <transition name="fade">
    <info-popup v-if="isTaxSettingsAdded" @closePopup="closePopup">
      <template v-slot:header>{{ $t('_errorCodes.taxSettingsSaved') }}</template>
    </info-popup>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import Button from '@/components/UI/Button.vue'
import Loader from '@/components/UI/Loader.vue'
import InfoPopup from '@/components/UI/InfoPopup.vue'
import TaxSettingsPerYear from '@/components/TaxSettingsPerYear.vue'
import Tabs from '@/components/UI/Tabs.vue'
import tab from '@/components/UI/Tab.vue'
import { useRoute } from 'vue-router'
import { taxSettingsActionTypes } from '@/store/taxSettings/actions'
import { MutationTypes } from '@/store/taxSettings/mutations'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'External data',
  setup() {
    const store = useStore()
    const selectedRow = ref()
    const route = useRoute()
    const router = useRouter()
    const selectedTabName = ref(route.query.year ?? new Date().getFullYear())
    const loader = computed(() => store.state.taxSettings.loader)
    const taxSettingErrors = computed(() => store.state.taxSettings.taxSettingErrors)
    const tabs = reactive([
      { name: new Date().getFullYear(), isActive: Number(route.query.year) == new Date().getFullYear() },
      { name: new Date().getFullYear() + 1, isActive: Number(route.query.year) == new Date().getFullYear() + 1 }
    ])
    const getTaxSettingsByYear = computed(() => store.state.taxSettings.getTaxSettingsByYear)
    const isTaxSettingsAdded = computed(() => store.state.taxSettings.isTaxSettingsAdded)
    const bpmTaxSettings = reactive({
      value: [{ column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Passenger car' }]
    })
    const plugInInfo = reactive({
      value: [{ column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Plug-in hybrid car' }]
    })
    const electricInfo = reactive({
      value: [{ column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Electric car' }]
    })
    const fiscalTaxSettings = reactive({
      value: [{ co2Operator: '=', co2: 0, tax: 0, priceOperator: '<', price: 0, type: 'add' }]
    })
    const dieselSurtaxSettings = reactive([
      {
        co2: 0,
        surtax: 0
      }
    ])
    const incomeTaxSettings = reactive({
      value: [{ fromValue: 0, incomeTaxPercent: 0, incomeTaxPercentForCalculation: 0, type: 'add' }]
    })
    const filterAsPerType = (value, typeOfValues) => {
      const bpmTaxSettingsByYear = value
        .filter((item) => {
          return item.typeOf == typeOfValues
        })
        .map((item) => {
          return {
            column1: item.column1,
            column2: item.column2,
            column3: item.column3,
            column4: item.column4,
            typeOf: item.typeOf,
            type: 'delete'
          }
        })
      return bpmTaxSettingsByYear
    }
    const getTaxSettings = () => {
      // getBpmTax
      bpmTaxSettings.value = filterAsPerType(getTaxSettingsByYear.value.bpmTaxSettings, 'Passenger car')
      if (!bpmTaxSettings.value.length) {
        bpmTaxSettings.value = [
          { column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Passenger car' }
        ]
      } else {
        bpmTaxSettings.value[bpmTaxSettings.value.length - 1]['type'] = 'add'
      }
      // getPlugInHybrid
      plugInInfo.value = filterAsPerType(getTaxSettingsByYear.value.bpmTaxSettings, 'Plug-in hybrid car')
      if (!plugInInfo.value.length) {
        plugInInfo.value = [
          { column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Plug-in hybrid car' }
        ]
      } else {
        plugInInfo.value[plugInInfo.value.length - 1]['type'] = 'add'
      }
      // getElectricCar
      electricInfo.value = filterAsPerType(getTaxSettingsByYear.value.bpmTaxSettings, 'Electric car')
      if (!electricInfo.value.length) {
        electricInfo.value = [{ column1: 0, column2: 0, column3: 0, column4: 0, type: 'add', typeOf: 'Electric car' }]
      }
      // get dieselSurtax
      if (getTaxSettingsByYear.value.dieselSurtaxSettings.length) {
        dieselSurtaxSettings[0].co2 = getTaxSettingsByYear.value.dieselSurtaxSettings[0]?.co2
        dieselSurtaxSettings[0].surtax = getTaxSettingsByYear.value.dieselSurtaxSettings[0]?.surtax
      } else {
        dieselSurtaxSettings[0].co2 = 0
        dieselSurtaxSettings[0].surtax = 0
      }
      // get fiscalTax
      fiscalTaxSettings.value = getTaxSettingsByYear.value.fiscalTaxSettings.map((item) => {
        return {
          co2: item.co2,
          co2Operator: item.co2Operator,
          price: item.price,
          priceOperator: item.priceOperator,
          tax: item.tax,
          type: 'delete'
        }
      })
      if (!fiscalTaxSettings.value.length) {
        fiscalTaxSettings.value = [{ co2Operator: '=', co2: 0, tax: 0, priceOperator: '<', price: 0, type: 'add' }]
      } else {
        fiscalTaxSettings.value[fiscalTaxSettings.value.length - 1]['type'] = 'add'
      }
      // get incomeTax
      incomeTaxSettings.value = getTaxSettingsByYear.value.incomeTaxSettings.map((item) => {
        return {
          fromValue: item.fromValue,
          incomeTaxPercent: item.incomeTaxPercent,
          incomeTaxPercentForCalculation: item.incomeTaxPercentForCalculation,
          type: 'delete'
        }
      })
      if (!incomeTaxSettings.value.length) {
        incomeTaxSettings.value = [
          { fromValue: 0, incomeTaxPercent: 0, incomeTaxPercentForCalculation: 0, type: 'add' }
        ]
      } else {
        incomeTaxSettings.value[incomeTaxSettings.value.length - 1]['type'] = 'add'
      }
    }
    const initializeRequest = async (query) => {
      if (route.name == 'taxSettings')
        await store.dispatch(taxSettingsActionTypes.GET_TAXSETTINGS, { year: query.year })
      getTaxSettings()
    }
    onMounted(async () => {
      await initializeRequest(route.query)
    })
    onUnmounted(() => {
      store.commit(MutationTypes.SET_TAXSETTINGS_ERROR, '')
    })
    watch(
      () => route.query,
      () => {
        initializeRequest(route.query)
      }
    )
    const discardTaxSettings = async () => {
      await store.dispatch(taxSettingsActionTypes.GET_TAXSETTINGS, { year: route.query.year })
      getTaxSettings()
    }
    const validateFloat = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = /^\d+([\,]\d+)*([\.]\d+)?$/gm
      return regex.test(value)
    }
    const settingsErrors = reactive({
      value: {}
    })
    const validateValue = () => {
      delete settingsErrors.value['hasError']
      delete settingsErrors.value['plugInErrors']
      delete settingsErrors.value['electricCarError']
      delete settingsErrors.value['dieselSurtaxError']
      delete settingsErrors.value['fiscalTaxError']
      delete settingsErrors.value['incomeTaxError']
      delete settingsErrors.value['incomeTaxRangeError']
      bpmTaxSettings.value.forEach((item) => {
        if (
          (item.column1 && !validateFloat(item.column1)) ||
          (item.column2 && !validateFloat(item.column2)) ||
          (item.column3 && !validateFloat(item.column3)) ||
          (item.column4 && !validateFloat(item.column4))
        ) {
          settingsErrors.value['hasError'] = 'required'
        }
      })
      plugInInfo.value.forEach((item) => {
        if (
          (item.column1 && !validateFloat(item.column1)) ||
          (item.column2 && !validateFloat(item.column2)) ||
          (item.column3 && !validateFloat(item.column3)) ||
          (item.column4 && !validateFloat(item.column4))
        ) {
          settingsErrors.value['plugInErrors'] = 'required'
        }
      })
      electricInfo.value.forEach((item) => {
        if (
          (item.column1 && !validateFloat(item.column1)) ||
          (item.column2 && !validateFloat(item.column2)) ||
          (item.column3 && !validateFloat(item.column3)) ||
          (item.column4 && !validateFloat(item.column4))
        ) {
          settingsErrors.value['electricCarError'] = 'required'
        }
      })
      if (
        (dieselSurtaxSettings[0].co2 && !validateFloat(dieselSurtaxSettings[0].co2)) ||
        (dieselSurtaxSettings[0].surtax && !validateFloat(dieselSurtaxSettings[0].surtax))
      ) {
        settingsErrors.value['dieselSurtaxError'] = 'required'
      }
      fiscalTaxSettings.value.forEach((item) => {
        if (
          (item.co2 && !validateFloat(item.co2)) ||
          (item.tax && !validateFloat(item.tax)) ||
          (item.price && !validateFloat(item.price))
        ) {
          settingsErrors.value['fiscalTaxError'] = 'required'
        }
      })
      incomeTaxSettings.value.forEach((item, index) => {
        if (
          (item.incomeTaxPercentForCalculation && !validateFloat(item.incomeTaxPercentForCalculation)) ||
          (item.incomeTaxPercentForCalculation && item.incomeTaxPercentForCalculation > 100)
        ) {
          settingsErrors.value['incomeTaxError'] = 'required'
        }

        if (item.fromValue && !validateFloat(item.fromValue)) {
          settingsErrors.value['incomeTaxError'] = 'required'
        } else if (
          item.fromValue &&
          index > 0 &&
          parseInt(item.fromValue.toString()) < parseInt(incomeTaxSettings.value[index - 1].fromValue.toString())
        ) {
          settingsErrors.value['incomeTaxRangeError'] = 'required'
        }
        if (
          (item.incomeTaxPercent && !validateFloat(item.incomeTaxPercent)) ||
          (item.incomeTaxPercent && item.incomeTaxPercent > 100)
        ) {
          settingsErrors.value['incomeTaxError'] = 'required'
        }
      })
      if (Object.getOwnPropertyNames(settingsErrors.value).length === 0) {
        return true
      }
    }
    const addFacility = (item) => {
      if (item['type'] == 'bpmTaxSettings') {
        selectedRow.value = bpmTaxSettings.value
      }
      if (item['type'] == 'plugInInfo') {
        selectedRow.value = plugInInfo.value
      }
      if (item['type'] == 'electricInfo') {
        selectedRow.value = electricInfo.value
      }
      if (item['type'] == 'bpmTaxSettings' || item['type'] == 'plugInInfo' || item['type'] == 'electricInfo') {
        selectedRow.value.push({
          column1: 0,
          column2: 0,
          column3: 0,
          column4: 0,
          type: 'add',
          typeOf: item.typeOf
        })
      }
      if (item['type'] == 'fiscalTaxSettings') {
        selectedRow.value = fiscalTaxSettings.value
        selectedRow.value.push({
          co2Operator: '=',
          co2: 0,
          tax: 0,
          priceOperator: '<',
          price: 0,
          type: 'add'
        })
      }
      if (item['type'] == 'incomeTaxSettings') {
        selectedRow.value = incomeTaxSettings.value
        selectedRow.value.push({
          fromValue: 0,
          incomeTaxPercent: 0,
          incomeTaxPercentForCalculation: 0,
          type: 'add'
        })
      }
      selectedRow.value[item['index']]['type'] = 'delete'
    }
    const deleteFacility = (item) => {
      if (item['type'] == 'bpmTaxSettings') {
        selectedRow.value = bpmTaxSettings.value
      }
      if (item['type'] == 'plugInInfo') {
        selectedRow.value = plugInInfo.value
      }
      if (item['type'] == 'electricInfo') {
        selectedRow.value = electricInfo.value
      }
      if (item['type'] == 'fiscalTaxSettings') {
        selectedRow.value = fiscalTaxSettings.value
      }
      if (item['type'] == 'incomeTaxSettings') {
        selectedRow.value = incomeTaxSettings.value
      }
      selectedRow.value.splice(item['index'], 1)
    }
    const onColumnInput = (option) => {
      if (option['type'] == 'bpmTaxSettings') {
        selectedRow.value = bpmTaxSettings.value
      }
      if (option['type'] == 'plugInInfo') {
        selectedRow.value = plugInInfo.value
      }
      if (option['type'] == 'electricInfo') {
        selectedRow.value = electricInfo.value
      }
      if (option['type'] == 'fiscalTaxSettings') {
        selectedRow.value = fiscalTaxSettings.value
      }
      if (option['type'] == 'incomeTaxSettings') {
        selectedRow.value = incomeTaxSettings.value
      }
      selectedRow.value[option['index']][option.keyName] = option['item']
    }
    const onUpdateDieselSurtax = (item) => {
      dieselSurtaxSettings[0][item.key] = item.value
    }
    const convertToNumber = (selectedOption) => {
      return parseFloat(selectedOption.replace(',', '.'))
    }
    const removeType = (type) => {
      const tempFacility = JSON.parse(JSON.stringify(type))
      tempFacility.forEach((item) => {
        if (item.column1) item.column1 = convertToNumber(item.column1.toString())
        else if (item.column1 == '') item.column1 = 0
        if (item.column2) item.column2 = convertToNumber(item.column2.toString())
        else if (item.column2 == '' && item.column2 !== 0) item.column2 = null
        if (item.column3) item.column3 = convertToNumber(item.column3.toString())
        else if (item.column3 == '') item.column3 = 0
        if (item.column4) item.column4 = convertToNumber(item.column4.toString())
        else if (item.column4 == '') item.column4 = 0
        if (item.co2) item.co2 = convertToNumber(item.co2.toString())
        else if (item.co2 == '') item.co2 = 0
        if (item.price) item.price = convertToNumber(item.price.toString())
        else if (item.price == '') item.price = 0
        if (item.tax) item.tax = convertToNumber(item.tax.toString())
        else if (item.tax == '') item.tax = 0
        if (item.surtax) item.surtax = convertToNumber(item.surtax.toString())
        else if (item.surtax == '') item.surtax = 0
        if (item.fromValue) item.fromValue = convertToNumber(item.fromValue.toString())
        else if (item.fromValue == '') item.fromValue = 0
        if (item.incomeTaxPercent) item.incomeTaxPercent = convertToNumber(item.incomeTaxPercent.toString())
        else if (item.incomeTaxPercent == '') item.incomeTaxPercent = 0
        if (item.incomeTaxPercentForCalculation)
          item.incomeTaxPercentForCalculation = convertToNumber(item.incomeTaxPercentForCalculation.toString())
        else if (item.incomeTaxPercentForCalculation == '') item.incomeTaxPercentForCalculation = 0
        delete item['type']
        if (
          (item.column1 == 0 && item.column2 == null) ||
          (item.column2 == 0 && item.column3 == 0 && item.column4 == 0)
        ) {
          delete item.column1
          delete item.column2
          delete item.column3
          delete item.column4
          delete item.typeOf
        }
        if (item.co2 == 0 && item.surtax == 0) {
          delete item.co2
          delete item.surtax
        }
        if (item.co2 == 0 && item.price == 0 && item.tax == 0) {
          delete item.co2
          delete item.price
          delete item.tax
          delete item.co2Operator
          delete item.priceOperator
        }
        if (item.fromValue == 0 && item.incomeTaxPercent == 0 && item.incomeTaxPercentForCalculation == 0) {
          delete item.fromValue
          delete item.incomeTaxPercent
          delete item.incomeTaxPercentForCalculation
        }
      })
      return tempFacility.filter((obj) => !(obj && Object.keys(obj).length === 0))
    }
    const saveTaxSettings = async () => {
      const taxData = {
        year: selectedTabName.value,
        bpmTaxSettings: removeType([...bpmTaxSettings.value, ...plugInInfo.value, ...electricInfo.value]),
        dieselSurtaxSettings: removeType(dieselSurtaxSettings),
        fiscalTaxSettings: removeType(fiscalTaxSettings.value),
        incomeTaxSettings: removeType(incomeTaxSettings.value)
      }
      if (validateValue()) {
        store.commit(MutationTypes.SET_TAXSETTINGS_ERROR, '')
        await store.dispatch(taxSettingsActionTypes.DELETE_TAXSETTINGS, { year: route.query.year })
        await store.dispatch(taxSettingsActionTypes.POST_TAXSETTINGS, taxData)
      }
    }
    const closePopup = () => {
      store.commit(MutationTypes.SET_ADDTAXSETTINGSSUCESS, false)
    }
    const selectedTab = (name) => {
      tabs.forEach((tab) => {
        tab.isActive = tab.name == name
      })
      selectedTabName.value = name
      const query = Object.assign({}, route.query, { year: name })
      router.push({ query })
    }
    return {
      loader,
      discardTaxSettings,
      saveTaxSettings,
      addFacility,
      onColumnInput,
      deleteFacility,
      bpmTaxSettings,
      plugInInfo,
      dieselSurtaxSettings,
      onUpdateDieselSurtax,
      fiscalTaxSettings,
      incomeTaxSettings,
      electricInfo,
      settingsErrors,
      getTaxSettingsByYear,
      isTaxSettingsAdded,
      closePopup,
      tabs,
      selectedTab,
      selectedTabName,
      taxSettingErrors
    }
  },
  components: {
    Button,
    Loader,
    InfoPopup,
    Tabs,
    tab,
    TaxSettingsPerYear
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.diesel-surtax-section
  .row
    margin: 2em 0 0 0
    display: flex
    max-width: 351px
    .half-width
      position: relative
      height: 52px
      &:first-child
        margin-right: 4em
.income-tax-settings
  .inner-section
    display: flex
    @media screen and (max-width: $mdBreakpoint)
      flex-direction: column
    .left-section
      flex: 1
      @media screen and (max-width: $mdBreakpoint)
        margin-right: 0 !important
      margin-right: 12em !important
      .row
        @media screen and (max-width: $mdBreakpoint)
          flex-direction: column
      .input-block
        height: 52px
        margin-right: 20px
        @media screen and (max-width: $mdBreakpoint)
          margin: 0 0 2em 0
          height: 54px
          flex: initial
          width: 100%
    .notes-section
      flex: 1
.income-tax-settings, .fiscal-tax-details
  h2
    margin: 1.2em 0 2em 0
  .row
    display: flex
    margin: 0 0 5.5em 0
    align-items: flex-end
    &:last-child
      margin: 0
.fiscal-tax-details
  .row
    @media screen and (max-width: $mdBreakpoint)
      flex-direction: column
    .column
      display: flex
      position: relative
      flex: 2
      margin-right: 1.7em
      height: 52px
      &:last-child
        margin-right: 0
      @media screen and (max-width: $mdBreakpoint)
        height: 54px
        flex: initial
        margin: 0 0 2em 0
        width: 100%
      label
        font-size: 16px
        color: $colorHubbleDarkGrey
        position: absolute
        left: 0
      .dropdown-block
        align-self: flex-end
        flex: 1
        .dropdown
          margin-left: 0
      .input-block
        flex: 3
.button-wrap
  display: flex
  justify-content: center
  flex: 1
  margin: 7em 0
.tabs-area
  background: #fff
  box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
  border-radius: 10px
  padding: 3em 0 4em
  margin: 1.5em 0
.company-details-wrap
  display: flex
  position: relative
  flex: 1
  @media screen and (max-width: $xxlBreakpoint)
    padding: 0 15px
    flex-direction: column
  h1, h2
    color: $colorHubble
  .center-area
    display: flex
    max-width: 970px
    margin: 5em auto 0 auto
    width: 100%
    z-index: 1
    flex-direction: column
    @media screen and (max-width: $xxlBreakpoint)
      margin: 3em auto 0 auto
  .left-area
    position: absolute
    left: 0
    @media screen and (max-width: $xxlBreakpoint)
      position: relative
      margin: 2em 0 0
    .employee-text
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
    .save-employee
      margin: 2em 0 0
      @media screen and (max-width: $mdBreakpoint - 1)
        button
          font-size: 12px
      button.dark:not(.checked)
        padding: 0.9em 1.4em
      button.light
        padding: 0.9em 1.4em
        margin: 0.7em 0
.error-message-block
  color: $colorHubbleRed
  font-size: 12px
  padding: 1em 0 0 2.5em
</style>
