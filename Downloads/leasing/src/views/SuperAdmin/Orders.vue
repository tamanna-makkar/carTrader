<template>
  <div class="employees-wrap">
    <div class="employees-heading-wrap">
      <h1>{{ $t('_orders.companyOrders') }}</h1>
    </div>
    <div class="employee-details-wrap">
      <div class="filters-main-wrap">
        <div class="search-filters-wrap">
          <div class="search-wrap">
            <Input
              :placeholder="$t('_orders.searchBy')"
              :isEmployeeSearch="true"
              :searchInput="true"
              v-model:value="searchBy"
              @update:value="onInput"
              @onEnter="onEnter"
            />
          </div>
          <div class="filters-wrap">
            <div class="outer-wrap">
              <InputElement type="date" name="startDate" :value="firstDate" @onChange="selectStartDate">
                {{ $t(`_orders.startDate`) }}
              </InputElement>
            </div>
            <div class="outer-wrap">
              <InputElement type="date" name="endDate" :value="lastDate" @onChange="selectEndDate">
                {{ $t(`_orders.endDate`) }}
              </InputElement>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!loader" class="listing-main-wrap">
        <div class="listing-wrap">
          <div class="sub-wrap">
            <div class="results-wrap">
              <span class="results-count" v-if="totalOrders">
                {{ totalOrders }}
              </span>
              <span>{{ $t('_employees.results') }}</span>
            </div>
            <ListingTable :headings="ordersHeadings" :data="getAllOrders" @sortBy="sortBy" type="orders" />
          </div>
        </div>
        <Pagination
          :count="totalOrders"
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
import Input from '@/components/UI/Input.vue'
import InputElement from '@/components/UI/Input.vue'
import ListingTable from '@/components/UI/ListingTable.vue'
import Pagination from '@/components/UI/Pagination.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import Loader from '@/components/UI/Loader.vue'
import { useStore } from '@/store'
import { ordersActionTypes } from '@/store/orders/actions'
export default defineComponent({
  name: 'Home',
  setup() {
    const searchBy = ref('')
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const totalOrders = computed(() => store.state.orders.totalOrders)
    const loader = computed(() => store.state.orders.loader)
    const getAllOrders = computed(() => store.state.orders.allOrders)
    const firstDate = ref('')
    const lastDate = ref('')
    const initializeRequest = async (query) => {
      await store.dispatch(ordersActionTypes.GET_ALLORDERS, { query: query })
    }
    onMounted(async () => {
      initializeRequest(route.query)
      if (route.query.startDate) {
        firstDate.value = route.query.startDate as string
      }
      if (route.query.endDate) {
        lastDate.value = route.query.endDate as string
      }
    })
    watch(
      () => route.query,
      () => {
        if (route.name == 'Orders') {
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
    const ordersHeadings = reactive([
      { label: 'Company name', key: 'name' },
      { label: 'Address', key: 'address' },
      { label: 'Postcal code', key: 'postalCode' },
      { label: 'City', key: 'city' },
      { label: 'Ordered Cars', key: 'carOrders' }
    ])
    const setPage = (pageNumber) => {
      const query = Object.assign({}, route.query, { page: pageNumber })
      router.push({ query })
    }
    const sortBy = (value) => {
      const query = Object.assign({}, route.query, { orderBy: value['orderBy'], order: value['order'] })
      router.push({ query })
    }
    const selectStartDate = (value) => {
      firstDate.value = value
      const query = Object.assign({}, route.query, { startDate: value })
      router.push({ query })
    }
    const selectEndDate = (value) => {
      lastDate.value = value
      const query = Object.assign({}, route.query, { endDate: value })
      router.push({ query })
    }
    return {
      searchBy,
      onInput,
      onEnter,
      loader,
      totalOrders,
      ordersHeadings,
      getAllOrders,
      route,
      setPage,
      sortBy,
      firstDate,
      lastDate,
      selectStartDate,
      selectEndDate
    }
  },
  components: {
    Input,
    InputElement,
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
  margin-right: 3.5rem
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
   .search-wrap
      position: relative
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
