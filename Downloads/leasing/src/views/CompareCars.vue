<template>
  <div class="compareCars">
    <p class="title">{{ $t('_compareCars.title') }}</p>
    <div v-if="!loader && compareCarsStatus == 'success'" class="compareColumns">
      <div class="column labels headings">
        <div class="carOptions"></div>
        <div class="carValues heading-section">
          <p class="label">{{ $t('_compareCars.listPrice') }}</p>
          <p class="label">{{ $t('_compareCars.monthlyNetCosts') }}</p>
          <p class="label">{{ $t('_compareCars.bodyType') }}</p>
          <p class="label">{{ $t('_compareCars.transmission') }}</p>
          <p class="label">{{ $t('_compareCars.fuelType') }}</p>
          <p class="label">{{ $t('_compareCars.enginePower') }}:</p>
          <p class="label">{{ $t('_compareCars.co2Emissions') }}</p>
          <p class="label">{{ $t('_compareCars.cargoSpace') }}:</p>
          <p class="label">{{ $t('_compareCars.towingCapacity') }}</p>
          <p class="label">{{ $t('_compareCars.seats') }}</p>
          <p class="label">{{ $t('_compareCars.doors') }}</p>
          <div class="equipment" v-if="checkIfEv(compareCarsData)">
            <p class="label">{{ $t('_sidebar.electricConsumption') }}</p>
            <p class="label">{{ $t('_sidebar.range') }}</p>
            <p class="label">{{ $t('_sidebar.chargeCapacity') }}</p>
            <p class="label">{{ $t('_sidebar.batteryCapacity') }}</p>
          </div>
          <p class="label equipments-section" :class="{ equipment: !checkIfEv(compareCarsData) }">
            {{ $t('_compareCars.equipment') }}
          </p>
        </div>
        <div class="button-wrapper"></div>
      </div>
      <div class="column labels mobile">
        <div class="carOptions"></div>
        <div class="carValues heading-section">
          <p class="label">{{ $t('_compareCars.listPrice') }}</p>
          <p class="label">{{ $t('_compareCars.monthlyNetCosts') }}</p>
          <p class="label">{{ $t('_compareCars.bodyType') }}</p>
          <p class="label">{{ $t('_compareCars.transmission') }}</p>
          <p class="label">{{ $t('_compareCars.fuelType') }}</p>
          <p class="label">{{ $t('_compareCars.enginePower') }}:</p>
          <p class="label">{{ $t('_compareCars.co2Emissions') }}</p>
          <p class="label">{{ $t('_compareCars.cargoSpace') }}:</p>
          <p class="label">{{ $t('_compareCars.towingCapacity') }}</p>
          <p class="label">{{ $t('_compareCars.seats') }}</p>
          <p class="label">{{ $t('_compareCars.doors') }}</p>
          <div class="equipment" v-if="checkIfEv(compareCarsData)">
            <p class="label">{{ $t('_sidebar.electricConsumption') }}</p>
            <p class="label">{{ $t('_sidebar.range') }}</p>
            <p class="label">{{ $t('_sidebar.chargeCapacity') }}</p>
            <p class="label">{{ $t('_sidebar.batteryCapacity') }}</p>
          </div>
          <p class="label" :class="{ equipment: !checkIfEv(compareCarsData) }">{{ $t('_compareCars.equipment') }}</p>
        </div>
      </div>
      <div class="carsOverview">
        <div class="slider">
          <div class="column" v-for="(car, index) in compareCarsData" :key="car.id">
            <div class="carOptions">
              <div class="button">
                <img
                  @click="optionsOpen(index)"
                  :src="open === index ? require('@/assets/options_hover.svg') : require('@/assets/options.svg')"
                />
                <div class="optionsDropdown" :class="{ open: open === index }">
                  <div class="duplicateWrapper" @click="duplicateCar(car)">
                    <img src="@/assets/duplicate.svg" />
                    <span class="text">{{ $t('_compareCars.duplicate') }}</span>
                  </div>
                  <div class="deleteWrapper" @click="deleteCar(car)">
                    <img src="@/assets/close.svg" />
                    <span class="text">{{ $t('_compareCars.delete') }}</span>
                  </div>
                </div>
              </div>
              <div class="topArea">
                <!-- <img src="@/assets/ford_fiesta.png" /> -->
                <img v-if="car['imagePath']" :src="`${imagesURl}/${car['imagePath']}`" />
                <div class="no-image-block" v-else>
                  <img v-if="$i18n.locale == 'en'" src="@/assets/no_image.svg" />
                  <img v-else src="@/assets/no-image-nl.svg" />
                </div>
                <p class="name">
                  {{ car['vehicleDetails']['local_make_name_128'] }}
                  {{ car['vehicleDetails']['local_model_name_129'] }}, {{ car['vehicleDetails']['model_year_108'] }},
                  {{ car['vehicleDetails']['local_version_name_131'] }}
                </p>
              </div>
            </div>
            <div class="carValues">
              <p>
                {{ car.vehicleDetails.retail_price_902 ? formatCurrency(car.vehicleDetails?.retail_price_902) : '-' }}
              </p>
              <p>{{ car.netMonthlyCost ? formatCurrency(car.netMonthlyCost) : '-' }}</p>
              <p>
                {{
                  car['vehicleDetails']['body_type_603']
                    ? $t(getTranslatedBodyType(car['vehicleDetails']['body_type_603']))
                    : ''
                }}
              </p>
              <div v-if="car['vehicleDetails']['transmission_type_20602']">
                <p v-if="car['vehicleDetails']['transmission_type_20602'] == 'Automatic'">
                  {{ $t('_sidebar.automatic') }}
                </p>
                <p v-else-if="car['vehicleDetails']['transmission_type_20602'] == 'Manual'">
                  {{ $t('_sidebar.manual') }}
                </p>
              </div>
              <div v-else>
                <p>-</p>
              </div>
              <div v-if="car['vehicleDetails']['fuel_type_8702']">
                <p>
                  {{ $t(getTranslatedFuelType(car['vehicleDetails']['fuel_type_8702'])) }}
                  <i v-if="car['vehicleDetails']['type_48602'] && car['vehicleDetails']['type_48602'] == 'hybrid'">
                    / {{ $t('_wizard.step2.Hybrid') }}
                  </i>
                  <i
                    v-else-if="
                      car['vehicleDetails']['type_48602'] && car['vehicleDetails']['type_48602'] == 'plug_in_hybrid'
                    "
                  >
                    / {{ $t('_wizard.step2.PlugInHybrid') }}
                  </i>
                </p>
              </div>
              <div v-else>
                <p>-</p>
              </div>
              <p>{{ `${car['vehicleDetails']['maximum_power_hp/ps_15304']} ${$t('_step2.hp')}` ?? '-' }}</p>
              <p>
                {{ `${car['vehicleDetails']['combined_62203'] ? car['vehicleDetails']['combined_62203'] : 0} gr/km` }}
              </p>
              <p>
                {{
                  `${car['vehicleDetails']['rear_seat_up;_to_lower_window_(l)_6002']} ${$t('_compareCars.liters')}` ??
                  '-'
                }}
              </p>
              <p v-if="car['vehicleDetails']['gross_trailer_weight_braked_(kg)_24105']">
                {{ car['vehicleDetails']['gross_trailer_weight_braked_(kg)_24105'] }} kg
              </p>
              <p v-else>-</p>
              <p>{{ car['vehicleDetails']['seating_capacity_702'] ?? '-' }}</p>
              <p>{{ car['vehicleDetails']['number_of_doors_602'] ?? '-' }}</p>
              <div class="equipment" v-if="checkIfEv(compareCarsData)">
                <p v-if="car['vehicleDetails']['combined_(wh\/km)_62803']">
                  <span>{{ `${car['vehicleDetails']['combined_(wh\/km)_62803'] / 10} kWh/100 km` }}</span>
                </p>
                <p v-else>-</p>
                <p v-if="car['vehicleDetails']['combined_km_62903']">
                  <span>{{ `${car['vehicleDetails']['combined_km_62903']} km` }}</span>
                </p>
                <p v-else>-</p>
                <p v-if="car['vehicleDetails']['quoted_kw_supplied_to_vehicle_53408']">
                  <span>{{ `${car['vehicleDetails']['quoted_kw_supplied_to_vehicle_53408']} kW` }}</span>
                </p>
                <p v-else>-</p>
                <p v-if="car['vehicleDetails']['battery_kilowatt_hour_(kwh)_8312']">
                  <span>{{ `${car['vehicleDetails']['battery_kilowatt_hour_(kwh)_8312']} kWh` }}</span>
                </p>
                <p v-else>-</p>
              </div>
              <div class="equipments-section" :class="{ equipment: !checkIfEv(compareCarsData) }">
                <span class="equipmentName" v-if="car['options'].length === 0">-</span>
                <span v-else v-for="item in car['options']" :key="item['id']" class="equipmentName">
                  {{ $i18n.locale == 'nl' ? item['titleNl'] : item['titleEn'] }}
                </span>
              </div>
            </div>
            <div class="button-wrapper">
              <Button
                @onClick="configureCar(car)"
                :text="$t('_compareCars.btnSelectConfigure')"
                buttonType="dark"
                :isDisabled="carOrderedTrue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!loader && compareCarsStatus != 'success'" class="center-div error-message-block">
      <h3>{{ $t('_discounts.sorrySearchText') }}</h3>
    </div>
    <div v-else class="center-div">
      <Loader />
    </div>
    <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
      <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
      <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
    </Popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, ComputedRef, watch } from 'vue'
