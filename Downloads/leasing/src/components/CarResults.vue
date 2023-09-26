<template>
  <div class="wrap">
    <div class="inner-wrapper">
      <div class="image-wrapper">
        <img v-if="item['_source']['image_path']" :src="`${imagesURl}/${item['_source']['image_path']}`" />
        <div v-else>
          <img v-if="$i18n.locale == 'en'" src="@/assets/no_image.svg" />
          <img v-else src="@/assets/no-image-nl.svg" />
        </div>
      </div>
      <h3 class="title">
        <span v-if="!showMoreVersion"
          >{{ item['_source']['brand'] }} {{ item['_source']['model'] }}, {{ item['_source']['year'] }},</span
        >
        {{ item['_source']['car_version'] }}
      </h3>
      <div class="car-values">
        <div class="row">
          <span class="t2 light">{{ $t('_step2.listPrice') }}</span>
          <span class="t2">{{ formatCurrency(item['_source']['price']) }}</span>
        </div>
        <div class="row">
          <span class="labels light">{{ $t('_step2.monthlyCosts') }}</span>
          <span class="t2" v-if="item['fields']['auth_monthly_cost']">{{
            formatCurrency(item['fields']['auth_monthly_cost'])
          }}</span>
          <span class="labels" v-else>{{ $t('_step2.nA') }}</span>
        </div>
        <div class="row">
          <span class="labels light">{{ $t('_step2.bodyType') }}</span>
          <span class="t2 body-type">{{ $t(getTranslatedBodyType(capitalize(item['_source']['body_type']))) }}</span>
        </div>
        <div class="row">
          <span class="labels light">{{ $t('_step2.transmission') }}</span>
          <span class="t2">{{ $t(getTranslatedTransmission(item['_source']['transmission_name'])) }}</span>
        </div>
        <div class="row">
          <span class="labels light">{{ $t('_step2.co2') }}</span>
          <span class="t2">{{ convertToCommas(item['_source']['co2_emission']) }} <i>gr/km</i></span>
        </div>
      </div>
      <div class="diff-wrap" v-if="item.fields?.auth_monthly_cost">
        <div class="match-wrapper">
          <button class="match" :class="getMatchPercentageColors(item['_score'])">
            {{ getMatchPercentage(item['_score']) }}% match
          </button>
          <span v-if="getMatchPercentage(item['_score']) < 100" @click="openPopup">{{ $t('_step2.seeWhy') }}</span>
        </div>
        <div class="comparison-wrapper">
          <span class="unfavorite" @click="toggleFavorite" :class="{ favorite: isFavorite }"></span>
          <label v-if="isFavorite" class="comparison">{{ $t('_step2.savedForComparison') }}</label>
          <label v-else class="comparison">{{ $t('_step2.saveForComparison') }}</label>
        </div>
      </div>
      <div v-else class="diff-wrap">
        <p class="no-lease-rate">
          {{ $t('_step2.noLeaseRate') }}
        </p>
      </div>
    </div>
    <div class="buttons" :class="{ 'more-versions': showMoreVersion }">
      <Button
        :text="$t('_step2.btnMoreVersions')"
        buttonType="purple"
        @onClick="
          $emit('moreVersions', {
            hits: item['inner_hits']['car_version']['hits']['hits'],
            brand: item['_source']['brand'],
            model: item['_source']['model']
          })
        "
      />
      <Button
        :text="$t('_step2.btnSelectAndConf')"
        buttonType="dark"
        :disabled="!item.fields?.auth_monthly_cost"
        @onClick="$emit('selectAndConfigure', item['_source']['vehicle_id'])"
      />
    </div>
    <Popup v-if="showPopUp" @onClick="showPopUp = false">
      <template v-slot:selectionPopup>
        <div class="selectionPopup">
          <div class="popup-content">
            <div class="match-wrapper">
              <button class="match" :class="getMatchPercentageColors(item['_score'])">
                {{ getMatchPercentage(item['_score']) }}% match
              </button>
            </div>
            <div class="title h3">{{ $t('_step2.popupTitle') }}</div>
            <div class="car-values">
              <div class="row" v-if="getComparisonBudget(item['fields']['auth_monthly_cost'])">
                <span class="t2 label">{{ $t('_step2.monthlyCosts') }}</span>
                <span class="t2 value">
                  <span class="budget" :class="comparisonStatus"></span>
                  {{ formatCurrency(item['fields']['auth_monthly_cost']) }}
                  <span class="percentage-value" v-if="showLessHighBudget"
                    >({{ Math.round(showLessHighBudget) }}% {{ $t(`_step2.${comparisonStatus}`) }})</span
                  >
                </span>
              </div>
              <div
                class="row"
                v-if="
                  item['_source']['electric_drive_range'] &&
                  item['_source']['plug_in_hybrid'] &&
                  item['_source']['plug_in_hybrid_drive_range'] &&
                  getComparisonPlugInRange(item['_source']['plug_in_hybrid_drive_range'])
                "
              >
                <span class="t2 label">{{ $t('_step2.minRangePlugInHybrid') }}</span>
                <span class="t2 value">
                  <span
                    class="range"
                    :class="getComparisonPlugInRange(item['_source']['plug_in_hybrid_drive_range'])"
                  ></span>
                  {{ item['_source']['plug_in_hybrid_drive_range'] }} km
                  <span class="percentage-value" v-if="showLessPlugInRange"
                    >({{ Math.round(showLessPlugInRange) }}% {{ $t(`_step2.${electricComparisonStatus}`) }})</span
                  >
                </span>
              </div>
              <div
                class="row"
                v-else-if="
                  item['_source']['electric_drive_range'] &&
                  getComparisonElectricRange(item['_source']['electric_drive_range'])
                "
              >
                <span class="t2 label">{{ $t('_step2.minRangeElec') }}</span>
                <span class="t2 value">
                  <span
                    class="range"
                    :class="getComparisonElectricRange(item['_source']['electric_drive_range'])"
                  ></span>
                  {{ item['_source']['electric_drive_range'] }} km
                  <span class="percentage-value" v-if="showLessElectricRange"
                    >({{ Math.round(showLessElectricRange) }}% {{ $t(`_step2.${electricComparisonStatus}`) }})</span
                  >
                </span>
              </div>
              <div class="row" v-if="getComparisonEnginePower(item['_source']['engine_power'])">
                <span class="t2 label">{{ $t('_step2.enginePower') }}</span>
                <span class="t2 value">
                  <span class="engine-power" :class="getComparisonEnginePower(item['_source']['engine_power'])"></span>
                  {{ item['_source']['hp'] }} {{ $t('_step2.hp') }}
                </span>
              </div>
              <!-- Hide the equipments for now               
              <div class="row" v-if="checkIfMissingEquipments(item['_source'])">
                <span class="t2 label">{{ $t('_step2.missingEquipment') }}</span>
                <div class="column">
                  <div
                    v-for="(equipment, index) in missingEquipments()"
                    :key="index"
                    :class="{ hidden: item['_source'][equipment] }"
                  >
                    <span class="t2 value" v-if="!item['_source'][equipment]">
                      <i class="missing-icon"></i>
                      {{ $t(removeUnderscore(equipment)) }}
                    </span>
                  </div>
                </div>
              </div> -->
              <!-- <div class="row" v-if="checkIfBodyTypeExist(item['_source']['body_type'])">
                <span class="t2 label">{{ $t('_step2.bodyType') }}</span>
                <div class="column">
                  <span class="t2 value">
                    <i class="missing-icon"></i>
                    {{ $t(getTranslatedBodyType(checkIfBodyTypeExist(item['_source']['body_type']))) }}
                  </span>
                </div>
              </div> -->
              <div
                class="row suitcases"
                v-if="item['_source']['suitcase_limit'] < wizardRequestBody['cargo_space'] / 100"
              >
                <span class="t2 label">{{ $t('_wizard.step6.suitcases') }}</span>
                <span class="t2 value"
                  >{{ item['_source']['suitcase_limit'] }} (
                  {{ wizardRequestBody['cargo_space'] / 100 - item['_source']['suitcase_limit'] }}
                  {{ $t('_step2.less') }} )
                </span>
              </div>
              <div class="pop-up-button">
                <Button :text="$t('_step2.popupButton')" @onClick="showPopUp = false" buttonType="dark" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popup>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, ComputedRef } from 'vue'
