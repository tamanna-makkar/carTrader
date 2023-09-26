<template>
  <div v-if="!loader">
    <div class="main-wrap">
      <div class="step-wrap step1 common-step hide-on-desktop">
        <h4>{{ $t('_configure.carSelectorWizard') }}</h4>
        <span class="checked"></span>
      </div>
      <div class="step-wrap step2 active">
        <!-- default layer -->
        <div class="first-layer active">
          <h4>{{ $t('_configure.pickYourCar') }}</h4>
          <div class="mobile-back">
            <BackButton v-if="!showMoreVersion" @onBack="$router.go(-1)" />
            <BackButton v-else :textToShow="$t('_step2.backToResults')" @onBack="showMoreVersion = false" />
          </div>
          <Button
            :text="$t('_generalTerms.adjustFilters')"
            @onClick="showFilters"
            buttonType="light filter"
            class="hide-mobile"
          />
        </div>
        <!-- default layer on mobile -->
        <div class="second-layer">
          <Button
            class="mobile-back"
            :text="$t('_generalTerms.filters')"
            @onClick="showFilters"
            buttonType="light filter"
          />
          <div class="buttons" v-if="showResults.length">
            <Button v-if="position === 1" @onClick="previous" buttonType="light arrow--left--disabled" />
            <Button v-if="position > 1" @onClick="previous" buttonType="light arrow--left" />
            <Button
              v-if="
                windowWidth < 500
                  ? position >= showResults.length || position === selectionAmount + 1
                  : position >= showResults.length || position === selectionAmount
              "
              @onClick="next"
              buttonType="light arrow--right--disabled"
            />
            <Button
              v-else-if="position < showResults.length && position < selectionAmount + 1"
              @onClick="next"
              buttonType="dark arrow--right"
            />
          </div>
        </div>
      </div>
      <div class="content" v-if="wizardResults.length">
        <div v-if="showMoreVersion" class="more-versions-heading">
          <BackButton :textToShow="$t('_step2.backToResults')" @onBack="showMoreVersion = false" />
          <h3 v-if="wizardInnerHits.value.length">
            {{ $t('_step2.AllVersionsOf') }} {{ brandAndModel['brand'] }} {{ brandAndModel['model'] }}
          </h3>
          <h3 v-else class="error-message-heading">{{ $t('_step2.noVersionsFound') }}</h3>
        </div>
        <div class="carousel" tag="div" id="carousel">
          <div class="selections">
            <div class="selection-wrapper">
              <div
                v-for="(item, index) in showResults.slice(0, selectionAmount)"
                :key="item._source.vehicle_id"
                class="slide selection"
                id="slide"
              >
                <CarResults
                  :item="item"
                  :currentIndex="index"
                  :wizardRequestBody="wizardRequestBody"
                  :showMoreVersion="showMoreVersion"
                  @selectAndConfigure="selectAndConfigure"
                  @moreVersions="moreVersions"
                  @toggleComplyPopup="toggleComplyPopup"
                />
              </div>
              <div class="mobile-buttons">
                <Button
                  v-if="selectionAmount < showResults.length"
                  :text="$t('_step2.btnMoreOptions')"
                  @onClick="moreOptions"
                  buttonType="light"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="button-wrapper">
          <Button
            v-if="selectionAmount < showResults.length"
            :text="$t('_step2.btnMoreOptions')"
            @onClick="moreOptions"
            buttonType="light"
          />
          <Button
            v-if="allSavedCars.length > 1"
            :text="$t('_step2.goToCompare')"
            @onClick="goToCompare"
            buttonType="light arrow--right"
          />
        </div>
      </div>
      <div v-else class="content error-message-block">
        <h3>{{ $t('_generalTerms.noResultsFound') }}</h3>
      </div>
    </div>
    <transition name="slide" appear>
      <div class="fixed-to-side" :class="{ active: showFilterSidebar }">
        <FilterSidebar @onClose="hideFilters" @applyFilters="applyFilters" @discardFilters="discardFilters" />
      </div>
    </transition>
    <teleport to="body">
      <div class="backdrop" v-if="showFilterSidebar" @click="showFilterSidebar = false"></div>
    </teleport>
  </div>
  <div v-if="loader" class="car-loader">
    <loader />
  </div>
  <Popup
    :CloseButton="true"
    :isRequiredPopup="true"
    v-if="showComplyPopup"
    @onClick="closeComplyPopup"
    @onClose="closeComplyPopup"
  >
    <div class="title h3">{{ $t('_step3.Car does not comply with the following settings') }}</div>
    <ul class="list-of-errors">
      <ul v-for="(option, index) in complyCarResponse" :key="index">
        <li>
          {{ $t(`_step3.${option}`) }}
        </li>
      </ul>
    </ul>
  </Popup>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive } from 'vue'
