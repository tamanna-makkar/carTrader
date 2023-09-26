<template>
  <div ref="el" class="dropdown" :class="type">
    <ul :class="{ open: open }">
      <div @click="open = !open" class="placeholder-wrapper">
        <li
          class="placeholder"
          v-if="
            selectedOption === 'Car brand' ||
            selectedOption === 'Merk' ||
            selectedOption === 'Model' ||
            selectedOption === 'Type' ||
            selectedOption === 'All' ||
            selectedOption === 'Please select an option' ||
            selectedOption === 'Selecteer een optie'
          "
        >
          {{ selectedOption }}
        </li>
        <li class="selected" v-else-if="type === 'carPolicy'">
          <span class="color" :style="{ 'background-color': selectedOption }"></span>
        </li>
        <li class="selected charging-items" v-else-if="type === 'chargingfacility-dropdown'">
          {{ selectedChargingDropdownItems['chargingFacility'] }}
          <span>€{{ selectedChargingDropdownItems['price'] }}</span>
        </li>
        <div v-else-if="type == 'step1Search' && isSearch" class="dropdown-with-search">
          <Input
            :placeholder="
              isBrandsSearch
                ? $t('_step1.placeholderBrand')
                : isLevelSearch
                ? $t('_step1.placeholderVersion')
                : $t('_step1.placeholderModel')
            "
            :searchInput="true"
            :isBrandsAndModelsSearch="true"
            v-model:value="searchInput"
            @update:value="onSearchInput"
          />
        </div>
        <li class="selected" v-else>
          {{ selectedOption }}
          <span class="duration" v-if="isDuration">
            {{ $t('_carPolicy.months') }}
          </span>
        </li>
        <img v-if="type !== 'step1Search'" src="@/assets/dropdown_arrow.svg" />
      </div>
      <div
        class="dropdown-content"
        v-if="
          type == 'employees-list car-policy-dropdown' ||
          type == 'employee car-policy-dropdown' ||
          type == 'employee roles-dropdown'
        "
      >
        <li v-for="(item, index) in employeesItems" :key="index" @click="onChange(item)">
          <label v-if="type == 'employee roles-dropdown'" class="check">
            {{ $t(`_employees.${item['title']}`) }}
          </label>
          <label v-else>
            {{ item['title'] }}
            <i v-if="selectedDropdownItems.includes(item.id)" class="tick"></i>
          </label>
        </li>
      </div>
      <div class="dropdown-content" v-else-if="type == 'chargingfacility-dropdown'">
        <li v-for="(item, index) in chargingFacilityItems" :key="index" @click="onChange(item)">
          {{ item['chargingFacility'] }}
          <span>€ {{ item['price'] }}</span>
        </li>
      </div>
      <div
        class="dropdown-content"
        v-else-if="type == 'employees-list lease-category-dropdown' || type == 'employee lease-category-dropdown'"
      >
        <li v-for="(item, index) in employeesItems" :key="index" @click="onChange(item)">
          <label>
            {{ item['title'] }} <span v-if="item['amount']">({{ CurrencyFormat(item['amount']) }})</span>
            <i v-if="selectedDropdownItems.includes(item.id)" class="tick"></i>
          </label>
        </li>
      </div>
      <div v-else class="dropdown-content" :class="{ 'brands-models-search': type === 'step1Search' }">
        <li v-if="type === 'wizard1' && showAnyOption" @click="onChange('Any')">Any</li>
        <li v-for="(item, index) in items" :key="index" @click="onChange(item)">
          <span class="color-block" v-if="type === 'carPolicy'">
            <span class="color" :class="getColor(item)"></span>
            <i v-if="selectedOption == item" class="tick"></i>
          </span>
          <label v-else>
            <i v-if="type === 'employees-list status-dropdown' || type == 'employee status-dropdown'">{{
              $t(`_employees.${item}`)
            }}</i>
            <i v-else-if="item['label']">{{ item['label'] }}</i>
            <i v-else>{{ item }}</i>
            <span v-if="type == 'brandsModel-dropdown' && selectedModels.includes(item)" class="tick"> </span>
            <span class="duration" v-if="isDuration">
              {{ $t('_carPolicy.months') }}
            </span>
            <span
              v-if="type === 'employees-list status-dropdown' && selectedDropdownItems.includes(item)"
              class="tick"
            ></span>
          </label>
        </li>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { employeeDropdownsType, chargingFacilityType } from '@/types'
