<template>
  <div class="wrap">
    <div class="main-wrap">
      <div class="step-wrap step1 common-step hide-on-desktop">
        <h4>{{ $t('_configure.carSelectorWizard') }}</h4>
        <span class="checked"></span>
      </div>
      <div class="step-wrap step2 common-step hide-on-desktop">
        <h4>{{ $t('_configure.pickYourCar') }}</h4>
        <span class="checked"></span>
      </div>
      <div>
        <div class="step-wrap step3 common-step active">
          <h4>{{ $t('_configure.configureYourCar') }}</h4>
          <div class="mobile-back">
            <BackButton @onBack="$router.go(-1)" />
          </div>
        </div>
        <div class="overlay-wrap">
          <div :class="{ overlay: loader, 'no-overlay': requiredChoicesTitles.length && showPopup }" />
          <div v-if="options">
            <!-- Exterior color -->
            <toggleableContent v-if="exteriorInterior['exteriorOptionC'] || exteriorInterior['exteriorOptionO']">
              <template v-slot:header> {{ $t('_configure.exteriorColour') }} </template>
              <div class="options-wrap">
                <div class="full-width">
                  <div v-for="(item, index) in exteriorInterior['exteriorOptionC']" :key="index" class="half-width">
                    <OptionsCheckboxes :id="item['optionId']" :packMembers="item['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(item)" :disabled="item['newState'] === 'conflicted' || carOrderedTrue || item['excludedColor'] || item['metallicEnabled'] === false"
                      :disableifRequired="enableSelectedOptions(item)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }}</i>
                        <i v-else>{{ item['titleEn'] }}</i>
                        <span class="code">({{ item['code'] }})</span>
                      </div>
                      <template v-if="item['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="item['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(item['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
              <div class="options-wrap" v-if="exteriorInterior['exteriorOptionO'].length">
                <h3>{{ $t('_configure.options') }}</h3>
                <div class="full-width">
                  <div v-for="(item, index) in exteriorInterior['exteriorOptionO']" :key="index" class="half-width">
                    <OptionsCheckboxes :id="item['optionId']" :packMembers="item['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(item)"
                      :disabled="item['newState'] === 'conflicted' || carOrderedTrue || item['schemaIds'] == '15201' || item['excludedColor']"
                      :disableifRequired="enableSelectedOptions(item)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }}</i>
                        <i v-else>{{ item['titleEn'] }}</i>
                        <span class="code">({{ item['code'] }})</span>
                      </div>
                      <template v-if="item['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="item['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(item['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
            </toggleableContent>
            <!-- Interior color -->
            <toggleableContent v-if="exteriorInterior['interiorOptionC'] || exteriorInterior['interiorOptionO']">
              <template v-slot:header> {{ $t('_configure.interiorColour') }} </template>
              <div class="options-wrap">
                <div class="full-width">
                  <div v-for="(item, index) in exteriorInterior['interiorOptionC']" :key="index" class="half-width">
                    <OptionsCheckboxes :id="item['optionId']" :packMembers="item['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(item)" :disabled="item['newState'] === 'conflicted' || carOrderedTrue || item['excludedColor']"
                      :disableifRequired="enableSelectedOptions(item)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }}</i>
                        <i v-else>{{ item['titleEn'] }}</i>
                        <span class="code">({{ item['code'] }})</span>
                      </div>
                      <template v-if="item['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="item['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(item['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
              <div class="options-wrap" v-if="exteriorInterior['interiorOptionO'].length">
                <h3>{{ $t('_configure.options') }}</h3>
                <div class="full-width">
                  <div v-for="(item, index) in exteriorInterior['interiorOptionO']" :key="index" class="half-width">
                    <OptionsCheckboxes :id="item['optionId']" :packMembers="item['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(item)"
                      :disabled="item['newState'] === 'conflicted' || carOrderedTrue || item['schemaIds'] == '17401' || item['excludedColor']"
                      :disableifRequired="enableSelectedOptions(item)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ item['titleNl'] }}</i>
                        <i v-else>{{ item['titleEn'] }}</i>
                        <span class="code">({{ item['code'] }})</span>
                      </div>
                      <template v-if="item['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="item['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(item['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
            </toggleableContent>
            <!-- packages -->
            <toggleableContent v-if="Object.keys(getPackagesAndOptions('P')).length    >    0">
              <template v-slot:header> {{ $t('_configure.packages') }} </template>
              <div v-for="(item, key, index) in getPackagesAndOptions('P')" :key="index" class="options-wrap">
                <h3>{{ $t(getTranslatedCategory(item[0]['category'])) }}</h3>
                <div class="full-width">
                  <div v-for="(option, index) in item" :key="index" class="half-width">
                    <OptionsCheckboxes :id="option['optionId']" :packMembers="option['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(option)" :disabled="option['newState'] === 'conflicted' || carOrderedTrue || option['excludedColor']"
                      :disableifRequired="enableSelectedOptions(option)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ option['titleNl'] }}</i>
                        <i v-else>{{ option['titleEn'] }}</i>
                        <span class="code">({{ option['code'] }})</span>
                      </div>
                      <ul v-if="option['packageInformation']" class="package-content">
                        <div v-if="$i18n.locale == 'nl'">
                          <li v-for="(packageItem, index) in option['packageInformation']['titleNl']" :key="index">
                            <span>{{ packageItem }}</span>
                          </li>
                        </div>
                        <div v-else>
                          <li v-for="(packageItem, index) in option['packageInformation']['titleEn']" :key="index">
                            <span>{{ packageItem }}</span>
                          </li>
                        </div>
                      </ul>
                      <ul v-if="option['packageContent']" class="package-content">
                        <li v-for="(packageItem, index) in option['packageContent'][$i18n.locale]" :key="index">
                          <span>{{ packageItem }}</span>
                        </li>
                      </ul>
                      <template v-if="option['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="option['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(option['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
            </toggleableContent>
            <toggleableContent v-if="Object.keys(getPackagesAndOptions('O')).length    >    0">
              <template v-slot:header> {{ $t('_configure.options') }} </template>
              <div v-for="(item, key, index) in getPackagesAndOptions('O')" :key="index" class="options-wrap">
                <h3>{{ $t(getTranslatedCategory(item[0]['category'])) }}</h3>
                <div class="full-width">
                  <div v-for="(option, index) in item" :key="index" class="half-width">
                    <!-- :disableifRequired="option['newState'] === 'required' || option['isPack']" -->
                    <OptionsCheckboxes :id="option['optionId']" :packMembers="option['packMembers']" @onCheck="onCheck"
                      :checked="getStatus(option)" :disabled="option['newState'] === 'conflicted' || carOrderedTrue || option['excludedColor']"
                      :disableifRequired="enableSelectedOptions(option)" :key="componentKey">
                      <div class="left-block" :class="{ 'half-block': item['price'] }">
                        <i v-if="$i18n.locale == 'nl'">{{ option['titleNl'] }}</i>
                        <i v-else>{{ option['titleEn'] }}</i>
                        <span class="code">({{ option['code'] }})</span>
                      </div>
                      <ul v-if="option['packageInformation']" class="package-content">
                        <div v-if="$i18n.locale == 'nl'">
                          <li v-for="(packageItem, index) in option['packageInformation']['titleNl']" :key="index">
                            <span>{{ packageItem }}</span>
                          </li>
                        </div>
                        <div v-else>
                          <li v-for="(packageItem, index) in option['packageInformation']['titleEn']" :key="index">
                            <span>{{ packageItem }}</span>
                          </li>
                        </div>
                      </ul>
                      <template v-if="option['isPack']" v-slot:info>
                        <span class="options">{{ $t('_configure.packageOption') }}</span>
                        <i class="info-icon"></i>
                      </template>
                      <template v-if="option['newState'] === 'required'" v-slot:mandatory>
                        <span class="options">{{ $t('_configure.mandatory') }}</span> <i class="info-icon"></i>
                      </template>
                      <template v-slot:price>
                        {{ formatCurrency(option['price']) }}
                      </template>
                    </OptionsCheckboxes>
                  </div>
                </div>
              </div>
            </toggleableContent>
            <toggleableContent>
              <template v-slot:header> {{ $t('_configure.accessories') }} </template>
              <div class="options-wrap">
                <div v-if="carPolicyId['mandatoryAccessories'] && carPolicyId['mandatoryAccessories'].length">
                  <h3>{{ $t('_configure.mandatoryAccessories') }}</h3>
                  <div class="mandatory-acc">
                    <div class="sub-wrap" v-for="(item, index) in carPolicyId['mandatoryAccessories']" :key="index">
                      <label> {{ item['accessory'] }} </label>
                      <span> € {{ item['price'] }} </span>
                    </div>
                  </div>
                </div>
                <h3>{{ $t('_configure.otherAccessories') }}</h3>
                <div class="charging-facility">
                  <AddChargingFacilities :othersAccessories="others.value" :step2Errors="otherAccessoriesErrors"
                    @add="addFacility" @delete="deleteFacility" @onNameInput="onNameInput" @onPriceInput="onPriceInput"
                    type="others" class="facility-wrap">
                  </AddChargingFacilities>
                </div>
                <div v-if="getCarsById && Object.keys(getCarsById).length && checkChargingFacility(carType)">
                  <h3>{{ $t('_configure.chargingFacility') }}</h3>
                  <Dropdown :chargingFacilityItems="carPolicyId['chargingFacility']" type="chargingfacility-dropdown"
                    :selectedChargingDropdownItems="selectedChargingFacility" @onChange="selectChargingFacility" />
                </div>
              </div>
            </toggleableContent>
            <div class="submit">
              <Button :text="$t('_configure.contiueToTheOrderProcess')" @onClick="continueToOrderProcess(1)"
                class="header_button" :buttonType="`dark arrow--right ${carOrderedTrue ? 'disabled' : ''}`"
                :disabled="NetMonthlyCostAndFlag.expensiveFlag" />
              <Button :text="$t('_configure.saveThisConfiguration')" @onClick="continueToOrderProcess(0)"
                class="header_button" :buttonType="`light arrow--right ${carOrderedTrue ? 'disabled' : ''}`"
                :disabled="NetMonthlyCostAndFlag.expensiveFlag" />
            </div>
          </div>
          <div v-if="!options && leaseRateError" class="lease-rate-error">
            <h3>{{ $t(`_step3.${leaseRateError}`) }}</h3>
          </div>
          <div class="loader-block" v-if="loader">
            <Loader />
          </div>
        </div>
      </div>
      <!-- Warning popup -->
      <Popup @onClick="onPopupClose" @onProceed="onProceed" :isRequiredPopup="true"
        :CloseButton="!requiredChoicesTitles.length"
        :isStateConflicted="requiredChoicesTitles.length ? checkConflictedOptions(requiredChoicesTitles[requiredChoiceIndex]) : false"
        @onClose="onClose" @revertSelectedOptions="revertSelectedOptions('conflictedRequiredOptions')"
        :isLoader="loader" v-if="(packMembersTitles.length || requiredChoicesTitles.length)">
        <div v-if="!loader" class="popup-inner-block">
          <div v-if="packMembersTitles.length" class="selected-pack">
            <h3>{{ packMembersPopUpTitle }}</h3>
            <div class="pack-members-wrap">
              <div v-for="(option, index) in packMembersTitles" :key="index" class="inner-block">
                <div class="left-block" :class="{ 'half-block': option['price'] }">
                  <span class="checked"></span>
                  <label v-if="$i18n.locale == 'nl'">{{ option['titleNl'] }}</label>
                  <label v-else>{{ option['titleEn'] }}</label>
                  <span class="code">({{ option['code'] }})</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="requiredChoicesTitles.length" class="required-choices"
            :class="{ required: packMembersTitles.length }">
            <h3>{{ $t('_step3.decisionNeededOnItems') }}</h3>
            <div class="options-wrap">
              <div class="full-width">
                <div v-for="(option, index) in requiredChoicesTitles[requiredChoiceIndex]" :key="index"
                  class="half-width">
                  <RadioButton :key="requiredChoiceIndex" :optionId="option['optionId']"
                    :packMembers="option['packMembers']" :checked="getStatus(option)" @onRadioClick="onRadioClick"
                    :disabled="option['newState'] === 'conflicted' || carOrderedTrue">
                    <div class="left-block" :class="{ 'half-block': option['price'] }">
                      <i v-if="$i18n.locale == 'nl'">{{ option['titleNl'] }}</i>
                      <i v-else>{{ option['titleEn'] }}</i>
                      <span class="code">({{ option['code'] }})</span>
                    </div>
                    <template v-slot:price>
                      {{ formatCurrency(option['price']) }}
                    </template>
                  </RadioButton>
                </div>
              </div>
            </div>
          </div>
          <div v-if="requiredChoicesTitles.length && checkConflictedOptions(requiredChoicesTitles[requiredChoiceIndex])"
            class="conflicted-options-overlay">
            <div class="options-wrap">
              <h3>{{ $t('_step3.sorryText') }}</h3>
              <p>{{ $t('_step3.lastSelectionReverted') }}</p>
            </div>
          </div>
        </div>
        <div v-else class="loading-block">
          <p>{{ $t('_step3.loading') }}</p>
        </div>
      </Popup>
      <!-- Comply car response -->
      <Popup :CloseButton="true" :isRequiredPopup="true" v-if="showComplyPopup" @onClick="closeComplyPopup"
        @onClose="closeComplyPopup">
        <div class="title h3">{{ $t('_step3.Car does not comply with the following settings') }}</div>
        <ul class="list-of-errors">
          <ul v-for="(option, index) in complyCarResponse" :key="index">
            <li>
              {{ $t(`_step3.${option}`) }}
            </li>
          </ul>
        </ul>
      </Popup>
      <Popup @onProceed="onProceedCarOrder" :CloseButton="false" :isRequiredPopup="true" v-if="showCarOrderPopup"
        @onClick="closeCarOrderPopup" @onClose="closeCarOrderPopup">
        <div class="h3 alert-heading">{{ $t('_generalTerms.saveConfiguration') }}</div>
        <RadioButton :key="requiredChoiceIndex" :optionId="1" @onRadioClick="onCarOrderRadioClick">
          <div class="left-block">
            <span class="code">{{ $t('_step3.updateCarOrder') }}</span>
          </div>
        </RadioButton>
        <RadioButton :key="requiredChoiceIndex" :optionId="2" @onRadioClick="onCarOrderRadioClick">
          <div class="left-block">
            <span class="code">{{    $t('_step3.saveCarOrder')    }}</span>
          </div>
        </RadioButton>
      </Popup>
      <Popup :CloseButton="true" :isRequiredPopup="true" v-if="NetMonthlyCostAndFlag.expensiveFlag && isExpensiveFlag"
        @onClick="closeExpensivePopup" @onClose="closeExpensivePopup" :centerPopup="true">
        <div class="title h4">{{ $t('_step3.budgetTooExpensive') }}</div>
      </Popup>
      <Popup :CloseButton="true" :isRequiredPopup="true" v-if="showConflictedOptionsPopup"
        @onClick="closeConflictedOptionsPopup" @onClose="closeConflictedOptionsPopup" :centerPopup="true">
        <div v-if="conflictedOptions.length" class="selected-pack">
          <h3>{{ $t('_step3.itemsRemoved') }}</h3>
          <div class="pack-members-wrap">
            <div v-for="(option, index) in conflictedOptions" :key="index" class="inner-block">
              <div class="left-block" :class="{ 'half-block': option['price'] }">
                <span class="checked"></span>
                <label v-if="$i18n.locale == 'nl'">{{ option['titleNl'] }}</label>
                <label v-else>{{ option['titleEn'] }}</label>
                <span class="code">({{ option['code'] }})</span>
              </div>
            </div>
          </div>
        </div>
      </Popup>
      <Popup :CloseButton="true" :isRequiredPopup="true" v-if="isColorsPopup && !requiredChoicesTitles.length"
        @onClick="closeColorsPopup" @onClose="closeColorsPopup" :centerPopup="true">
        <div class="title h4">{{ colorsMessage }}</div>
      </Popup>
      <!-- if any of the nestedOption is conflicted -->
      <Popup :isRequiredPopup="true" v-if="showConflictedNestedOptionsPopup"
        @onClick="closeConflictedNestedOptionsPopup" @onClose="closeConflictedNestedOptionsPopup" :centerPopup="true"
        :isStateConflicted="true" @revertSelectedOptions="revertSelectedOptions('conflictedNestedOptions')">
        <div class="popup-inner-block conflicted-nested-options-popup">
          <div class="options-wrap">
            <h3>{{ $t('_step3.sorryText') }}</h3>
            <p>{{ $t('_step3.lastSelectionReverted') }}</p>
          </div>
        </div>
      </Popup>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import toggleableContent from '@/components/toggleableContent.vue'
import { mandatoryAccessoriesType, step2ErrorsType } from '@/types'
import RadioButton from '@/components/UI/RadioButton.vue'
import formatCurrency from '@/filters/CurrencyFormat'
import Button from '@/components/UI/Button.vue'
import BackButton from '@/components/UI/BackButton.vue'
import OptionsCheckboxes from '@/components/UI/OptionsCheckboxes.vue'
import Loader from '@/components/UI/Loader.vue'
import { VueCookieNext } from 'vue-cookie-next'
import { AuthActionTypes } from '@/store/auth/actions'
import { ActionTypes } from '@/store/options/actions'
import { MutationTypes } from '@/store/options/mutations'
import { useStore } from '@/store'
import { reactive, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import Popup from '@/components/Popup.vue'
import AddChargingFacilities from '@/components/AddChargingFacilities.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import { useI18n } from 'vue-i18n'
import { USER_STATUS } from '@/composables/staticValues'
import toLowerCase from '@/filters/toLowerCase'

export default defineComponent({
  components: {
    toggleableContent,
    RadioButton,
    Button,
    BackButton,
    OptionsCheckboxes,
    Loader,
    Popup,
    AddChargingFacilities,
    Dropdown
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const componentKey = ref(0)
    const requiredChoiceIndex = ref(0)
    const showPopup = ref(false)
    const showCarOrderPopup = ref(false)
    const selectedCheckbox = ref('')
    const packMembers = ref()
    const updateCarOrderValue = ref(1)
    const carOrderStatus = ref(0)
    const isExpensiveFlag = ref(true)
    const showConflictedOptionsPopup = ref(false)
    const showConflictedNestedOptionsPopup = ref(false)
    const { t } = useI18n({ useScope: 'global' })
    const packMembersPopUpTitle = ref(t('_step3.itemsAdded'))
    const optionsResponse = computed(() => store.state.options.optionsResponse)
    const optionsResponseAsObject = computed(() => store.state.options.optionsResponseAsObject)
    const nestedOptions = computed(() => store.state.options.nestedOptions)
    const stateVehicleId = computed(() => store.state.options.vehicleId)
    const exteriorInterior = reactive({
      exteriorOptionC: [],
      exteriorOptionO: [],
      interiorOptionC: [],
      interiorOptionO: []
    })
    const others: { value: mandatoryAccessoriesType[] } = reactive({
      value: [
        { accessory: '', price: '', type: 'add' }
      ]
    })
    const convertToNumberAndFloat = (selectedOption) => {
      return selectedOption.replace(/,/g, '.')
    }
    const removeType = (type) => {
      const tempFacility = JSON.parse(JSON.stringify(type))
      tempFacility.forEach((item) => {
        delete item['type']
        if (!item.accessory || !item.price) {
          delete item['accessory']
          delete item['price']
        }
        if (item['price']) item['price'] = convertToNumberAndFloat(item['price'])
      })
      return tempFacility.filter((item) => !(item && Object.keys(item).length === 0))
    }
    const showComplyPopup = ref(false)
    const closeComplyPopup = () => {
      showComplyPopup.value = false
    }
    const closeCarOrderPopup = () => {
      showCarOrderPopup.value = false
    }
    const selectedOptions: Array<string> = []
    let optionsConfigurationData = sessionStorage.getItem('optionsConfigurationData')
      ? JSON.parse(sessionStorage.getItem('optionsConfigurationData') || '{}')
      : {
        selectedOptions: selectedOptions,
        requiredChoices: [],
        option: '',
        action: '',
        otherAccessories: [],
        chargingFacilities: [],
        userSelectedOptions: []
      }
    const isColorsPopup = ref(false)
    const initialize = async () => {
      // if new vehicleId entered and optionsConfiguration will be cleared
      if (sessionStorage.getItem('currentVehicleId')) {
        const getCurrentVehicleID = JSON.parse(sessionStorage.getItem('currentVehicleId'))
        if (getCurrentVehicleID && getCurrentVehicleID !== route.params.vehicleId) {
          optionsConfigurationData = {
            selectedOptions: selectedOptions,
            requiredChoices: [],
            option: '',
            action: '',
            otherAccessories: [],
            chargingFacilities: [],
            userSelectedOptions: []
          }
          sessionStorage.removeItem('nestedOptions')
          sessionStorage.removeItem('latestSelection')
        }
      }
      // 43366520210701
      // 809814620210101
      // 786165220210401
      // 433666
      sessionStorage.setItem('optionsConfigurationData', JSON.stringify(optionsConfigurationData))
      await store.dispatch(ActionTypes.GET_OPTIONS_CONFIGURATIONS, {
        vehicleId: route.params.vehicleId,
        selectedOptions: optionsConfigurationData,
        selectedCheckbox: selectedCheckbox.value,
        packMembers: packMembers.value,
      })
      if (document.getElementById('popup')) {
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
      }
      isExpensiveFlag.value = true
      isColorsPopup.value = false
      // if new vehicleId entered
      if (stateVehicleId.value)
        sessionStorage.setItem('currentVehicleId', JSON.stringify(stateVehicleId.value))
      // to track the option that just added
      const optionJustAdded = optionsConfigurationData['userSelectedOptions'][optionsConfigurationData['userSelectedOptions'].length - 1]
      sessionStorage.setItem('optionJustAdded', JSON.stringify([optionJustAdded]))
      if (!optionJustAdded) {
        sessionStorage.removeItem('optionJustAdded')
      }
      // check if any of the nestedOption is conflicted
      const getNestedOptions = Object.entries(nestedOptions.value)
      const allOptions = getNestedOptions.flat(2)
      const conflictedOptionsDetails = optionsResponse.value
        .filter(item => {
          return allOptions.indexOf(item['optionId'].toString()) !== -1 && item.newState == 'conflicted'
        })
        .map(function (item) {
          return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionID: item['optionId'].toString(), state: item.newState }
        })
      if (conflictedOptionsDetails.length) {
        showConflictedNestedOptionsPopup.value = true
      }
    }
    const loader = computed(() => store.state.options.optionsloader)
    const options = computed(() => store.state.options.options)
    const packagesAndOptions = computed(() => store.state.options.packagesAndOptions)
    const requiredChoicesTitles = computed(() => store.state.options.requiredChoicesTitles)
    const packMembersTitles = computed(() => store.state.options.packMembersTitles)
    const carPolicyId = computed(() => store.state.auth.carPolicyByID)
    const currentUserCarOrder = computed(() => store.state.auth.currentUser.carOrders)
    const complyCarResponse = computed(() => store.state.options.complyCarResponse)
    const getCarsById = computed(() => store.state.options.carsById.cars)
    const carType = computed(() => store.state.options.carsById.cars['type_48602'] || store.state.options.carsById.cars['fuel_type_8702'])
    const carOrderId = ref(route.params.carOrderId)
    const carOrderedTrue = computed(() => toLowerCase(store.state.auth.currentUser.userStatus) === USER_STATUS.CAR_ORDERED)
    const NetMonthlyCostAndFlag = computed(() => store.state.options.NetMonthlyCostAndFlag)
    const colorsFlag = computed(() => store.state.options.colorsFlag)
    const allSelectedOptions = computed(() => store.state.options.allSelectedOptions)
    const latestSelection = computed(() => store.state.options.latestSelection)
    const leaseRateError = computed(() => store.state.options.leaseRateError)
    const conflictedOptions = computed(() => store.state.options.conflictedOptions)
    const colorsMessage = computed(() => {
      let errMessage = ''
      if (!colorsFlag.value.interior && !colorsFlag.value.exterior) {
        errMessage = t('_step3.selectBothColor')
      } else if (colorsFlag.value.interior && !colorsFlag.value.exterior) {
        errMessage = t('_step3.selectExteriorColor')
      } else {
        errMessage = t('_step3.selectInteriorColor')
      }
      return errMessage
    })
    const selectedChargingFacility = ref()
    const carOrderAdd = reactive({
      vehicleId: route.params.vehicleId,
      monthlyCost: 13.74,
      carPrice: 12.25,
      chargingFacilities: [] as mandatoryAccessoriesType[]
    })
    const revertSelectedOptions = async (state) => {
      let latestSelection
      if (state == 'conflictedRequiredOptions')
        latestSelection = JSON.parse(sessionStorage.getItem('latestSelection'))
      else if (state == 'conflictedNestedOptions')
        latestSelection = JSON.parse(sessionStorage.getItem('optionJustAdded'))
      latestSelection.forEach((item) => {
        delete nestedOptions.value[item]
        const getNestedOptions = Object.entries(nestedOptions.value)
        optionsConfigurationData['selectedOptions'] = getNestedOptions.flat(2)
        if (optionsConfigurationData['userSelectedOptions'].indexOf(item) != -1)
          optionsConfigurationData['userSelectedOptions'].splice(optionsConfigurationData['userSelectedOptions'].indexOf(item), 1)
      })
      optionsConfigurationData['action'] = ''
      optionsConfigurationData['option'] = ''
      await initialize()
      if (state == 'conflictedRequiredOptions')
        store.state.options.latestSelection = []
      else if (state == 'conflictedNestedOptions')
        showConflictedNestedOptionsPopup.value = false
      document.body.classList.remove('modal-open')
      sessionStorage.removeItem('optionJustAdded')
    }
    const onPopupClose = () => {
      const selected = document.querySelector('input[type=radio][name=name]:checked')
      if (selected) {
        const selectedID = selected.id.replace('radio-', '')
        store.state.options.latestSelection.push(selectedID)
      }
      if (sessionStorage.getItem('latestSelection')) {
        revertSelectedOptions('conflictedRequiredOptions')
      }
      showPopup.value = false
      store.commit(MutationTypes.SET_REQUIRED_CHOICES_TITLES, [])
      store.commit(MutationTypes.SET_PACK_MEMBERS_TITLES, [])
      document.body.classList.remove('modal-open')
    }
    const closeExpensivePopup = () => {
      isExpensiveFlag.value = false
      document.body.classList.remove('modal-open')
    }
    const onClose = () => {
      showPopup.value = false
      store.commit(MutationTypes.SET_PACK_MEMBERS_TITLES, [])
      document.body.classList.remove('modal-open')
      packMembers.value = ''
    }
    const getExteriorInterior = (prop, type) => {
      let filteredExteriorInterior
      if (options.value) {
        const data = options.value?.[prop]
        filteredExteriorInterior = data?.filter((item) => item['type'] == type)
      }
      return filteredExteriorInterior
    }
    const groupByOptionsType = () => {
      const filteredExteriorOptionC = getExteriorInterior('exteriorColour', 'C')
      const filteredExteriorOptionO = getExteriorInterior('exteriorColour', 'O')
      const filteredInteriorOptionC = getExteriorInterior('interiorColour', 'C')
      const filteredInteriorOptionO = getExteriorInterior('interiorColour', 'O')
      exteriorInterior.exteriorOptionC = filteredExteriorOptionC
      exteriorInterior.exteriorOptionO = filteredExteriorOptionO
      exteriorInterior.interiorOptionC = filteredInteriorOptionC
      exteriorInterior.interiorOptionO = filteredInteriorOptionO
    }
    const getCarPolicyById = async () => {
      await store.dispatch(AuthActionTypes.GET_CARPOLICY_BY_ID, {
        companyId: VueCookieNext.getCookie('companyId'),
        carPolicyId: VueCookieNext.getCookie('employeeCarPolicyId')
      })
    }
    const otherAccessoriesErrors: Array<step2ErrorsType> = reactive([{
      facilityError: '',
      priceError: ''
    }])
    onMounted(async () => {
      await initialize()
      await groupByOptionsType()
      await getCarPolicyById()
      selectedChargingFacility.value = carPolicyId.value?.chargingFacility[0]
      if (optionsConfigurationData['chargingFacilities'].length) {
        selectedChargingFacility.value.chargingFacility = optionsConfigurationData['chargingFacilities'][0]['accessory']
        selectedChargingFacility.value.price = optionsConfigurationData['chargingFacilities'][0]['price']
      }
      if (optionsConfigurationData['otherAccessories'].length) {
        Array.prototype.unshift.apply(others.value, optionsConfigurationData['otherAccessories'])
        for (let i = 0; i < optionsConfigurationData['otherAccessories'].length; i++) {
          otherAccessoriesErrors.unshift({
            facilityError: '',
            priceError: ''
          })
        }
      }
    })
    const checkIfEqual = (array1, array2) => {
      if (array1.length === array2.length) {
        return array1.every((element, index) => {
          if (element === array2[index]) {
            return true
          }
          return false
        });
      }
      return false;
    }
    watch(
      () => _.cloneDeep(options.value),
      () => {
        groupByOptionsType()
      }
    )
    watch(
      () => _.cloneDeep(requiredChoicesTitles.value),
      () => {
        requiredChoiceIndex.value = 0
      }
    )
    watch(
      () => route.params.vehicleId,
      () => {
        sessionStorage.removeItem('optionsConfigurationData')
        sessionStorage.removeItem('nestedOptions')
        sessionStorage.removeItem('latestSelection')
        sessionStorage.removeItem('currentVehicleId')
      },
    )
    watch(
      () => _.cloneDeep(allSelectedOptions.value),
      () => {
        const mergedArray = [...new Set([...optionsConfigurationData['selectedOptions'], ...allSelectedOptions.value])];
        if (!checkIfEqual(optionsConfigurationData['selectedOptions'], mergedArray)) {
          optionsConfigurationData['selectedOptions'] = mergedArray
          initialize()
        }
      }
    )
    watch(
      () => _.cloneDeep(latestSelection.value),
      (currentValue) => {
        sessionStorage.setItem('latestSelection', JSON.stringify(currentValue))
        if (!latestSelection.value.length) {
          sessionStorage.removeItem('latestSelection')
        }
      }
    )
    watch(
      () => _.cloneDeep(nestedOptions.value),
      (currentValue) => {
        if (optionsConfigurationData['action'] == 'added' && optionsConfigurationData['option'] && optionsResponse.value.length) {
          const addToNestedOptions = (selectedOptionId, key) => {
            const packMembers = optionsResponseAsObject.value[selectedOptionId]['packMembers']
            const requiredOptions = optionsResponseAsObject.value[selectedOptionId]['required']
            const flattenArray = [...new Set([...packMembers ?? '', ...requiredOptions ?? ''])];
            return flattenArray.forEach((value) => {
              if (store.state.options.nestedOptions[key].indexOf(value) === -1) {
                store.state.options.nestedOptions[key].push(value)
              }
            })
          }
          const userSelectedOptionIds = optionsConfigurationData['userSelectedOptions']
          userSelectedOptionIds.forEach((optionId) => {
            addToNestedOptions(optionId, optionId)
            currentValue[optionId].forEach((nestedOptionId) => {
              addToNestedOptions(nestedOptionId, optionId)
            })
          })
        }
        sessionStorage.setItem('nestedOptions', JSON.stringify(currentValue))
        if (!Object.keys(nestedOptions.value).length) {
          sessionStorage.removeItem('nestedOptions')
        }
      }
    )
    watch(
      () => _.cloneDeep(conflictedOptions.value),
      (currentValue) => {
        if (currentValue.length) {
          showConflictedOptionsPopup.value = true
          currentValue.forEach((item) => {
            optionsConfigurationData['selectedOptions'].splice(optionsConfigurationData['selectedOptions'].indexOf(item['optionID']), 1)
            optionsConfigurationData['userSelectedOptions'].splice(optionsConfigurationData['userSelectedOptions'].indexOf(item['optionID']), 1)
            delete nestedOptions.value[item['optionID']]
          })
          initialize()
        }
      }
    )
    const getFilteredPackageOptions = (prop, type) => {
      let filteredPackagesAndOptions
      if (packagesAndOptions.value) {
        const data = packagesAndOptions.value?.[prop]
        filteredPackagesAndOptions = data?.filter((item) => item['type'] == type)
      }
      return filteredPackagesAndOptions
    }
    const getPackagesAndOptions = (type) => {
      const packageOptions = {}
      for (const key in packagesAndOptions.value) {
        const result = getFilteredPackageOptions(key, type)
        if (result && result.length) {
          packageOptions[key] = result
        }
      }
      return packageOptions
    }
    const setToDefault = () => {
      showPopup.value = true
      requiredChoiceIndex.value = 0
    }
    const checkChargingFacility = (fuelType) => {
      if (fuelType == 'electric' || fuelType == 'plug_in_hybrid') {
        if (carPolicyId.value.fuelType) {
          const checkFuelType = carPolicyId.value.fuelType.some((item) => item.title == fuelType && item.isChargingMandatory == 1)
          return checkFuelType
        }
      } else {
        return false
      }
    }
    const onCheck = async (item) => {
      optionsConfigurationData['option'] = item['option'].target.id
      optionsConfigurationData['action'] = item['option'].target.checked ? 'added' : 'removed'
      if (optionsConfigurationData['selectedOptions'].indexOf(item['option'].target.id) === -1) {
        optionsConfigurationData['selectedOptions'].push(item['option'].target.id)
      }
      if (optionsConfigurationData['userSelectedOptions'].indexOf(item['option'].target.id) === -1) {
        optionsConfigurationData['userSelectedOptions'].push(item['option'].target.id)
      }
      if (!item['option'].target.checked) {
        optionsConfigurationData['selectedOptions'].splice(
          optionsConfigurationData['selectedOptions'].indexOf(item['option'].target.id),
          1
        )
        optionsConfigurationData['userSelectedOptions'].splice(
          optionsConfigurationData['userSelectedOptions'].indexOf(item['option'].target.id),
          1
        )
        packMembersPopUpTitle.value = t('_step3.itemsRemoved')
        // if unchecked removed selectedOptions + packMembers + requiredOptions
        delete nestedOptions.value[optionsConfigurationData['option']]
        const getNestedOptions = Object.entries(nestedOptions.value)
        optionsConfigurationData['selectedOptions'] = getNestedOptions.flat(2)
      } else {
        packMembersPopUpTitle.value = t('_step3.itemsAdded')
      }
      selectedCheckbox.value = item['option'].target.id
      packMembers.value = item.packMembers
      await initialize()
      setToDefault()
      componentKey.value += 1
    }
    const onRadioClick = (item) => {
      const optionId = item.optionId
      selectedCheckbox.value = optionId
      packMembers.value = item.packMembers
    }
    const onProceed = () => {
      const selected = document.querySelector('input[type=radio][name=name]:checked')
      if (selected) {
        const selectedID = selected.id.replace('radio-', '')
        optionsConfigurationData['action'] = 'added'
        optionsConfigurationData['option'] = selectedID
        optionsConfigurationData['selectedOptions'].push(selectedID)
        optionsConfigurationData['userSelectedOptions'].push(selectedID)
        store.state.options.latestSelection.push(selectedID)
        initialize()
      }
      if (requiredChoiceIndex.value < requiredChoicesTitles.value.length - 1) {
        requiredChoiceIndex.value += 1
      }
    }
    const checkConflictedOptions = (options) => {
      const isStateConflicted = options.every(function (item) {
        return item['newState'] == 'conflicted'
      })
      return isStateConflicted
    }
    const getTranslatedCategory = (item) => {
      let category = '_configure.other'
      if (item == 'Safety') {
        category = '_configure.safety'
      } else if (item == 'Driving & braking') {
        category = '_configure.drivingAndBraking'
      } else if (item == 'Audio & Entertainment') {
        category = '_configure.audioEntertainment'
      } else if (item == 'Comfort') {
        category = '_configure.comfort'
      } else if (item == 'Interior colour') {
        category = '_configure.interiorColour'
      } else if (item == 'Exterior colour') {
        category = '_configure.exteriorColour'
      }
      return category
    }
    const getStatus = (item) => {
      return item['newState'] === 'selected' || item['isPack'] == true || item['newState'] === 'required'
    }
    const addToOptionsConfigurations = () => {
      optionsConfigurationData['otherAccessories'] = !others.value[0]['accessory'] ? [] : removeType(others.value)
      initialize()
    }
    const addFacility = (item) => {
      others.value.push({
        accessory: '', price: '', type: 'add'
      })
      others.value[item['index']]['type'] = 'delete'
      otherAccessoriesErrors.push({
        facilityError: '',
        priceError: ''
      })
      addToOptionsConfigurations()
    }
    const deleteFacility = (item) => {
      others.value.splice(item['index'], 1)
      addToOptionsConfigurations()
    }
    const selectChargingFacility = (item) => {
      selectedChargingFacility.value = item
      if (checkChargingFacility(carType.value ?? ''))
        optionsConfigurationData['chargingFacilities'] = [{
          accessory: selectedChargingFacility.value['chargingFacility'],
          price: selectedChargingFacility.value['price']
        }]
      initialize()
    }
    const onNameInput = (option) => {
      others.value[option['index']]['accessory'] = option['item']
      delete otherAccessoriesErrors[option['index']]['facilityError']
      if (others.value[option['index']]['accessory'].length < 2 || others.value[option['index']]['accessory'].length > 250) {
        otherAccessoriesErrors[option['index']]['facilityError'] = 'LengthError'
      }
    }
    const onPriceInput = (option) => {
      others.value[option['index']]['price'] = option['item']
      delete otherAccessoriesErrors[option['index']]['priceError']
      if (!others.value[option['index']]['price'].match(/^[0-9.,]*$/)) {
        otherAccessoriesErrors[option['index']]['priceError'] = 'typeError'
      }
    }
    const getFilteredNestedOptions = () => {
      const nestedOptions = JSON.parse(sessionStorage.getItem('nestedOptions'))
      const options = []
      for (const key in nestedOptions) {
        optionsResponse.value
          .forEach((item) => {
            if (item['optionId'].toString() == key) {
              options.push({ titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionId: item['optionId'], type: item['type'], price: item['price'], priceExcludingVAT: item['priceExcludingVAT'], category: item['category'], children: nestedOptions[key] })
            }
          })
      }
      options.forEach((option) => {
        const nestedChildern = optionsResponse.value
          .filter((item) => {
            return option.children.indexOf(item['optionId'].toString()) !== -1
          })
          .map(function (item) {
            return { titleEn: item['titleEn'], titleNl: item['titleNl'], code: item['code'], optionId: item['optionId'], type: item['type'], price: item['price'], priceExcludingVAT: item['priceExcludingVAT'], category: item['category'] }
          })
        option.children = nestedChildern
      })
      return options
    }
    const onProceedCarOrder = async () => {
      carOrderAdd['co2Emission'] = getCarsById.value['combined_62203'],
        carOrderAdd['options'] = getFilteredNestedOptions()
      carOrderAdd['otherAccessories'] = !others.value[0]['accessory'] ? [] : removeType(others.value)
      if (checkChargingFacility(carType.value ?? ''))
        carOrderAdd['chargingFacilities'] = [{
          accessory: selectedChargingFacility.value['chargingFacility'],
          price: selectedChargingFacility.value['price']
        }]
      carOrderAdd['status'] = carOrderStatus.value
      if (updateCarOrderValue.value === 1) {
        await store.dispatch(ActionTypes.ADD_CARORDER, { carOrderData: carOrderAdd, id: carOrderId.value })
        if (complyCarResponse.value && complyCarResponse.value.length) {
          showComplyPopup.value = true
        }
      } else {
        await store.dispatch(ActionTypes.ADD_CARORDER, { carOrderData: carOrderAdd })
        if (complyCarResponse.value && complyCarResponse.value.length) {
          showComplyPopup.value = true
        }
      }
    }

    const onCarOrderRadioClick = (item) => {
      updateCarOrderValue.value = item.optionId
    }
    const continueToOrderProcess = async (status) => {
      await initialize()
      if (colorsFlag.value.interior && colorsFlag.value.exterior && !requiredChoicesTitles.value.length && !NetMonthlyCostAndFlag.value.expensiveFlag) {
        carOrderStatus.value = status
        if(!carOrderStatus.value && carOrderId.value) {
          showCarOrderPopup.value = true
        } else {
          onProceedCarOrder()
        }
      } else {
        isColorsPopup.value = true
      }
    }

    const closeColorsPopup = () => {
      isColorsPopup.value = false
    }
    const closeConflictedOptionsPopup = () => {
      showConflictedOptionsPopup.value = false
      store.state.options.conflictedOptions = []
      document.body.classList.remove('modal-open')
    }
    const closeConflictedNestedOptionsPopup = () => {
      if (sessionStorage.getItem('optionJustAdded')) {
        revertSelectedOptions('conflictedNestedOptions')
      }
    }
    const enableSelectedOptions = (option) => {
      if ((option['newState'] === 'required' || option['isPack']) && optionsConfigurationData['userSelectedOptions']) {
        if (optionsConfigurationData['userSelectedOptions'].includes(option.optionId.toString())) {
          return false
        }
        return true
      }
    }
    return {
      exteriorInterior,
      options,
      loader,
      getPackagesAndOptions,
      formatCurrency,
      onCheck,
      getTranslatedCategory,
      getStatus,
      requiredChoicesTitles,
      requiredChoiceIndex,
      showPopup,
      onPopupClose,
      onRadioClick,
      onProceed,
      packMembersPopUpTitle,
      packMembersTitles,
      onClose,
      addFacility,
      deleteFacility,
      onNameInput,
      onPriceInput,
      others,
      otherAccessoriesErrors,
      carPolicyId,
      selectedChargingFacility,
      selectChargingFacility,
      currentUserCarOrder,
      complyCarResponse,
      carOrderAdd,
      continueToOrderProcess,
      closeComplyPopup,
      showComplyPopup,
      checkChargingFacility,
      getCarsById,
      closeCarOrderPopup,
      showCarOrderPopup,
      onCarOrderRadioClick,
      onProceedCarOrder,
      componentKey,
      enableSelectedOptions,
      carOrderedTrue,
      NetMonthlyCostAndFlag,
      closeExpensivePopup,
      isExpensiveFlag,
      closeColorsPopup,
      isColorsPopup,
      colorsMessage,
      checkConflictedOptions,
      revertSelectedOptions,
      carType,
      leaseRateError,
      showConflictedOptionsPopup,
      closeConflictedOptionsPopup,
      conflictedOptions,
      showConflictedNestedOptionsPopup,
      closeConflictedNestedOptionsPopup
    }
  }
})
</script>
<style lang="sass" scoped>
.lease-rate-error
  display: flex
  align-items: center
  flex: 1
  width: 100%
  justify-content: center
  background: $colorWhite
  height: 70vh
  h3
    text-align: center
    padding: 0 15px
.title.h4
  font-size: 16px
  text-align: center
  margin-bottom: 2em
.mandatory-acc
  display: flex
  flex-direction: column
  width: 300px
  max-width: 100%
  margin: 0 0 3em 0.5em
  .sub-wrap
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0 0 0.9em
    label, span
      color: $colorHubbleText
      font-size: 14px
    label
      display: flex
      align-items: center
      &:before
        content: ""
        @include backgroundImage('checked.svg')
        width: 20px
        height: 20px
        display: flex
        align-items: center
        opacity: 0.5
        margin-right: 0.6em
.popup-inner-block
  display: flex
  flex: 1
  width: 100%
  flex-direction: column
.loading-block
p
  font-family: 'Lato-semibold'
  font-size: 15px
  margin: 5em 0
  color: $colorHubbleDarkGrey
.left-block
  i
    font-style: normal
.required-choices
  .inner-block
    .left-block
      width: 80%
.inner-block
  padding-left: 2.4em
  width: 100%
  display: flex
.overlay-wrap
  position: relative
.overlay
  background: rgba(255, 255, 255, 0.8)
  width: 100%
  z-index: 1
  position: absolute
  top: 0
  bottom: 0
.no-overlay
  background: none
span.code
  color: $colorHubbleDarkGrey
  margin-left: 0.3em
  font-size: 14px
.half-block
  width: 70%
.left-block
  label
    word-break: break-word
    font-size: 14px
.required.required-choices
  .options-wrap
    height: 25vh
.required-choices
  width: 100%
  .options-wrap
    height: 40vh
    overflow-y: auto
    overflow-x: hidden
    padding-right: 1.5em
    &::-webkit-scrollbar
      width: 5px
      border-radius: 5px
    &::-webkit-scrollbar-thumb
      background: $colorHubble
      border-radius: 10px
    &::-webkit-scrollbar-track
      background-color: $colorHubbleBackgroundGrey
      border-radius: 10px
  h3
    color: $colorHubble
    font-size: 16px
    border-bottom: 1px solid $colorHubbleGreyIcons
    padding-bottom: 0.4em
    margin-bottom: 1em
  h2
    font-size: 18px
    text-align: center
    font-family: 'Lato-semibold'
    color: $colorHubbleText
    margin-top: 0
    margin-bottom: 1.3em
.required-choices, .selected-pack
  h3
    color: $colorHubble
    font-size: 16px
    border-bottom: 1px solid $colorHubbleGreyIcons
    padding-bottom: 0.4em
    margin-bottom: 1em
.main-wrap
  display: flex
  flex-direction: column
  @media screen and (max-width: $mdBreakpoint)
    padding-bottom: 8em
  .step-wrap.hide-on-desktop
    @media screen and (max-width: $mdBreakpoint)
      display: none
  .step3
    display: flex
    justify-content: space-between
    @media screen and (max-width: $mdBreakpoint)
      padding: 1.5em 15px !important
  .step1, .step2
    justify-content: space-between
    &:before
      background-color: $colorHubbleGreyLines
      color: $colorWhite
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
  .step3
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
    margin: 1.4em 1em 2.1em 2.8em
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
    > .charging-facility
      margin: 0 0 3em 0.5em
      width: 70%
    .add-facilities
      margin: 3em 0 0 0
      label.floating-label
        font-size: 14px
    .full-width
      display: flex
      flex-wrap: wrap
      .half-width
        flex-basis: 47%
        margin-bottom: 0.5em !important
        display: flex
        justify-content: space-between
        padding: 0 0.4em 0 0
        @media screen and (max-width: $lgBreakpoint)
          flex-basis: 100%
        &:nth-child(2n + 1)
          margin: 0 2.8em 0 0
          @media screen and (max-width: $lgBreakpoint)
            margin: 0
        .description
          p
            font-size: 13px
            line-height: 22px
            color: $colorHubbleDarkGrey
            margin: 0.5em 0
      .options
        font-size: 12px
        padding: 0.4em 0 0.4em 0.4em
        line-height: normal
        display: flex
        @media screen and (max-width: $xsBreakpoint)
          flex-direction: column
      .info-icon
        @include backgroundImage('info_dark.svg')
        height: 1.5em
        width: 1.2em
        display: flex
        padding-right: 0.6em
.loader-block
  display: flex
  justify-content: center
  position: fixed
  z-index: 2
  top: 33em
  width: 100%
  @media screen and (min-width: $mdBreakpoint)
    width: calc(100vw - 35%)
.submit
  display: flex
  align-items: center
  padding: 2rem 2.1rem 3.5rem 2.2rem
  background-color: $colorWhite
  @media screen and (max-width: $xsBreakpoint)
    flex-direction: column
  button
    padding: 0.95rem 1.95rem 0.95rem 2rem
    &:first-of-type
      margin: 0 1em 0 0
      @media screen and (max-width: $xsBreakpoint)
        margin: 0 0 1em 0
span.price
  font-size: 14px
  color: $colorHubbleDarkGrey
  margin-left: 0.3em
  position: absolute
  right: 0.4em
  @media screen and (max-width: 480px)
    position: static
.selected-pack
  margin: 0 0 2em 0
  width: 100%
  .inner-block
    padding: 0
    position: relative
    margin: 0 0 1em 0
    .left-block
      display: flex
      align-items: center
      .checked
        width: 24px
        height: 24px
        border-radius: 3px
        background-color: $colorHubbleLightBackground
        margin: 0 0.9em 0 0
        display: flex
        justify-content: center
        &:after
          content: ""
          @include backgroundImage('checked.svg')
          width: 20px
.list-of-errors
  padding: 0 0 0 8em
  width: 100%
  > ul
    padding: 0
  li
    font-size: 14px
    list-style: disc
    padding: 1em 0 0 0
    span
      font-size: 14px
.alert-heading
  text-align: left
  align-self: flex-start
  margin-bottom: 1rem
  width: 100%
  border-bottom: 2px solid $colorHubbleGreyIcons
  padding-bottom: 10px
  color: $colorHubble
.conflicted-nested-options-popup
  .options-wrap
    height: 40vh
    overflow-y: auto
    overflow-x: hidden
    padding-right: 1.5em
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    padding-left: 15px
    &::-webkit-scrollbar
      width: 5px
      border-radius: 5px
    &::-webkit-scrollbar-thumb
      background: $colorHubble
      border-radius: 10px
    &::-webkit-scrollbar-track
      background-color: $colorHubbleBackgroundGrey
      border-radius: 10px
  p
    font-size: 14px
    font-family: 'Lato'
    text-align: center
    margin: 1em 
.conflicted-options-overlay
  position: absolute;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, #FFFFFF 49.48%, rgba(255, 255, 255, 0.8) 100%)
  left: 0
  .options-wrap
    height: 40vh
    overflow-y: auto
    overflow-x: hidden
    padding-right: 1.5em
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    padding-left: 15px
    &::-webkit-scrollbar
      width: 5px
      border-radius: 5px
    &::-webkit-scrollbar-thumb
      background: $colorHubble
      border-radius: 10px
    &::-webkit-scrollbar-track
      background-color: $colorHubbleBackgroundGrey
      border-radius: 10px
  p
    font-size: 14px
    font-family: 'Lato'
    text-align: center
    margin: 1em
ul.package-content 
  padding: 0
  margin: 0
  li
    list-style: none
    display: flex
    align-items: center
    &:before
      content: "-"
      margin-right: 10px
      font-size: 22px
      color: $colorHubbleDarkGrey
      align-self: flex-start
    span
     font-size: 13px
     color: $colorHubbleDarkGrey    
</style>