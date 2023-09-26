<template>
  <div class="sub-level-wrap">
    <div class="left-area">
      <div class="step1 common-step active">
        <h4>{{ $t('_configure.carSelectorWizard') }}</h4>
      </div>
      <Button
        :text="$t('_wizard.exitWizard')"
        @onClick="goToStep1"
        class="header_button"
        buttonType="transparent arrow--left"
      />
    </div>
    <div class="center-area">
      <div class="wizard-wrap">
        <div class="middle-wrap">
          <ProgressBar :step="selectedIndex + 1" />
          <component
            v-bind:is="components[selectedIndex]['label']"
            :checkboxesValues="checkboxesValues"
            @selectedBrands="selectedBrands"
            @selectedBudget="selectedBudget"
          ></component>
        </div>
        <div class="prev-next">
          <Button
            v-if="selectedIndex > 0"
            :text="windowWidth > 576 ? $t('_generalTerms.previousQues') : ''"
            @onClick="onClickPrev"
            class="header_button"
            :class="{ 'mobile-prev': windowWidth < 576 }"
            buttonType="light arrow--left"
          />
          <div class="skip-mobile-wrap">
            <Button
              v-if="!lastStep"
              :text="$t('_generalTerms.continue')"
              @onClick="onClickSkip"
              class="skip-button header_button"
              buttonType="transparent arrow--right"
            />
            <Button
              v-if="lastStep"
              :text="$t('_wizard.step11.continueWithBrands')"
              @onClick="onClickSkip"
              class="skip-button header_button"
              buttonType="transparent arrow--right"
            />
            <Button
              v-if="lastStep"
              id="lastButton"
              :class="{ disabled: !getSelectedBrands.value.length }"
              :text="windowWidth > 576 ? $t('_generalTerms.goToResults') : $t('_generalTerms.results')"
              @onClick="gotToResult"
              class="header_button"
              buttonType="dark arrow--right"
            />
            <Button
              v-if="!lastStep"
              id="nextButton"
              :class="{ disabled: !checkActives || checkIfEqualBudget() }"
              :text="windowWidth > 576 ? $t('_generalTerms.nextQues') : $t('_generalTerms.next')"
              @onClick="onClickNext"
              class="header_button"
              buttonType="dark arrow--right"
            />
          </div>
        </div>
        <div class="skip-wrap">
          <Button
            :text="lastStep ? $t('_wizard.step11.continueWithBrands') : $t('_generalTerms.skipThis')"
            @onClick="lastStep ? continueWithAllBrands() : onClickSkip()"
            class="header_button"
            buttonType="transparent arrow--right"
          />
        </div>
      </div>
    </div>
  </div>
  <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
    <div class="title h3">{{ $t('_warningPopup.title') }}</div>
    <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
  </Popup>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue'
