<template>
  <div class="main-wrap" v-if="!loader">
    <div class="step">
      <span>01</span>
    </div>
    <div class="title-section">
      <h3 class="title">{{ $t('_step1.selectCar') }}</h3>
      <p class="description t2">{{ $t('_step1.descSelectCar') }}</p>
    </div>
    <div class="main-content">
      <div class="left-section">
        <div class="info">
          <h3 class="title">{{ $t('_step1.helpChooseCar') }}</h3>
          <p class="description t2">{{ $t('_step1.descHelpChooseCar') }}</p>
        </div>
        <div class="button-wrapper">
          <Button :text="$t('_step1.launchWizard')" @onClick="goToWizard" buttonType="dark arrow--right" />
        </div>
      </div>
      <div class="right-section">
        <div class="info">
          <h3 class="title">{{ $t('_step1.iNeedThisCar') }}</h3>
        </div>
        <div class="dropdown-wrapper">
          <div class="inner-section">
            <Dropdown
              :key="componentKey"
              :items="filteredBrands"
              :selectedOption="selectedBrand"
              @onChange="selectBrand"
              :isSearch="true"
              :isBrandsSearch="true"
              type="step1Search"
            />
          </div>
          <div class="inner-section">
            <Dropdown
              :key="componentKey"
              :class="{ enable: models && models.length }"
              class="model-dropdown"
              :items="filteredModels"
              :selectedOption="selectedModel"
              @onChange="selectModel"
              :isSearch="true"
              type="step1Search"
            />
          </div>
        </div>
        <div class="button-wrapper" :class="{ 'brands-models-search': selectedBrand }">
          <Button
            :text="$t('_step1.continueToConfig')"
            buttonType="dark arrow--right disabled"
            :class="{ enabled: isBrandModelExist }"
            @onClick="goToResultsAndConfigure"
          />
        </div>
      </div>
      <div class="left-section side-section">
        <div class="info">
          <h3 class="title">{{ $t('_step1.showAll') }}</h3>
          <p class="description t2">{{ $t('_step1.descShowAll') }}</p>
        </div>
        <div class="button-wrapper">
          <Button :text="$t('_step1.showAll')" @onClick="showAllCars" buttonType="dark arrow--right" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, onUnmounted } from 'vue'