import { useStore } from '@/store'
import formatCurrency from '@/filters/CurrencyFormat'
import BackButton from '@/components/UI/BackButton.vue'
import Button from '@/components/UI/Button.vue'
import CarResults from '@/components/CarResults.vue'
import FilterSidebar from '@/components/UI/FilterSidebar.vue'
import { ActionTypes } from '@/store/wizardSteps/actions'
import loader from '@/components/UI/Loader.vue'
import onWindowResize from '@/mixins/onWindowResize'
import { ActionTypes as userCarsActionTypes } from '@/store/userCars/actions'
import { useRouter } from 'vue-router'
import { wizardStepsResponseAllHits } from '@/types'
import Popup from '@/components/Popup.vue'
export default defineComponent({
  components: {
    BackButton,
    Button,
    FilterSidebar,
    CarResults,
    loader,
    Popup
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const wizardResults = computed(() => store.state.wizardSteps.wizardResults)
    const backButtonPressed = computed(() => store.state.wizardSteps.backButtonPressed)
    const loader = computed(() => store.state.wizardSteps.loader)
    const userCarsLoader = computed(() => store.state.userCars.loader)
    const { windowWidth } = onWindowResize()
    const showComplyPopup = ref(false)
    const showMoreVersion = ref(false)
    const options = computed(() => store.state.options.options)
    const complyCarResponse = computed(() => store.state.options.complyCarResponse)
    const wizardInnerHits: { value: wizardStepsResponseAllHits[] } = reactive({ value: [] })
    const showResults = computed(() => (showMoreVersion.value ? wizardInnerHits.value : wizardResults.value))
    const allSavedCars = computed(() => store.state.userCars.savedCars)
    const brandAndModel = ref({})
    const showFilterSidebar = ref(false)
    const position = ref(1)
    const selectionAmount = sessionStorage.getItem('selectionAmount')
      ? ref(JSON.parse(sessionStorage.getItem('selectionAmount')))
      : ref(4)
    const wizardRequestBody = reactive({
      paginate: { offset: 0, limit: 100 }
    })
    const closeComplyPopup = () => {
      showComplyPopup.value = false
    }
    const toggleComplyPopup = () => {
      showComplyPopup.value = !showComplyPopup.value
    }
    const wizardSteps = reactive([
      'budget',
      'fuel_type',
      'plug_in_hybrid',
      'hybrid',
      'electric_drive_range',
      'plug_in_hybrid_drive_range',
      'body_type',
      'transmission',
      'engine_power',
      'cargo_space',
      'towing_capacity',
      'seats',
      'doors',
      'brands'
    ])

    const settingCarPloiciesValues = () => {
      const carPolicyFuelTypes = JSON.parse(sessionStorage.getItem('car_policy_fuel_type') || '[]')
      const filteredFuelTypes = carPolicyFuelTypes.filter((e) => e !== 'plug_in_hybrid' && e !== 'hybrid')

      if (filteredFuelTypes.length > 0) {
        // Setting fuel values
        sessionStorage.setItem('fuel_type', JSON.stringify(filteredFuelTypes))

        if (sessionStorage.getItem('car_policy_electric_range') && filteredFuelTypes.includes('electric')) {
          const carPolicyElectricRange = JSON.parse(sessionStorage.getItem('car_policy_electric_range') || '[]')
          sessionStorage.setItem('electric_drive_range', JSON.stringify(carPolicyElectricRange))
        }
      }

      // Adding Hybrid true if it exists
      if (carPolicyFuelTypes.includes('hybrid')) {
        sessionStorage.setItem('hybrid', JSON.stringify(true))
      }

      // Adding Plugin Hybrid Range
      if (
        sessionStorage.getItem('car_policy_plug-in-hybrid_range') &&
        !sessionStorage.getItem('plug_in_hybrid_drive_range')
      ) {
        const carPolicyPluginHybridRange = JSON.parse(sessionStorage.getItem('car_policy_plug-in-hybrid_range') || '[]')
        sessionStorage.setItem('plug_in_hybrid', JSON.stringify(true))
        sessionStorage.setItem('plug_in_hybrid_drive_range', JSON.stringify(carPolicyPluginHybridRange))
      }
    }

    const initializeRequest = async () => {
      if (sessionStorage.getItem('car_policy_fuel_type') && !sessionStorage.getItem('fuel_type')) {
        const carPolicyFuelTypes = JSON.parse(sessionStorage.getItem('car_policy_fuel_type') || '[]')
        const filteredFuelTypes = carPolicyFuelTypes.filter((e) => e !== 'plug_in_hybrid' && e !== 'hybrid')

        //// Direct selection or direct at step 2
        if (!sessionStorage.getItem('plug_in_hybrid') && !sessionStorage.getItem('hybrid')) {
          settingCarPloiciesValues()
        }
        if (
          !sessionStorage.getItem('plug_in_hybrid') &&
          !sessionStorage.getItem('hybrid') &&
          filteredFuelTypes.length != 0
        ) {
          sessionStorage.setItem('fuel_type', JSON.stringify(filteredFuelTypes))
        }

        // Adding electric drive Range
        if (
          sessionStorage.getItem('car_policy_electric_range') &&
          !sessionStorage.getItem('electric_drive_range') &&
          filteredFuelTypes.includes('electric')
        ) {
          const carPolicyElectricRange = JSON.parse(sessionStorage.getItem('car_policy_electric_range') || '[]')
          sessionStorage.setItem('electric_drive_range', JSON.stringify(carPolicyElectricRange))
        }

        if (
          sessionStorage.getItem('car_policy_plug-in-hybrid_range') &&
          !sessionStorage.getItem('plug_in_hybrid_drive_range') &&
          sessionStorage.getItem('plug_in_hybrid')
        ) {
          const carPolicyPluginHybridRange = JSON.parse(
            sessionStorage.getItem('car_policy_plug-in-hybrid_range') || '[]'
          )
          sessionStorage.setItem('plug_in_hybrid_drive_range', JSON.stringify(carPolicyPluginHybridRange))
        }
      }
      if (sessionStorage.getItem('car_policy_body_type') && !sessionStorage.getItem('body_type')) {
        const allowedBodyType = JSON.parse(sessionStorage.getItem('car_policy_body_type') || '[]')
        sessionStorage.setItem('body_type', JSON.stringify(allowedBodyType))
      }

      if (sessionStorage.getItem('car_policy_doors') && !sessionStorage.getItem('doors')) {
        const minDoors = JSON.parse(sessionStorage.getItem('car_policy_doors') || '[]')
        sessionStorage.setItem('doors', JSON.stringify(minDoors['min']))
      }
      // If user has not selected the electric drive range, we pick electric range from car policy
      if (
        sessionStorage.getItem('fuel_type') &&
        sessionStorage.getItem('fuel_type').includes('electric') &&
        !sessionStorage.getItem('electric_drive_range') &&
        sessionStorage.getItem('car_policy_electric_range')
      ) {
        sessionStorage.setItem('electric_drive_range', sessionStorage.getItem('car_policy_electric_range'))
      }

      // If user has not selected the plugin hybrid range, we pick plugin hybrid range from car policy
      if (
        sessionStorage.getItem('plug_in_hybrid') &&
        !sessionStorage.getItem('plug_in_hybrid_drive_range') &&
        sessionStorage.getItem('car_policy_plug-in-hybrid_range')
      ) {
        sessionStorage.setItem('plug_in_hybrid_drive_range', sessionStorage.getItem('car_policy_plug-in-hybrid_range'))
      }

      wizardSteps.forEach((item) => {
        if (
          sessionStorage.getItem('electric_drive_range') &&
          JSON.parse(sessionStorage.getItem('electric_drive_range') || '') == 0
        ) {
          sessionStorage.removeItem('electric_drive_range')
        }
        if (
          sessionStorage.getItem('plug_in_hybrid_drive_range') &&
          JSON.parse(sessionStorage.getItem('plug_in_hybrid_drive_range') || '') == 0
        )
          sessionStorage.removeItem('plug_in_hybrid_drive_range')
        if (sessionStorage.getItem(item)) wizardRequestBody[item] = JSON.parse(sessionStorage.getItem(item) || '')
        else delete wizardRequestBody[item]

        if (
          wizardRequestBody['electric_drive_range'] &&
          (!wizardRequestBody['fuel_type'] || !wizardRequestBody['fuel_type'].includes('electric'))
        ) {
          delete wizardRequestBody['electric_drive_range']
        }
      })

      await store.dispatch(ActionTypes.POST_WIZARDSTEPS, wizardRequestBody)
    }
    onMounted(async () => {
      await initializeRequest()
      if (backButtonPressed.value && window.history.state) {
        const left = window.history.state.scroll.left
        const top = window.history.state.scroll.top
        window.scrollTo({ left: left, top: top, behavior: 'smooth' })
      }
      await store.dispatch(userCarsActionTypes.GET_ALLSAVEDCARS, { status: 0 })
    })
    const convertToCommas = (selectedOption) => {
      return selectedOption.replace('.', ',')
    }
    const hideFilters = () => {
      showFilterSidebar.value = false
    }
    const showFilters = () => {
      showFilterSidebar.value = true
    }
    const next = () => {
      const slides = selectionAmount.value + 1
      const carousel = document.getElementById('carousel')
      if (slides > position.value) {
        position.value = position.value + 1
        carousel?.scrollTo(269 * (position.value - 1) + 35 * (position.value - 1), 0)
      }
    }
    const previous = () => {
      const carousel = document.getElementById('carousel')
      if (position.value > 1) {
        position.value = position.value - 1
        if (position.value === 1) {
          carousel?.scrollTo(0, 0)
        }
        carousel?.scrollTo(269 * (position.value - 1) + 35 * (position.value - 1), 0)
      }
    }
    const moreOptions = () => {
      selectionAmount.value = selectionAmount.value + 20
      const carousel = document.getElementById('carousel')
      setTimeout(function () {
        carousel?.scrollTo(269 * (position.value - 1) + 35 * (position.value - 1), 0)
      }, 100)
      sessionStorage.setItem('selectionAmount', JSON.stringify(selectionAmount.value))
    }
    const selectAndConfigure = (vehicleId) => {
      const params = { vehicleId: vehicleId.slice(0, -8) }
      router.push({ name: 'Step3', params })
    }
    const applyFilters = async () => {
      await initializeRequest()
      hideFilters()
      showMoreVersion.value = false
    }
    const discardFilters = async () => {
      wizardSteps.forEach((item) => {
        if (wizardRequestBody[item]) sessionStorage.setItem(item, JSON.stringify(wizardRequestBody[item]))
        else sessionStorage.removeItem(item)
      })
      await initializeRequest()
      hideFilters()
      showMoreVersion.value = false
    }
    const moreVersions = (innerHits) => {
      showMoreVersion.value = true
      wizardInnerHits.value = innerHits['hits']
      brandAndModel.value['brand'] = innerHits['brand']
      brandAndModel.value['model'] = innerHits['model']
      window.scrollTo(0, 0)
    }

    const goToCompare = () => {
      const carOrderIds: number[] = allSavedCars.value.map((e) => {
        return e.id
      })
      router.push({
        name: 'CompareCars',
        query: { id: carOrderIds }
      })
    }
    return {
      store,
      showFilterSidebar,
      position,
      selectionAmount,
      formatCurrency,
      hideFilters,
      showFilters,
      next,
      previous,
      moreOptions,
      wizardResults,
      convertToCommas,
      loader,
      windowWidth,
      selectAndConfigure,
      applyFilters,
      discardFilters,
      wizardRequestBody,
      moreVersions,
      showMoreVersion,
      showResults,
      wizardInnerHits,
      brandAndModel,
      complyCarResponse,
      showComplyPopup,
      closeComplyPopup,
      options,
      toggleComplyPopup,
      userCarsLoader,
      goToCompare,
      allSavedCars
    }
  }
})
</script>
<style lang="sass" scoped>
.mobile-buttons
  display: none
  @media screen and (max-width: $mdBreakpoint)
    display: flex
    align-items: center
    justify-content: center
    padding-right: 1.45rem
    flex: 0 0 20em
    button
      padding: 1.35rem 2rem
