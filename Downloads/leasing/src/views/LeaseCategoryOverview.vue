<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div v-if="!loader" class="lease-categories-wrap">
    <div class="lease-heading">
      <h1>{{ $t('_DriverAccount.leaseCategory') }}</h1>
      <Button
        v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')"
        :text="$t('leaseCategories.newleaseCategory')"
        @click="openNewCategory"
        buttonType="add--left dark"
      />
    </div>
    <div class="row" v-if="typeof getAllLeaseCategories !== 'string' && getAllLeaseCategories.length">
      <div
        v-for="(category, index) in getAllLeaseCategories"
        :key="index"
        class="details-inner-wrap display-info-layout lease-category"
      >
        <div class="category-title-wrap">
          <h2>{{ category['title'] }}</h2>
          <div v-if="roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')" class="edit-block">
            <router-link :to="{ name: 'LeaseCategory', params: { id: category['id'] } }"
              ><span class="edit"></span
            ></router-link>
          </div>
        </div>
        <div>
          <label>{{ $t('_DriverAccount.leaseAmount') }}</label>
          <ul
            class="lease-budget"
            v-if="category['multipleFuelTypesAmount'] && category['multipleFuelTypesAmount'].length"
          >
            <li v-for="(item, index) in category['multipleFuelTypesAmount']" :key="index">
              <span>{{ $t(`leaseCategories.${item['fuelType']}Car`) }}</span>
              <span>€ {{ ConvertToCommas(item['amount']) }}</span>
            </li>
          </ul>
          <span v-else>€ {{ ConvertToCommas(category['amount']) }}</span>
        </div>
        <div>
          <label
            >{{ $t('_DriverAccount.overrun') }} (<i v-if="category['overrunType'] == '$'">€</i>
            <i v-else>{{ category['overrunType'] }}</i
            >)
          </label>
          <span v-if="category['overrun'] == null">-</span>
          <span v-else>
            <span v-if="category['overrunType'] == '%'">
              {{ ConvertToCommas(category['overrun']) }} {{ category['overrunType'] }}
            </span>
            <span v-else> € {{ ConvertToCommas(category['overrun']) }} </span>
          </span>
        </div>
        <div>
          <label>{{ $t('_DriverAccount.personalContribution') }}</label>
          <span>€ {{ ConvertToCommas(category['personalContribution']) }}</span>
        </div>
        <div>
          <label>{{ $t('_DriverAccount.personalContributionPercent') }}</label>
          <span v-if="category['maxPersonalContributionPercentage'] == null">-</span>
          <span v-else>{{ ConvertToCommas(category['maxPersonalContributionPercentage']) }}%</span>
        </div>
        <div>
          <label>{{ $t('_DriverAccount.undershoot') }}</label>
          <span>{{ ConvertToCommas(category['undershootPayoutPercentage']) }} %</span>
        </div>
        <div>
          <label>{{ $t('_DriverAccount.maxCo2') }}</label>
          <span v-if="category['co2Emission'] == null">-</span>
          <span v-else>{{ ConvertToCommas(category['co2Emission']) }} gr/km</span>
        </div>
      </div>
    </div>
    <div class="not-found-block" v-else>
      <h3>{{ $t('_carPolicy.noLeaseCategory') }}</h3>
    </div>
  </div>
  <div v-else class="loader-block">
    <loader />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import Button from '@/components/UI/Button.vue'
import { useStore } from '@/store'
import { leaseActionTypes } from '@/store/leaseCategories/actions'
import { VueCookieNext } from 'vue-cookie-next'
import loader from '@/components/UI/Loader.vue'
import { useRouter } from 'vue-router'
import MessageBar from '@/components/UI/MessageBar.vue'
import getCompany from '@/mixins/getCompany'
import ConvertToCommas from '@/filters/ConvertToCommas'
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
    const loader = computed(() => store.state.leaseCategories.loader)
    const roles = VueCookieNext.getCookie('roles')
    const getAllLeaseCategories = computed(() => store.state.leaseCategories.allLeaseCategories)
    const { compId, companyDetailState } = getCompany()
    const initializeRequest = () => {
      store.dispatch(leaseActionTypes.GET_ALLCATEGORIES, { companyId: compId })
    }
    const openNewCategory = () => {
      router.push({ name: 'LeaseCategory' })
    }
    onMounted(async () => {
      await initializeRequest()
    })
    return {
      loader,
      getAllLeaseCategories,
      openNewCategory,
      ConvertToCommas,
      roles,
      companyDetailState
    }
  }
})
</script>
<style lang="sass" scoped>
ul.lease-budget
  padding: 0
  margin: 0
  li
    list-style: none
    display: flex
    margin: 3px 0
    span
      flex: 1
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
      width: 24%
      box-sizing: border-box
      margin: 0 3.2em 3.2em 0
      @media screen and (max-width: $lgBreakpoint)
        width: 48%
        margin: 0 2em 1em 0
        &:nth-child(2n)
          margin: 0 0 1em 0
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
        margin: 0 0 2em 0
      h2
        margin: 0.9em 0 0.4em 0
        border: 0
      label
        i
          font-style: normal
      .category-title-wrap
        display: flex
        align-items: center
        justify-content: space-between
        border-bottom: 1px solid $colorHubbleGreyIcons
        .edit-block
          display: flex
          flex-direction: row
          align-items: center
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
