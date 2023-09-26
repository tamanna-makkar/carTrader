<template>
  <div v-if="carsById">
    <div :class="{ 'fixed-to-bottom': windowWidth < 768 }">
      <div :class="{ 'sidebar-wrap': windowWidth < 768 }">
        <span
          class="toggle-icon"
          :class="{ 'toggle-up': expandSidebar }"
          @click=";(expandSidebar = !expandSidebar), (collapseSidebar = !collapseSidebar)"
        ></span>
        <div :class="{ 'sidebar-fixed': windowWidth > 767 }" class="sidebar" v-if="expandSidebar || windowWidth > 767">
          <div class="info-section">
            <h3>{{ $t('_sidebar.yourSelection') }}</h3>
            <div class="auto-type">
              <div class="product-wrap">
                <img v-if="carImagePath && carImagePath !== ''" :src="`${imagesURl}/${carImagePath}`" />
                <div v-else>
                  <img v-if="$i18n.locale == 'en'" src="@/assets/no_image.svg" />
                  <img v-else src="@/assets/no-image-nl.svg" />
                </div>
              </div>
              <span
                >{{ carsById['make_111'] }} {{ carsById['local_model_name_129'] }}, {{ carsById['model_year_108'] }},
                {{ carsById['local_version_name_131'] }}</span
              >
            </div>
            <div class="highlight-wrapper" v-if="!leaseRateError">
              <div class="net-monthly-cost-section" v-if="$route.name == 'Step4'">
                <span v-if="carOrderDetailsById['netMonthlyCost']"> {{ formatCurrency(carOrderDetailsById['netMonthlyCost']) }} </span>
                <span v-else>€ 0,00</span>
              </div>
              <div class="net-monthly-cost-section" v-else>
                <span v-if="NetMonthlyCostAndFlag['netMonthlyCost']"> {{ formatCurrency(NetMonthlyCostAndFlag['netMonthlyCost']) }} </span>
                <span v-else>€ 0,00</span>
              </div>
              <label> {{ $t('_sidebar.monthlyCost') }}* </label>
            </div>
            <div class="info">
              <label> {{ $t('_configure.financialImpact.fiscalValue') }} </label>
              <span v-if="NetMonthlyCostAndFlag['fiscalValue']">{{ formatCurrency(NetMonthlyCostAndFlag['fiscalValue']) }}</span>
              <span v-else-if="carOrderDetailsById['fiscalValue']">{{ formatCurrency(carOrderDetailsById['fiscalValue']) }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.fuelType') }} </label>
              <span>{{ $t(getTranslatedFuelType(carsById['fuel_type_8702'])) }}
                <i v-if="carsById['type_48602'] && carsById['type_48602'] == 'hybrid'">
                  / {{ $t('_wizard.step2.Hybrid') }}
                </i>
                <i v-else-if="carsById['type_48602'] && carsById['type_48602'] == 'plug_in_hybrid'">
                  / {{ $t('_wizard.step2.PlugInHybrid') }}
                </i>
              </span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.monthlyEmissions') }} </label>
              <span>{{ carsById['combined_62203'] }} gr/km</span>
            </div>
            <div class="info" v-if="carsById['combined_(l/100km)_42005']">
              <label> {{ $t('_sidebar.fuelConsumption') }} </label>
              <span>{{ ConvertToCommas(carsById['combined_(l/100km)_42005']) }} l/100 km</span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.gearBoxType') }} </label>
              <span v-if="carsById['transmission_type_20602'] == 'Automatic'">{{ $t('_sidebar.automatic') }}</span>
              <span v-else-if="carsById['transmission_type_20602'] == 'Manual'">{{ $t('_sidebar.manual') }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.bodyType') }} </label>
              <span>{{ $t(getTranslatedBodyType(carsById['body_type_603'])) }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_compareCars.enginePower') }}</label>
              <span>{{ carsById['maximum_power_hp/ps_15304'] }} {{ $t('_step2.hp') }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_compareCars.cargoSpace') }}</label>
              <span>{{ `${carsById['rear_seat_up;_to_lower_window_(l)_6002']} ${$t('_compareCars.liters')}` }}</span>
            </div> 
            <div class="info">
              <label> {{ $t('_sidebar.noOfDoors') }} </label>
              <span>{{ carsById['number_of_doors_602'] }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.noOfSeats') }} </label>
              <span>{{ carsById['seating_capacity_702'] }}</span>
            </div>
            <div class="info">
              <label> {{ $t('_sidebar.towingCapacity') }} </label>
              <span>{{ carsById['gross_trailer_weight_braked_(kg)_24105'] }} kg</span>
            </div>
            <div v-if="carsById['combined_(wh\/km)_62803']" class="info">
              <label> {{ $t('_sidebar.electricConsumption') }} </label>
              <span>{{ `${carsById['combined_(wh\/km)_62803'] / 10} kWh/100 km` }} </span>
            </div>
            <div v-if="carsById['combined_km_62903']" class="info">
              <label>{{ $t('_sidebar.range') }} </label>
              <span>{{ `${carsById['combined_km_62903']} km` }}</span>
            </div>
            <div v-if="carsById['quoted_kw_supplied_to_vehicle_53408']" class="info">
              <label>{{ $t('_sidebar.chargeCapacity') }} </label>
              <span>{{ `${carsById['quoted_kw_supplied_to_vehicle_53408']} kW` }}</span>
            </div>
            <div v-if="carsById['battery_kilowatt_hour_(kwh)_8312']" class="info">
              <label>{{ $t('_sidebar.batteryCapacity') }} </label>
              <span>{{ `${carsById['battery_kilowatt_hour_(kwh)_8312']} kWh` }} </span>
            </div>
          </div>
          <div class="extra_info" :class="{ 'extra-info-desktop': windowWidth > 767 }">
            <label> {{ $t('_configure.financialImpact.disclaimer') }} </label>
          </div>
        </div>
        <div class="collapse" v-if="collapseSidebar">
          <div class="product"><img v-if="carImagePath && carImagePath !== ''" :src="`${imagesURl}/${carImagePath}`" /></div>
          <div class="info">
            <p>{{ $t('_sidebar.monthlyCost') }}*</p>
            <p>{{ $t('_sidebar.monthlyEmissions') }}</p>
          </div>
          <div class="info">
            <span v-if="NetMonthlyCostAndFlag['netMonthlyCost']">{{ formatCurrency(NetMonthlyCostAndFlag['netMonthlyCost']) }}</span>
            <span>{{ carsById['combined_62203'] }} gr/km</span>
          </div>
        </div>
      </div>
      <teleport to="body">
        <div class="backdrop" v-if="expandSidebar" @click=";(expandSidebar = false), (collapseSidebar = true)"></div>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/options/actions'
import formatCurrency from '@/filters/CurrencyFormat'
import getTranslatedFuelType from '@/filters/getTranslatedFuelType'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import { useRoute } from 'vue-router'
import ConvertToCommas from '@/filters/ConvertToCommas'
export default defineComponent({
  data() {
    return {
      series: 'BMW 1-series, 2021, 2.0 118D Auto',
      monthlyCost: '5 340,00',
      allowance: '5 000,00 (103%)',
      deducated: '140,00',
      co2: '0,5 tonnes'
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const windowWidth = ref(window.innerWidth)
    const expandSidebar = ref(false)
    const collapseSidebar = ref(true)
    const carsById = computed(() => store.state.options.carsById.cars)
    const carImagePath = computed(() => store.state.options.carsById.path)
    const carOrderDetailsById = computed(() => store.state.options.carOrderDetailsById)
    const loader = computed(() => store.state.options.optionsloader)
    const NetMonthlyCostAndFlag = computed(() => store.state.options.NetMonthlyCostAndFlag)
    const leaseRateError = computed(() => store.state.options.leaseRateError)
    const imagesURl = process.env.VUE_APP_IMG_URL
    const carDetails = ref({})
    const getSidebar = async () => {
      await store.dispatch(ActionTypes.GET_CARSBYID, { vehicleId: route.params.vehicleId })
    }
    onMounted(async () => {
      window.onresize = () => {
        windowWidth.value = window.innerWidth
      }
      document.addEventListener('scroll', () => {
        const sidebar: HTMLElement = document.querySelector('.sidebar-fixed') as HTMLElement
        if (windowWidth.value > 767 && sidebar) {
          if (window.scrollY > 67) {
            sidebar.classList.add('sidebar-scroll')
          } else {
            sidebar.classList.remove('sidebar-scroll')
          }
        }
      })
      await getSidebar()
      // await getCarsByIdTitle()
    })
    return {
      expandSidebar,
      collapseSidebar,
      windowWidth,
      carsById,
      loader,
      imagesURl,
      carDetails,
      formatCurrency,
      getTranslatedFuelType,
      getTranslatedBodyType,
      carImagePath,
      NetMonthlyCostAndFlag,
      ConvertToCommas,
      leaseRateError,
      carOrderDetailsById
    }
  }
})
</script>

<style lang="sass" scoped>
.info-section
  margin-bottom: 1em
.sidebar
  min-height: 630px
.sidebar-fixed
  position: absolute
  height: calc(100vh - 100px)
  display: flex
  justify-content: space-between
  top: auto
  bottom: auto
  box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.1)
  background: $colorWhite
  border-radius: 5px
  padding: 2em
.sidebar.sidebar-scroll
  h3
    display: none
.sidebar-scroll
  position: fixed
  width: calc(21% - 7.3em)
  top: 0
  bottom: 0
  height: calc(100vh - 120px)
  -webkit-transform: translate3d(0, 0, 0)
  transform: translate3d(0, 0, 0)
  @media screen and (min-width: $mdBreakpoint) and (max-width: $xlBreakpoint)
    width: calc(32% - 4.3em)
  .auto-type
    .product-wrap
      display: none
.sidebar-mobile
  position: static
.fixed-to-bottom
  position: fixed
  bottom: 0
  width: 100%
  z-index: 1
.backdrop
  position: fixed
  background: $colorBlack
  top: 0
  width: 100%
  left: 0
  height: 100%
  z-index: 0
  opacity: 0.5
.collapse
  @media screen and (min-width: $mdBreakpoint)
    display: none
.sidebar-wrap
  position: relative
  background-color: $colorWhite
  box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
  padding: 1.3em 15px
  z-index: 1
  .sidebar
    .info, .auto-type
      flex-direction: row
    .auto-type
      .product-wrap
        width: 49%
        margin-right: 0.5em
      span
        width: 50%
      img
        max-width: 129px
    .extra_info
      margin: 4em 0 0 0
  .collapse
    display: flex
    align-items: center
    justify-content: space-between
  .toggle-icon
    @include backgroundImage('toggle-down.svg')
    width: 29px
    height: 29px
    border: 1px solid $colorHubbleGreyIcons
    border-radius: 100%
    position: absolute
    top: -13px
    background-color: $colorWhite
    @media screen and (min-width: $mdBreakpoint)
      display: none
  .toggle-up
    @include backgroundImage('toggle-up.svg')
    background-color: $colorWhite
  .product
    max-width: 60px
    img
      width: 100%
  .info
    display: flex
    flex-direction: column
    p
      color: $colorHubbleDarkGrey
      font-family: 'Lato'
      margin: 0
    p, span
      font-size: 14px
    span
      font-family: 'Lato-semibold'
.desktop-sidebar
  display: none
  @media screen and (min-width: $mdBreakpoint)
    display: flex

.sidebar
  flex-direction: column
  margin-top: 2.4em
  min-height: 370px
  h3
    display: none
    text-align: center
    @media screen and (min-width: $mdBreakpoint)
      display: block
  div
    display: flex
    flex-direction: column
  .auto-type
    margin: 0 0 1.5em 0
    display: flex
    justify-content: center
    align-items: center
    .product-type
      margin: 1em 0 0.6em
    img
      max-width: 150px
      width: 100%
      margin: 0em 0 1em 0
    span
      font-size: 1.8em
      line-height: 2.2rem
      font-family: 'Lato-semibold'
  .info
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: center
    label
      @media screen and (max-width: 767px)
        width: 49%
        margin-right: 0.5em
    span
      font-size: 1.4em
      color: $colorHubbleText
      font-family: 'Lato-semibold'
      i
        font-style: normal
    span.expensive-budget
      color: $colorHubbleRed    
  label
    font-size: 1.4em
    color: $colorHubbleDarkGrey
    line-height: 2.2rem
  .extra-info-desktop
    @media screen and (max-height: 630px)
      display: none
  .highlight-wrapper
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    border-radius: 6px
    font-family: 'Lato'
    color: $colorWhite
    padding: 1.3rem 1rem
    margin-bottom: 2rem
    background: $colorHubbleGradient
    font-weight: 700
    .net-monthly-cost-section
      span
        font-size: 1.8rem
    label
      color: $colorWhite
      padding-left: 0.5em
</style>