.backdrop
  position: fixed
  background: $colorBlack
  top: 0
  width: 100%
  left: 0
  height: 100%
  z-index: 0
  opacity: 0.5
.fixed-to-side
  position: fixed
  transform: translateX(110%)
  top: 0
  right: 0
  width: 400px
  height: 100vh
  transition: all 0.4s ease-in-out
  z-index: 100
  background: #fff
  @media screen and (max-width: $xsBreakpoint)
    max-width: 280px
.active
  transform: translateX(0)
.hiding
  background-color: transparent !important
  color: transparent !important
  pointer-events: none
  &::before, &::after
    display: none

.more-versions-heading
    display: flex
    align-items: center
    position: relative
    margin: 0 0 3em
    button
      position: absolute
      left: 0
      top: 0
      display: none
      @media screen and (min-width: $mdBreakpoint + 1)
        display: flex
    h3
      width: 100%
      text-align: center
    h3.error-message-heading
      height: 60vh
.carousel-view
  display: flex
  flex-direction: column
  display: none
  @media screen and (max-width: $mdBreakpoint)
    display: block
.carousel
  @media screen and (max-width: $mdBreakpoint)
    display: flex
    width: 100%
    overflow: scroll
    scroll-behavior: smooth
    scrollbar-width: none
    &::-webkit-scrollbar
      display: none