import { useStore } from '@/store'
import formatCurrency from '@/filters/CurrencyFormat'
import Button from '@/components/UI/Button.vue'
import Popup from '@/components/UI/Popup.vue'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import { ActionTypes as userCarAction } from '@/store/userCars/actions'
import { savedCarsType } from '@/types'
export default defineComponent({
  emits: ['selectAndConfigure', 'moreVersions', 'toggleComplyPopup'],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    wizardRequestBody: {
      type: Object,
      default: () => ({})
    },
    showMoreVersion: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Button,
    Popup
  },
  setup(props, { emit }) {
    const store = useStore()
    const imagesURl = process.env.VUE_APP_IMG_URL
    const showPopUp = ref(false)
    const loader = computed(() => store.state.userCars.loader)
    const showLessHighBudget = ref()
    const showLessElectricRange = ref()
    const showLessPlugInRange = ref()
    const comparisonStatus = ref()
    const electricComparisonStatus = ref()
    const complyCarResponse = computed(() => store.state.options.complyCarResponse)
    const vehicleIdWithoutYear = ref(
      props.item._source.vehicle_id.substring(0, props.item._source.vehicle_id.length - 8)
    )
    const allSavedCars: ComputedRef<savedCarsType[]> = computed(() => store.state.userCars.savedCars)
    const savedCarsIds = computed(() => store.state.userCars.savedCarsIds)
    const isFavorite = computed(
      () => savedCarsIds.value.findIndex((e) => e === vehicleIdWithoutYear.value.toString()) !== -1
    )
    const formatMissingEquipments = (selectedOption) => {
      return selectedOption.replaceAll(' ', '_').toLowerCase()
    }
    const convertToCommas = (selectedOption) => {
      return selectedOption.replace('.', ',')
    }
    const getMatchPercentage = (score) => {
      const entireMaxScore = (score / 1) * 100
      return Math.round(entireMaxScore)
    }
    const getMatchPercentageColors = (score) => {
      let color = 'grey'
      if (getMatchPercentage(score) == 100) color = 'green'
      else if (getMatchPercentage(score) < 100 && getMatchPercentage(score) >= 80) color = 'gradient'
      else if (getMatchPercentage(score) <= 79) color = 'grey'
      return color
    }
    const openPopup = () => {
      showPopUp.value = true
    }
    const toggleFavorite = async () => {
      const carBody = {
        vehicleId: props.item._source.vehicle_id,
        monthlyCost: props.item._source.budget_monthly,
        carPrice: props.item._source.price,
        co2Emission: props.item._source.co2_emission,
        status: false,
        colors: [],
        options: [], // Needs to be changed in further steps
        otherAccessories: [],
        chargingFacilities: []
      }
      if (!isFavorite.value) {
        await store.dispatch(userCarAction.SAVE_CAR_ORDER, carBody)
        if (complyCarResponse.value && complyCarResponse.value.length) {
          emit('toggleComplyPopup')
        }
      } else {
        const savedCarIndex = allSavedCars.value.findIndex(
          (e) => +e.vehicleDetails.unique_identity_101 === +vehicleIdWithoutYear.value
        )
        if (savedCarIndex !== -1) {
          const savedCarId = allSavedCars.value[savedCarIndex].id
          await store.dispatch(userCarAction.DELETE_SAVED_CAR, [savedCarId])
        }
      }
    }
    const getComparisonBudget = (budget) => {
      if (props.wizardRequestBody.budget) {
        const selectedBudget = props.wizardRequestBody.budget
        if (budget < selectedBudget[0]) {
          comparisonStatus.value = 'lower'
          showLessHighBudget.value = (budget / selectedBudget[0]) * 100 - 100
        } else if (budget > selectedBudget[1]) {
          comparisonStatus.value = 'higher'
          showLessHighBudget.value = (budget / selectedBudget[1]) * 100 - 100
        } else if (selectedBudget[0] < budget < selectedBudget[1]) {
          return false
        }
      }
      return comparisonStatus.value
    }
    const getComparisonEnginePower = (power) => {
      power = parseFloat(power)
      let comparisonStatus = ''
      if (props.wizardRequestBody.engine_power) {
        const selectedEnginePower = parseInt(props.wizardRequestBody.engine_power)
        if (power > selectedEnginePower) {
          comparisonStatus = 'lower'
        }
      }
      return comparisonStatus
    }
    const getComparisonElectricRange = (electricRange) => {
      const userInput = parseInt(props.wizardRequestBody.electric_drive_range)
      electricRange = parseInt(electricRange)
      if (userInput !== 1) {
        if (electricRange < userInput) {
          electricComparisonStatus.value = 'less'
          showLessElectricRange.value = 100 - (electricRange / userInput) * 100
        }
      }
      return electricComparisonStatus.value
    }
    const getComparisonPlugInRange = (plugInRange) => {
      const userInput = parseInt(props.wizardRequestBody.plug_in_hybrid_drive_range)
      plugInRange = parseInt(plugInRange)
      if (userInput !== 1) {
        if (plugInRange < userInput) {
          electricComparisonStatus.value = 'less'
          showLessPlugInRange.value = 100 - (plugInRange / userInput) * 100
        }
      }
      return electricComparisonStatus.value
    }
    const getTranslatedTransmission = (selectedTransmission) => {
      let translatedTransmission = '_wizard.step4.manual'
      if (selectedTransmission == 'Automatic') {
        translatedTransmission = '_wizard.step4.automatic'
      }
      return translatedTransmission
    }
    const capitalize = (bodyType) => {
      let value
      if (bodyType !== 'SUV' && bodyType !== 'MPV') {
        value = bodyType.charAt(0).toUpperCase() + bodyType.slice(1).toLowerCase()
      } else {
        value = bodyType
      }
      return value
    }
    /* const checkIfBodyTypeExist = (bodyType) => {
      if (props.wizardRequestBody.body_type) {
        const lowercased = props.wizardRequestBody.body_type.map((name) => name.toLowerCase())
        if (!lowercased.includes(bodyType.toLowerCase())) {
          return capitalize(bodyType)
        } else {
          return false
        }
      }
    } */
    return {
      convertToCommas,
      formatCurrency,
      getMatchPercentage,
      getMatchPercentageColors,
      openPopup,
      showPopUp,
      isFavorite,
      toggleFavorite,
      getComparisonBudget,
      getComparisonEnginePower,
      formatMissingEquipments,
      showLessHighBudget,
      comparisonStatus,
      getComparisonElectricRange,
      showLessElectricRange,
      electricComparisonStatus,
      getComparisonPlugInRange,
      showLessPlugInRange,
      capitalize,
      getTranslatedTransmission,
      getTranslatedBodyType,
      imagesURl,
      loader,
      vehicleIdWithoutYear
    }
  }
})
</script>
<style lang="sass" scoped>
.labels
  font-size: 1.4rem
  line-height: 2.2rem