import router from '@/router'
import Button from '@/components/UI/Button.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import getCarBrandsModels from '@/mixins/getCarBrandsModels'
import Loader from '@/components/UI/Loader.vue'
import { useStore } from '@/store'
import { carBrandsModelType } from '@/types'
import { MutationTypes } from '@/store/options/mutations'
export default defineComponent({
  components: {
    Button,
    Dropdown,
    Loader
  },
  setup() {
    const store = useStore()
    const componentKey = ref(0)
    const getCarPolicyBrandsModels = computed(() => store.state.auth.carPolicyBrandsModels)
    const filteredBrands = computed(() =>
      store.getters.filteredBrands.map((item) => {
        return item.brand
      })
    )
    const searchString = computed(() => store.state.options.searchString)
    const searchModels = computed(() => store.state.options.searchModels)
    const filteredModels = computed(() => store.getters.filteredModels)
    const { carBrandsModels } = getCarBrandsModels()
    const selectedBrand = ref<string>('')
    const selectedModel = ref('')
    const models = ref()
    const brandModelsArray: { value: carBrandsModelType[] } = reactive({
      value: [{ brand: '', models: [] }]
    })
    const loader = computed(() => store.state.auth.loader)
    const selectBrand = (brand) => {
      let availableCarBrandsModels = carBrandsModels
      selectedModel.value = ''
      selectedBrand.value = brand
      if (getCarPolicyBrandsModels.value.length) {
        availableCarBrandsModels = getCarPolicyBrandsModels
      }
      const getModels = availableCarBrandsModels.value.filter((item) => {
        return item['brand'] == brand
      })
      let getAvailableModels
      if (!getModels[0].models.length) {
        getAvailableModels = carBrandsModels.value.find((item) => item.brand === brand)
      } else {
        getAvailableModels = getModels[0]
      }
      models.value = getAvailableModels.models.sort()
      store.commit(MutationTypes.SET_SELECTED_MODELS, models.value)
      brandModelsArray['value'][0]['brand'] = selectedBrand.value
      store.commit(MutationTypes.SET_SEARCH_STRING, brand)
      store.commit(MutationTypes.SET_SEARCH_MODELS, '')
      componentKey.value += 1
    }
    const selectModel = (item) => {
      selectedModel.value = item
      brandModelsArray['value'][0]['models'][0] = item.toLowerCase()
      sessionStorage.setItem('brands', JSON.stringify(brandModelsArray.value))
      store.commit(MutationTypes.SET_SEARCH_MODELS, item)
      componentKey.value += 1
    }
    const goToWizard = () => {
      sessionStorage.removeItem('brands')
      sessionStorage.removeItem('selectedIndex')
      // remove carPolicy settings
      sessionStorage.removeItem('plug_in_hybrid')
      sessionStorage.removeItem('hybrid')
      sessionStorage.removeItem('plug_in_hybrid_drive_range')
      sessionStorage.removeItem('electric_drive_range')
      sessionStorage.removeItem('fuel_type')
      sessionStorage.removeItem('body_type')
      sessionStorage.removeItem('doors')
      router.push({ name: 'step1Wizard' })
    }
    const isBrandModelExist = computed(() => {
      let isBrandModel = false
      if (
        filteredBrands.value.indexOf(searchString.value) > -1 &&
        filteredModels.value.indexOf(searchModels.value) > -1
      ) {
        isBrandModel = true
      }
      return isBrandModel
    })

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
    const goToResultsAndConfigure = () => {
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
      router.push({ name: 'Step2' })
      settingCarPloiciesValues()
    }

    const showAllCars = () => {
      sessionStorage.removeItem('budget')
      sessionStorage.removeItem('transmission')
      sessionStorage.removeItem('engine_power')
      sessionStorage.removeItem('cargo_space')
      sessionStorage.removeItem('towing_capacity')
      sessionStorage.removeItem('seats')

      if (sessionStorage.getItem('car_policy_fuel_type')) {
        const allowedFuelType = JSON.parse(sessionStorage.getItem('car_policy_fuel_type') || '[]')
        if (allowedFuelType.includes('electric')) {
          sessionStorage.setItem('electric_drive_range', sessionStorage.getItem('car_policy_electric_range') || '[]')
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
        sessionStorage.removeItem('fuel_type')
        sessionStorage.removeItem('plug_in_hybrid')
        sessionStorage.removeItem('hybrid')
        sessionStorage.removeItem('plug_in_hybrid_drive_range')
        sessionStorage.removeItem('electric_drive_range')
      }

      if (sessionStorage.getItem('car_policy_body_type')) {
        const allowedBodyType = JSON.parse(sessionStorage.getItem('car_policy_body_type') || '[]')
        sessionStorage.setItem('body_type', JSON.stringify(allowedBodyType))
      } else {
        sessionStorage.removeItem('body_type')
      }

      if (sessionStorage.getItem('car_policy_doors')) {
        const allowedDoors = JSON.parse(sessionStorage.getItem('car_policy_doors') || '[]')
        sessionStorage.setItem('doors', JSON.stringify(parseInt(allowedDoors.min)))
      } else {
        sessionStorage.removeItem('doors')
      }

      if (sessionStorage.getItem('car_policy_brands_models')) {
        const brandsModelsArray = JSON.parse(sessionStorage.getItem('car_policy_brands_models') || '')
        sessionStorage.setItem('brands', JSON.stringify(brandsModelsArray))
      } else {
        sessionStorage.removeItem('brands')
      }
      router.push({ name: 'Step2' })
    }
    const removeBrand = () => {
      selectedBrand.value = ''
    }
    const removeModel = () => {
      selectedModel.value = ''
    }
    onUnmounted(() => {
      store.commit(MutationTypes.SET_SEARCH_STRING, '')
      store.commit(MutationTypes.SET_SEARCH_MODELS, '')
    })
    return {
      selectedBrand,
      selectedModel,
      models,
      selectBrand,
      selectModel,
      goToWizard,
      carBrandsModels,
      loader,
      goToResultsAndConfigure,
      isBrandModelExist,
      filteredBrands,
      filteredModels,
      removeBrand,
      removeModel,
      componentKey,
      showAllCars
    }
  }
})
</script>

<style lang="sass" scoped>
.dropdown-wrapper
  .inner-section
    display: flex
    flex-direction: column
    flex: 1
    &:first-child
      margin-bottom: 1.5em
.main-wrap
  background: white
  height: 100%
  box-shadow: $shadowHubbleDashboard
  border-radius: 0.5em
  padding: 2em 3.1em 0 3em
  box-sizing: border-box
  .step
    position: absolute
    top: 41px
    left: 5px
    display: flex
    align-items: center
    justify-content: center
    width: 2.6em
    height: 2.6em
    background: $colorHubbleLightPurple
    border-radius: 100%
    span
      color: $colorHubble
      font-size: 1.3em
      line-height: 2.2rem
  .title-section
    display: flex
    flex-direction: column
    border-bottom: 1px solid $colorHubbleGreyLines
    .title
      margin-bottom: 1rem
    .description
      color: $colorHubbleDarkGrey
      margin-bottom: 1.5rem
  .main-content
    display: flex
    flex: 1
    flex-direction: column
    margin: 3em 0 7em 0
    .description
      color: $colorHubbleDarkGrey
    .left-section
      display: flex
      flex: 1
      justify-content: unset
      .info
        .title
          margin-bottom: 3rem
    .right-section
      display: flex
      flex-direction: column
      margin-left: 0
      justify-content: unset
      border-top: 1px solid $colorHubbleGreyLines
      padding-top: 3em
      .info
        margin-bottom: 1.5rem
      .dropdown-wrapper
        display: flex
        flex-direction: column
        .model-dropdown
          opacity: 0.3
          pointer-events: none
        .enable
          opacity: 1
          pointer-events: visible
        .dropdown
          margin: 0 0 1.5rem 0
    .left-section.side-section
      border-top: 1px solid $colorHubbleGreyLines
    .button-wrapper
      margin: 3em 0 0rem 0
      button
        padding: 0.95rem 1.95rem 0.95rem 2rem
@media only screen and (min-width: $xsBreakpoint)
  .main-wrap
    .main-content
      .right-section
        .dropdown-wrapper
          .dropdown
            &:first-child
              margin-bottom: 0
@media only screen and (min-width: $mdBreakpoint)
  .main-wrap
    height: 36.9rem
    .step
      left: 21px
    .main-content
      flex-direction: row
      .left-section
        padding-right: 3em
        .info
          margin-bottom: 4rem
      .right-section
        padding-left: 3.2em
        padding-right: 3.2em
        border-left: 1px solid $colorHubbleGreyLines
        border-right: 1px solid $colorHubbleGreyLines
        border-top: none
        padding-top: unset
        .dropdown-wrapper
          margin-top: 1rem
      .left-section.side-section
        border-top: none
        padding-left: 3.2em
        padding-right: 0
        .info
          .description
            margin-bottom: 2.2rem
</style>