import formatCurrency from '@/filters/CurrencyFormat'
import Button from '@/components/UI/Button.vue'
import { ActionTypes as userCarsActionTypes } from '@/store/userCars/actions'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { savedCarsType } from '@/types'
import Loader from '@/components/UI/Loader.vue'
import Popup from '@/components/Popup.vue'
import router from '@/router'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import getTranslatedFuelType from '@/filters/getTranslatedFuelType'
import { USER_STATUS } from '@/composables/staticValues'
import toLowerCase from '@/filters/toLowerCase'
export default defineComponent({
  name: 'Home',
  setup() {
    const open = ref()
    const route = useRoute()
    const store = useStore()
    const showPopup = ref(false)
    const deleteCarId = ref(0)
    const imagesURl = process.env.VUE_APP_IMG_URL
    const loader = computed(() => store.state.userCars.loader)
    const carOrderedTrue = computed(
      () => toLowerCase(store.state.auth.currentUser.userStatus) === USER_STATUS.CAR_ORDERED
    )
    const compareCarsData: ComputedRef<savedCarsType[]> = computed(() => store.state.userCars.compareCarsData)
    const compareCarsStatus = computed(() => store.state.userCars.compareCarsStatus)
    const initialize = async () => {
      if (route.query.id) {
        const compIds = Array.isArray(route.query.id) ? route.query.id : [route.query.id]
        await store.dispatch(userCarsActionTypes.GET_CAR_ORDER_DETAILS, compIds)
      }
    }

    onMounted(initialize)
    const optionsOpen = (index) => {
      if (open.value === index) {
        open.value = null
      } else {
        open.value = index
      }
    }
    const duplicateCar = async (item) => {
      const carBody = {
        vehicleId: item.vehicleDetails.unique_identity_101,
        monthlyCost: item.netMonthlyCost,
        carPrice: 1000,
        co2Emission: item.co2Emission,
        status: false,
        colors: item.interiorColor,
        options: item.options, // Needs to be changed in further steps
        mandatoryAccessories: item.mandatoryAccessories,
        otherAccessories: item.otherAccessories,
        chargingFacilities: item.chargingFacilities
      }
      const res = await store.dispatch(userCarsActionTypes.SAVE_CAR_ORDER, carBody)
      const id = res.carOrderResponse.id
      if (route.query.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const carIds: any = Array.isArray(route.query.id) ? [...route.query.id] : [route.query.id]
        carIds.push(id)
        router.push({ name: 'CompareCars', query: { id: carIds } })
        open.value = false
      }
    }

    const closePopup = () => {
      showPopup.value = false
    }

    const configureCar = async (savedCar) => {
      // allOptionId's
      const optionIds = savedCar.options
        .map((e) => {
          return [e, ...e['children']]
        })
        .flat()
        .map((item) => item['optionId'].toString())
      // userSelectedOptions
      const userSelectedOptions = savedCar.options.map((e) => {
        return e['optionId'].toString()
      })
      // nestedOptions
      const nestedOptions = {}
      savedCar.options.forEach((item) => {
        if (!nestedOptions[item['optionId']]) {
          nestedOptions[item['optionId']] = []
          item['children'].forEach((e) => nestedOptions[item['optionId']].push(e['optionId'].toString()))
        }
      })
      store.state.options.nestedOptions = nestedOptions
      sessionStorage.setItem('nestedOptions', JSON.stringify(nestedOptions))
      const selectedOptions = {
        selectedOptions: optionIds,
        userSelectedOptions: userSelectedOptions,
        requiredChoices: [],
        option: '',
        action: 'added',
        otherAccessories: savedCar.otherAccessories,
        chargingFacilities: savedCar.chargingFacilities
      }
      await sessionStorage.setItem('optionsConfigurationData', JSON.stringify(selectedOptions))
      await router.push({
        name: 'Step3',
        params: {
          vehicleId: savedCar.vehicleDetails.unique_identity_101,
          carOrderId: savedCar.id
        }
      })
    }
    const onProceed = async () => {
      showPopup.value = false
      open.value = false
      if (route.query.id && route.query.id.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const carIds: any = await [...route.query.id]
        const deletedIndex = await carIds.findIndex((e) => +e === +deleteCarId.value)
        await carIds.splice(deletedIndex, 1)
        await store.dispatch(userCarsActionTypes.DELETE_SAVED_CAR, [deleteCarId.value])
        if (carIds.length === 0) {
          await router.push({ name: 'Dashboard' })
        } else {
          await router.replace({ name: 'CompareCars', query: { id: carIds } })
        }
      }
    }
    const checkIfEv = (comparisionCars) => {
      const isEv = comparisionCars.some((car) => {
        const carType = car.vehicleDetails['type_48602'] || car.vehicleDetails['fuel_type_8702']
        return carType == 'electric' || carType == 'plug_in_hybrid'
      })
      return isEv
    }
    watch(
      () => route.query.id,
      () => {
        initialize()
      }
    )
    const deleteCar = (item: savedCarsType) => {
      deleteCarId.value = item.id
      showPopup.value = true
    }
    return {
      formatCurrency,
      open,
      optionsOpen,
      duplicateCar,
      deleteCar,
      compareCarsData,
      compareCarsStatus,
      imagesURl,
      loader,
      showPopup,
      closePopup,
      onProceed,
      configureCar,
      getTranslatedBodyType,
      getTranslatedFuelType,
      carOrderedTrue,
      checkIfEv
    }
  },
  components: {
    Button,
    Loader,
    Popup
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/variables.sass'
.equipments-section
  display: flex
  flex-direction: column
  flex: 1
  margin-bottom: 24px
  @media screen and (max-width: $mdBreakpoint - 1)
    padding-top: 26px
.no-image-block
  display: flex
  justify-content: center
.compareCars
  display: flex
  flex-direction: column
  @media screen and (max-width: $xxlBreakpoint)
    // padding: 0 3.4em on parent container
    // width: calc(100vw - 68px)
  @media screen and (max-width: $mdBreakpoint - 1)
    padding-left: 30px
    width: calc(100vw - 30px)
  .title
    margin-top: 0.359rem
    margin-bottom: 1.4rem
    font-size: 2.8rem
    line-height: 3.36rem
    font-weight: 900
    color: $colorHubble
    @media screen and (max-width: $mdBreakpoint - 1)
      margin-top: 3rem
  .compareColumns
    display: flex
    flex-direction: row
    position: relative
    @media screen and (min-width: $mdBreakpoint)
      max-width: 1372px
    .column.labels.mobile
      display: flex
      position: absolute
      background-color: transparent
      .carValues.heading-section
        margin-top: 24px
      @media screen and (min-width: $mdBreakpoint + 1)
        display: none
      .carOptions
        margin-bottom: 0.2rem
      .carValues
        .label
          padding-top: 31px
          font-size: 14px
          line-height: 22px
          border-bottom: none
          &:first-child
            padding-top: 0
          &:last-child
            padding-top: 26px
            @media screen and (max-width: $mdBreakpoint)
              padding-top: 32px

    .column.labels
      display: none
      @media screen and (min-width: $mdBreakpoint + 1)
        display: flex
        flex: 1 0 auto
    .column
      background-color: $colorWhite
      display: flex
      flex-direction: column
      padding-top: 10px
      width: 225px
      margin-right: 10px
      font-size: 1.6rem
      line-height: 2.6rem
      border-radius: 5px
      // @media screen and (min-width: $mdBreakpoint)
      //   width: 285px
      @media screen and (max-width: $mdBreakpoint)
        margin-right: 1rem
      &:first-child
        background-color: transparent
      &:last-child
        margin-right: 0
        @media screen and (max-width: $mdBreakpoint)
          margin-right: 30px
      .carOptions
        position: relative
        height: 230px
        margin-bottom: 2rem
        .optionsDropdown
          display: none
          flex-direction: column
          position: absolute
          top: 40px
          right: 12px
          height: 104px
          width: 139px
          padding: 14px 0
          border-radius: 5px
          background-color: $colorWhite
          box-shadow: $shadowHubbleSmaller
          box-sizing: border-box
          &.open
            display: flex
          .duplicateWrapper, .deleteWrapper
            display: flex
            align-items: center
            height: 38px
            &:hover
              cursor: pointer
              background-color: rgba($colorHubbleBlueBG, 0.08)
            .text
              font-size: 14px
              line-height: 16.8px
          .duplicateWrapper
            padding: 0 24px 0 24px
            img
              margin-right: 13px
          .deleteWrapper
            padding: 0 25.42px 0 26.25px
            img
              margin-right: 15.25px
              height: 13.5px
              width: 13.5px
        .button
          display: flex
          justify-content: flex-end
          margin-bottom: 3px
          margin-right: 10px
          img
            &:hover
              cursor: pointer
        .topArea
          display: flex
          flex-direction: column
          padding: 0 15px
          img
            object-fit: contain
            align-self: center
            max-height: 100px
            max-width: 150px
            margin-bottom: 20px
          .name
            text-align: center
            font-weight: 700
            font-size: 1.8rem
            line-height: 2.16rem
            border-bottom: none
      .carValues
        padding: 0 15px
        display: flex
        flex-direction: column
        flex: 2
        p
          border-bottom: 1px solid $colorHubbleGreyLines
          padding-top: 5px
          padding-bottom: 5px
          display: flex
          @media screen and (max-width: $mdBreakpoint)
            padding-top: 26px
          i
            font-style: normal
        .equipment
          p:first-child
            @media screen and (max-width: $mdBreakpoint)
              padding-top: 0px
          i
            font-style: normal
        >p:last-child
          margin-bottom: 24px
          border-bottom: none
          padding-bottom: 0
        .label
          font-weight: 700
          &:last-child
            // margin-bottom: 74px
        .equipment
          display: flex
          flex-direction: column
          padding-bottom: 5px
          padding-top: 5px
          //border-bottom: 1px solid $colorHubbleGreyLines
          @media screen and (max-width: $mdBreakpoint)
            padding-top: 26px
      .button-wrapper
        display: flex
        height: 50px
        button
          width: 100%
          border-radius: 5px
    .carsOverview
      width: 70vw
      flex: 1
      .slider
        display: flex
        overflow-x: scroll
        padding-bottom: 30px
        &::-webkit-scrollbar
          height: 4px
        &::-webkit-scrollbar-track
          background: $colorHubbleGreyLines
        &::-webkit-scrollbar-thumb
          background: $colorHubble
          border-radius: 5px
          cursor: pointer
        .column
          flex: 1 0 auto
          width: 225px
          max-width: 300px
          justify-content: space-between
          &:first-child
            background-color: $colorWhite
.headings
  flex: unset !important
  .button-wrapper
    padding-bottom: 34px
.center-div
  display: flex
  justify-content: center
  align-items: center
  width: 100%
.error-message-block
  height: 50vh
.heading-section
  min-width: 200px
</style>
