<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div v-if="!loader" class="lease-categories-wrap">
    <div class="lease-heading">
      <h1>{{ $t('_carPolicy.carPolicies') }}</h1>
      <Button
        v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')"
        :text="$t('_carPolicy.newCarPolicy')"
        @click="openNewCarPolicy"
        buttonType="add--left dark"
      />
    </div>
    <div class="row" v-if="typeof getAllCarPolicies !== 'string' && getAllCarPolicies.length">
      <div
        v-for="(policy, index) in getAllCarPolicies"
        :key="index"
        class="details-inner-wrap display-info-layout lease-category"
        :style="{ 'border-color': policy['colorCode'] }"
      >
        <div class="category-title-wrap">
          <h2>{{ policy['policyTitle'] }}</h2>
          <div v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')" class="edit-block">
            <router-link :to="{ name: 'carPolicy', params: { id: policy['id'] } }"
              ><span class="edit"></span
            ></router-link>
          </div>
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
        <div>
          <label>{{ $t('_carPolicy.doorsAmount') }}</label>
          <span
            >{{ policy['amountOfDoors']['min'] }} - {{ policy['amountOfDoors']['max'] }}
            {{ $t('_wizard.step9.doors') }}</span
          >
        </div>
        <div>
          <label>{{ $t('_carPolicy.carBrandsModels') }}</label>
          <div class="inner-row text-wrap" v-if="policy['carBrandsAndModels'].length">
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
          <div v-if="policy['mandatoryAccessories'].length" class="inner-row text-wrap mandatory-acc">
            <span v-for="(item, index) in policy['mandatoryAccessories']" :key="index">
              {{ item['accessory'] }} ({{ formatCurrency(item['price']) }})<i>, </i>
            </span>
          </div>
          <div class="not-found-block" v-else>-</div>
        </div>
        <div>
          <label>{{ $t('_carPolicy.chargingFacility') }}</label>
          <div v-if="policy['chargingFacility'].length" class="inner-row text-wrap mandatory-acc">
            <span v-for="(item, index) in policy['chargingFacility']" :key="index">
              {{ item['chargingFacility'] }} ({{ formatCurrency(item['price']) }})<i>, </i>
            </span>
          </div>
          <div class="not-found-block" v-else>-</div>
        </div>
        <div>
          <label>{{ $t('_carPolicy.mandatoryFactoryOptions') }}</label>
          <span v-if="policy['mandatoryFactoryOptions'].length">{{
            $t(`_carPolicy.${policy['mandatoryFactoryOptions'][0]}`)
          }}</span>
          <span v-else>-</span>
        </div>
        <div>
          <label>{{ $t('_carPolicy.excludedColors') }}</label>
          <div class="inner-row text-wrap" v-if="policy['excludedCarColors'] && policy['excludedCarColors'].length">
            <span class="fuel-types" v-for="(item, index) in policy['excludedCarColors']" :key="index">
              {{ $t(`_carPolicy.${item}`) }}
              <i>, </i>
            </span>
          </div>
          <span v-else>-</span>
        </div>
        <div>
          <label>{{ $t('_carPolicy.carPolicyDocument') }}</label>
          <span v-if="policy['document']">{{ policy['document'] }}</span>
          <span v-else>-</span>
        </div>
      </div>
    </div>
    <div class="not-found-block" v-else>
      <h3>{{ $t('_carPolicy.noCarPolicy') }}</h3>
    </div>
  </div>
  <div v-else class="loader-block">
    <loader />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import Button from '@/components/UI/Button.vue'
