<template>
  <div class="employees-listing" :class="type">
    <div class="headings-wrap">
      <div class="heading" v-for="(heading, index) in headings" :key="index" :class="heading['key']">
        <span class="sorting-icon" :class="sortIcon(heading['key'])" @click="sortBy(heading['key'])"></span>
        {{ $t(`_${type}.${heading['key']}`) }}
      </div>
    </div>
    <div class="details-wrap">
      <div v-if="Array.isArray(data)">
        <div v-for="(item, index) in data" :key="index" class="detail">
          <div class="sub-detail-wrap">
            <div v-for="(heading, index) in headings" :key="index" :class="heading['key']" class="items-wrap">
              <span
                v-if="item[heading['key']] && heading['key'] == 'carPolicy'"
                :style="{ 'background-color': item[heading['key']]['colorCode'] }"
              >
                {{ item[heading['key']]['policyTitle'] }}
              </span>
              <span v-else-if="item[heading['key']] && heading['key'] == 'leaseCategory'">
                {{ item[heading['key']]['title'] }}
                <span v-if="item[heading['key']]['amount']" class="padding-none"
                  >({{ CurrencyFormat(item[heading['key']]['amount']) }})</span
                >
              </span>
              <span v-else-if="item[heading['key']] && heading['key'] == 'leaseValidUntil'">
                {{ getFormatedDate(item[heading['key']]) }}
              </span>
              <span
                v-else-if="item[heading['key']] && heading['key'] == 'userStatus'"
                class="status-box"
                :class="getStatus(item[heading['key']])"
                >{{ $t(`_employees.${item[heading['key']]}`) }}</span
              >
              <span
                v-else-if="
                  item[heading['key']] && heading['key'] == 'foundCombinations' && !item['foundCombinations'].length
                "
              >
                {{ $t('_externalData.allCombinations') }}
              </span>
              <span
                v-else-if="
                  item[heading['key']] && heading['key'] == 'foundCombinations' && item['foundCombinations'].length
                "
              >
                {{ getNotFoundCombinations(item['notFoundCombinations'])[0] }}, ...
                <span class="count" @click="openMissingCombo(getNotFoundCombinations(item['notFoundCombinations']))">{{
                  `+${item['notFoundCombinations'].length - 1}`
                }}</span>
              </span>
              <span v-else-if="item[heading['key']] && heading['key'] == 'retail_price_902'">
                {{ CurrencyFormat(item[heading['key']]) }}
              </span>
              <span v-else-if="item[heading['key']]">{{ item[heading['key']] }}</span>
              <span v-else>-</span>
            </div>
            <span
              v-if="type == 'employees' || type == 'companies'"
              class="edit-button"
              @click="$emit('editEmployee', item['id'])"
            ></span>
          </div>
        </div>
      </div>
      <div v-else class="not-found-block">
        <h2>{{ data }}</h2>
      </div>
    </div>
  </div>
  <Popup
    :isStateConflicted="true"
    :isRequiredPopup="true"
    v-if="isMissingComboPopup"
    @revertSelectedOptions="closeMissingComboPopup"
    @onClick="closeMissingComboPopup"
    :centerPopup="true"
  >
    <div class="popup-inner-block">
      <h3>{{ $t('_externalData.missingLeaseRate') }}</h3>
      <ul>
        <li v-for="(item, index) in listOfCombos.value" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </Popup>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { employeeHeadingsType, employeeDetailsType } from '@/types'
