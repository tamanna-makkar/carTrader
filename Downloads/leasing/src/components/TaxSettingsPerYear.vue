<template>
  <div class="wrapping">
    <div class="details-inner-wrap">
      <div class="select-year-block">
        <h2>
          {{ $t('_taxSettings.bpmTables') }}
          <div class="info">
            <div class="info-wrap" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
              <i class="info-icon"></i>
            </div>
            <transition name="fade" v-if="activeOption">
              <Tooltip type="TaxInfo">
                <div class="tax-info">
                  <p>Explanation of the columns:</p>
                  <ul>
                    <li>Column I: CO2 emissions from</li>
                    <li>Column II: CO2 emissions up to</li>
                  </ul>
                  <p>Calculate the tax for a passenger car as follows:</p>
                  <ul>
                    <li>Subtract the value of column I from the CO2 emissions of the car</li>
                    <li>Multiply the result by the amount from column IV</li>
                    <li>Add the amount from column III here</li>
                  </ul>
                </div>
              </Tooltip>
            </transition>
          </div>
        </h2>
      </div>
      <div class="passenger-car-section inner-section">
        <div class="heading-block">
          <h3>{{ $t('_taxSettings.passengerCar') }}</h3>
          <span class="error-message" v-if="settingsErrors['hasError']">
            {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
          </span>
        </div>
        <addFacility
          :facility="bpmTaxSettings"
          @add="addFacility"
          @delete="deleteFacility"
          @onColumnInput="onColumnInput"
          type="bpmTaxSettings"
          typeOf="Passenger car"
          class="facility-wrap"
        >
        </addFacility>
      </div>
      <div class="electic-cars-section inner-section">
        <div class="heading-block">
          <h3>{{ $t('_taxSettings.plugCar') }}</h3>
          <span class="error-message" v-if="settingsErrors['plugInErrors']">
            {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
          </span>
        </div>
        <addFacility
          :facility="plugInInfo"
          @add="addFacility"
          @delete="deleteFacility"
          @onColumnInput="onColumnInput"
          type="plugInInfo"
          typeOf="Plug-in hybrid car"
          class="facility-wrap"
        >
        </addFacility>
      </div>
      <!-- <div class="electic-cars-section inner-section">
            <div class="heading-block">
                <h3>{{ $t('_taxSettings.electricCar') }}</h3>
                <span class="error-message" v-if="settingsErrors['electricCarError']">
                    {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
                </span>
            </div>
            <addFacility
                :facility="electricInfo"
                @add="addFacility"
                @delete="deleteFacility"
                @onColumnInput="onColumnInput"
                type="electricInfo"
                typeOf="Electric car"
                class="facility-wrap"
                >
            </addFacility>
        </div> -->
      <div class="diesel-surtax-section inner-section">
        <div class="heading-block">
          <h3>{{ $t('_taxSettings.dieselSurtax') }}</h3>
          <span class="error-message" v-if="settingsErrors['dieselSurtaxError']">
            {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
          </span>
        </div>
        <div class="row">
          <div class="half-width">
            <InputElement
              type="text"
              name="co2"
              :value="dieselSurtaxSettings[0]['co2']"
              @update:value="onUpdateDieselSurtax"
              currencyPlaceholder="gr/km"
              currencyPlaceholderPosition="right"
            >
              From > CO2
            </InputElement>
          </div>
          <div class="half-width">
            <InputElement
              type="text"
              name="surtax"
              :value="ConvertToCommas(dieselSurtaxSettings[0]['surtax'])"
              @update:value="onUpdateDieselSurtax"
              currencyPlaceholder="gr/km"
              currencyPlaceholderPosition="right"
            >
              Surtax
            </InputElement>
          </div>
        </div>
      </div>
    </div>
    <div class="details-inner-wrap fiscal-tax-details">
      <div class="heading-block">
        <h2>{{ $t('_taxSettings.fiscalTaxAddition') }}</h2>
      </div>
      <div class="inner-section">
        <div class="heading-block">
          <span class="error-message" v-if="settingsErrors['fiscalTaxError']">
            {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
          </span>
        </div>
        <div class="row" v-for="(item, index) in fiscalTaxSettings" :key="index">
          <div class="column">
            <label>{{ $t('_taxSettings.c02Emission') }} </label>
            <div class="dropdown-block">
              <Dropdown
                :items="operatorItems"
                :selectedOption="item['co2Operator']"
                @onChange="
                  onColumnInput({ item: $event, index: index, type: 'fiscalTaxSettings', keyName: 'co2Operator' })
                "
              />
            </div>
            <div class="input-block">
              <InputElement
                type="text"
                name="fuelValue"
                :value="item['co2']"
                @update:value="onColumnInput({ item: $event, index: index, type: 'fiscalTaxSettings', keyName: 'co2' })"
              >
              </InputElement>
            </div>
          </div>
          <div class="column">
            <div class="input-block">
              <InputElement
                type="text"
                name="fuelValue"
                :value="ConvertToCommas(item['tax'])"
                currencyPlaceholder="%"
                currencyPlaceholderPosition="right"
                @update:value="onColumnInput({ item: $event, index: index, type: 'fiscalTaxSettings', keyName: 'tax' })"
              >
                {{ $t('_taxSettings.taxAddition') }}
              </InputElement>
            </div>
          </div>
          <div class="column">
            <label>{{ $t('_taxSettings.capCosumerPrice') }} </label>
            <div class="dropdown-block">
              <Dropdown
                :items="operatorItems"
                :selectedOption="item['priceOperator']"
                @onChange="
                  onColumnInput({ item: $event, index: index, type: 'fiscalTaxSettings', keyName: 'priceOperator' })
                "
              />
            </div>
            <div class="input-block">
              <InputElement
                type="text"
                name="fuelValue"
                :value="ConvertToCommas(item['price'])"
                currencyPlaceholder="€"
                @update:value="
                  onColumnInput({ item: $event, index: index, type: 'fiscalTaxSettings', keyName: 'price' })
                "
              >
              </InputElement>
            </div>
          </div>
          <div class="button-wrap">
            <Button
              v-if="item['type'] == 'add'"
              :text="$t('_generalTerms.add')"
              class="add-button active"
              buttonType="light add--left"
              @onClick="addFacility({ index: index, type: 'fiscalTaxSettings' })"
            />
            <Button
              v-else
              :text="$t('_generalTerms.delete')"
              buttonType="light close--left"
              @onClick="deleteFacility({ index: index, type: 'fiscalTaxSettings' })"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="details-inner-wrap income-tax-settings">
      <h2>{{ $t('_taxSettings.incomeTaxSelection') }}</h2>
      <div class="heading-block">
        <span class="error-message" v-if="settingsErrors['incomeTaxError']">
          {{ $t('_errorCodes.onlyFloatAndNumbers') }}*
        </span>
        <span class="error-message" v-if="settingsErrors['incomeTaxRangeError']">
          {{ $t('_errorCodes.incomeRangeError') }}*
        </span>
      </div>
      <div class="inner-section">
        <div class="row" v-for="(item, index) in incomeTaxSettings" :key="index">
          <div class="column">
            <div class="input-block">
              <InputElement
                type="text"
                name="fromValue"
                :value="item['fromValue']"
                currencyPlaceholder="€"
                @update:value="
                  onColumnInput({ item: $event, index: index, type: 'incomeTaxSettings', keyName: 'fromValue' })
                "
              >
                {{ $t('_taxSettings.incomeFrom') }}
              </InputElement>
            </div>
          </div>
          <div class="column">
            <div class="input-block">
              <InputElement
                type="text"
                name="incomeTaxPercent"
                :value="ConvertToCommas(item['incomeTaxPercent'])"
                currencyPlaceholder="%"
                currencyPlaceholderPosition="right"
                @update:value="
                  onColumnInput({ item: $event, index: index, type: 'incomeTaxSettings', keyName: 'incomeTaxPercent' })
                "
              >
                {{ $t('_taxSettings.incomeTax') }}
              </InputElement>
            </div>
          </div>
          <div class="column">
            <div class="input-block">
              <InputElement
                type="text"
                name="incomeTaxPercentForCalculation"
                :value="ConvertToCommas(item['incomeTaxPercentForCalculation'])"
                currencyPlaceholder="%"
                currencyPlaceholderPosition="right"
                @update:value="
                  onColumnInput({
                    item: $event,
                    index: index,
                    type: 'incomeTaxSettings',
                    keyName: 'incomeTaxPercentForCalculation'
                  })
                "
              >
                {{ $t('_taxSettings.calculationTax') }}
              </InputElement>
            </div>
          </div>
          <div class="button-wrap">
            <Button
              v-if="item['type'] == 'add'"
              :text="$t('_generalTerms.add')"
              class="add-button active"
              buttonType="light add--left"
              @onClick="addFacility({ index: index, type: 'incomeTaxSettings' })"
            />
            <Button
              v-else
              :text="$t('_generalTerms.delete')"
              buttonType="light close--left"
              @onClick="deleteFacility({ index: index, type: 'incomeTaxSettings' })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import Button from '@/components/UI/Button.vue'
import addFacility from '@/components/addFacility.vue'
import InputElement from '@/components/UI/Input.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import Tooltip from '@/components/UI/Tooltip.vue'
import ConvertToCommas from '@/filters/ConvertToCommas'
import { taxSettingsType } from '@/types'
export default defineComponent({
  name: 'External data',
  props: {
    bpmTaxSettings: {
      type: Array as () => taxSettingsType[],
      default: () => []
    },
    plugInInfo: {
      type: Array as () => taxSettingsType[],
      default: () => []
    },
    electricInfo: {
      type: Array,
      default: () => []
    },
    dieselSurtaxSettings: {
      type: Array,
      default: () => []
    },
    fiscalTaxSettings: {
      type: Array,
      default: () => []
    },
    incomeTaxSettings: {
      type: Array,
      default: () => []
    },
    settingsErrors: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const activeOption = ref(false)
    const operatorItems = reactive(['<', '=', '>'])
    const addFacility = (item) => {
      emit('addFacility', item)
    }
    const deleteFacility = (item) => {
      emit('deleteFacility', item)
    }
    const onColumnInput = (option) => {
      emit('onColumnInput', option)
    }
    const onUpdateDieselSurtax = (value, key) => {
      emit('onUpdateDieselSurtax', { value: value, key: key })
    }
    return {
      addFacility,
      onColumnInput,
      deleteFacility,
      onUpdateDieselSurtax,
      operatorItems,
      activeOption,
      ConvertToCommas
    }
  },
  components: {
    Button,
    addFacility,
    InputElement,
    Dropdown,
    Tooltip
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.fiscal-tax-details .error-message
  top: -30px !important
.heading-block
  position: relative
  .error-message
    top: 75%
    width: max-content;
.tax-info
  p, ul li
    font-size: 14px
    color: $colorHubbleText
    font-family: 'Lato'
    font-weight: 400
  ul
    padding-left: 21px
    margin: 0 0 1em 0
.info-icon
  @include backgroundImage('white-info.svg')
  height: 1.5em
  width: 1.2em
  display: flex
  padding-right: 0.6em
  cursor: pointer
.passenger-car-section.inner-section
  margin: 2em 0 3em 0
  position: relative
.select-year-block
  display: flex
  h2
    flex: 2.5
    border-bottom: none !important
    margin-bottom: 0 !important
    display: flex
  .dropdown-block
    display: flex
    flex: 1
    align-items: center
    label
      font-size: 14px
      color: $colorHubbleDarkGrey
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
  .heading-block
    padding: 1.2rem 3em
    .error-message
      top: 0
.income-tax-settings, .fiscal-tax-details
  h2
    margin: 1.2em 0 2em 0
  .row
    display: flex
    margin: 0 0 5.5em 0
    align-items: flex-end
    &:last-child
      margin: 0
    @media screen and (max-width: $mdBreakpoint)
      margin: 0 0 3.5em 0
.fiscal-tax-details, .income-tax-settings
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
  flex: 1
  justify-content: flex-end
  .add-button
    color: $colorWhite
    pointer-events: none
  button
    height: 44px
    padding: 0.5em 1.5em
  .add-button.active
    pointer-events: visible
    color: $colorHubble
    &:before
      background-image: url(~@/assets/dark-plus.svg)
.inner-section
  margin: 0 0 3em 0
  padding: 0 3em
  &:last-child
    margin: 0
  h3
    font-size: 16px
    line-height: 26px
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
  .details-inner-wrap.fiscal-tax-details, .details-inner-wrap.income-tax-settings
    h2
      margin: 1.2em 0 2em 0
  .details-inner-wrap
    background: none
    border-radius: 0
    box-shadow: none
    padding: 0
    margin: 0 auto 3em auto
    h2
      margin: 1.2em 0 1em 0
      background: $colorHubble
      color: $colorWhite
      height: 45px
      display: flex
      align-items: center
      padding: 0 1.8em
      border-bottom: 0
    .half-width
      position: relative
</style>