import loader from '@/components/UI/Loader.vue'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import formatCurrency from '@/filters/CurrencyFormat'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
import getTranslatedFuelType from '@/filters/getTranslatedFuelType'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { VueCookieNext } from 'vue-cookie-next'
import MessageBar from '@/components/UI/MessageBar.vue'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  name: 'Lease Categories',
  components: {
    Button,
    loader,
    MessageBar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const roles = VueCookieNext.getCookie('roles')
    const getAllCarPolicies = computed(() => store.state.carPolicy.getAllCarPolicies)
    const loader = computed(() => store.state.carPolicy.loader)
    const { compId, companyDetailState } = getCompany()
    const initializeRequest = () => {
      store.dispatch(carPolicyActionTypes.GET_ALLPOLICIES, { companyId: compId })
    }
    onMounted(async () => {
      await initializeRequest()
    })
    const openNewCarPolicy = () => {
      router.push({ name: 'carPolicy' })
    }
    return {
      getAllCarPolicies,
      loader,
      getTranslatedFuelType,
      formatCurrency,
      getTranslatedBodyType,
      openNewCarPolicy,
      roles,
      companyDetailState
    }
  }
})
</script>
<style lang="sass" scoped>
.text-wrap
  flex-wrap: wrap
  flex-direction: row !important
  i
    margin: 0 0.2em 0 0
  span:last-child
    i
      display: none
.display-info-layout div.not-found-block
  padding: 0
  color: $colorHubbleText
  font-size: 16px
  margin: 0
  align-items: flex-start
.lease-categories-wrap
  @media screen and (max-width: $mdBreakpoint)
    padding: 0 15px
  @media screen and (min-width: $mdBreakpoint)
    padding: 0
  .lease-heading
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0 0 2em 0
    @media screen and (max-width: $mdBreakpoint)
      flex-direction: column
      align-items: flex-start
      margin: 1.5em 0 2.5em 0
    button
      padding: 0.9em 1.5em 0.9em 1em
      @media screen and (max-width: $mdBreakpoint)
        padding: 0.7em 1em 0.7em 0.5em
  h1
    color: $colorHubble
    margin: 0
    @media screen and (max-width: $mdBreakpoint)
      font-size: 20px
      margin: 0 0 0.5em 0
  .row
    display: flex
    flex-wrap: wrap
    @media screen and (max-width: $xsBreakpoint)
      flex-direction: column
    .lease-category
      padding: 0 20px 10px 20px
      width: 32%
      box-sizing: border-box
      border-top: 5px solid
      height: 100%
      .inner-row
        padding: 0
        display: flex
      .mandatory-acc
        flex-direction: row
        flex-wrap: wrap
        span
          i
            margin: 0 0.2em 0 0
          &:last-child
            i
              display: none
      @media screen and (max-width: $lgBreakpoint)
        width: 49%
        margin: 0 2% 2% 0
        &:nth-child(2n)
          margin: 0 0 1em 0
      @media screen and (min-width: $lgBreakpoint)
        width: 32%
        margin: 0 2% 2% 0
        &:nth-child(3n+0)
          margin-right: 0
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
        margin: 0 0 2em 0
      &.management
        border-color: $colorHubbleDarkGreen
      &.junior
        border-color: $colorHubble
      &.draft
        border-color: $colorHubbleGreyIcons
      div
        span.fuel-types
          text-transform: capitalize
      h2
        margin: 0 0 0 0
        border: 0
        padding: 0
      .category-title-wrap
        display: flex
        align-items: center
        justify-content: space-between
        border-bottom: 1px solid $colorHubbleGreyIcons
        padding: 12px 0
        .edit-block
          display: flex
          flex-direction: row
          align-items: center
          padding: 0
          span.text
            font-size: 14px
            color: $colorHubbleDarkGrey
          span.edit
            display: flex
            width: 48px
            height: 30px
            background-color: $colorHubbleLightPurple
            justify-content: center
            align-items: center
            border-radius: 50px
            margin: 0em 0 0 0.5em
            cursor: pointer
            &:after
              content: ""
              @include backgroundImage('edit.svg')
              background-color: $colorHubbleLightPurple
              width: 18px
              height: 18px
              background-size: 100%
</style>
