<template>
  <div>
    <div v-for="(item, index) in checkboxesValues" :key="index" class="checkboxes-wrap">
      <Checkbox
        :item="item"
        :isChecked="item.isActive"
        :isFilter="isFilter"
        @onCheck="onCheck($event, item['title'], index)"
        theme="wizards"
      >
        {{ $t(item['value']) }}
        <template v-slot:rangeDropdown>
          <div class="drive-range" :class="{ 'filter-range': isFilter }">
            <p v-if="!isFilter">{{ $t('_wizard.step2.minDriveRange') }}</p>
            <p v-else>{{ $t('_wizard.step2.minDriveRangeSmall') }}</p>
            <Dropdown
              v-if="item['value'] == '_wizard.step2.Electric'"
              :currentIndex="index"
              :items="
                $route.name != 'carPolicy'
                  ? getCarPolicyRange('car_policy_electric_range', ElectricRange)
                  : ElectricRange
              "
              :selectedOption="selectedElectricOption"
              @onChange="selectElectricOption"
              type="range-dropdown"
            />
            <Dropdown
              v-if="item['value'] == '_wizard.step2.PlugInHybrid'"
              :currentIndex="index"
              :items="
                $route.name != 'carPolicy'
                  ? getCarPolicyRange('car_policy_plug-in-hybrid_range', HybridRange)
                  : HybridRange
              "
              :selectedOption="selectedHybridOption"
              @onChange="selectHybridOption"
              type="range-dropdown"
            />
          </div>
        </template>
        <template v-slot:chargingMandatory>
          <div class="switchToggle">
            <label class="switch">
              <input
                type="checkbox"
                :checked="chargingMandatoryOptions[index]"
                @input="$emit('selectMandatoryOptions', { index: index, item: chargingMandatoryOptions[index] })"
              />
              <span
                class="slider not-active"
                v-bind:class="{ 'slider-active': chargingMandatoryOptions[index] }"
              ></span>
            </label>
            <span class="label" v-if="chargingMandatoryOptions[index]">
              {{ $t('_carPolicy.chargingMandatory') }}
            </span>
            <span class="label" v-else>
              {{ $t('_carPolicy.chargingNotMandatory') }}
            </span>
          </div>
        </template>
        <template v-slot:mileageDuration v-if="item['mileageDuration']">
          <div class="milage-duration-range">
            <div>
              <p>{{ $t('_wizard.step2.setMileage') }}</p>
              <Dropdown
                :currentIndex="index"
                :items="MileageRange"
                :selectedOption="selectedMileageOption[index]"
                @onChange="selectMileageOption"
                type="mileage-dropdown"
              />
            </div>
            <div>
              <p>{{ $t('_wizard.step2.setDuration') }}</p>
              <Dropdown
                :currentIndex="index"
                :items="DurationRange"
                :selectedOption="selectedDurationOption[index]"
                @onChange="selectDurationOption"
                type="mileage-dropdown"
                :isDuration="true"
              />
            </div>
          </div>
        </template>
        <template v-if="item.wizardInfo" v-slot:wizardInfo>
          <i class="info-icon" />
        </template>
      </Checkbox>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