.extra-option
  display: flex
  align-items: center
  flex: 0 0 18.5rem
  padding-right: 1.45rem
  box-sizing: border-box
  button
    padding: 1.4rem 2rem
.slide
  @media screen and (max-width: $mdBreakpoint)
    margin: 0.4rem 2rem 0 1.5rem
    flex: 0 0 26.9rem
    position: relative
    display: flex
    flex-direction: column
    background-color: $colorHubbleLightBackground
    border-radius: 5px
    box-sizing: border-box
    &:first-child
      background-color: $colorWhite
      box-shadow: $shadowHubbleResult
  .image-wrapper
    display: flex
    margin: 3.5rem 0 1rem 0
    justify-content: center
  .title
    text-align: center
    margin-bottom: 1rem
    height: 44px
    padding: 0 0.5rem
  .match-wrapper
    display: flex
    flex-direction: column
    align-items: center
    span
      color: $colorHubble
      font-size: 1.5rem
      line-height: 1.8rem
      font-weight: 600
      margin-top: 0.5rem
      &:hover
        cursor: pointer
    .match
      border-radius: 30px
      padding: 0.6rem 1rem
      color: $colorWhite
      border: none
      max-width: 103px
      &:hover
        cursor: unset
      &.green
        background-color: $colorHubbleGreen
        margin-bottom: 2.3rem
      &.gradient
        background: $colorHubbleGradient
      &.grey
        background-color: $colorHubbleGreyIcons
  .comparison-wrapper
    display: flex
    justify-content: center
    align-items: center
    margin-top: 2rem
    img
      margin-right: 1.5rem
    .comparison
      display: flex
      color: $colorHubble
      font-size: 1.5rem
      line-height: 1.8rem
      font-weight: 600
  .buttons
    display: flex
    position: absolute
    bottom: 0
    left: 0
    right: 0
    margin-top: 2rem
    button
      padding: 1.6rem 0
      &:first-child
        border-radius: 5px 0 0 5px
        width: 40%
      &:last-child
        border-radius: 0 5px 5px 0
        width: 60%
