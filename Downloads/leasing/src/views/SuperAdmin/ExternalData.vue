<template>
   <div class="employees-wrap">
      <div class="employees-heading-wrap">
        <h1> {{ $t('_companies.externalData') }} </h1>
      </div>
      <div class="overlay-wrap">
        <div :class="{'overlay': leaseRateDataLoader }" />
          <div class="employee-details-wrap">
            <div class="upload-data">
              <div class="leaserate-data">
                  <div class="info">
                    <h3>{{ $t('_companies.leaseRateData') }}</h3>
                    <span v-if="Object.keys(getNotInLeaseRateData).length">{{ $t('_companies.lastestUpdate') }} {{ getFormatedDate(getNotInLeaseRateData.leaseRateDataUpdatedAt.split(' ')[0]) }} {{ getNotInLeaseRateData.leaseRateDataUpdatedAt.split(' ')[1] }} </span>
                  </div>
                  <span class="success-msg result-msg" v-if="!leaseRateDataLoader && leaseRateDataResponse == 'success'">
                    {{ $t('_companies.leaseRateSuccessfullyUpdated') }}
                  </span>
                  <span class="error-msg result-msg" v-else-if="!leaseRateDataLoader && leaseRateDataResponse == 'error'">
                    {{ $t(`_companies.${leaseRateDataMessage}`)  }}
                  </span>
                  <div class="upload-lease-rate-data">
                    <input
                      data-v-b16d5354=""
                      type="file"
                      name="logo"
                      @change="fileChange"
                      accept=".xls,.xlsx"
                      class="input-file"
                    />
                    <div class="file">
                      <Button :text="$t('_companies.uploadNewFile')" @click="uploadLeaseData" buttonType="add--left dark" />
                    </div>
                  </div>
              </div>
              <div class="jato-data">
                  <div class="info">
                    <h3>{{ $t('_companies.jatoData') }}</h3>
                    <span v-if="Object.keys(getNotInLeaseRateData).length">{{ $t('_companies.lastestUpdate') }} {{ getFormatedDate(getNotInLeaseRateData.jatoDbUpdatedAt) }} </span>
                  </div>
              </div>
            </div>
              <div v-if="!loader" class="listing-main-wrap">
                <div class="listing-wrap"> 
                  <div class="sub-wrap">
                    <h2>{{ $t('_companies.notInLeaseData') }}</h2>
                    <ListingTable :headings="leaseRateDataHeadings" :data="getNotInLeaseRateData.allVehicles" @sortBy="sortBy" type="externalData" />
                  </div>
                </div>
                <Pagination :count="getNotInLeaseRateData.totalRecords" :currentPage="route.query.page" :itemsPerPage="20" @page-changed="setPage"></Pagination>
              </div>
              <div v-else class="loader-block">
                <Loader />
              </div>
            </div>
          <div class="loader-block" v-if="leaseRateDataLoader">
            <Loader />
            <h3>{{ $t('_externalData.leaseRateDataUploading') }}</h3>
          </div>
      </div>
      <Popup class="leaseRateWarningPopup" v-if="showPopup" @onClick="closePopup" :setleaseRatePopup="true">
        <div class="title h3">{{ $t('_warningPopup.leaseRateWarningTitle') }}</div>
        <div class="text t2" v-for="(item, index) in leaseRateDataMessage" :key="index">
          {{ $t('_warningPopup.leaseRateWarningText1')}} {{ item['error'].split(' ')[3]}} {{$t('_warningPopup.In') }} {{ item['error'].split(' ')[5] }} {{$t('_warningPopup.leaseRateWarningText2') }}
        </div>
      </Popup>
   </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onUnmounted, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import Loader from '@/components/UI/Loader.vue'