import Input from '@/components/UI/Input.vue'
import CurrencyFormat from '@/filters/CurrencyFormat'
import { useStore } from '@/store'
import { MutationTypes } from '@/store/options/mutations'
export default defineComponent({
  components: {
    Input
  },
  emits: ['onChange'],
  name: 'Dropdown',
  props: {
    employeesItems: {
      type: Array as () => employeeDropdownsType[],
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String
    },
    selectedOption: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: ''
    },
    currentIndex: {
      type: Number,
      default: null
    },
    selectedModels: {
      type: Array,
      default: () => []
    },
    selectedDropdownItems: {
      type: Array,
      default: () => []
    },
    isDuration: {
      type: Boolean,
      default: false
    },
    isMultiselect: {
      type: Boolean,
      default: false
    },
    selectedChargingDropdownItems: {
      type: Object as () => chargingFacilityType,
      default: () => ({})
    },
    chargingFacilityItems: {
      type: Array as () => chargingFacilityType[],
      default: () => []
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    isBrandsSearch: {
      type: Boolean,
      default: false
    },
    isLevelSearch: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showAnyOption = ref(false)
    const store = useStore()
    const el = ref<HTMLDivElement>(document.createElement('div'))
    const searchInput = props.isBrandsSearch
      ? ref(store.state.options.searchString)
      : props.isLevelSearch
      ? ref(store.state.options.searchLevels)
      : ref(store.state.options.searchModels)
    const open = ref(false)
    const onChange = (item) => {
      showAnyOption.value = true
      if (!props.isMultiselect) {
        open.value = false
      }
      if (props.type == 'mileage-dropdown' || props.type == 'brandsModel-dropdown' || props.type == 'range-dropdown') {
        emit('onChange', { item: item, key: props.currentIndex })
      } else {
        emit('onChange', item)
      }
    }
    const getColor = (item) => {
      let color = 'orange'
      if (item == '#2C00AB') {
        color = 'dark-blue'
      } else if (item == '#00B5AD') {
        color = 'sky-blue'
      } else if (item == '#51B786') {
        color = 'green'
      } else if (item == '#FF675E') {
        color = 'red'
      }
      return color
    }
    const closeDropdown = (e) => {
      const target = e.target
      if (el.value && el.value !== target && !el.value.contains(target)) {
        open.value = false
      }
    }
    const onSearchInput = (value) => {
      if (props.isBrandsSearch) {
        store.commit(MutationTypes.SET_SEARCH_STRING, value)
      } else if (props.isLevelSearch) {
        store.commit(MutationTypes.SET_SEARCH_LEVELS, value)
      } else {
        store.commit(MutationTypes.SET_SEARCH_MODELS, value)
      }
    }
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    return { showAnyOption, open, onChange, getColor, el, CurrencyFormat, searchInput, onSearchInput }
  }
})
</script>

<style lang="sass" scoped>
.dropdown-with-search
  position: relative
  display: flex
  flex: 1
  input
    padding-left: 0
    background: none
.employee, .chargingfacility-dropdown
  margin: 0 !important
.chargingfacility-dropdown
  width: 300px
  margin: 0 0 0 0.5em !important
  .dropdown-content
    top: 35px !important
    li
      display: flex
      align-items: center
      justify-content: space-between
      margin-right: 0.8em !important
      span
        font-size: 14px
.employee.status-dropdown
  li.selected
    display: block !important
    &:first-letter
      text-transform: capitalize