.versions.carousel
  .slide
    height: 557px
    .match-wrapper
      .match
        margin-bottom: 1rem
        &.green
          margin-bottom: 1rem
    .car-values
      margin-bottom: 1rem
      .row
        .t2
          display: flex
          img
            margin-top: 0.5rem
            margin-right: 0.6rem
            align-self: flex-start
          .hidden
            width: 14px
            height: 14px
            margin-right: 0.6rem
        .last
          position: relative
          flex-direction: column
          .equipment-wrapper
            display: flex
            .equipment
              word-break: break-word
              font-size: 1.4rem
              line-height: 2.2rem
          .more-equip
            display: flex
            width: 7rem
            font-weight: 700
            font-size: 1.4rem
            line-height: 2.2rem
            padding: 0.2rem 0.7rem
            border-radius: 3rem
            border: none
            background: $colorHubbleRed
            color: $colorWhite
            transition: 300ms ease-out
            margin-top: 0.6rem
            &:hover
              background: $colorHubble
          .tooltip
            top: 82px
            left: -80px
            width: 204px
            .equipment
              margin-bottom: 0.5rem
              .value
                display: flex
                align-items: center
                font-size: 1.4rem
                line-height: 2.2rem
    .buttons
      button
        border-radius: 5px !important
        &:first-child
          width: 100%
