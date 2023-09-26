<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="employees-wrap">
    <div class="employees-heading-wrap">
      <h1>{{ $t('_employees.employees') }}</h1>
      <Button :text="$t('_employees.newEmployee')" @click="openNewEmployee" buttonType="add--left dark" />
    </div>
    <div class="employee-details-wrap">
      <div class="filters-main-wrap">
        <div class="search-filters-wrap">
          <div class="search-wrap">
            <Input
              :placeholder="$t('_employees.searchBy')"
              :isEmployeeSearch="true"
              :searchInput="true"
              v-model:value="searchBy"
              @update:value="onInput"
              @onEnter="onEnter"
            />
          </div>
          <div class="add-filters">
            <span class="toggle-down" :class="{ 'toggle-up': isFilters }" @click="isFilters = !isFilters"></span>
            {{ $t('_employees.addFilters') }}
          </div>
          <div class="filters-wrap" v-if="isFilters">
            <div v-if="typeof carPolicies !== 'string' && carPolicies.length" class="outer-wrap">
              <Dropdown
                :employeesItems="getAllCarPolicies"
                :selectedOption="$t(selectedCarPolicy)"
                :selectedDropdownItems="getIdsOnly(carPolicyArray)"
                @onChange="selectCarPolicy"
                type="employees-list car-policy-dropdown"
                :isMultiselect="true"
              />
            </div>
            <div v-if="typeof leaseCategories !== 'string' && leaseCategories.length" class="outer-wrap">
              <Dropdown
                :employeesItems="getAllLeaseCategories"
                :selectedOption="$t(selectedLeaseCategory)"
                :selectedDropdownItems="getIdsOnly(leaseCategoryArray)"
                @onChange="selectLeaseCategory"
                type="employees-list lease-category-dropdown"
                :isMultiselect="true"
              />
            </div>
            <div class="outer-wrap">
              <Dropdown
                :items="statusItems"
                :selectedOption="$t(selectedStatus)"
                :selectedDropdownItems="statusItemsArray.value"
                @onChange="selectStatus"
                type="employees-list status-dropdown"
                :isMultiselect="true"
              />
            </div>
          </div>
        </div>
        <div class="selected-dropdown-items" v-if="isFilters">
          <ul>
            <li v-for="(item, index) in carPolicyArray.value" :key="index">
              {{ item['title'] }}
              <span class="remove-icon" @click="removeCarPolicy(item, index)"></span>
            </li>
            <li v-for="(item, index) in leaseCategoryArray.value" :key="index">
              {{ item['title'] }} <span v-if="item['amount']">({{ CurrencyFormat(item['amount']) }})</span>
              <span class="remove-icon" @click="removeLeaseCategory(item, index)"></span>
            </li>
            <li v-for="(item, index) in statusItemsArray.value" :key="index">
              {{ $t(`_employees.${item}`) }}
              <span class="remove-icon" @click="removeStatusItems(item, index)"></span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!loader" class="listing-main-wrap">
        <div class="listing-wrap">
          <div class="sub-wrap">
            <div class="results-wrap">
              <span class="results-count" v-if="totalUsers">
                {{ totalUsers }}
              </span>
              <span>{{ $t('_employees.results') }}</span>
            </div>
            <ListingTable
              :headings="employeeHeadings"
              :data="getAllUsers"
              @sortBy="sortBy"
              @setPage="setPage"
              type="employees"
              @editEmployee="editEmployee"
            />
          </div>
        </div>
        <Pagination
          :count="totalUsers"
          :currentPage="route.query.page"
          :itemsPerPage="10"
          @page-changed="setPage"
        ></Pagination>
      </div>
      <div v-else class="loader-block">
        <loader />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref, onMounted, computed, watch } from 'vue'
