<template>
  <div class="wrapper">
    <div class="close-button" @click="$emit('onClose')"></div>
    <div class="filterSidebar">
      <div class="contentSidebar">
        <h1 class="title">{{ $t('_generalTerms.adjustFilters') }}:</h1>
        <div class="wizard-step1">
          <span class="step-name">{{ $t('_wizard.step1.filterTitle') }}</span>
          <div class="wizard-inner-wrap slider-wrapper">
            <CustomSlider />
          </div>
        </div>
        <div class="wizard-step2 common-block">
          <span class="step-name">{{ $t('_wizard.step2.filterTitle') }} </span>
          <Wizard2 :checkboxesValues="fuelTypeCheckboxes" :isFilter="true" />
        </div>
        <div class="wizard-step3 common-block">
          <span class="step-name">{{ $t('_wizard.step3.filterTitle') }} </span>
          <Wizard3 :checkboxesValues="bodyTypeCheckboxes" :isFilter="true" />
        </div>
        <div class="wizard-step4 common-block">
          <span class="step-name">{{ $t('_wizard.step4.filterTitle') }} </span>
          <div class="row">
            <Wizard4 :checkboxesValues="gearBoxCheckboxes" :isFilter="true" />
          </div>
        </div>
        <div class="wizard-step5 common-block">
          <span class="step-name">{{ $t('_wizard.step5.filterTitle') }}</span>
          <Wizard5 :isFilter="true" />
        </div>
        <div class="wizard-step6 common-block">
          <span class="step-name">{{ $t('_wizard.step6.filterTitle') }}</span>
          <CargoSpace />
        </div>
        <div class="wizard-step7 common-block">
          <span class="step-name">{{ $t('_wizard.step7.filterTitle') }}</span>
          <Wizard7 :isFilter="true" />
        </div>
        <div class="wizard-step8 common-block">
          <span class="step-name">{{ $t('_wizard.step8.filterTitle') }}</span>
          <Wizard8 :isFilter="true" />
        </div>
        <div class="wizard-step9 common-block">
          <span class="step-name">{{ $t('_wizard.step9.filterTitle') }}</span>
          <Wizard9 :isFilter="true" />
        </div>
        <div class="wizard-step10 common-block">
          <span class="step-name"> {{ $t('_wizard.step11.filterTitle') }} </span>
          <!-- <Wizard10 :checkboxesValues="equipmentCheckboxes" :isFilter="true" /> -->
          <Wizard10 :isFilter="true" />
        </div>
        <div class="footer">
          <div class="buttons">
            <Button :text="$t('_generalTerms.applyFilters')" @onClick="$emit('applyFilters')" buttonType="dark" />
            <Button
              :text="$t('_generalTerms.discardChanges')"
              @onClick="$emit('discardFilters')"
              buttonType="transparent"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from '@/store'
import CustomSlider from '@/components/UI/CustomSlider.vue'
import Wizard2 from '@/components/Step1/wizard2.vue'
import Wizard3 from '@/components/Step1/wizard3.vue'
import Wizard4 from '@/components/Step1/wizard4.vue'
import Wizard5 from '@/components/Step1/wizard5.vue'
import Wizard7 from '@/components/Step1/wizard7.vue'
import Wizard8 from '@/components/Step1/wizard8.vue'
import Wizard9 from '@/components/Step1/wizard9.vue'
import Wizard10 from '@/components/Step1/wizard10.vue'
import CargoSpace from '@/components/CargoSpace.vue'
import Button from '@/components/UI/Button.vue'
import wizardFuelType from '@/mixins/wizards/WizardFuelType'
// import wizardEquipments from '@/mixins/wizards/WizardEquipments'
export default defineComponent({
  emits: ['onClose', 'applyFilters', 'discardFilters'],
  components: {
    CustomSlider,
    Wizard2,
    Wizard3,
    Wizard4,
    Wizard5,
    Wizard7,
    Wizard8,
    Wizard9,
    Wizard10,
    Button,
    CargoSpace
  },
  setup() {
    const store = useStore()
    const el = ref<HTMLDivElement>(document.createElement('div'))
    const { checkboxesStep2 } = wizardFuelType()
    const changeFilterSlider = ($event) => {
      console.log('slider', $event)
    }
    // wizard step 2
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
    // wizard step 3
    const checkboxesStep3 = reactive([
      {
        id: 'styled-checkbox1',
        value: 'SUV',
        isActive: false
      },
      {
        id: 'styled-checkbox2',
        value: 'Hatchbacks',
        isActive: false
      },
      {
        id: 'styled-checkbox3',
        value: 'Saloons',
        isActive: false
      },
      {
        id: 'styled-checkbox4',
        value: 'Coupes',
        isActive: false
      },
      {
        id: 'styled-checkbox5',
        value: 'Estate cars',
        isActive: false
      },
      {
        id: 'styled-checkbox6',
        value: 'MPV',
        isActive: false
      },
      {
        id: 'styled-checkbox8',
        value: 'Convertibles',
        isActive: false,
        isDisabled: false
      }
    ])
    if (sessionStorage.getItem('car_policy_body_type')) {
      const storedStepValue = JSON.parse(sessionStorage.getItem('car_policy_body_type') || '[]')
      checkboxesStep3.forEach((item) => {
        item.isDisabled = !storedStepValue.includes(item.value)
      })
    }
    const getSelectedBodyType = (storedStep, checkboxArray) => {
      const storedStepValue = JSON.parse(sessionStorage.getItem(`${storedStep}`) || '[]')
      storedStepValue.forEach((itemName) => {
        checkboxArray.forEach((item) => {
          if (item.value === itemName) {
            item.isActive = true
          }
        })
      })
      return checkboxArray
    }
    const bodyTypeCheckboxes = sessionStorage.getItem('body_type')
      ? getSelectedBodyType('body_type', checkboxesStep3)
      : checkboxesStep3
    // wizard step 4
    const checkboxesStep4 = reactive([
      {
        id: 'step4-styled-checkbox1',
        value: '_wizard.step4.manual',
        isActive: false,
        title: 'Manual'
      },
      {
        id: 'step4-styled-checkbox2',
        value: '_wizard.step4.automatic',
        isActive: false,
        title: 'Automatic'
      }
    ])
    const gearBoxCheckboxes = sessionStorage.getItem('transmission')
      ? getSelectedValue('transmission', checkboxesStep4)
      : checkboxesStep4
    // wizard step 10
    // const { equipmentCheckboxes } = wizardEquipments()
    return {
      store,
      el,
      fuelTypeCheckboxes,
      bodyTypeCheckboxes,
      gearBoxCheckboxes,
      // equipmentCheckboxes,
      changeFilterSlider
    }
  }
})
</script>

