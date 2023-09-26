<template>
  <div class="employees-wrap">
    <div class="employees-heading-wrap">
      <h1>{{ $t('_companies.companies') }}</h1>
      <Button :text="$t('_companies.newCompany')" @click="openNewCompany" buttonType="add--left dark" />
    </div>
    <div class="employee-details-wrap">
      <div class="filters-main-wrap">
        <div class="search-filters-wrap">
          <div class="search-wrap">
            <Input
              :placeholder="$t('_companies.searchBy')"
              :isEmployeeSearch="true"
              :searchInput="true"
              v-model:value="searchBy"
              @update:value="onInput"
              @onEnter="onEnter"
            />
          </div>
        </div>
      </div>
      <div v-if="!loader" class="listing-main-wrap">
        <div class="listing-wrap">
          <div class="sub-wrap">
            <div class="results-wrap">
              <span class="results-count" v-if="totalCompanies">
                {{ totalCompanies }}
              </span>
              <span>{{ $t('_employees.results') }}</span>
            </div>
            <ListingTable
              :headings="companiesHeadings"
              :data="getAllCompanies"
              @sortBy="sortBy"
              type="companies"
              @editEmployee="editCompany"
            />
          </div>
        </div>
        <Pagination
          :count="totalCompanies"
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
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import Button from '@/components/UI/Button.vue'
import Input from '@/components/UI/Input.vue'
import ListingTable from '@/components/UI/ListingTable.vue'
import Pagination from '@/components/UI/Pagination.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import Loader from '@/components/UI/Loader.vue'
import { useStore } from '@/store'
import { superAdminCompanyActionTypes } from '@/store/superAdminCompany/actions'
export default defineComponent({
  name: 'Home',
  setup() {
    const searchBy = ref('')
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const totalCompanies = computed(() => store.state.superAdminCompany.totalCompanies)
    const loader = computed(() => store.state.superAdminCompany.loader)
    const getAllCompanies = computed(() => store.state.superAdminCompany.allCompanies)
    const initializeRequest = async (query) => {
      await store.dispatch(superAdminCompanyActionTypes.GET_ALLCOMPANIES, { query: query })
    }
    onMounted(async () => {
      initializeRequest(route.query)
    })
    watch(
      () => route.query,
      () => {
        if (route.name == 'Companies') {
          initializeRequest(route.query)
        }
      }
    )
    const onInput = (value) => {
      searchBy.value = value
    }
    const onEnter = () => {
      const searchedTerm = (searchBy.value as string).trim().toLowerCase()
      const query: { query?: string } = Object.assign({}, route.query, { query: searchedTerm, page: 1 })
      if (!searchedTerm) {
        delete query.query
      }
      router.push({ query })
    }
    const companiesHeadings = reactive([
      { label: 'Company name', key: 'name' },
      { label: 'Address', key: 'address' },
      { label: 'Postcal code', key: 'postalCode' },
      { label: 'City', key: 'city' }
    ])
    const setPage = (pageNumber) => {
      const query = Object.assign({}, route.query, { page: pageNumber })
      router.push({ query })
    }
    const sortBy = (value) => {
      const query = Object.assign({}, route.query, { orderBy: value['orderBy'], order: value['order'] })
      router.push({ query })
    }
    const openNewCompany = () => {
      router.push({ name: 'Company' })
    }
    const editCompany = (companyId) => {
      router.push({ name: 'superAdminCompanyDetails', params: { id: companyId } })
    }
    return {
      openNewCompany,
      searchBy,
      onInput,
      onEnter,
      loader,
      totalCompanies,
      companiesHeadings,
      getAllCompanies,
      route,
      setPage,
      sortBy,
      editCompany
    }
  },
  components: {
    Button,
    Input,
    ListingTable,
    Loader,
    Pagination
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
        @media screen and (min-width: $lgBreakpoint)
          width: 48%
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