.diff-wrap
  justify-content: space-between
  flex-direction: column
  height: 91px
  display: flex
.no-lease-rate
  font-size: 14px
  color: $colorHubbleDarkGrey
  text-align: center
  line-height: 22px
.wrap
  display: flex
  flex-direction: column
  flex: 1
  .inner-wrapper
    display: flex
    flex-direction: column
    flex: 1
    @media screen and (min-width: $mdBreakpoint + 1)
      padding: 0px 1.5em 0 1.5em
  .image-wrapper
    display: flex
    margin: 3.5rem 0 1rem 0
    justify-content: center
    width: 150px
    height: 100px
    align-self: center
    img
      width: 100%
      object-fit: contain
  .title
    text-align: center
    margin-bottom: 1rem
    height: 44px
    flex: 1
    span
      font-size: 1.8rem
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 .9rem
  .car-values
    display: flex
    flex-direction: column
    margin-bottom: 2rem
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 .9rem
    .row
      display: flex
      flex: 1
      gap: 18px
      .t2
        text-transform: capitalize
        i
          text-transform: lowercase
          font-style: normal
      .light
        width: 120px
        color: $colorHubbleDarkGrey
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
      max-width: 128px
      font-family: 'Lato'
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
    span
      display: flex
      margin-right: 1.3rem
      cursor: pointer
      &:after
        content: ""
        width: 17px
        height: 17px
      &.unfavorite
        &:after
          @include backgroundImage('Star-notfilled.svg')
          background-size: 100%
      &.favorite
        &:after
          @include backgroundImage('Star.svg')
          background-size: 100%
  .buttons
    display: flex
    margin-top: 2rem
    button
      padding: 1.6rem 0
      &:first-child
        border-radius: 5px 0 0 5px
        width: 40%
      &:last-child
        border-radius: 0 5px 5px 0
        width: 60%
  .more-versions
    button
      &:first-child
        display: none
      &:last-child
        width: 100%
        border-radius: 5px