<style lang="sass">
@import '~vue-slider-component/lib/theme/default.scss'
.wrapper
  display: flex
  .close-button
    z-index: 20
    background: $colorWhite
    position: absolute
    top: 31px
    right: 385px
    height: 27px
    width: 27px
    border: 1px solid $colorHubbleGreyIcons
    border-radius: 50px
    @media screen and (max-width: $xsBreakpoint)
      right: 262px
    &:hover
      cursor: pointer
    &::before
      display: flex
      justify-content: center
      content: url(~@/assets/closeFilter.svg)
  .filterSidebar
    height: 100vh
    overflow-y: scroll
    @media screen and (min-width: $xxlBreakpoint)
      &::-webkit-scrollbar
        width: 0px
    .contentSidebar
      position: relative
      flex: 1
      padding: 3rem 0 6.5rem 0
      .footer
        width: 100%
        z-index: 100
        position: fixed
        bottom: 0
        box-sizing: border-box
        background: $colorWhite
        box-shadow: $shadowHubbleSmaller
        padding: 1.1rem 5.6rem 0.9rem 5.7rem
        @media screen and (max-width: $xsBreakpoint)
          padding: 1.1rem 15px 0.9rem 15px
        .buttons
          display: flex
          gap: 1.8rem
          button
            padding: 1.35rem 1.9rem
            @media screen and (max-width: $xsBreakpoint)
              padding: 1rem 1.9rem
      .title
        margin-bottom: 1.8rem
        padding: 0 3.4rem 0 4.7rem
      .wizard-step1
        display: flex
        flex-direction: column
        box-sizing: border-box
        padding: 1.5rem 0 0 0
        background: $colorHubbleLightBackground
        @media screen and (max-width: $mdBreakpoint)
          padding: 2.5rem 0 0 0
        .step-name
          padding: 0 3.4rem 0 4.7rem
          margin-bottom: 0.6rem
          @media screen and (max-width: $mdBreakpoint)
            padding: 0 3.4rem 0 1.7rem
        .slider-wrapper
          padding: 1.9rem 3.4rem 2rem 4.7rem
          @media screen and (max-width:$mdBreakpoint)
            padding: 2em 25px 3em !important
      .common-block
        padding: 1.5rem 3.4rem 1.6rem 4.7rem
        @media screen and (max-width:$mdBreakpoint)
          padding: 1.5rem 3.4rem 1.6rem 15px
      .wizard-step2
        display: flex
        flex-direction: column
        box-sizing: border-box
        .step-name
          margin-bottom: 0.9rem
        .checkbox-wrapper
          margin-bottom: 0.9rem
          &:last-child
            margin-bottom: 0
          .checkbox-wrap.active
            background-color: $colorWhite
          .dropdownRow
            flex-direction: row
            align-items: center
            .range-wrapper
              .drive-range
                display: flex
                flex: 1
                align-items: center
                p
                  font-size: 1.4rem
                  line-height: 2.2rem
      .wizard-step3
        display: flex
        flex-direction: column
        background: $colorHubbleLightBackground
        .step-name
          margin-bottom: 0.9rem
        .columns
          display: flex
          flex-direction: row
        .column
          display: flex
          flex: 1
          flex-direction: column
          .checkbox-wrapper
            margin-bottom: 0.9rem
            &:last-child
              margin-bottom: 0
            .checkbox-wrap.active
              background-color: $colorHubbleLightBackground
      .wizard-step4
        display: flex
        flex-direction: column
        padding: 1.5rem 3.4rem 2rem 4.7rem
        @media screen and (max-width: $mdBreakpoint)
          padding: 1.5rem 15px 2rem 15px
          .row
            flex-direction: column
            .checkbox-wrapper
              margin: 0 0 1em 0
        .step-name
          margin-bottom: 0.9rem
        .row
          display: flex
          .checkbox-wrapper
            &:first-child
              flex: 1
            &:last-child
              flex: 1
      .wizard-step5, .wizard-step7, .wizard-step8, .wizard-step9
        display: flex
        flex-direction: column
        padding: 1.5rem 0 0 0
        background: $colorHubbleLightBackground
        @media screen and (max-width: $mdBreakpoint)
          padding: 2.5rem 0 0 0
        .step-name
          margin-bottom: 0.6rem
          padding: 0 3.4rem 0 4.7rem
          @media screen and (max-width: $mdBreakpoint)
            padding: 0 3.4rem 0 1.7rem
        .wizard-inner-wrap
          .slider-wrapper
            padding: 1.9rem 3.4rem 2rem 4.7rem
            @media screen and (max-width: $mdBreakpoint)
              padding: 2em 25px 3em !important
      .wizard-step6
        display: flex
        flex-direction: column
        padding: 1.5rem 0 0 0
        @media screen and (max-width: $mdBreakpoint)
          padding: 2.5rem 0 0 0
        .step-name
          margin-bottom: 0.6rem
          padding: 0 3.4rem 0 4.7rem
          @media screen and (max-width: $mdBreakpoint)
            padding: 0 3.4rem 0 1.7rem
        .slider-wrapper
          padding: 1.9rem 3.4rem 2rem 4.7rem
          background: $colorWhite
          @media screen and (max-width: $mdBreakpoint)
            padding: 2em 25px 3em !important
      .wizard-step7
      .wizard-step8
        background: $colorWhite
        .slider-wrapper
          background: $colorWhite
      .wizard-step9
      .wizard-step10
        display: flex
        flex-direction: column
        padding: 1.5rem 3.4rem 2rem 4.7rem
        background: $colorWhite
        @media screen and (max-width: $mdBreakpoint)
          padding: 1.5rem 15px 2rem 15px
        .step-name
          margin-bottom: 0.9rem
        .row
          display: flex
          flex: 1
          margin-bottom: 0.9rem
      .wizard-step11
        display: flex
        flex-direction: column
        background: $colorHubbleLightBackground
        padding: 1.5rem 3.4rem 2rem 4.7rem
        @media screen and (max-width: $mdBreakpoint)
          padding: 1.5rem 15px 2rem 15px
          .side-padding
            padding: 0
        .step-name
          margin-bottom: 0.9rem
        .active-search
          box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
          border-radius: 5px
          .search-brands
            &:after
              content: ""
              border-bottom: 1px solid $borderColor
              content: ""
              width: 93%
              position: absolute
              bottom: 0
              margin: auto
              left: 0
              right: 0
            input[type="text"]
              background-color: $colorWhite
              border-bottom-left-radius: 0
              border-bottom-right-radius: 0
        .search-wrap.open
          height: 42rem
        .search-brands
          display: flex
          position: relative
        .dropdown
          display: flex
          flex-direction: column
          padding: 0 1em 0 2.3em
          @media screen and (max-width: $xsBreakpoint)
            padding-left: 1.3em
          h4
            color: $colorHubbleDarkGrey
            font-weight: normal
            font-size: 1.4em
            margin: 0.5em 0
          .brand-main-wrap
            display: flex
            max-height: 33em
            overflow-y: scroll
            padding: 0 1.2em 0 0
            flex-direction: column
            &::-webkit-scrollbar
              width: 6px
            &::-webkit-scrollbar-thumb
              background: $colorHubble
              border-radius: 10px
            &::-webkit-scrollbar-track
              background: $colorHubbleGreyLines
              border-radius: 10px
            .popular-brands, .other-brand
              display: flex
              flex-direction: column
              div.brand
                flex-basis: 47.2%
                margin-bottom: 1em
                @media screen and (max-width: $xsBreakpoint)
                  flex-basis: 100%
                  &:nth-child(2n + 1)
                    margin-right: 0
                  .wizards
                    padding-right: 0
        .selected-brands
          display: flex
          flex-direction: column
          h4
            display: flex
            align-items: center
            margin: 1.7em 0 0
            font-size: 15px
            line-height: 18px
            font-weight: normal
            color: $colorHubbleText
            overflow: hidden
          ul
            display: flex
            flex-wrap: wrap
            padding: 0
            margin: 1rem 0 0
            li
              &.remove-all
                background-color: $colorHubbleLightBackground
                border: none
            li
              display: flex
              align-items: center
              border: 1px solid $colorHubble
              color: $colorHubble
              line-height: 18px
              font-size: 15px
              font-family: 'Lato-semibold'
              align-items: center
              padding: 0.6em 1em
              border-radius: 5px
              margin: 0 0.6em 0.6em 0
              background: $colorWhite
              span.remove-icon
                cursor: pointer
                @include backgroundImage('close.svg')
                width: 11px
                height: 12px
                margin-left: 6px
</style>