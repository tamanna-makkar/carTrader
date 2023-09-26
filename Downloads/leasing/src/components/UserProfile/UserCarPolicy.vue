<template>
  <div v-if="!loader">
    <div class="car-policy-wrap">
      <div class="left-area">
        <div v-if="Object.keys(policy).length" class="details-inner-wrap display-info-layout car-policy">
          <h2>{{ $t('_carPolicy.title') }}</h2>
          <div>
            <label>{{ $t('_carPolicy.policyName') }}</label>
            <span v-if="policy['policyTitle'] !== null">{{ policy['policyTitle'] }}</span>
            <span v-else>{{ $t('_carPolicy.noPolicy') }}</span>
          </div>
          <div>
            <label>{{ $t('_carPolicy.fuelType') }}</label>
            <div class="inner-row text-wrap">
              <span class="fuel-types" v-for="(item, index) in policy['fuelType']" :key="index">
                {{ $t(getTranslatedFuelType(item['title'])) }}
                <i>, </i>
              </span>
            </div>
          </div>
          <div>
            <label>{{ $t('_carPolicy.carBodyType') }}</label>
            <div class="inner-row text-wrap">
              <span class="fuel-types" v-for="(item, index) in policy['carBodyType']" :key="index">
                {{ $t(getTranslatedBodyType(item)) }}
                <i>, </i>
              </span>
            </div>
          </div>
          <!-- <div>
            <label>{{ $t('_carPolicy.minAmountOfDoors') }}</label>
            <span v-if="policy.amountOfDoors"> {{ policy.amountOfDoors.min }} {{ $t('_carPolicy.doors') }} </span>
          </div> -->
          <div>
            <label>{{ $t('_carPolicy.doorsAmount') }}</label>
            <span v-if="policy['amountOfDoors']"
              >{{ policy['amountOfDoors']['min'] ?? '' }} - {{ policy['amountOfDoors']['max'] ?? '' }}
              {{ $t('_wizard.step9.doors') }}</span
            >
          </div>
          <div>
            <label>{{ $t('_carPolicy.carBrandsModels') }}</label>
            <div class="inner-row text-wrap" v-if="policy['carBrandsAndModels'] && policy['carBrandsAndModels'].length">
              <span v-for="(item, index) in policy['carBrandsAndModels']" :key="index">
                {{ item['brand'] }} (<span v-if="item['models'].length"> {{ item['models'].join(', ') }} </span
                ><span v-else>{{ $t('_generalTerms.any') }} </span>) <i>, </i>
              </span>
            </div>
            <div class="inner-row" v-else>
              <span class="disabled">{{ $t('_carPolicy.noLimit') }}</span>
            </div>
          </div>
          <div>
            <label>{{ $t('_carPolicy.mandatoryAccessoriesHeading') }}</label>
            <div
              v-if="policy['mandatoryAccessories'] && policy['mandatoryAccessories'].length"
              class="inner-row text-wrap mandatory-acc"
            >
              <span v-for="(item, index) in policy['mandatoryAccessories']" :key="index">
                {{ item['accessory'] }} ({{ formatCurrency(item['price']) }})<i>, </i>
              </span>
            </div>
            <div class="not-found-block" v-else>-</div>
          </div>
          <div>
            <label>{{ $t('_carPolicy.mandatoryFactoryOptions') }}</label>
            <span v-if="policy['mandatoryFactoryOptions'] && policy['mandatoryFactoryOptions'].length">{{
              policy['mandatoryFactoryOptions'].join(', ')
            }}</span>
            <span v-else>-</span>
          </div>
          <div>
            <label>{{ $t('_carPolicy.carPolicyDocument') }}</label>
            <span class="car-policy-document" v-if="policy['document']" @click="downloadCarPolicyDocument">{{
              policy['document']
            }}</span>
            <span v-else>-</span>
          </div>
        </div>
        <div v-else class="details-inner-wrap display-info-layout car-policy">
          <h2>{{ $t('_carPolicy.title') }}</h2>
          <span>{{ $t('_carPolicy.noPolicy') }}</span>
        </div>
      </div>
      <div class="right-area">
        <div v-if="Object.keys(leaseCategory).length" class="lease-section">
          <div class="details-inner-wrap display-info-layout car-policy">
            <h2>{{ $t('_DriverAccount.leaseCategory') }}</h2>
            <div>
              <label>{{ $t('_DriverAccount.leaseAmount') }}</label>
              <ul
                class="lease-budget"
                v-if="leaseCategory.multipleFuelTypesAmount && leaseCategory.multipleFuelTypesAmount.length"
              >
                <li v-for="(item, index) in leaseCategory.multipleFuelTypesAmount" :key="index">
                  <span>{{ $t(`leaseCategories.${item['fuelType']}Car`) }}</span>
                  <span>€ {{ ConvertToCommas(item['amount']) }}</span>
                </li>
              </ul>
              <span v-else>€ {{ ConvertToCommas(leaseCategory.amount) }}</span>
            </div>
            <div>
              <label>{{ $t('_DriverAccount.overrun') }}</label>
              <span>
                <span v-if="leaseCategory.overrun == null">-</span>
                <span v-else>
                  {{ leaseCategory.overrunType === '$' ? '€' : '' }} {{ ConvertToCommas(leaseCategory.overrun) }}
                  {{ leaseCategory.overrunType === '%' ? '%' : '' }}
                </span>
              </span>
            </div>
            <div>
              <label>{{ $t('_DriverAccount.personalContribution') }}</label>
              <span>€ {{ ConvertToCommas(leaseCategory.personalContribution) }}</span>
            </div>
            <div>
              <label>{{ $t('_DriverAccount.personalContributionPercent') }}</label>
              <span v-if="leaseCategory.maxPersonalContributionPercentage == null">-</span>
              <span v-else>{{ ConvertToCommas(leaseCategory.maxPersonalContributionPercentage) }}%</span>
            </div>
            <div>
              <label>{{ $t('_DriverAccount.undershoot') }}</label>
              <span>{{ ConvertToCommas(leaseCategory.undershootPayoutPercentage) }} %</span>
            </div>
            <div>
              <label>{{ $t('_DriverAccount.maxCo2') }}</label>
              <span v-if="leaseCategory['co2Emission'] == null">-</span>
              <span v-else>{{ ConvertToCommas(leaseCategory.co2Emission) }} gr/km</span>
            </div>
          </div>
        </div>
        <div v-else class="lease-section">
          <div class="details-inner-wrap display-info-layout car-policy">
            <h2>{{ $t('_DriverAccount.leaseCategory') }}</h2>
            <span>{{ $t('_DriverAccount.noLeaseCategory') }}</span>
          </div>
        </div>
        <div class="preset-section">
          <div class="white-area">
            <p>{{ $t('_DriverAccount.presetSelections') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loader-block" v-else>
    <Loader />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { AuthActionTypes } from '@/store/auth/actions'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import getTranslatedFuelType from '@/filters/getTranslatedFuelType'
import { leaseActionTypes } from '@/store/leaseCategories/actions'
import Loader from '@/components/UI/Loader.vue'
import formatCurrency from '@/filters/CurrencyFormat'
import { VueCookieNext } from 'vue-cookie-next'
import ConvertToCommas from '@/filters/ConvertToCommas'
export default defineComponent({
  name: 'Driver Car Policy',
  setup() {
    const store = useStore()
    const user = computed(() => store.state.auth.currentUser)
    const loader = computed(() => store.state.auth.loader)
    const policy = computed(() => store.state.auth.carPolicyByID)
    const leaseCategory = computed(() => store.state.leaseCategories.leaseCategoryByID)
    const initialize = async () => {
      if (VueCookieNext.getCookie('companyId') && VueCookieNext.getCookie('employeeCarPolicyId')) {
        await store.dispatch(AuthActionTypes.GET_CARPOLICY_BY_ID, {
          companyId: VueCookieNext.getCookie('companyId'),
          carPolicyId: VueCookieNext.getCookie('employeeCarPolicyId')
        })
      }
      if (user.value.leaseCategory !== null) {
        await store.dispatch(leaseActionTypes.GET_LEASEBYID, {
          companyId: VueCookieNext.getCookie('companyId'),
          leaseCategoryId: user.value.leaseCategory.id
        })
      }
    }
    const downloadCarPolicyDocument = () => {
      store.dispatch(carPolicyActionTypes.DOWNLOAD_CARPOLICYDOCUMENT, {
        companyId: VueCookieNext.getCookie('companyId'),
        carPolicyId: VueCookieNext.getCookie('employeeCarPolicyId')
      })
    }
    onMounted(async () => {
      await initialize()
    })
    return {
      user,
      loader,
      policy,
      leaseCategory,
      getTranslatedFuelType,
      getTranslatedBodyType,
      formatCurrency,
      downloadCarPolicyDocument,
      ConvertToCommas
    }
  },
  components: {
    Loader
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
.inner-row.text-wrap, .inner-row, .not-found-block
  padding: 0 !important
.display-info-layout div.not-found-block
  padding: 0
  color: $colorHubbleText
  font-size: 16px
  margin: 0
  align-items: flex-start
.car-policy-wrap .display-info-layout  span.car-policy-document
  color: $colorHubbleDarkBlue
  cursor: pointer
  color: 15px
.loader-block
  display: flex
  flex: 1
  justify-content: space-around
.car-policy-wrap
  display: flex
  @media screen and (max-width: $lgBreakpoint)
    flex-direction: column
  h2
    margin: 1.4em 0 0.5em 0
  .display-info-layout
    display: flex
    flex-direction: column
    padding: 0 3em 4em 3em
    @media screen and (max-width: $lgBreakpoint)
      padding: 0 15px 2em 15px
    div
      border-bottom: 1px solid $colorHubbleGreyLines
      display: flex
      flex-direction: column
      padding: 12px 0
      &:last-child
        border-bottom: none
      label
        font-size: 14px
        color: $colorHubbleDarkGrey
        padding: 0 0 6px 0
      span
        font-size: 16px
        color: $colorHubbleText
        line-height: normal
        &.disabled
          color: $colorHubbleGreyIcons
  .left-area, .right-area
    flex: 1
  .left-area
    margin: 0 3.2em 0 0
    @media screen and (max-width: $lgBreakpoint)
      margin: 0 0 2em 0
      flex: 1.2
  .right-area
    display: flex
    flex: 2
    @media screen and (max-width: $lgBreakpoint)
      flex-direction: column
      flex: 1
    .lease-section
      margin: 0 3.3em 0 0
      @media screen and (max-width: $lgBreakpoint)
        margin: 0 0 2em 0
      .car-policy
        &:first-child
          margin: 0 0 3.1em 0
          @media screen and (max-width: $lgBreakpoint)
            margin: 0 0 2.1em 0
    .lease-section , .preset-section
      flex: 1
    .preset-section
      .white-area
        padding: 2.1em
        border-radius: 5px
        background: $colorWhite
        p
          font-size: 14px
          line-height: 22px
          color: $colorHubbleText
    .left-area, .right-area .lease-section, .right-area
      @media screen and (max-width: $lgBreakpoint)
        margin: 0 0 2.1em 0
.text-wrap
  flex-wrap: wrap
  flex-direction: row !important
  i
    margin: 0 0.2em 0 0
  span:last-child
    i
      display: none
ul.lease-budget
  padding: 0
  margin: 0
  li
    list-style: none
    display: flex
    margin: 3px 0
    span
      flex: 1
</style>