import Button from '@/components/UI/Button.vue'
import Input from '@/components/UI/Input.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import ListingTable from '@/components/UI/ListingTable.vue'
import Pagination from '@/components/UI/Pagination.vue'
import { UsersActionTypes } from '@/store/users/actions'
import { leaseActionTypes } from '@/store/leaseCategories/actions'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import MessageBar from '@/components/UI/MessageBar.vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { employeeDropdownsType } from '@/types'
import CurrencyFormat from '@/filters/CurrencyFormat'
import Loader from '@/components/UI/Loader.vue'
import _ from 'lodash'
import { USER_STATUS } from '@/composables/staticValues'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const getAllUsers = computed(() => store.state.users.getAllUsers)
    const totalUsers = computed(() => store.state.users.totalUsers)
    const loader = computed(() => store.state.users.loader)
    const isFilters = ref(true)
    const carPolicies = computed(() => store.state.carPolicy.getAllCarPolicies)
    const leaseCategories = computed(() => store.state.leaseCategories.allLeaseCategories)
    const { compId, companyDetailState } = getCompany()
    const roles = computed(() => store.state.auth.currentUser?.roles)
    const getAllCarPolicies = computed(() =>
      store.state.carPolicy.getAllCarPolicies.map((item) => {
        return { title: item.policyTitle, id: item.id }
      })
    )
    const getAllLeaseCategories = computed(() =>
      store.state.leaseCategories.allLeaseCategories.map((item) => {
        return { title: item.title, amount: item.amount, id: item.id }
      })
    )
    const initializeRequest = (query) => {
      store.dispatch(UsersActionTypes.GET_ALLUSERS, { companyId: compId, query: query })
    }
    const initializeDropdownsRequests = async () => {
      await store.dispatch(carPolicyActionTypes.GET_ALLPOLICIES, { companyId: compId })
      await store.dispatch(leaseActionTypes.GET_ALLCATEGORIES, { companyId: compId })
    }
    const carPolicyArray: { value: employeeDropdownsType[] } = reactive({ value: [] })
    const leaseCategoryArray: { value: employeeDropdownsType[] } = reactive({ value: [] })
    const statusItemsArray: { value: Array<string> } = reactive({ value: [] })
    const getIdsOnly = (selectedArray) => {
      return selectedArray.value.map((item) => item.id)
    }
    watch(
      () => route.query,
      () => {
        if (route.name == 'Employees') {
          initializeRequest(route.query)
        }
      }
    )
    onMounted(async () => {
      await initializeRequest(route.query)
      await initializeDropdownsRequests()
      const getSelectedFilterItems = (queryParams, storeData) => {
        const ids = queryParams.toString().split(',')
        const selectedItems = storeData.filter((option) => {
          return ids.includes(option['id']?.toString())
        })
        return selectedItems
      }
      if (route.query.carPolicy) {
        carPolicyArray.value = getSelectedFilterItems(route.query.carPolicy, getAllCarPolicies.value)
      }
      if (route.query.leaseCategory) {
        leaseCategoryArray.value = getSelectedFilterItems(route.query.leaseCategory, getAllLeaseCategories.value)
      }
      if (route.query.userStatus) {
        const selectedUserStatus = route.query.userStatus.toString().replace(/['"]+/g, '').split(',')
        statusItemsArray.value = selectedUserStatus
      }
    })
    const searchBy = route.query.name ? ref(route.query.name) : ref('')
    const employeeHeadings = reactive([
      { label: 'Employee name', key: 'name' },
      { label: 'Number plate', key: 'licensePlate' },
      { label: 'Lease valid until', key: 'leaseValidUntil' },
      { label: 'Car policy', key: 'carPolicy' },
      { label: 'Lease category', key: 'leaseCategory' },
      { label: 'Status', key: 'userStatus' }
    ])
    const selectedCarPolicy = ref('_employees.carPolicy')
    watch(
      () => _.cloneDeep(carPolicyArray.value),
      (currentValue) => {
        const carPolicyIds = currentValue.map((item) => item.id)
        const query = Object.assign({}, route.query, { carPolicy: carPolicyIds.join(',') })
        if (!currentValue.length) {
          delete query.carPolicy
        }
        router.push({ query })
      }
    )
    watch(
      () => _.cloneDeep(leaseCategoryArray.value),
      (currentValue) => {
        const leaseCategoriesIds = currentValue.map((item) => item.id)
        const query = Object.assign({}, route.query, { leaseCategory: leaseCategoriesIds.join(',') })
        if (!currentValue.length) {
          delete query.leaseCategory
        }
        router.push({ query })
      }
    )
    watch(
      () => _.cloneDeep(statusItemsArray.value),
      (currentValue) => {
        const statusItems = currentValue.map((item) => `'${item}'`)
        const query = Object.assign({}, route.query, { userStatus: statusItems.join(',') })
        if (!currentValue.length) {
          delete query.userStatus
        }
        router.push({ query })
      }
    )
    const selectCarPolicy = (option) => {
      const findIndex = carPolicyArray.value.findIndex((item) => item.id === option['id'])
      if (findIndex === -1) {
        carPolicyArray.value.push({ title: option['title'], id: option['id'] })
      }
    }
    const removeCarPolicy = (item, index) => {
      if (carPolicyArray.value.indexOf(item) !== -1) {
        carPolicyArray.value.splice(index, 1)
      }
    }
    const statusItems = reactive([
      USER_STATUS.SELECTOR_AVAILABLE,
      USER_STATUS.CAR_ORDERED,
      USER_STATUS.ACTIVE_LEASE,
      USER_STATUS.DEACTIVATED_ACCOUNT,
      USER_STATUS.NO_LEASE_CAR
    ])
    const selectedLeaseCategory = ref('_employees.leaseCategory')
    const selectLeaseCategory = (option) => {
      const findIndex = leaseCategoryArray.value.findIndex((item) => item.id === option['id'])
      if (findIndex === -1) {
        leaseCategoryArray.value.push({
          title: option['title'],
          amount: option['amount'],
          id: option['id']
        })
      }
    }
    const removeLeaseCategory = (item, index) => {
      if (leaseCategoryArray.value.indexOf(item) !== -1) {
        leaseCategoryArray.value.splice(index, 1)
      }
    }
    const selectedStatus = ref('_employees.status')
    const selectStatus = (item) => {
      if (statusItemsArray.value.indexOf(item) === -1) {
        statusItemsArray.value.push(item)
      }
    }
    const removeStatusItems = (item, index) => {
      if (statusItemsArray.value.indexOf(item) !== -1) {
        statusItemsArray.value.splice(index, 1)
      }
    }
    const sortBy = (value) => {
      const query = Object.assign({}, route.query, { orderBy: value['orderBy'], order: value['order'] })
      router.push({ query })
    }
    const setPage = (pageNumber) => {
      const query = Object.assign({}, route.query, { page: pageNumber })
      router.push({ query })
    }
    const onInput = (value) => {
      searchBy.value = value
    }
    const onEnter = () => {
      const searchedTerm = (searchBy.value as string).trim().toLowerCase()
      const query: { name?: string } = Object.assign({}, route.query, { name: searchedTerm, page: 1 })
      if (!searchedTerm) {
        delete query.name
      }
      router.push({ query })
    }
    const openNewEmployee = () => {
      router.push({ name: 'Employee' })
    }
    const editEmployee = (employeeId) => {
      router.push({ name: 'Employee', params: { id: employeeId } })
    }
    return {
      searchBy,
      onInput,
      openNewEmployee,
      selectedCarPolicy,
      selectCarPolicy,
      selectedLeaseCategory,
      selectLeaseCategory,
      statusItems,
      selectedStatus,
      selectStatus,
      employeeHeadings,
      getAllUsers,
      route,
      getAllCarPolicies,
      getAllLeaseCategories,
      carPolicyArray,
      removeCarPolicy,
      leaseCategoryArray,
      CurrencyFormat,
      removeLeaseCategory,
      statusItemsArray,
      removeStatusItems,
      getIdsOnly,
      sortBy,
      totalUsers,
      setPage,
      loader,
      editEmployee,
      isFilters,
      onEnter,
      carPolicies,
      leaseCategories,
      roles,
      companyDetailState
    }
  },
  components: {
    Button,
    Input,
    Dropdown,
    ListingTable,
    Loader,
    Pagination,
    MessageBar
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.filters-wrap
  @media screen and (max-width: $xsBreakpoint)
    flex-direction: column
.outer-wrap
  width: 33%
  @media screen and (max-width: $xsBreakpoint)
    width: 100%
.employees-wrap
   height: 100%
   @media screen and (max-width: $xlBreakpoint)
     width: 92vw
   .listing-wrap
    @media screen and (max-width: $xlBreakpoint)
      overflow-x: scroll
      padding-bottom: 3em
      &::-webkit-scrollbar
        width: 1px
        height: 5px
      &::-webkit-scrollbar-thumb
        background: $colorHubble
        border-radius: 5px
      &::-webkit-scrollbar-track
        background: $colorHubbleGreyLines
        border-radius: 5px
      .sub-wrap
        width: 1500px
   @media screen and (max-width: $mdBreakpoint)
     padding: 15px 15px 0 15px
   .employees-heading-wrap
    display: flex
    justify-content: space-between
    @media screen and (max-width: $mdBreakpoint)
      align-items: center
    h1
      color: $colorHubble
      margin: 0
      @media screen and (max-width: $mdBreakpoint)
        font-size: 20px
    button
      padding: 0.9em 1.5em 0.9em 1em
      @media screen and (max-width: $mdBreakpoint)
        padding: 0.7em 1em 0.7em 0.5em
   .search-wrap
      position: relative
   .add-filters
    align-items: center
    display: none
    font-size: 15px
    color: $colorHubble
    font-family: 'lato-semibold'
    margin: 1.2em 0 0
    @media screen and (max-width: $mdBreakpoint)
      display: flex
    .toggle-down
      @include backgroundImage('toggle-down.svg')
      width: 29px
      height: 29px
      background-color: $colorHubbleButtonGrey
      border-radius: 100%
      margin-right: 9px
      background-size: 10px
    .toggle-up
      @include backgroundImage('toggle-up.svg')
      background-color: $colorHubbleButtonGrey
   .employee-details-wrap
      background: #fff
      box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
      border-radius: 10px
      padding: 3.3em 2em 4em
      margin: 1.5em 0
      @media screen and (max-width: $mdBreakpoint)
        background: none
        box-shadow: none
        border-radius: 0
        padding: 0
      .filters-main-wrap, .listing-main-wrap
        @media screen and (max-width: $mdBreakpoint)
          background: #fff
          box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
          border-radius: 10px
      .filters-main-wrap
        @media screen and (max-width: $mdBreakpoint)
          margin: 2em 0 3em
          padding: 3.3em 2em 4em
      .search-filters-wrap
        display: flex
        align-items: flex-end
        @media screen and (max-width: $xlBreakpoint)
          flex-direction: column
          align-items: flex-start
        .search-wrap
          flex: 1
          margin-right: 3em
          @media screen and (max-width: $xlBreakpoint)
            width: 100%
        .filters-wrap
           flex: 1
           display: flex
           align-items: flex-end
           margin-right: 7em
           margin-bottom: 2px
           @media screen and (max-width: $xlBreakpoint)
              margin: 2em 0 0
              width: 100%
              flex-wrap: wrap
           .dropdown
             margin-right: 3em
             @media screen and (max-width: $xsBreakpoint)
              width: 100%
              margin: 0 0 1.5em 0
             &:first-child
                margin-right: 3em
                @media screen and (max-width: $xsBreakpoint)
                  margin-right: 0
             &:last-child
                margin-left: 0
      .selected-dropdown-items
        margin: 1.6em 0
        ul
          display: flex
          flex-wrap: wrap
          padding: 0
          margin: 0.5em 0 0
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
            &.status-items
              display: inline-block
              &:first-letter
                text-transform: capitalize
              .remove-icon
                float: right
                margin-top: 3px
            span.remove-icon
              cursor: pointer
              @include backgroundImage('close.svg')
              width: 11px
              height: 12px
              margin-left: 6px
      .results-wrap
        font-size: 14px
        margin: 1.5em 0 0
        display: flex
        align-items: center
        @media screen and (max-width: $mdBreakpoint)
          padding: 0 1em 0
        .results-count
          font-size: 14px
          background-color: $colorHubbleBackgroundGrey
          color: $colorHubbleText
          border-radius: 16px
          margin-right: 0.8em
          width: 34px
          display: flex
          text-align: center
          justify-content: center
          height: 22px
          align-items: center
        span
          &:last-child
            font-size: 14px
        &:after
          content: ''
          border-bottom: 1px solid $colorHubbleGreyLines
          width: 100%
          margin-left: 1em
</style>