// import { WizardFilter } from '@/types'
// import { MutationTypes } from '@/store/options/mutations'
import router from '@/router'
import Popup from '@/components/Popup.vue'
import Button from '@/components/UI/Button.vue'
import ProgressBar from '@/components/UI/ProgressBar.vue'
import wizard1 from '@/components/Step1/wizard1.vue'
import wizard2 from '@/components/Step1/wizard2.vue'
import wizard3 from '@/components/Step1/wizard3.vue'
import wizard4 from '@/components/Step1/wizard4.vue'
import wizard5 from '@/components/Step1/wizard5.vue'
import wizard6 from '@/components/Step1/wizard6.vue'
import wizard7 from '@/components/Step1/wizard7.vue'
import wizard8 from '@/components/Step1/wizard8.vue'
import wizard9 from '@/components/Step1/wizard9.vue'
import wizard10 from '@/components/Step1/wizard10.vue'
// import wizard11 from '@/components/Step1/wizard11.vue'
import onWindowResize from '@/mixins/onWindowResize'
import wizardBodyType from '@/mixins/wizards/WizardBodyType'
import wizardFuelType from '@/mixins/wizards/WizardFuelType'
// import wizardEquipments from '@/mixins/wizards/WizardEquipments'
export default defineComponent({
  emits: ['clickPrev'],
  components: {
    Button,
    wizard1,
    wizard2,
    wizard3,
    wizard4,
    wizard5,
    wizard6,
    wizard7,
    wizard8,
    wizard9,
    wizard10,
    // wizard11,
    ProgressBar,
    Popup
  },
  setup(props, { emit }) {
    const selectedIndex = sessionStorage.getItem('selectedIndex')
      ? ref(JSON.parse(sessionStorage.getItem('selectedIndex') || '0'))
      : ref(0)
    const getSelectedBrands = reactive({ value: JSON.parse(sessionStorage.getItem('brands') || '[]') })
    const getSelectedBudget = reactive({
      value: sessionStorage.getItem('budget') ? JSON.parse(sessionStorage.getItem('budget') || '') : [0, 2500]
    })
    const showPopup = ref(false)
    const { windowWidth } = onWindowResize()
    const components = reactive([
      { label: 'wizard1' },
      { label: 'wizard2' },
      { label: 'wizard3' },
      { label: 'wizard4' },
      { label: 'wizard5' },
      { label: 'wizard6' },
      { label: 'wizard7' },
      { label: 'wizard8' },
      { label: 'wizard9' },
      { label: 'wizard10' }
      // { label: 'wizard11' }
    ])
    // for Each step, checkboxes values are stored into the session and get the same values from session on refresh
    // step2
    const { checkboxesStep2 } = wizardFuelType()
    const getSelectedValue = (storedStep, checkboxArray) => {
      const storedStepValue = JSON.parse(sessionStorage.getItem(`${storedStep}`) || '[]')
      storedStepValue.forEach((itemName) => {
        checkboxArray.forEach((item) => {
          if (item.title === itemName) {
            item.isActive = true
          }
        })
      })
      return checkboxArray
    }
    const fuelTypeCheckboxes = sessionStorage.getItem('fuel_type')
      ? getSelectedValue('fuel_type', checkboxesStep2)
      : checkboxesStep2
    // step3
    const { checkboxesStep3, bodyTypeCheckboxes } = wizardBodyType()
    // step4
    const checkboxesStep4 = reactive([
      {
        id: 'styled-checkbox1',
        value: '_wizard.step4.manual',
        desc: 'The gear box will be set to manual',
        isActive: false,
        wizardInfo: false,
        title: 'Manual'
      },
      {
        id: 'styled-checkbox2',
        value: '_wizard.step4.automatic',
        desc: 'The gear box will be set to automatic',
        isActive: false,
        wizardInfo: false,
        title: 'Automatic'
      }
    ])
    const gearBoxCheckboxes = sessionStorage.getItem('transmission')
      ? getSelectedValue('transmission', checkboxesStep4)
      : checkboxesStep4
    // step 10
    // const { equipmentCheckboxes } = wizardEquipments()
    watch(selectedIndex, (currentValue) => {
      sessionStorage.setItem('selectedIndex', JSON.stringify(currentValue))
    })
    const lastStep = computed(() => {
      return selectedIndex.value === components.length - 1
    })
    const checkboxesValues = computed(() => {
      let values
      if (components[selectedIndex.value]['label'] === 'wizard2') {
        values = fuelTypeCheckboxes
      } else if (components[selectedIndex.value]['label'] === 'wizard3') {
        values = bodyTypeCheckboxes
      } else if (components[selectedIndex.value]['label'] === 'wizard4') {
        values = gearBoxCheckboxes
      } /* else if (components[selectedIndex.value]['label'] === 'wizard10') {
        values = equipmentCheckboxes
      } */
      return values
    })
    const checkActives = computed(() => {
      let data
      if (checkboxesValues.value !== undefined) {
        checkboxesValues.value.forEach((element) => {
          if (element.isActive === true) {
            data = true
          }
        })
      } else {
        data = true
      }
      return data
    })
    const selectedBrands = (brands) => {
      getSelectedBrands.value = brands
    }
    const selectedBudget = (selectedBudget) => {
      getSelectedBudget.value = selectedBudget
    }
    const checkIfEqualBudget = () => {
      if (components[selectedIndex.value]['label'] === 'wizard1') {
        return getSelectedBudget.value[0] == getSelectedBudget.value[1]
      }
    }
    const resetStep = (resetItems) => {
      resetItems.forEach((item) => {
        // if((item['title'] !== 'plug_in_hybrid') && (item['title'] !== 'hybrid'))
        item.isActive = false
      })
    }
    const onClickPrev = () => {
      selectedIndex.value -= 1
      if (
        !sessionStorage.getItem('fuel_type') &&
        !sessionStorage.getItem('plug_in_hybrid') &&
        !sessionStorage.getItem('hybrid')
      )
        resetStep(checkboxesStep2)
      if (!sessionStorage.getItem('body_type')) resetStep(checkboxesStep3)
      if (!sessionStorage.getItem('transmission')) resetStep(checkboxesStep4)
      /* if (!sessionStorage.getItem('equipments'))
        resetStep(equipmentCheckboxes) */
      emit('clickPrev')
    }
    const onClickNext = () => {
      if (selectedIndex.value < components.length - 1) {
        selectedIndex.value += 1
      }
      if (selectedIndex.value == 1 && !sessionStorage.getItem('budget')) {
        sessionStorage.setItem('budget', JSON.stringify([0, 2500]))
      }
    }
    const onClickSkip = () => {
      if (selectedIndex.value < components.length - 1) {
        selectedIndex.value += 1
        let removedItem = ''
        if (selectedIndex.value == 1) {
          removedItem = 'budget'
        } else if (selectedIndex.value == 2) {
          if (sessionStorage.getItem('car_policy_fuel_type')) {
            const allowedFuelType = JSON.parse(sessionStorage.getItem('car_policy_fuel_type') || '[]')
            if (allowedFuelType.includes('electric')) {
              sessionStorage.setItem(
                'electric_drive_range',
                sessionStorage.getItem('car_policy_electric_range') || '[]'
              )
            }
            if (allowedFuelType.includes('plug_in_hybrid')) {
              sessionStorage.setItem('plug_in_hybrid', JSON.stringify(true))
              sessionStorage.setItem(
                'plug_in_hybrid_drive_range',
                sessionStorage.getItem('car_policy_plug-in-hybrid_range') || '[]'
              )
              const removeIndex = allowedFuelType.findIndex((item) => item == 'plug_in_hybrid')
              allowedFuelType.splice(removeIndex, 1)
            }
            if (allowedFuelType.includes('hybrid')) {
              sessionStorage.setItem('hybrid', JSON.stringify(true))
              const removeIndex = allowedFuelType.findIndex((item) => item == 'hybrid')
              allowedFuelType.splice(removeIndex, 1)
            }
            if (allowedFuelType.length > 0) {
              sessionStorage.setItem('fuel_type', JSON.stringify(allowedFuelType))
            }
          } else {
            removedItem = 'fuel_type'
            sessionStorage.removeItem('plug_in_hybrid')
            sessionStorage.removeItem('hybrid')
            sessionStorage.removeItem('plug_in_hybrid_drive_range')
            sessionStorage.removeItem('electric_drive_range')
          }
        } else if (selectedIndex.value == 3) {
          if (sessionStorage.getItem('car_policy_body_type')) {
            const allowedBodyType = JSON.parse(sessionStorage.getItem('car_policy_body_type') || '[]')
            sessionStorage.setItem('body_type', JSON.stringify(allowedBodyType))
          } else {
            removedItem = 'body_type'
          }
        } else if (selectedIndex.value == 4) {
          removedItem = 'transmission'
        } else if (selectedIndex.value == 5) {
          removedItem = 'engine_power'
        } else if (selectedIndex.value == 6) {
          removedItem = 'cargo_space'
        } else if (selectedIndex.value == 7) {
          removedItem = 'towing_capacity'
        } else if (selectedIndex.value == 8) {
          removedItem = 'seats'
        } else if (selectedIndex.value == 9) {
          if (sessionStorage.getItem('car_policy_doors')) {
            const allowedDoors = JSON.parse(sessionStorage.getItem('car_policy_doors') || '[]')
            sessionStorage.setItem('doors', JSON.stringify(parseInt(allowedDoors.min)))
          } else {
            removedItem = 'doors'
          }
        } /* else if (selectedIndex.value == 10) { 
          removedItem = 'equipments'
        } */
        sessionStorage.removeItem(removedItem)
      } else {
        router.push({ name: 'Step2' })
      }
    }
    const goToStep1 = () => {
      showPopup.value = true
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
      sessionStorage.removeItem('selectionAmount')
      router.push({ name: 'Step1' })
    }
    const closePopup = () => {
      showPopup.value = false
    }
    const gotToResult = () => {
      router.push({ name: 'Step2' })
    }
    const continueWithAllBrands = () => {
      if (sessionStorage.getItem('car_policy_brands_models')) {
        const brandsModelsArray = JSON.parse(sessionStorage.getItem('car_policy_brands_models') || '')
        sessionStorage.setItem('brands', JSON.stringify(brandsModelsArray))
      } else {
        sessionStorage.removeItem('brands')
      }
      router.push({ name: 'Step2' })
    }
    return {
      selectedIndex,
      windowWidth,
      onClickNext,
      onClickSkip,
      onClickPrev,
      components,
      checkboxesStep2,
      checkboxesStep3,
      checkboxesStep4,
      goToStep1,
      gotToResult,
      lastStep,
      checkboxesValues,
      checkActives,
      continueWithAllBrands,
      selectedBrands,
      getSelectedBrands,
      selectedBudget,
      getSelectedBudget,
      checkIfEqualBudget,
      showPopup,
      onProceed,
      closePopup
    }
  }
})
</script>
<style lang="sass" scoped>
.middle-wrap
  position: relative
  z-index: 0
  @media screen and (min-width: $mdBreakpoint)
    padding: 0 15px