.employees-list.status-dropdown, .employee.status-dropdown
  li
    label
      display: block
      &:first-letter
        text-transform: capitalize
      span.tick
        float: right
.employees-list
  .placeholder-wrapper
    .selected
      font-size: 16px !important
      color: $colorHubbleText
      opacity: 0.5
  .dropdown-content
    li
      label
        color: $colorHubbleDarkGrey
.filter-range
  .range-dropdown
    ul
      li
        font-size: 14px !important
.carPolicy.dropdown
  ul.open
    .dropdown-content
      top: 32px
  &:last-child
    margin-left: 0
.wizard1
  .dropdown-content
    max-height: 19em
.range-dropdown-filter
  margin-left: 1rem !important
  width: 70px
  ul
    .placeholder-wrapper
      img
        margin-left: 1rem
.range-dropdown
  .dropdown-content
    @media screen and (max-width: $xsBreakpoint)
      max-height: 9em
      overflow-y: scroll
      &::-webkit-scrollbar
        width: 4px
      &::-webkit-scrollbar-thumb
        background: $colorHubble
.dropdown.brandsModel-dropdown
  margin-left: 0 !important
  .placeholder-wrapper
    li
      text-transform: capitalize
.dropdown
  display: flex
  flex: 1
  // height: 100%
  &:first-child
    margin-right: 1.5em
  &:last-child
    margin-left: 1.5em
  ul
    position: relative
    display: flex
    flex-direction: column
    flex: 1
    height: 100%
    margin: 0
    padding: 0
    .placeholder-wrapper
      display: flex
      align-items: center
      border-bottom: 2px solid $colorHubble
      &:hover
        cursor: pointer
      .charging-items
        display: flex
        justify-content: SPACE-BETWEEN
        span
          margin-right: 0.8em !important
      .selected, .placeholder
        display: flex
        flex: 1
        font-size: 1.5rem
        line-height: 2.6rem
        align-items: center
        span
          margin: 0.2em 0
        span.duration
          margin: 0 2px 0
          line-height: 0
      .placeholder
        opacity: 0.5
    .dropdown-content
      display: none
      z-index: 100
    li
      display: none
      list-style-type: none
      font-size: 1.4em
      line-height: 1.7rem
      label
        cursor: pointer
        display: flex
        align-items: center
        // justify-content: space-between
        flex: 1
        align-items: center
        .duration
          font-size: 14px
          line-height: 0
          margin-left: 2px
        i
          font-style: normal
      .color-block
        display: flex
        align-items: center
      span.color
        width: 23px
        height: 23px
        display: flex
        border-radius: 100%
        &.orange
          background-color: $colorHubbleYellow
        &.dark-blue
          background-color: $colorHubbleDarkBlue
        &.sky-blue
          background-color: $colorHubbleDarkGreen
        &.green
          background-color: $colorHubbleGreen
        &.red
          background-color: $colorHubbleRed
    &.open
      .dropdown-content.brands-models-search
        top: 37px
      .dropdown-content
        position: absolute
        top: 28px
        left: 0
        right: 0
        display: flex
        flex-direction: column
        box-shadow: $shadowHubbleSmaller
        background: $colorWhite
        padding: 1rem 0 0 0
        overflow-y: scroll
        overflow-x: hidden
        max-height: 15em
        &::-webkit-scrollbar
          width: 4px
        &::-webkit-scrollbar-thumb
          background: $colorHubble
      .placeholder, .selected
        padding: 0
        margin-bottom: 0
        &:hover
          color: unset
      img
        transform: rotate(180deg)
      .tick
        width: 10px
        height: 12px
        @include backgroundImage('tick.svg')
        margin: 0 1em
      li
        display: flex
        padding: 0 0 0 1rem
        margin-bottom: 1.5rem
        &:hover
          cursor: pointer
          color: $colorHubble
.employees-list.status-dropdown, .employees-list.car-policy-dropdown, .employees-list.lease-category-dropdown
  margin: 0
</style>