import { useRoute } from 'vue-router'
import CurrencyFormat from '@/filters/CurrencyFormat'
import Popup from '@/components/Popup.vue'
export default defineComponent({
  name: 'Home',
  emits: ['editEmployee', 'sortBy', 'setPage'],
  components: {
    Popup
  },
  props: {
    headings: {
      type: Array as () => employeeHeadingsType[],
      default: () => []
    },
    data: {
      type: [Array as () => employeeDetailsType[], String, Array]
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const route = useRoute()
    const sortOrder = ref(route.query.order) || ref('asc')
    const isMissingComboPopup = ref(false)
    const listOfCombos = reactive({ value: [] })
    const getStatus = (status) => {
      let statusColor = 'grey'
      if (status == 'selector available') {
        statusColor = 'red'
      } else if (status == 'car ordered' || status == 'active lease') {
        statusColor = 'green'
      }
      return statusColor
    }
    const sortIcon = (value) => {
      let icon = 'default-icon '
      if (route.query.orderBy && route.query.order) {
        if (route.query.orderBy === value) {
          icon += route.query.order === 'asc' ? 'sort-asc' : 'sort-desc'
        }
      }
      return icon
    }
    const sortBy = (value) => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      emit('sortBy', { orderBy: value, order: sortOrder.value })
    }
    const getFormatedDate = (value) => {
      return value.split('-').reverse().join('-')
    }
    const getNotFoundCombinations = (combinations) => {
      const notFoundCombos = combinations.map((item) => {
        const splitByUnderScore = item.split('_')
        splitByUnderScore[0] = `${splitByUnderScore[0]} months`
        splitByUnderScore[1] = `${splitByUnderScore[1]} km`
        item = splitByUnderScore.join(' / ')
        return item
      })
      return notFoundCombos
    }
    const openMissingCombo = (missingCombos) => {
      isMissingComboPopup.value = true
      listOfCombos.value = missingCombos
    }
    const closeMissingComboPopup = () => {
      isMissingComboPopup.value = false
    }
    return {
      getStatus,
      CurrencyFormat,
      sortIcon,
      sortOrder,
      sortBy,
      route,
      getFormatedDate,
      getNotFoundCombinations,
      isMissingComboPopup,
      closeMissingComboPopup,
      openMissingCombo,
      listOfCombos
    }
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.foundCombinations
  .sorting-icon
    display: none !important
.externalData, .orders
  .detail
    cursor: auto !important
    .sub-detail-wrap
      &:hover
        background: none !important
.foundCombinations
  span
    align-items: center
.popup-inner-block
  display: flex
  flex: 1
  width: 100%
  flex-direction: column
  ul
    padding: 0
    columns: 2
  li
    font-size: 12px
    list-style: none
    margin: 0 0 10px
  h3
    color: $colorHubble
    font-size: 16px
    border-bottom: 1px solid $colorHubbleGreyIcons
    padding-bottom: 0.4em
    margin-bottom: 1em
.foundCombinations
  span
    display: flex
.count
  font-size: 14px
  background-color: $colorHubbleLightPurple
  border-radius: 16px
  margin-right: 0.8em
  width: 34px
  display: flex
  text-align: center
  justify-content: center
  height: 22px
  align-items: center
  margin-left: 14px
  align-items: center
  cursor: pointer
  &:hover
    background-color: $colorHubble
    color: $colorWhite !important
.employees-listing
  display: flex
  flex-direction: column
  margin: 1.6em 0 0
  .headings-wrap
     display: flex
     color: $colorWhite
     .heading
       flex: 1
       font-size: 14px
       display: flex
       align-items: center
       background-color: $colorHubbleDarkBlue
       padding: 0.8em 0.5em
       &:first-of-type
        position: sticky
        left: 0
        @media screen and (max-width: $xlBreakpoint)
          max-width: 130px
          border-right: 1px solid $colorHubbleGreyLines
       .sorting-icon
          display: flex
          cursor: pointer
          &:after
            content: ""
            width: 10px
            height: 19px
            margin-right: 5px
          &.default-icon
            &:after
              @include backgroundImage('sort-table.svg')
          &.sort-asc
            &:after
              @include backgroundImage('sort-asc.svg')
          &.sort-desc
            &:after
              @include backgroundImage('sort-desc.svg')
  .details-wrap
    display: flex
    flex-direction: column
    .not-found-block
      display: flex
      justify-content: center
      h2
        font-weight: normal
        font-size: 18px
        margin: 3em
    .detail
      display: flex
      cursor: pointer
      .sub-detail-wrap
        display: flex
        flex: 1
        position: relative
        &:hover
          background-color: $colorHubbleLightPurple
          border-radius: 5px
          .leaseCategory
            span
              background-color: $colorWhite
          .edit-button
            &:after
              background-color: $colorHubble !important
              @include backgroundImage('edit-white.svg')
        .userStatus
          span
            border-radius: 5px
            color: $colorWhite
            padding: 5px 10px
            display: inline-block
            line-height: normal
            &:first-letter
              text-transform: capitalize
          .red
            background-color: $colorHubbleRed
          .green
            background-color: $colorHubbleGreen
          .grey
            background-color: $colorHubbleGreyLines
            color: $colorHubbleDarkGrey
        .edit-button
          position: absolute
          right: 0.7em
          top: 5px
          &:after
            content: ""
            @include backgroundImage('edit.svg')
            width: 1.8rem
            height: 1.8rem
            display: flex
            background-color: $colorHubbleLightPurple
            padding: 5px 12px
            border-radius: 50px
      div.items-wrap
        flex: 1
        padding: 0.5em
        @media screen and (max-width: $xlBreakpoint)
          background: $colorWhite
          border-bottom: 1px solid $colorHubbleGreyLines
        span
          color: $colorHubbleText
          font-size: 14px
        span.padding-none
          padding: 0
      div.name
        position: sticky
        left: 0
        padding-left: 1em
        @media screen and (max-width: $xlBreakpoint)
          max-width: 130px
          border-right: 1px solid $colorHubbleGreyLines
.employees, .companies, .externalData, .orders
  .details-wrap
    .detail
      @media screen and (min-width: $xlBreakpoint)
        border-bottom: 1px solid #E6E6E6
        padding: 0.4em 0
      div.items-wrap
        &:first-child
          color: $colorHubbleDarkBlue
      .carPolicy, .leaseCategory
        span
          padding: 4px 8px
          border-radius: 5px
      .leaseCategory
        span
          background-color: $colorHubbleLightPurple
.status-box
  max-width: 12rem
</style>