.sub-level-wrap
  display: flex
  position: relative
  @media screen and (max-width: $mdBreakpoint)
    flex-direction: column
  .left-area
    max-width: 34.8em
    width: 100%
    button
      padding: 0 0 0 2.3em
    @media screen and (min-width: $mdBreakpoint)
      position: absolute
      left: 0
    @media screen and (max-width: $mdBreakpoint)
      display: flex
      padding: 0 15px
      box-sizing: border-box
      position: static
      align-items: center
      justify-content: space-between
      width: 100%
      max-width: 100%
      button
        display: none
      .common-step
        &:before
          left: 0
  .center-area
    flex: 2
    .wizard-wrap
      max-width: 67rem
      width: 100%
      margin: auto
      @media screen and (max-width: $xsBreakpoint)
        padding-bottom: 10em
      @media screen and (max-width: $mdBreakpoint)
        max-width: 100%
      @media screen and (min-width: $mdBreakpoint + 1px) and (max-width: $xlBreakpoint)
        margin-top: 9rem
        max-width: 56rem
      .progress-wrap
        padding: 0.9em 15px 3.7em 15px
        @media screen and (min-width: $mdBreakpoint)
          padding: 0.9em 0 3.7em 0
  .prev-next
    display: flex
    margin: 3.3em 0 1em 0
    padding: 1em 1.5rem
    @media screen and (max-width: $xsBreakpoint)
      width: unset
      box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
      margin: 3.3em 0 0 0
      position: fixed
      left: 0
      right: 0
      bottom: 0
      z-index: 1
      background-color: $colorWhite
      .light
        border-radius: 100%
        width: 2.9em
        height: 2.9em
        &:before
          padding-right: 0
    .mobile-prev
      &:before
        left: -1px
        position: relative
        top: -2px
    .skip-mobile-wrap
      display: flex
      margin-left: auto
      .skip-button
        display: none
        @media screen and (max-width: $xsBreakpoint)
          display: block
  .skip-wrap
    display: flex
    justify-content: flex-end
    padding: 0 1.5rem 2.3em 1.5rem
    @media screen and (max-width: $xsBreakpoint)
      display: none
</style>