import ListingTable from '@/components/UI/ListingTable.vue'
import Pagination from '@/components/UI/Pagination.vue'
import Button from '@/components/UI/Button.vue'
import Popup from '@/components/Popup.vue'
import { superAdminCompanyActionTypes } from '@/store/superAdminCompany/actions'
import { superAdminMutationTypes } from '@/store/superAdminCompany/mutations'
export default defineComponent({
  name: 'External data',
  setup() {
    const searchBy = ref('')
    const store = useStore()
    const route = useRoute()
    const selectedTabName = ref('notInLeaseData')
    const router = useRouter()
    const loader = computed(() => store.state.superAdminCompany.loader)
    const showPopup = ref(false)
    const getNotInLeaseRateData = computed(() => store.state.superAdminCompany.notInLeaseRateData)
    const totalLeaseRateData = ref(42)
    const tabs = reactive([
      { name: 'notInLeaseData', isActive: true }
    ])
    const leaseRateDataResponse = computed(() => store.state.superAdminCompany.leaseRateDataResponse) 
    const leaseRateDataLoader = computed(() => store.state.superAdminCompany.leaseRateDataLoader)
    const leaseRateDataMessage = computed(() => store.state.superAdminCompany.leaseRateDataMessage) 
    const initializeRequest = async (query) => {
      await store.dispatch(superAdminCompanyActionTypes.GET_NOTINLEASERATE, { query: query })
    }
    onMounted(async () => {
      initializeRequest(route.query)
    })
    watch(() => route.query, () => {
      initializeRequest(route.query)
    })
    const getFormatedDate = (value) => {
      return value.split('-').reverse().join('-')
    }
    const setPage = (pageNumber) => {
      const query = Object.assign({}, route.query, { page: pageNumber })
      router.push({ query })
    }
    const leaseRateDataHeadings = reactive([
      { label: 'ID', key: 'unique_identity_101'},
      { label: 'Brand', key: 'local_make_name_128' },
      { label: 'Model', key: 'local_model_name_129' },
      { label: 'Version', key: 'local_version_name_131' },
      { label: 'Consumerprice', key: 'retail_price_902' },
      { label: 'Mileage/duration missing', key: 'foundCombinations' }
    ])
    const sortBy = (value) => {
      const query = Object.assign({}, route.query, { orderBy: value['orderBy'], order: value['order'] })
      router.push({ query })
    }
    const selectedTab = (name: string) => {
      tabs.forEach((tab) => {
        tab.isActive = tab.name == name
      })
      selectedTabName.value = name
    }
    const uploadLeaseData = () => {
      console.log('uploadLeaseData')
    }
    const closePopup = () => {
      showPopup.value = false
    }
    const fileChange = async (event) => {
      const fileDetails = event.target.files
      const formData = new FormData()
      formData.append('file', fileDetails[0] as File)
      if (fileDetails[0])
        event.target.value = ''
        await store.dispatch(superAdminCompanyActionTypes.UPLOAD_LEASERATE, { body: formData })
          if (leaseRateDataResponse.value == 'success' && Array.isArray(leaseRateDataMessage.value) && leaseRateDataMessage.value.length)
            showPopup.value = true
          if (leaseRateDataResponse.value == 'success')  
            initializeRequest(route.query)
    }
    onUnmounted(() => {
      store.commit(superAdminMutationTypes.SET_LEASERATEDATA_RESPONSE, false)
      store.commit(superAdminMutationTypes.SET_LEASERATEDATA_LOADER, false)
      store.commit(superAdminMutationTypes.SET_LEASERATEDATA_MSG, false)
    })
    return {
      searchBy, loader, route, selectedTab, selectedTabName, sortBy, leaseRateDataHeadings, getNotInLeaseRateData, totalLeaseRateData, setPage, uploadLeaseData, fileChange,
      leaseRateDataLoader,
      leaseRateDataResponse,
      tabs,
      leaseRateDataMessage,
      showPopup, 
      closePopup,
      getFormatedDate
    }
  },
  components: {
    Loader,
    ListingTable,
    Pagination,
    Button,
    Popup
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.loader-block
  display: flex
  justify-content: center
  flex-direction: column
  align-items: center
  position: fixed
  z-index: 2
  top: 33em
  width: 100%
  left: 0
  right: 0
  h3
    margin: 2em 0 0
.overlay-wrap
  position: relative
.overlay
  background: rgba(255, 255, 255, 0.7)
  width: 100%
  z-index: 1
  position: absolute
  top: 0
  bottom: 0
.upload-data
  position: relative
.result-msg
  position: relative
  display: flex
  padding-left: 32px
  font-size: 14px
  align-items: center
  margin: 0 0 2em 0
  &:before
    content: ""
    width: 25px
    height: 25px
    position: absolute
    left: 0
.success-msg
  &:before
    @include backgroundImage('check.svg')
.error-msg
  &:before
    @include backgroundImage('missing.svg')
.left-popup
  .title
    border-bottom: 1px solid $colorHubbleGreyIcons
    padding-bottom: 1rem
    margin-bottom: 2.5rem
    color: $colorHubbleDarkBlue
  .text
      line-height: 2.8rem
.upload-lease-rate-data
  position: relative
  width: 22rem
  input
    position: absolute
    left: 0
    right: 0
    width: 100%
    height: 100%
    opacity: 0
    cursor: pointer
    top: 0 
.employees-wrap
   height: 100%
   @media screen and (max-width: $xlBreakpoint)
     width: 92vw 
   .listing-wrap
    h2
      font-size: 16px
      font-family: 'Lato-semibold'
      border-bottom: 1px solid $colorHubbleGreyIcons
      margin: 1.4em 0 1.8em 0
      padding: 0 0 0.3em 0
      color: $colorHubble
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
   .employee-details-wrap
      background: #fff
      box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
      border-radius: 10px
      padding: 3.3em 2em 6em
      margin: 1.5em 0
      .listing-main-wrap
        @media screen and (max-width: $mdBreakpoint)
          background: #fff
          box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
          border-radius: 10px
      .upload-data
        display: flex
        margin: 0 0 3em 0
        @media screen and (max-width: $xsBreakpoint)
          flex-direction: column
        .leaserate-data
          margin: 0 4em 0 0
          @media screen and (max-width: $xsBreakpoint)
            margin: 0 0 2em 0
          .info
            margin: 0 0 2.2em 0
            @media screen and (max-width: $xsBreakpoint)
              flex-direction: column
          button
            padding: 0.9em 1.5em 0.9em 1em
            max-width: 22rem
            @media screen and (max-width: $xsBreakpoint)
              margin: auto  
        .leaserate-data, .jato-data
          display: flex
          flex-direction: column
          background-color: $colorHubbleBackgroundGrey
          padding: 2em
          border-radius: 5px
          height: max-content
          .info
            display: flex
            align-items: center
            justify-content: space-between
            @media screen and (max-width: $xsBreakpoint)
              flex-direction: column
            h3
              font-size: 18px
              color: $colorHubbleDarkBlue
              margin: 0 1em 0 0
            span
              font-size: 14px
              color: $colorHubbleText                
</style>