.hide
  display: none !important
.hide-mobile
  display: block
  @media screen and (max-width: $mdBreakpoint)
    display: none
.hide-tablet
  display: none
  @media screen and (max-width: $mdBreakpoint)
    display: block
.main-wrap
  display: flex
  flex-direction: column
  .step-wrap.hide-on-desktop
    @media screen and (max-width: $mdBreakpoint)
      display: none
  .step2
    display: flex
    flex-direction: column
    justify-content: space-between
    &:before
      content: none
    @media screen and (max-width: $mdBreakpoint)
      padding: 1.45rem 1.5rem !important
  .step1, .step2
    justify-content: space-between
  .step-wrap
    background-color: $colorWhite
    border-radius: 5px
    margin: 0 0 0.3em 0
    box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
    .checked
      @include backgroundImage('check.svg')
      width: 1.5em
      height: 1.5em
      border-radius: 100%
  .step2
    z-index: 0
    margin: 0
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    h4
      font-size: 15px
      margin: 1em 0
      @media screen and (max-width: $mdBreakpoint)
        padding-left: 2.5em !important
    .mobile-back
      button
        padding: 0.6rem 1.5rem 0.6rem 1.5rem
        display: none
        @media screen and (max-width: $mdBreakpoint)
          display: block
    .first-layer, .second-layer
      display: flex
      width: 100%
      justify-content: space-between
    .first-layer
      position: relative
      margin-bottom: 1.55rem
      @media screen and (max-width: $mdBreakpoint)
        align-items: center
      @media screen and (min-width: $mdBreakpoint + 1)
        padding: 1.8rem 2.95rem 0 3.3rem
        margin-bottom: 1rem
        box-sizing: border-box
      h4
        font-size: 15px
        font-family: 'Lato-semibold'
        line-height: 18px
        height: 18px
        color: $colorHubbleText
        @media screen and (min-width: $mdBreakpoint + 1)
          margin: 0.7rem 0 0 0
      &:before
        content: "02"
        position: absolute
        top: 50%
        transform: translateY(-50%)
        border-radius: 100%
        background-color: $colorHubbleGreyLines
        color: $colorWhite
        width: 26px
        text-align: center
        height: 26px
        font-size: 13px
        display: flex
        align-items: center
        justify-content: center
        font-family: 'Lato-semibold'
        left: -12px
        @media screen and (max-width: $mdBreakpoint)
          left: 0
      &.active
        &:before
          background-color: $colorHubbleLightPurple
          color: $colorHubble
    .versions.first-layer
      padding: 1.8rem 2.95rem 0 3.3rem
      h4
        padding-left: 0
        margin-top: 0.7rem
      @media screen and (min-width: $mdBreakpoint + 1px)
        &::before
          top: 78%
      @media screen and (max-width: $mdBreakpoint)
        padding: unset
      @media screen and (min-width: $mdBreakpoint)
        h4
          // padding: 0
          // margin-top: 0.7rem
      @media screen and (min-width: $mdBreakpoint + 1px)
        button
          &.dark
            display: none
      &.wizard
        padding: 2rem 2.95rem 2.5rem 3.3rem
        &::before
          top: 40%
        @media screen and (max-width: $mdBreakpoint)
          padding: unset
          &::before
            top: 50%
      h4
        @media screen and (max-width: $mdBreakpoint)
          margin-top: 1.2rem
    .second-layer
      .buttons
        display: flex
        gap: 10px
        button
          border-radius: 50px
          padding: 0.9rem 1.6rem
          &:before, &:after
            padding: 0
      @media screen and (min-width: $mdBreakpoint + 1)
        display: none
    .versions.second-layer
      padding: 0 3rem
      box-sizing: border-box
      margin: 0 0 2rem 0
      align-items: center
      button
        &.mobile-back
          display: none
          @media screen and (max-width: $mdBreakpoint)
            display: block
      @media screen and (min-width: $mdBreakpoint) and (max-width: $mdBreakpoint)
        .hiding
          display: none
      @media screen and (min-width: $mdBreakpoint + 1px)
        .buttons
          display: none
      @media screen and (max-width: $mdBreakpoint)
        padding: unset
        margin: 0
      &.noMargin
        margin: 0 !important
    .versions
      @media screen and (min-width: $mdBreakpoint)
        display: flex
  .content
    display: flex
    flex-direction: column
    background-color: $colorWhite
    padding: 0 3rem 4rem 3rem
    box-sizing: border-box
    width: 100%
    @media screen and (min-width: 1156px) and (max-width: 1439px)
      padding: 0 3.3rem 4rem 3rem
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 0 1.3rem 0
      width: 100vw
    .selections
      display: flex
      @media screen and (min-width: $mdBreakpoint + 1)
        margin: 1rem 0 0 0
        flex-wrap: wrap
      .selection-wrapper
        display: flex
        @media screen and (min-width: $mdBreakpoint + 1)
          flex-wrap: wrap
          flex: 1
        .selection
          background-color: $colorWhite
          filter: drop-shadow(1px 1px 10px rgba(109, 109, 109, 0.1))
          @media screen and (min-width: $mdBreakpoint + 1)
            position: relative
            display: flex
            flex: 0 0 22%
            margin-right: 4%
            margin-bottom: 5rem
            border-radius: 5px
            box-sizing: border-box
            &:nth-child(4n)
              margin-right: 0
          @media screen and (min-width: $mdBreakpoint + 1) and (max-width: 1155px)
            flex: 0 0 45%
            &:nth-child(2n+1)
              margin-right: 10%
            &:nth-child(2n)
              margin-right: 0
          @media screen and (min-width: 1156px) and (max-width: 1439px)
            flex: 0 0 28%
            margin-right: 8%
            &:nth-child(3n)
              margin-right: 0
            &:nth-child(4n)
              margin-right: 8%
          &:first-child
            filter: drop-shadow(1px 1px 10px rgba(44, 0, 171, 0.2))
          .image-wrapper
            display: flex
            margin: 3.5rem 0 1rem 0
            justify-content: center
          .title
            text-align: center
            margin-bottom: 1rem
            height: 44px
          .car-values
            display: flex
            flex-direction: column
            margin-bottom: 2rem
            .row
              display: flex
              flex: 1
              gap: 18px
              .t2
                flex: 1
                text-transform: capitalize
              i
                text-transform: lowercase
                font-style: normal
              .light
                width: 120px
                color: $colorHubbleDarkGrey
              .body-type-uppercase
                text-transform: uppercase
          .match-wrapper
            display: flex
            flex-direction: column
            align-items: center
            span
              color: $colorHubble
              font-size: 1.5rem
              line-height: 1.8rem
              font-weight: 600
              margin-top: 0.5rem
              &:hover
                cursor: pointer
            .match
              border-radius: 30px
              padding: 0.6rem 1rem
              color: $colorWhite
              border: none
              max-width: 103px
              &:hover
                cursor: unset
              &.green
                background-color: $colorHubbleGreen
                margin-bottom: 2.3rem
              &.gradient
                background: $colorHubbleGradient
              &.grey
                background-color: $colorHubbleGreyIcons
          .comparison-wrapper
            display: flex
            justify-content: center
            align-items: center
            margin-top: 2rem
            img
              margin-right: 1.5rem
            .comparison
              display: flex
              color: $colorHubble
              font-size: 1.5rem
              line-height: 1.8rem
              font-weight: 600
          .buttons, .hidden-space
            display: flex
            position: absolute
            bottom: 0
            left: 0
            right: 0
            margin-top: 2rem
            button
              padding: 1.6rem 0
              &:first-child
                border-radius: 5px 0 0 5px
                width: 40%
              &:last-child
                border-radius: 0 5px 5px 0
                width: 60%
          .versions
            button
              &:first-child
                width: 100%
          .hidden-space
            position: static
            margin-left: -15px
            margin-right: -15px
    .versions.selection-wrapper
      .selection
        height: 557px
        .match-wrapper
          .match
            margin-bottom: 1rem
            &.green
              margin-bottom: 1rem
        .car-values
          margin-bottom: 1rem
          .row
            .t2
              display: flex
              img
                margin-top: 0.5rem
                margin-right: 0.6rem
                align-self: flex-start
              .hidden
                width: 14px
                height: 14px
                margin-right: 0.6rem
            .last
              position: relative
              flex-direction: column
              .equipment-wrapper
                display: flex
                .equipment
                  word-break: break-word
                  font-size: 1.4rem
                  line-height: 2.2rem
              .more-equip
                display: flex
                width: 7rem
                font-weight: 700
                font-size: 1.4rem
                line-height: 2.2rem
                padding: 0.2rem 0.7rem
                border-radius: 3rem
                border: none
                background: $colorHubbleRed
                color: $colorWhite
                transition: 300ms ease-out
                margin-top: 0.6rem
                &:hover
                  background: $colorHubble
              .tooltip
                top: 82px
                left: -80px
                width: 204px
                .equipment
                  margin-bottom: 0.5rem
                  .value
                    display: flex
                    align-items: center
                    font-size: 1.4rem
                    line-height: 2.2rem
        .buttons
          button
            border-radius: 5px !important
            &:first-child
              width: 100%

    .button-wrapper
      display: flex
      justify-content: center
      margin-top: -2rem
      @media screen and (max-width: $mdBreakpoint)
        display: none
      &>*
        margin-right: 1rem
      button
        padding: 1.35rem 2rem
.loader-block, .error-message-block
  display: flex
  justify-content: center
.error-message-block
  height: 100vh
  padding: 0 15px !important
  text-align: center
  h3
    font-size: 18px
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
.car-loader
  position: fixed
  display: flex
  justify-content: center
  position: fixed
  z-index: 2
  left: 50%
  top: 33em
  align-self: center
  align-items: center
.loader-background
  opacity: 0.5
</style>