.selectionPopup
  .popup-content
    display: flex
    flex-direction: column
    padding: 0 3.2em
    .car-values
      display: flex
      flex-direction: column
      margin-bottom: 2rem
      .suitcases
        .label
          text-transform: capitalize
      .row
        display: flex
        justify-content: space-between
        margin-bottom: 1rem
        .value
          font-family: 'Lato-semibold'
        .label, .value
          width: 50%
        .label
          display: flex
          color: $colorHubbleDarkGrey
        .hidden
          display: none
        .column
          display: flex
          flex-direction: column
          flex: 1
          span
            padding-left: 1em
            width: 100%
        .value
          position: relative
          padding-left: 2.4rem
          align-items: center
          display: flex
          .budget.lower, .budget.higher, .engine-power.lower, .missing-icon, .range.less
            display: flex
            margin-right: 0.5em
            &:after
              content: ""
              width: 14px
              height: 14px
          .budget.lower, .engine-power.lower, .range.less
            &:after
              @include backgroundImage('less_red.svg')
          .budget.higher
            &:after
              @include backgroundImage('more_red.svg')
              background-size: contain
          .missing-icon
            &:after
              @include backgroundImage('missing.svg')
              background-size: contain
          .percentage-value
            margin-left: 0.5em
            font-size: 1.4rem
          img
            position: absolute
            top: 4px
            left: 0
          .equipment
            display: flex
            flex-wrap: wrap
            font-size: 1.4rem
            line-height: 2.2rem
    .match-wrapper
      display: flex
      justify-content: center
      margin-top: 3.8rem
      .match
        border-radius: 30px
        padding: 0.6rem 1rem
        color: $colorWhite
        border: none
        margin-bottom: 1.7rem
        font-family: 'Lato'
        &:hover
          cursor: unset
        &.green
          background-color: $colorHubbleGreen
        &.gradient
          background: $colorHubbleGradient
        &.grey
          background-color: $colorHubbleGreyIcons
.title
  font-size: 1.8em
  line-height: 2.2rem
  margin-bottom: 3.1rem
  text-align: center
.text
  font-family: Lato-semibold
  color: $colorHubbleDarkGrey
  text-align: center
.pop-up-button
  display: flex
  justify-content: center
  padding: 4em 0 3em 0
  button
    padding: 0.8em 5.1em 0.8em 5.1em
.center-div
  display: flex
  justify-content: center
  align-items: center
</style>
