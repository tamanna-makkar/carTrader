<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="car-policy-wrap" v-if="!loader">
    <div class="left-area">
      <div class="policy-text">
        <span>{{ $t('_carPolicy.carPolicies') }}</span> <span>/</span>
        <h1>{{ getBreadCrumbTitle() }}</h1>
      </div>
      <div class="save-policy">
        <Button
          :text="$t('_generalTerms.save')"
          buttonType="dark"
          :class="{ disabled: !fileDetails['fileName'] }"
          @onClick="publishCarPolicy"
        />
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardChanges" />
        <Button
          v-if="route.params.id"
          :text="$t('_generalTerms.delete')"
          buttonType="light delete-button"
          @onClick="deleteCarPolicy"
        />
      </div>
    </div>
    <div class="center-area">
      <span v-if="deleteCarPolicyResponse" class="error-message delete-error">
        {{ $t('_carPolicy.CannotDeleteCarPolicy') }}*
      </span>
      <div class="car-policy-steps">
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][0]"
          :sectionIndex="0"
          @toggleSection="toggleSection"
          id="infoSection"
          :showError="Object.getOwnPropertyNames(errors).length > 0"
        >
          <template v-slot:header> {{ $t('_carPolicy.generalInformation') }} </template>
          <div class="general-infomation step">
            <div class="half-width">
              <InputElement type="text" :value="carPolicyTitle" @update:value="onInput">{{
                $t('_carPolicy.carPolicyTitle')
              }}</InputElement>
              <span class="error-message" v-if="errors.titleRequiredError">
                {{ $t('_errorCodes.requiredError') }}
              </span>
              <span class="error-message" v-if="errors.titleLengthError">
                {{ $t('_errorCodes.titleLengthError') }}
              </span>
            </div>
            <div class="half-width">
              <label>{{ $t('_carPolicy.colorCode') }}</label>
              <Dropdown
                type="carPolicy"
                :items="colorCodes"
                :selectedOption="selectedColorCode"
                @onChange="selectColorCode"
              />
            </div>
          </div>
          <div class="next-block">
            <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step1', 0)" buttonType="dark arrow--right" />
          </div>
        </toggleableContent>

        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][1]"
          :sectionIndex="1"
          @toggleSection="toggleSection"
          id="fuelSection"
          :showError="FuelTypeError == 'required' || checkAddChargingFacility()"
        >
          <template v-slot:header> {{ $t('_carPolicy.fuelType') }} </template>
          <div class="fuel-types step">
            <h3>{{ $t('_carPolicy.selectFuelTypes') }}</h3>
            <div class="error-wrap" v-if="FuelTypeError == 'required'">
              <span class="error-message">{{ $t('_errorCodes.fuelTypeError') }}</span>
            </div>
            <fuel-type
              :checkboxesValues="checkboxesValues"
              :selectedElectricOption="selectedElectricOption"
              :selectedHybridOption="selectedHybridOption"
              :isMileageDuration="true"
              @onCheck="onCheck"
              @selectElectricOption="selectElectricOption"
              @selectHybridOption="selectHybridOption"
              :selectedMileageOption="selectedMileageOption"
              :selectedDurationOption="selectedDurationOption"
              @selectMileageOption="selectMileageOption"
              @selectDurationOption="selectDurationOption"
              :chargingMandatoryOptions="chargingMandatoryOptions"
              @selectMandatoryOptions="selectMandatoryOptions"
              class="content-wrap"
            >
            </fuel-type>
            <AddChargingFacilities
              v-if="isChargingMandatory"
              :facility="chargingFacility.value"
              @add="addFacility"
              @delete="deleteFacility"
              @onNameInput="onNameInput"
              @onPriceInput="onPriceInput"
              :step2Errors="step2Errors"
              type="chargingFacility"
              class="charging-facility facility-wrap"
            >
              <h3>{{ $t('_carPolicy.enterChargingFacilities') }}</h3>
            </AddChargingFacilities>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step2', 1)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][2]"
          :sectionIndex="2"
          @toggleSection="toggleSection"
          id="bodyTypeSection"
          :showError="bodyTypeError == 'required'"
        >
          <template v-slot:header> {{ $t('_carPolicy.carBodyType') }} </template>
          <div class="body-type step">
            <h3>{{ $t('_carPolicy.selectBodyTypes') }}</h3>
            <div class="error-wrap" v-if="bodyTypeError == 'required'">
              <span class="error-message">{{ $t('_errorCodes.bodyTypeError') }}</span>
            </div>
            <CarBodyType
              class="content-wrap"
              :checkboxesValues="checkboxesStep3"
              @onCarBodyCheck="onCarBodyCheck"
            ></CarBodyType>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step3', 2)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][3]"
          :sectionIndex="3"
          @toggleSection="toggleSection"
          id="amountOfDoors"
        >
          <template v-slot:header> {{ $t('_carPolicy.doorsAmount') }} </template>
          <div class="door-amount step">
            <h3>{{ $t('_carPolicy.allowedDoorCount') }}</h3>
            <div class="slider-wrapper content-wrap">
              <vue-slider
                ref="slider"
                v-model="sliderValue"
                :vData="sliderData.value"
                v-bind="sliderDataOptions"
                direction="rtl"
                tooltip="always"
              >
                <template v-slot:tooltip="{ value }">
                  <div class="vue-slider-dot-tooltip-inner">
                    <span v-if="value == 2" class="first-index vue-slider-dot-tooltip-text"
                      >{{ value }} {{ $t('_wizard.step9.doors') }}</span
                    >
                    <span v-else-if="value == 5" class="last-index vue-slider-dot-tooltip-text"
                      >{{ value }} {{ $t('_wizard.step9.doors') }}</span
                    >
                    <span v-else class="vue-slider-dot-tooltip-text">{{ value }} {{ $t('_wizard.step9.doors') }}</span>
                  </div>
                </template>
              </vue-slider>
            </div>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step4', 3)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][4]"
          :sectionIndex="4"
          @toggleSection="toggleSection"
          id="carBrandsModels"
        >
          <template v-slot:header> {{ $t('_carPolicy.carBrandsModels') }} </template>
          <div class="car-brands step">
            <h3>{{ $t('_carPolicy.selectBrandsModels') }}</h3>
            <CarBrandsModels
              class="content-wrap"
              @selectCarPolicyBrand="selectCarPolicyBrand"
              @selectModel="selectModel"
              @removeModel="removeModel"
              @addCarBrand="addCarBrand"
              @removeAllModels="removeAllModels"
              @deleteCarBrand="deleteCarBrand"
              :getBrands="getBrands"
              :brandModelsArray="brandModelsArray.value"
              :models="models"
              :showPolicyBrandsModels="showPolicyBrandsModels"
            >
            </CarBrandsModels>
            <div class="next-block">
              <Button
                :text="$t('_generalTerms.next')"
                @onClick="goToNext('car-brands', 4)"
                buttonType="dark arrow--right"
              />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][5]"
          :sectionIndex="5"
          @toggleSection="toggleSection"
          id="mandatoryAccessories"
        >
          <template v-slot:header> {{ $t('_carPolicy.mandatoryAccessoriesHeading') }} </template>
          <div class="mandatory-acess step">
            <AddChargingFacilities
              :mandatoryAccessories="mandatoryAccessories.value"
              @add="addFacility"
              @delete="deleteFacility"
              @onNameInput="onNameInput"
              @onPriceInput="onPriceInput"
              :step2Errors="mandatoryAccessoriesErrors"
              type="mandatoryAccessories"
              class="facility-wrap"
            >
              <h3>{{ $t('_carPolicy.addMandatoryForEmployees') }}</h3>
            </AddChargingFacilities>
          </div>
          <div class="next-block">
            <Button
              :text="$t('_generalTerms.next')"
              @onClick="goToNext('mandatory-accessories', 5)"
              buttonType="dark arrow--right"
            />
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][6]"
          :sectionIndex="6"
          @toggleSection="toggleSection"
          id="factoryOptionsSection"
        >
          <template v-slot:header> {{ $t('_carPolicy.mandatoryFactoryOptions') }} </template>
          <div class="factory-options step">
            <h3>{{ $t('_carPolicy.selectMandatoryFactoryOptions') }}</h3>
            <div class="content-wrap">
              <div v-for="(item, index) in factoryOptionsCheckboxes" :key="index" class="options">
                <Checkbox
                  :item="item"
                  @onCheck="onFactoryCheck($event, item.title)"
                  :isChecked="item.isActive"
                  theme="wizards"
                >
                  {{ $t(item['value']) }}
                  <template v-if="item.wizardInfo" v-slot:wizardInfo>
                    <i class="info-icon" />
                  </template>
                </Checkbox>
              </div>
            </div>
            <h3 class="colors-heading">{{ $t('_carPolicy.colorsToExclude') }}</h3>
            <div class="colors-wrap">
              <div v-for="(item, index) in carColors" :key="index" class="options">
                <Checkbox
                  :item="{ id: index, value: item }"
                  @onCheck="onCarColorsCheck($event)"
                  :isChecked="excludedColorsArray.value.includes(item)"
                  theme="wizards"
                >
                  {{ $t(`_carPolicy.${item}`) }}
                </Checkbox>
              </div>
            </div>
          </div>
          <div class="next-block">
            <Button
              :text="$t('_generalTerms.next')"
              @onClick="goToNext('factoryOptionsStep', 6)"
              buttonType="dark arrow--right"
            />
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][7]"
          :sectionIndex="7"
          @toggleSection="toggleSection"
          id="uploadDocumentSection"
        >
          <template v-slot:header> {{ $t('_carPolicy.carPolicyDocument') }} </template>
          <div class="policy-document step">
            <h3>{{ $t('_carPolicy.uploadCarPolicyDocument') }}</h3>
            <div class="error-wrap">
              <span v-if="documentResponse" class="error-message">
                {{ $t(`_errorCodes.${documentResponse}`) }}
              </span>
            </div>
            <UploadDocument
              class="content-wrap"
              :fileDetails="fileDetails"
              @fileChange="fileChange"
              @deleteFile="deleteFile"
            />
            <div class="next-block">
              <Button
                :class="{ disable: !fileDetails['fileName'] }"
                :text="$route.params.id ? $t('_carPolicy.updateCarPolicy') : $t('_carPolicy.publishCarPolicy')"
                @onClick="publishCarPolicy"
                buttonType="dark arrow--right"
              />
            </div>
          </div>
        </toggleableContent>
      </div>
    </div>
  </div>
  <div class="loader-block" v-else>
    <Loader />
  </div>
  <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
    <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
    <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
  </Popup>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, onUnmounted } from 'vue'