export default defineComponent({
  emits: [
    'onCheck',
    'selectElectricOption',
    'selectHybridOption',
    'selectMileageOption',
    'selectDurationOption',
    'selectMandatoryOptions'
  ],
  props: {
    checkboxesValues: {
      type: Object,
      default: () => ({})
    },
    selectedElectricOption: {
      type: [String, Number],
      default: ''
    },
    selectedHybridOption: {
      type: [String, Number],
      default: ''
    },
    isMileageDuration: {
      type: Boolean,
      default: false
    },
    selectedMileageOption: {
      type: Array,
      default: () => []
    },
    selectedDurationOption: {
      type: Array,
      default: () => []
    },
    chargingMandatoryOptions: {
      type: Array,
      default: () => []
    },
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const ElectricRange = reactive([
      '< 100 km',
      '100 km',
      '200 km',
      '300 km',
      '400 km',
      '500 km',
      '600 km',
      '700 km',
      '800 km',
      '900 km',
      '> 1000 km'
    ])
    const HybridRange = reactive(['< 50 km', '50 km', '75 km', '100 km', '125 km'])
    const MileageRange = reactive(['20000 km', '25000 km', '30000 km', '35000 km', '40000 km', '45000 km'])
    const DurationRange = reactive(['36', '48', '60'])
    const convertToNumber = (selectedOption) => {
      return parseInt(selectedOption.replace(/[kmmonths<>]/g, ''))
    }
    const getCarPolicyRange = (storedRange, rangeArray) => {
      let range
      if (sessionStorage.getItem(storedRange)) {
        const carPolicyRange = parseInt(JSON.parse(sessionStorage.getItem(storedRange) || ''))
        const getNumbers = rangeArray.map((value) => convertToNumber(value))
        getNumbers[0] = 0
        const getIndex = getNumbers.indexOf(carPolicyRange)
        range = rangeArray.slice(getIndex)
      } else {
        range = rangeArray
      }
      return range
    }
    const onCheck = ($event, title, index) => {
      emit('onCheck', { item: $event, title: title, index: index })
    }
    const selectElectricOption = (item) => {
      emit('selectElectricOption', item)
    }
    const selectHybridOption = (item) => {
      emit('selectHybridOption', item)
    }
    const selectMileageOption = (item) => {
      emit('selectMileageOption', item)
    }
    const selectDurationOption = (item) => {
      emit('selectDurationOption', item)
    }
    return {
      ElectricRange,
      HybridRange,
      onCheck,
      selectElectricOption,
      selectHybridOption,
      MileageRange,
      DurationRange,
      selectMileageOption,
      selectDurationOption,
      getCarPolicyRange
    }
  },
  components: {
    Checkbox,
    Dropdown
  }
})
</script>
<style lang="sass" scoped>
.checkboxes-wrap
  margin: 0 0 1em 0
  .drive-range.filter-range
    display: flex
    align-items: center
    p
      margin-right: 1em
      @media screen and (max-width: $xsBreakpoint)
        display: none
    .dropdown
      width: 9em
      ul
        li
          font-size: 14px !important
  .drive-range
    padding-left: 5em
    padding-bottom: 0.5em
    p
      font-size: 14px
      color: $colorHubbleDarkGrey
    .dropdown
      margin-left: 0
      width: 12em
      margin-top: 0.2em
      ul
        li
          font-size: 14px
          color: $colorHubbleText
    .dropdown-content
      overflow-y: scroll
      height: 9em
  .info-icon
    @include backgroundImage('info.svg')
    cursor: pointer
    width: 18px
    height: 18px
    &:hover
      @include backgroundImage('info_dark.svg')
.milage-duration-range
  display: flex
  @media screen and (max-width: $xsBreakpoint)
    flex-direction: column
  > div
    flex: 1
    display: flex
    margin: 0 3em 0 0
    align-items: center
    @media screen and (max-width: $xsBreakpoint)
      width: 90%
    p
      color: $colorHubbleDarkGrey
      font-size: 14px
      line-height: normal
      @media screen and (max-width: $xsBreakpoint)
        flex: 1
.switchToggle
  margin-top: 8px
  padding-left: 5em
  padding-bottom: 1.8em
  display: flex
  align-items: center
  .label
    font-size: 14px
    color: $colorHubbleText
    @media screen and (max-width: $mdBreakpoint - 1)
      margin-left: 1em
  .switch
    position: relative
    display: inline-block
    width: 54px
    height: 27px
    input
      opacity: 0
      width: 0
      height: 0
      &:checked + .slider
        border-color: $colorHubble
      &:checked + .slider:before
        -webkit-transform: translateX(26px)
        -ms-transform: translateX(26px)
        transform: translateX(26px)
    .slider
      position: absolute
      cursor: pointer
      top: 0px
      left: 0
      right: 0
      bottom: 6px
      background-color: $colorWhite
      border: 1px solid $colorHubbleGreyIcons
      -webkit-transition: .4s
      transition: .4s
      height: 24px
      width: 40px
      &:before
        position: absolute
        content: ""
        height: 25px
        width: 24px
        left: 0
        bottom: -1px
        background-color: white
        -webkit-transition: .4s
        transition: .4s
    .not-active
      border-radius: 34px
      &:before
        border-radius: 50%
        background-color: $colorHubbleGreyIcons
    .slider-active
      &:before
        background-color: $colorHubble
        right: 25px
        left: auto
</style>