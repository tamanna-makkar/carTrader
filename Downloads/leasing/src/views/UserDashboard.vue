<template>
  <div v-if="!loader" class="main-dashboard-section">
    <div class="top-wrap">
      <div class="welcome-section">
        <div class="left-section">
          <h1>{{ $t('_dashboard.welcome') }}!</h1>
          <p>{{ $t('_dashboard.findPerfectFit') }}</p>
          <div class="steps-section">
            <div class="col">
              <span>01</span>
              <p>{{ $t('_dashboard.selectModel') }}</p>
            </div>
            <div class="col">
              <span>02</span>
              <p>{{ $t('_dashboard.compareModelVersions') }}</p>
            </div>
            <div class="col">
              <span>03</span>
              <p>{{ $t('_dashboard.configureTheCar') }}</p>
            </div>
          </div>
          <Button
            :text="$t('_dashboard.launchSelector')"
            :class="{ disabled: user.userStatus != 'selector available' }"
            @onClick="launchSelector"
            buttonType="white arrow--right"
          />
        </div>
        <div class="right-section">
          <div class="profile-section">
            <p>
              {{ $t('_dashboard.viewAccountDetails') }}
              <span
                ><router-link :to="{ name: 'UserProfile' }">{{ $t('_dashboard.accountDetails') }}</router-link></span
              >
              {{ $t('_dashboard.andCompany') }}
              <span
                ><router-link :to="{ name: 'UserProfile', params: { tab: 'carPolicy' } }">{{
                  $t('_dashboard.carPolicy')
                }}</router-link></span
              >
              <label v-if="$i18n.locale == 'nl'">
                {{ $t('_dashboard.fromYourEmployer') }}
              </label>
            </p>
            <span class="guide-image"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-section">
      <div class="left-block">
        <div>
          <h3>{{ $t('_userDashboard.currentCar') }}</h3>
          <div v-if="user.licensePlate">
            <div class="car-block current-car common-block">
              <div class="licence-plate">
                <div class="inner-block">
                  <span class="currency">NL</span>
                  <span class="licence">{{ user.licensePlate }}</span>
                </div>
              </div>
              <div v-if="user.leaseValidUntil" class="lease-data car-cost-details">
                <div class="inner-block">
                  <h4>{{ $t('_userDashboard.leaseValid') }}</h4>
                  <span class="valid-date"> {{ getLeaseValidUntil(user.leaseValidUntil) }} </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="current-car not-selected-block">
            <h1>{{ $t('_userDashboard.havenotCurrent') }}</h1>
          </div>
          <div
            v-if="
              toLowerCase(user.userStatus) == USER_STATUS.SELECTOR_AVAILABLE ||
              toLowerCase(user.userStatus) == USER_STATUS.CAR_ORDERED
            "
          >
            <h3>{{ $t('_userDashboard.nextCar') }}</h3>
            <div v-if="Object.keys(user.carOrders).length > 0">
              <div @click="viewDetails" class="car-block common-block">
                <div class="car-details">
                  <div
                    class="details"
                    v-if="user.carOrders['vehicleDetails'] && Object.keys(user.carOrders['vehicleDetails']).length > 0"
                  >
                    <h4>{{ user.carOrders['vehicleDetails']['local_make_name_128'] }}</h4>
                    <span>{{ user.carOrders['vehicleDetails']['local_model_name_129'] }}</span>
                    <span>{{ user.carOrders['vehicleDetails']['local_version_name_131'] }}</span>
                  </div>
                  <div class="details" v-else>
                    <h4>{{ $t('_step2.nA') }}</h4>
                  </div>
                </div>
                <div class="car-cost-details">
                  <div class="inner-block">
                    <h4>{{ $t('_userDashboard.netCostPerMonth') }}</h4>
                    <span>
                      {{ user.carOrders['netMonthlyCost'] ? formatCurrency(user.carOrders['netMonthlyCost']) : '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="not-selected-block">
              <h1>{{ $t('_userDashboard.havenotSelected') }}</h1>
              <p>{{ $t('_userDashboard.launchTheSelector') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-block" v-if="user.userStatus == 'selector available'">
        <div class="saved-cars-heading">
          <h3>{{ $t('_userDashboard.savedCar') }}</h3>
          <div class="fixed-to-bottom buttons-block">
            <!-- Mobile View -->
            <Button
              :class="{ 'delete-active': checkedSavedCars.length > 0 }"
              class="disable-button"
              :text="$t('_userDashboard.deleteSelected')"
              @onClick="showPopup = true"
              buttonType="light close--left"
            />
            <Button
              v-if="checkedSavedCars.length > 1"
              :text="$t('_userDashboard.compareSelected')"
              @onClick="compareSelected"
              buttonType="dark compare--left"
              class="flipBtn_face flipBtn_back"
            />
            <Button
              v-else
              :class="{ 'configure-active': checkedSavedCars.length === 1 }"
              class="disable-button flipBtn_face flipBtn_front"
              :text="$t('_userDashboard.configureSelected')"
              @onClick="configureSelected"
              buttonType="dark arrow"
            >
            </Button>
            <!-- Mobile View Ends-->
          </div>
          <div class="buttons-block">
            <Button
              :class="{ 'delete-active': checkedSavedCars.length > 0 }"
              class="disable-button"
              :text="$t('_userDashboard.deleteSelected')"
              @onClick="showPopup = true"
              buttonType="light close--left"
            />
            <div :class="{ 'flipBtn-animation': checkedSavedCars.length > 1 }" class="flipBtn">
              <Button
                v-if="checkedSavedCars.length > 1"
                :text="$t('_userDashboard.compareSelected')"
                @onClick="compareSelected"
                buttonType="dark compare--left"
                class="flipBtn_face flipBtn_back"
              />
              <Button
                v-else
                :class="{ 'configure-active': checkedSavedCars.length === 1 }"
                class="disable-button flipBtn_face flipBtn_front"
                :text="$t('_userDashboard.configureSelected')"
                @onClick="configureSelected"
                buttonType="dark arrow"
              >
              </Button>
              <div class="flipBtn_face flipBtn_mid demo1"></div>
            </div>
          </div>
        </div>

        <div v-if="allSavedCars.length > 0" class="saved-cars">
          <div class="select-all">
            <Checkbox
              :item="selectAllItems"
              theme="dashboard"
              :isChecked="false"
              @onCheck="selectAll(allSavedCars, $event)"
            />
            <span> {{ $t('_dashboard.selectAll') }}</span>
          </div>
          <div v-for="(item, index) in allSavedCars" :key="index" class="common-block">
            <div class="car-details">
              <Checkbox :item="item" @onCheck="onCheck(item)" :isChecked="checkSelected(item)" theme="dashboard" />
              <div class="image-block">
                <img v-if="item['imagePath']" :src="`${imagesURl}/${item['imagePath']}`" />
                <div v-else>
                  <img v-if="$i18n.locale == 'en'" src="@/assets/no_image.svg" />
                  <img v-else src="@/assets/no-image-nl.svg" />
                </div>
              </div>
              <div class="details">
                <h4>{{ item['vehicleDetails']['local_make_name_128'] }}</h4>
                <span>{{ item['vehicleDetails']['local_model_name_129'] }}</span>
                <span>{{ item['vehicleDetails']['local_version_name_131'] }}</span>
              </div>
            </div>
            <div class="car-cost-details">
              <div class="inner-block">
                <h4>{{ $t('_userDashboard.netCostPerMonth') }}:</h4>
                <span> {{ formatCurrency(item['netMonthlyCost']) }} </span>
              </div>
              <div class="inner-block">
                <h4>{{ $t('_userDashboard.co2Emission') }}:</h4>
                <span class="valid-date">
                  {{
                    item['vehicleDetails']['combined_62203']
                      ? `${ConvertToCommas(item['vehicleDetails']['combined_62203'].toString())} gr/km`
                      : '-'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="dashboard-section car-block">
            <!-- <h3>{{ $t('_dashboard.yourSavedCars') }}</h3> -->
            <div class="empty-block">
              <h1>{{ $t('_dashboard.havenotSavedCars') }}</h1>
              <p>{{ $t('_dashboard.saveCars') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Popup
      v-if="!user.incomeTax && showTaxPercentagePopup"
      @onClick="closeTaxPercentagePopup"
      @goToAccount="goToAccount"
      :centerPopup="true"
      :setIncomeTaxPopup="true"
    >
      <div class="title h3">{{ $t('_warningPopup.welcomeToCarSelector') }}</div>
      <p class="sub-text">{{ $t('_warningPopup.completeAccountDetails') }}</p>
    </Popup>
  </div>
  <div v-else class="center-items">
    <loader />
  </div>
  <Popup v-if="showNoCarPolicyPopup" @onClick="closeShowNoCarPolicyPopup" @onProceed="closeShowNoCarPolicyPopup">
    <div class="title h3">{{ $t('_warningPopup.noCarPolicyTitle') }}</div>
    <div class="text t2">{{ $t('_warningPopup.noCarPolicyText') }}</div>
  </Popup>
  <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
    <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
    <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
  </Popup>
  <transition name="fade">
    <info-popup v-if="carOrderSuccess" @closePopup="closeInfoPopup">
      <template v-slot:header>{{ $t('_configure.carOrderSuccess') }}</template>
    </info-popup>
  </transition>
  <transition name="fade">
    <info-popup v-if="carOrderPdfError" @closePopup="closePdfInfoPopup">
      <template v-slot:header>{{ $t('_errorCodes.pdfNotFound') }}</template>
    </info-popup>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ComputedRef, ref, computed } from 'vue'
import formatCurrency from '@/filters/CurrencyFormat'
import Button from '@/components/UI/Button.vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ActionTypes as userCarsActionTypes } from '@/store/userCars/actions'
import { ActionTypes } from '@/store/options/actions'
import { MutationTypes } from '@/store/options/mutations'
import ConvertToCommas from '@/filters/ConvertToCommas'
import { savedCarsType } from '@/types'
import loader from '@/components/UI/Loader.vue'
import Popup from '@/components/Popup.vue'
import InfoPopup from '@/components/UI/InfoPopup.vue'
import { USER_STATUS } from '@/composables/staticValues'
import toLowerCase from '@/filters/toLowerCase'
export default defineComponent({
  name: 'Home',
  components: {
    Button,
    Checkbox,
    loader,
    Popup,
    InfoPopup
  },
  setup() {
    const router = useRouter()
    const showPopup = ref(false)
    const store = useStore()
    const checkedSavedCars = ref<savedCarsType[]>([])
    const selectAllItems = ref({
      id: 1,
      isActive: true
    })
    const showTaxPercentagePopup = ref(true)
    const imagesURl = process.env.VUE_APP_IMG_URL
    const user = computed(() => store.state.auth.currentUser)
    const loader = computed(() => store.state.userCars.loader)
    const showNoCarPolicyPopup = computed(() => store.state.options.showPopUp)
    const allSavedCars: ComputedRef<savedCarsType[]> = computed(() => store.state.userCars.savedCars)
    const carOrderSuccess = computed(() => store.state.options.carOrderSuccess)
    const carOrderPdfError = computed(() => store.state.options.carOrderPdfError)
    const accessToken = computed(() => store.state.auth.accessToken)
    const initialize = async () => {
      if (accessToken.value) {
        await store.dispatch(userCarsActionTypes.GET_ALLSAVEDCARS, { status: 0 })
      }
    }
    onMounted(initialize)

    const launchSelector = () => {
      if (user.value.carPolicy !== null) {
        router.push({ name: 'Step1' })
      } else {
        store.commit(MutationTypes.SET_POPUP, true)
      }
    }
    const closePopup = () => {
      showPopup.value = false
    }
    const onProceed = () => {
      showPopup.value = false
      const carIds = checkedSavedCars.value.map((e) => {
        return e.id
      })
      store.dispatch(userCarsActionTypes.DELETE_SAVED_CAR, carIds)
      checkedSavedCars.value = []
    }
    const closeTaxPercentagePopup = () => {
      showTaxPercentagePopup.value = false
    }
    const configureSelected = async () => {
      if (checkedSavedCars.value.length > 0) {
        // allOptionId's
        const optionIds = checkedSavedCars.value[0].options
          .flatMap((e) => {
            return [e, ...e['children']]
          })
          .map((item) => item['optionId'].toString())
        // userSelectedOptions
        const userSelectedOptions = checkedSavedCars.value[0].options.map((e) => {
          return e['optionId'].toString()
        })
        // nestedOptions
        const nestedOptions = {}
        checkedSavedCars.value[0].options.forEach((item) => {
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
          otherAccessories: checkedSavedCars.value[0].otherAccessories,
          chargingFacilities: checkedSavedCars.value[0].chargingFacilities
        }
        await sessionStorage.setItem('optionsConfigurationData', JSON.stringify(selectedOptions))
        await router.push({
          name: 'Step3',
          params: {
            vehicleId: checkedSavedCars.value[0].vehicleDetails.unique_identity_101,
            carOrderId: checkedSavedCars.value[0].id
          }
        })
      }
    }

    const viewDetails = async () => {
      store.dispatch(ActionTypes.DOWNLOAD_CARORDERPDF, {
        lang: localStorage.getItem('locale') || 'nl',
        carOrderId: user.value.carOrders['id']
      })
    }
    const compareSelected = () => {
      const carIds = checkedSavedCars.value.map((e) => {
        return e.id
      })
      router.push({ name: 'CompareCars', query: { id: carIds } })
    }

    const checkSelected = (item) => {
      const searchIndex = checkedSavedCars.value.findIndex((e: savedCarsType) => e.id == item.id)
      return searchIndex !== -1
    }
    const onCheck = (item) => {
      const searchIndex = checkedSavedCars.value.findIndex((e: savedCarsType) => e.id == item.id)
      if (searchIndex === -1) {
        checkedSavedCars.value.push(item)
      } else {
        checkedSavedCars.value.splice(searchIndex, 1)
      }
    }
    const closeInfoPopup = () => {
      store.commit(MutationTypes.SET_CARORDERSUCCESS, false)
    }
    const closePdfInfoPopup = () => {
      store.commit(MutationTypes.SET_CARORDERPDFERROR, false)
    }
    const closeShowNoCarPolicyPopup = () => {
      store.commit(MutationTypes.SET_POPUP, false)
    }
    const selectAll = (allItems, $event) => {
      checkedSavedCars.value = [...allItems]
      if (!$event.target.checked) {
        checkedSavedCars.value = []
      }
    }
    const getLeaseValidUntil = (date) => {
      return date.split('-').reverse().join('-')
    }
    const goToAccount = () => {
      router.push({ name: 'UserProfile' })
    }
    return {
      launchSelector,
      showPopup,
      closePopup,
      onProceed,
      configureSelected,
      checkSelected,
      formatCurrency,
      onCheck,
      ConvertToCommas,
      allSavedCars,
      checkedSavedCars,
      loader,
      compareSelected,
      imagesURl,
      carOrderSuccess,
      carOrderPdfError,
      closeInfoPopup,
      closePdfInfoPopup,
      showNoCarPolicyPopup,
      closeShowNoCarPolicyPopup,
      selectAllItems,
      selectAll,
      viewDetails,
      user,
      getLeaseValidUntil,
      showTaxPercentagePopup,
      closeTaxPercentagePopup,
      USER_STATUS,
      toLowerCase,
      goToAccount
    }
  }
})
</script>
<style lang="sass" scoped>
.sub-text
  font-size: 14px
  color: $colorHubbleDarkGrey
  line-height: 22px
  text-align: center
  margin: 1.4em 0 0
.title.h4
  font-size: 16px
  text-align: center
  line-height: 22px
  margin-bottom: 2em
  a
    font-family: 'Lato-semibold'
.current-car.not-selected-block
  margin: 0 0 3em
.current-car
  > div
      display: flex
      flex: 1
      .inner-block
        display: flex
        span.currency, span.licence
          display: flex
          align-items: center
          justify-content: center
          font-family: 'Lato-semibold'
        span.currency
          background-color: $currencyColor
          color: $colorWhite
          width: 42px
          height: 48px
          border-top-left-radius: 5px
          border-bottom-left-radius: 5px
        span.licence
          background-color: $colorHubbleYellow
          border-top-right-radius: 5px
          border-bottom-right-radius: 5px
          width: 136px
.select-all
  margin: 0 3em
  padding: 2em 0 1.5em
  border-bottom: 1px solid $colorHubbleButtonGrey
  display: flex
  align-items: center
  @media screen and (max-width: $xlBreakpoint)
    margin: 0 15px
.main-dashboard-section
  display: flex
  flex-direction: column
  margin: 1em 0 0 0
  .top-wrap
    display: flex
    @media screen and (max-width: $mdBreakpoint)
      padding: 2em 15px 0 15px
    .welcome-section
      background: linear-gradient(271.78deg, #2C00AB 1.54%, #00B5AD 98.53%)
      flex: 2.8
      display: flex
      border-radius: 5px
      box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
      color: $colorWhite
      padding: 3em 3em 4.5em
      @media screen and (max-width: $mdBreakpoint)
        padding: 3em 15px
      .left-section
        flex: 2
      .right-section
        flex: 1
        justify-content: flex-end
        display: none
        @media screen and (max-width: $lgBreakpoint)
          flex: 2
          margin-left: 0
        @media screen and (min-width: $mdBreakpoint)
          display: flex
      button
        padding: 0.8em 1em 0.9em 1.5em
        width: MAX-CONTENT
        @media screen and (max-width: $mdBreakpoint)
          margin: auto
      h1
        color: $colorWhite
        margin: 0 0 0.4em 0
        @media screen and (max-width: $mdBreakpoint)
          margin: 0 0 0.3em 0
          font-size: 22px
      p
        font-size: 15px
      .steps-section
        display: flex
        margin: 3em 0 4em 0
        flex-wrap: wrap
        @media screen and (max-width: $lgBreakpoint)
          flex-direction: column
          margin: 1.7em 0
      .col
        display: flex
        flex: 1
        justify-content: space-between
        align-items: center
        margin: 0 5em 0 0
        &:last-child
          margin: 0
        @media screen and (max-width: $xlBreakpoint)
          margin: 0 3em 1.4em 0
        @media screen and (max-width: $mdBreakpoint)
          margin: 0 0 1.4em 0
          &:last-child
            margin: 0 0 1.4em 0
        span
          background-color: rgba(255, 255, 255, 0.1)
          border-radius: 5px
          font-size: 28px
          color: $colorWhite
          max-width: 75px
          height: 75px
          display: flex
          flex: 1
          justify-content: center
          align-items: center
          margin: 0 0.6em 0 0
          font-weight: 900
        p
          flex: 2
          font-size: 14px
          line-height: 22px
    .profile-section
      width: 70%
      margin: 0 0 0 6em
      position: relative
      padding: 1em 0 0
      display: flex
      @media screen and (max-width: $xlBreakpoint)
        margin: 0 0 0 4em
        width: 100%
      .guide-image
        @include backgroundImage('guide-arrow.svg')
        width: 69px
        height: 70px
        display: flex
        background-size: contain
        position: absolute
        right: 0
        @media screen and (max-width: $lgBreakpoint)
          width: 48px
      p
        font-size: 16px
        padding-right: 4em
        @media screen and (max-width: $lgBreakpoint)
          font-size: 15px
        span
          font-family: 'Lato-semibold'
          cursor: pointer
          border-bottom: 1px solid $colorWhite
          display: inline-block
          @media screen and (max-width: $lgBreakpoint)
            font-size: 15px
          a
           color: $colorWhite
.dashboard-section
  display: flex
  margin: 4em 0
  .current-car.not-selected-block
    h1
      color: $colorHubbleGreyIcons
  @media screen and (max-width: $mdBreakpoint)
    flex-direction: column
    padding: 0 15px 10em 15px
  .left-block
    flex: 1
    flex-basis: 50%
    flex-grow: 0
    h3
      margin: 0.6em 0 1.2em 0
      @media screen and (max-width: $xlBreakpoint)
        margin: 1.5em 0 0.5em
  h3
    margin-bottom: 1em
    @media screen and (max-width: $xlBreakpoint)
      margin: 1.5em 0 0.5em
      font-size: 16px
  .car-block, .not-selected-block, .saved-cars, .fixed-to-bottom
    display: flex
    background: $colorWhite
    box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
    border-radius: 5px
  .car-block
    padding: 3em 3em
    align-items: center
    margin: 0 0 4em
    cursor: pointer
    @media screen and (max-width: $mdBreakpoint)
      margin: 0
  .common-block
    padding: 3em 3em
    align-items: center
    @media screen and (max-width: $xlBreakpoint)
      flex-direction: column
      padding: 2em 15px
    .car-details
      display: flex
      flex: 1
      @media screen and (max-width: $xlBreakpoint)
        align-self: flex-start
      .image-block
        display: flex
        align-items: center
        justify-content: center
        img
          max-width: 100px
      .details
        display: flex
        flex-direction: column
        justify-content: center
        margin: 0 0.5em 0 1.3em
        h4
          font-size: 16px
          font-weight: 400
          margin: 0
        span
          color: $colorHubbleDarkGrey
          font-size: 14px
    .car-cost-details
      display: flex
      flex: 1
      @media screen and (max-width: $xlBreakpoint)
        width: 100%
        margin: 1.8em 0 0 0
      .inner-block
        display: flex
        flex-direction: column
        flex: 1
        h4
          color: $colorHubbleDarkGrey
          font-weight: normal
          font-size: 14px
          margin: 0
        span
          font-size: 16px
        .valid-date
          color: $colorHubbleRed
  .not-selected-block
    flex-direction: column
    padding: 3em 3em 4em 3em
    @media screen and (max-width: $xlBreakpoint)
      padding: 3em 15px 4em 15px
    h1
      color: $colorHubbleGreyIcons
      @media screen and (max-width: $xlBreakpoint)
        font-size: 22px
        line-height: 28px
    p
      color: $colorHubbleDarkGrey
      font-size: 14px
      line-height: 22px
      margin: 0.6em 0 2.3em
    button
      width: fit-content
  .right-block
    flex: 1
    margin: 0 0 0 3.3em
    @media screen and (max-width: $mdBreakpoint)
      margin: 0
    .saved-cars-heading, .common-block
      display: flex
    .buttons-block
      display: none
    .buttons-block
      position: relative
      .disable-button
        background: $colorHubbleGreyLines
        color: $colorWhite
        pointer-events: none
      .disable-button.close--left
        &:before
          content: url(~@/assets/close-white.svg)
      .configure-active, .delete-active
        pointer-events: all
      .configure-active
        background: $colorHubble
        &:hover
          background: $colorHubbleHover
      .delete-active.close--left
        color: $colorHubble
        &:hover
          background: $colorWhite
        &:before
          content: url(~@/assets/close.svg)
      @media screen and (min-width: $xlBreakpoint)
        display: flex
        button
          &:first-child
            margin: 0 0.7em 0 0
    .saved-cars-heading
      justify-content: space-between
      align-items: center
      margin: 0 0 1em
      h3
        margin-bottom: 0
      .fixed-to-bottom
        display: none
        justify-content: space-between
        position: fixed
        bottom: 0
        width: 100%
        z-index: 1
        padding: 1em 15px
        border-radius: 0
        left: 0
        right: 0
        box-sizing: border-box
        @media screen and (max-width: $xlBreakpoint)
          display: flex
    .saved-cars
      flex-direction: column
      .common-block
        margin: 0 3em
        padding: 1.5em 0
        border-bottom: 1px solid $colorHubbleButtonGrey
        @media screen and (max-width: $xlBreakpoint)
          margin: 0 15px
        &:first-child
          border-top: 1px solid $colorHubbleButtonGrey
        .car-cost-details
          .inner-block
            span.valid-date
              color: $colorHubbleText
.flipBtn-animation
  transform: rotateX( 180deg )
  button
    transform: rotateX( -180deg )
.flipBtn
  transition: .6s
  transition-duration: 0.5s
  transform-style: preserve-3d
.flipBtn_front
  transform: rotateY(0)
  backface-visibility: hidden
  transform-style: preserve-3d
.center-items
  display: flex
  align-items: center
  justify-content: center
.empty-block
  h1
    color: $colorHubbleGreyIcons
  @media screen and (max-width: $xlBreakpoint)
    font-size: 22px
    line-height: 28px
  p
    font-family: 'Lato'
    color: $colorHubbleDarkGrey
    font-size: 14px
    line-height: 22px
    margin: 0.6em 0 0
</style>