import Button from '@/components/UI/Button.vue'
import toggleableContent from '@/components/toggleableContent.vue'
import InputElement from '@/components/UI/Input.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import FuelType from '@/components/FuelType.vue'
import AddChargingFacilities from '@/components/AddChargingFacilities.vue'
import CarBodyType from '@/components/CarBodyType.vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import CarBrandsModels from '@/components/CarBrandsModels.vue'
import UploadDocument from '@/components/UI/UploadDocument.vue'
import generalInfo from '@/composables/PolicyGeneralInfo'
import PolicyFuelType from '@/composables/PolicyFuelType'
import BodyType from '@/composables/PolicyBodyType'
import PolicyFactoryOptions from '@/composables/PolicyFactoryOptions'
import PolicyBrandsModels from '@/composables/PolicyBrandsModels'
import uploadDocument from '@/composables/PolicyUploadDocument'
import doorCount from '@/composables/PolicyDoorCount'
import VueSlider from 'vue-slider-component'
import Popup from '@/components/Popup.vue'
import { useStore } from '@/store'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import { AuthActionTypes } from '@/store/auth/actions'
import { carPolicyMutationTypes } from '@/store/carPolicy/mutations'
import { AuthMutationTypes } from '@/store/auth/mutations'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Loader from '@/components/UI/Loader.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import _ from 'lodash'
import MessageBar from '@/components/UI/MessageBar.vue'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  components: {
    Button,
    toggleableContent,
    InputElement,
    Dropdown,
    FuelType,
    AddChargingFacilities,
    CarBodyType,
    Checkbox,
    CarBrandsModels,
    UploadDocument,
    VueSlider,
    Loader,
    Popup,
    MessageBar
  },
  name: 'Car policies',
  setup() {
    const store = useStore()
    const route = useRoute()
    const showPopup = ref(false)
    const { t } = useI18n({ useScope: 'global' })
    const carPolicyByID = computed(() => store.state.auth.carPolicyByID)
    const carBrandsModels = computed(() => store.state.options.carBrandsModels)
    const deleteCarPolicyResponse = computed(() => store.state.carPolicy.deleteCarPolicyResponse)
    const documentResponse = computed(() => store.state.carPolicy.documentResponse)
    const carColors = computed(() => store.state.carPolicy.carColors)
    const excludedColorsArray: { value: Array<string> } = reactive({ value: [] })
    const roles = computed(() => store.state.auth.currentUser?.roles)
    const { compId, companyDetailState } = getCompany()
    const closePopup = () => {
      showPopup.value = false
    }
    const onProceed = () => {
      showPopup.value = false
      store.dispatch(carPolicyActionTypes.DELETE_CARPOLICY, {
        companyId: compId,
        carPolicyId: route.params.id
      })
    }
    const {
      colorCodes,
      carPolicyTitle,
      errors,
      selectedColorCode,
      selectColorCode,
      checkStep1,
      onInput
    } = generalInfo()
    const {
      selectedMileageOption,
      selectedDurationOption,
      selectMileageOption,
      selectDurationOption,
      chargingMandatoryOptions,
      selectMandatoryOptions,
      isChargingMandatory,
      chargingFacility,
      addFacility,
      onNameInput,
      onPriceInput,
      deleteFacility,
      step2Errors,
      FuelTypeError,
      selectElectricOption,
      selectHybridOption,
      onCheck,
      checkboxesValues,
      selectedElectricOption,
      selectedHybridOption,
      mandatoryAccessories,
      mandatoryAccessoriesErrors,
      fuelTypeArray,
      convertToNumberAndFloat,
      checkChargingFacility,
      checkAddChargingFacility
    } = PolicyFuelType()
    const { checkboxesStep3, bodyTypeError, onCarBodyCheck, bodyTypeArray } = BodyType()
    const { factoryOptionsCheckboxes, onFactoryCheck, factoryOptionsArray } = PolicyFactoryOptions()
    const {
      models,
      brandModelsArray,
      selectModel,
      removeModel,
      addCarBrand,
      removeAllModels,
      deleteCarBrand,
      getBrands,
      showPolicyBrandsModels,
      selectCarPolicyBrand
    } = PolicyBrandsModels()
    const { fileDetails, fileChange } = uploadDocument()
    const { sliderValue, sliderDataOptions, sliderData } = doorCount()
    const sectionsErrors = reactive({})
    const sectionToggleValues = reactive({ value: [true, false, false, false, false, false, false, false] })
    const loader = computed(() => store.state.carPolicy.loader)
    const onCarColorsCheck = ($event) => {
      if (excludedColorsArray.value.indexOf($event.target.value) === -1) {
        excludedColorsArray.value.push($event.target.value)
      }
      if (!$event.target.checked) {
        excludedColorsArray.value.splice(excludedColorsArray.value.indexOf($event.target.value), 1)
      }
    }
    const initialize = async () => {
      await store.dispatch(AuthActionTypes.GET_CARPOLICY_BY_ID, {
        companyId: compId,
        carPolicyId: route.params.id
      })
      carPolicyTitle.value = carPolicyByID.value.policyTitle
      selectedColorCode.value = carPolicyByID.value.colorCode
      // carBodyTyoe
      checkboxesStep3.forEach((item) => {
        item.isActive = carPolicyByID.value.carBodyType.includes(item.value)
      })
      bodyTypeArray.value = carPolicyByID.value.carBodyType
      // AmountOfDoors
      const minDoors = parseInt(`${carPolicyByID.value.amountOfDoors.min}`)
      sliderValue.value = minDoors
      // mandatory factory
      factoryOptionsCheckboxes.forEach((item) => {
        item.isActive = carPolicyByID.value.mandatoryFactoryOptions.includes(item.title)
      })
      factoryOptionsArray.value = carPolicyByID.value.mandatoryFactoryOptions
      // document
      fileDetails['fileName'] = carPolicyByID.value.document
      // fuel type
      const getIndexOfItem = (selectedTitle) => {
        return checkboxesValues.findIndex((item) => item.title === selectedTitle)
      }
      checkboxesValues.forEach((item) => {
        carPolicyByID.value.fuelType.forEach((policyTitle) => {
          if (policyTitle.title == 'plug_in_hybrid') {
            policyTitle.title = 'plug-in hybrid'
          }
          if (item.title == policyTitle.title) {
            item.isActive = true
            selectedMileageOption[getIndexOfItem(item.title)] = policyTitle.setMileage + ' km'
            selectedDurationOption[getIndexOfItem(item.title)] = policyTitle.setDuration.toString()
            if (item.title == 'electric') {
              let policyDistance = policyTitle.distance.toString()
              if (policyDistance == '1000') {
                policyDistance = '> 1000 km'
              } else if (policyDistance == '0') {
                policyDistance = '< 100 km'
              } else {
                policyDistance = policyDistance + ' km'
              }
              selectedElectricOption.value = policyDistance
              chargingMandatoryOptions[getIndexOfItem('electric')] = policyTitle.isChargingMandatory == 1 ? true : false
            } else if (item.title == 'plug-in hybrid') {
              let policyDistance = policyTitle.distance.toString()
              if (policyDistance == '200') {
                policyDistance = '> 200 km'
              } else if (policyDistance == '0') {
                policyDistance = '< 50 km'
              } else {
                policyDistance = policyDistance + ' km'
              }
              selectedHybridOption.value = policyDistance
              chargingMandatoryOptions[getIndexOfItem('plug-in hybrid')] =
                policyTitle.isChargingMandatory == 1 ? true : false
            }
          }
        })
      })
      fuelTypeArray.value = carPolicyByID.value.fuelType
      // charging facilities
      Array.prototype.unshift.apply(chargingFacility.value, carPolicyByID.value.chargingFacility)
      // mandatory facilities
      mandatoryAccessories.value.unshift(...carPolicyByID.value.mandatoryAccessories)
      for (let i = 0; i < carPolicyByID.value.mandatoryAccessories.length; i++) {
        mandatoryAccessoriesErrors.unshift({
          facilityError: '',
          priceError: ''
        })
      }
      // Car brands models
      if (carPolicyByID.value.carBrandsAndModels.length > 0) {
        showPolicyBrandsModels.value = true
      }
      brandModelsArray.value = carPolicyByID.value.carBrandsAndModels
      // carColors
      excludedColorsArray.value = carPolicyByID.value.excludedCarColors ?? []
    }
    watch(
      () => _.cloneDeep(carBrandsModels.value),
      () => {
        brandModelsArray.value.forEach((item, index) => {
          if (item.brand) {
            const brandName = { item: item.brand, key: index }
            selectCarPolicyBrand(brandName)
          }
        })
      }
    )
    onMounted(async () => {
      if (route.params.id) {
        await initialize()
      } else {
        store.commit(AuthMutationTypes.SET_CARPOLICYBYID, {})
      }
      await store.dispatch(carPolicyActionTypes.GET_CAR_COLORS)
    })
    const toggleSection = (index) => {
      const closeAllOther = sectionToggleValues.value.map(function (item, itemIndex) {
        if (itemIndex === index) {
          item = !item
        } else {
          item = false
        }
        return item
      })
      sectionToggleValues.value = closeAllOther
    }
    // goToNext
    const validateOptions = (options, ErroField) => {
      ErroField.value = ''
      if (!options.some((item) => item.isActive === true)) {
        ErroField.value = 'required'
      } else {
        return true
      }
    }
    const scrollToSection = (sectionId) => {
      const element = document.querySelector(`#${sectionId}`) as HTMLElement
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
    const goToNext = (type, index) => {
      sectionToggleValues['value'][index] = false
      sectionToggleValues['value'][index + 1] = true
      let sectionID = ''
      if (type === 'step1') {
        checkStep1()
        sectionID = 'fuelSection'
      } else if (type === 'step2') {
        validateOptions(checkboxesValues, FuelTypeError)
        if (isChargingMandatory.value) {
          checkChargingFacility()
        }
        sectionID = 'bodyTypeSection'
      } else if (type === 'step3') {
        validateOptions(checkboxesStep3, bodyTypeError)
        sectionID = 'amountOfDoors'
      } else if (type === 'step4') {
        sectionID = 'carBrandsModels'
      } else if (type === 'car-brands') {
        sectionID = 'mandatoryAccessories'
      } else if (type === 'mandatory-accessories') {
        sectionID = 'factoryOptionsSection'
      } else if (type === 'factoryOptionsStep') {
        sectionID = 'uploadDocumentSection'
      }
      setTimeout(() => {
        scrollToSection(sectionID)
      }, 300)
    }
    const validateSections = () => {
      delete sectionsErrors['infoError']
      delete sectionsErrors['fuelTypeError']
      delete sectionsErrors['bodyTypeError']
      delete sectionsErrors['chargingMandatoryFields']
      let sectionId = ''
      let sectionIndex = 0
      if (!checkStep1()) {
        sectionsErrors['infoError'] = 'required'
        sectionId = 'infoSection'
        sectionIndex = 0
      }
      if (!validateOptions(checkboxesValues, FuelTypeError)) {
        sectionsErrors['fuelTypeError'] = 'required'
        if (!sectionId) {
          sectionId = 'fuelSection'
          sectionIndex = 1
        }
      }
      if (isChargingMandatory.value) {
        if (!checkChargingFacility()) {
          sectionsErrors['chargingMandatoryFields'] = 'required'
          if (!sectionId) {
            sectionId = 'fuelSection'
            sectionIndex = 1
          }
        }
      }
      if (!validateOptions(checkboxesStep3, bodyTypeError)) {
        sectionsErrors['bodyTypeError'] = 'required'
        if (!sectionId) {
          sectionId = 'bodyTypeSection'
          sectionIndex = 2
        }
      }
      if (Object.getOwnPropertyNames(sectionsErrors).length === 0) {
        return true
      } else {
        sectionToggleValues['value'][sectionIndex] = true
        scrollToSection(sectionId)
      }
    }
    const getBreadCrumbTitle = () => {
      let title = t('_carPolicy.newCarPolicy')
      if (route.params.id) {
        title = t('_carPolicy.editCarPolicy')
      }
      return title
    }
    const deleteFile = () => {
      fileDetails['file'] = {}
      fileDetails['fileName'] = ''
      store.dispatch(carPolicyActionTypes.DELETE_CARPOLICYDOCUMENT, {
        companyId: compId,
        carPolicyId: carPolicyByID.value.id
      })
    }
    const removeEmptyBrands = (brandsModelsArray) => {
      const tempbrandsModelsArray = JSON.parse(JSON.stringify(brandsModelsArray))
      tempbrandsModelsArray.forEach((item) => {
        if (!item.brand) {
          delete item['brand']
          delete item['models']
        }
      })
      return tempbrandsModelsArray.filter((item) => !(item && Object.keys(item).length === 0))
    }
    const removeType = (type) => {
      const tempFacility = JSON.parse(JSON.stringify(type))
      tempFacility.forEach((item) => {
        delete item['type']
        if ((!item['price'] && !item['chargingFacility']) || (!item['accessory'] && !item['price'])) {
          delete item['price']
          delete item['chargingFacility']
          delete item['accessory']
        }
        if (item['price']) item['price'] = convertToNumberAndFloat(item['price'])
      })
      return tempFacility.filter((item) => !(item && Object.keys(item).length === 0))
    }
    const changeTitle = (fuelTypeArray) => {
      const tempFuelTypeArray = JSON.parse(JSON.stringify(fuelTypeArray))
      const getPlugHybridIndex = fuelTypeArray.findIndex((item) => item.title == 'plug-in hybrid')
      if (getPlugHybridIndex !== -1) {
        tempFuelTypeArray[getPlugHybridIndex].title = 'plug_in_hybrid'
        return tempFuelTypeArray
      } else {
        return fuelTypeArray
      }
    }
    const publishCarPolicy = () => {
      if (validateSections()) {
        const formData = new FormData()
        formData.append('policyTitle', JSON.stringify(carPolicyTitle.value))
        formData.append('colorCode', JSON.stringify(selectedColorCode.value))
        formData.append('fuelType', JSON.stringify(changeTitle(fuelTypeArray.value)))
        formData.append('carBodyType', JSON.stringify(bodyTypeArray.value))
        formData.append('amountOfDoors', JSON.stringify({ min: sliderValue.value }))
        formData.append(
          'carBrandsAndModels',
          JSON.stringify(showPolicyBrandsModels.value ? removeEmptyBrands(brandModelsArray.value) : [])
        )
        formData.append(
          'mandatoryAccessories',
          JSON.stringify(!mandatoryAccessories.value[0]['accessory'] ? [] : removeType(mandatoryAccessories.value))
        )
        formData.append('mandatoryFactoryOptions', JSON.stringify(factoryOptionsArray.value))
        if (fileDetails['file']['name']) formData.append('document', fileDetails['file'] as File)
        formData.append(
          'chargingFacility',
          JSON.stringify(isChargingMandatory.value ? removeType(chargingFacility.value) : [])
        )
        formData.append('excludedColors', JSON.stringify(excludedColorsArray.value))
        if (route.params.id) {
          formData.append('_method', 'PUT')
          store.dispatch(carPolicyActionTypes.UPDATE_CARPOLICY, {
            companyId: compId,
            carPolicyId: carPolicyByID.value.id,
            data: formData
          })
        } else {
          store.dispatch(carPolicyActionTypes.ADD_CARPOLICY, {
            companyId: compId,
            data: formData
          })
        }
      }
    }
    const discardChanges = () => {
      router.push({ name: 'CarPolicyOverview' })
    }
    const deleteCarPolicy = () => {
      showPopup.value = true
    }
    onUnmounted(() => {
      store.commit(carPolicyMutationTypes.DELETE_CARPOLICYRESPONSE, '')
      store.commit(carPolicyMutationTypes.SET_DOCUMENT_RESPONSE, '')
    })
    return {
      colorCodes,
      selectedColorCode,
      selectColorCode,
      goToNext,
      carPolicyTitle,
      errors,
      onInput,
      FuelType,
      checkboxesValues,
      onCheck,
      selectElectricOption,
      selectHybridOption,
      selectedElectricOption,
      selectedHybridOption,
      selectedMileageOption,
      selectedDurationOption,
      selectMileageOption,
      selectDurationOption,
      chargingMandatoryOptions,
      selectMandatoryOptions,
      isChargingMandatory,
      chargingFacility,
      addFacility,
      onNameInput,
      onPriceInput,
      deleteFacility,
      step2Errors,
      checkboxesStep3,
      bodyTypeError,
      FuelTypeError,
      mandatoryAccessories,
      mandatoryAccessoriesErrors,
      factoryOptionsCheckboxes,
      selectCarPolicyBrand,
      models,
      brandModelsArray,
      selectModel,
      removeModel,
      addCarBrand,
      removeAllModels,
      deleteCarBrand,
      showPolicyBrandsModels,
      publishCarPolicy,
      fileDetails,
      fileChange,
      deleteFile,
      onFactoryCheck,
      onCarBodyCheck,
      bodyTypeArray,
      sliderValue,
      sliderDataOptions,
      sliderData,
      factoryOptionsArray,
      convertToNumberAndFloat,
      loader,
      sectionToggleValues,
      toggleSection,
      checkChargingFacility,
      checkAddChargingFacility,
      carPolicyByID,
      getBreadCrumbTitle,
      discardChanges,
      route,
      showPopup,
      closePopup,
      onProceed,
      deleteCarPolicy,
      getBrands,
      deleteCarPolicyResponse,
      documentResponse,
      carColors,
      onCarColorsCheck,
      excludedColorsArray,
      companyDetailState,
      roles
    }
  }
})
</script>
<style lang="sass" scoped>
.colors-heading
  margin: 2.3em 0 0
.colors-wrap
  display: flex
  flex-wrap: wrap
  margin: 4em 0 0
  .options
    flex-basis: 47%
    &:nth-child(odd)
      margin: 0 5% 0 0 !important;
.delete-error
  top: 42px
.loader-block
  display: flex
  flex: 1
  justify-content: space-around
.charging-facility.facility-wrap
  margin: 4em 0 0
.facility-wrap
  margin: 0
  h3
    padding: 0 0 3rem 0
.disabled
  pointer-events: none
  background: $colorHubbleGreyLines !important
  color: $colorWhite !important
.general-infomation
  @media screen and (max-width: $mdBreakpoint - 1)
    flex-direction: column
    .half-width
      &:first-child
        margin-right: 0 !important
        margin-bottom: 5em
  .half-width
    &:first-child
      margin-right: 3em
.content-wrap
  margin-top: 5em
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
    position: relative
    .car-policy-steps
      display: flex
      flex: 1
      flex-direction: column
      margin: 7.5em 0 18em
      background: $colorWhite
      box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
      position: relative
      .general-infomation
        label
          font-size: 1.6em
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
        @media screen and (max-width: $mdBreakpoint - 1)
          flex-direction: column
        h3
          text-align: center
          width: 100%
        .half-width
          width: 50%
          position: relative
          display: flex
          flex-direction: column
          @media screen and (max-width: $mdBreakpoint - 1)
            width: 100%
            height: 48px
            &:first-child
              margin-bottom: 4em
      .next-block
        margin: 3.6em 0 5em
        display: flex
        justify-content: center
      .fuel-types
        display: flex
        flex-direction: column
      .body-type, .door-amount
        flex-direction: column
      .error-wrap
        text-align: center
        position: relative
        .error-message
          left: 0
          right: 0
          margin: auto
      .factory-options
        flex-direction: column
        .options
          margin: 0 0 1em 0
      .car-brands,  .policy-document
        flex-direction: column
      .policy-document
        button.disable
          background-color: $colorHubbleGreyLines
          pointer-events: none
</style>
<style lang="sass">
@import '~vue-slider-component/lib/theme/default.scss'
</style>
