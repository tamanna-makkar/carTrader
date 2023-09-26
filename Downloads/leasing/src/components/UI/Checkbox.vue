<template>
  <div
    ref="el"
    class="checkbox-wrap"
    :class="{
      disabled: item['isDisabled'],
      active: isChecked,
      description: $slots['description'],
      wizards: theme == 'wizards',
      wizard: item['isWizard'],
      brands: isBrands,
      dropdown: $slots['rangeDropdown'],
      dropdownRow: isFilter || forEmployee || forCarBrands,
      employee: forEmployee,
      carBrands: forCarBrands,
      hierarchyRow: forHierarchyRow,
      filterCheckboxBrands: $slots['filterCheckboxBrands'],
      dashboard: theme == 'dashboard',
      orderSteps: theme == 'step4',
      filterCheckboxDiscount: theme == 'discount'
    }"
  >
    <input
      type="checkbox"
      :id="isBrands ? brand : item['id']"
      :value="isBrands ? brand : item['value']"
      :checked="isChecked"
      @change="onCheck(item, $event)"
    />
    <label :for="isBrands ? brand : item['id']">
      <div class="inner-block">
        <slot />
        <span class="price" v-if="$slots['price']">
          <slot name="price"></slot>
        </span>
        <div class="info" v-if="$slots['info']">
          <div class="info-wrap" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
            <slot name="info"></slot>
          </div>
          <transition name="fade" v-if="activeOption">
            <Tooltip> Here comes extra information about this car type </Tooltip>
          </transition>
        </div>
        <div
          :class="{
            active: item['isActive'],
            disabled: item['isDisabled'],
            'body-type': !isFilter && $slots['body-type']
          }"
        >
          <div class="icon-wrapper" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
            <slot name="body-type"></slot>
          </div>
          <transition name="fade" v-if="activeOption && !item['isDisabled']">
            <Tooltip :isBodyType="true"> Here comes extra information about this car type: {{ item.value }} </Tooltip>
          </transition>
          <transition name="fade" v-if="activeOption && item['isDisabled']">
            <Tooltip :isBodyType="true">
              Your employer has indicated that you cannot select this car type: {{ item.value }}</Tooltip
            >
          </transition>
          <div class="image-wrapper" v-if="$slots['image']">
            <slot name="image"></slot>
          </div>
          <div class="image-wrapper" v-if="$slots['imageDisabled'] && !isFilter">
            <slot name="imageDisabled"></slot>
          </div>
          <div class="value-wrapper" v-if="$slots['value']">
            <slot name="value"></slot>
          </div>
        </div>
        <div v-if="$slots['description']">
          <slot name="description"></slot>
        </div>
      </div>
    </label>
    <div v-if="$slots['moreInfo']" class="more-info">
      <span @click="moreInfo = !moreInfo"><slot name="moreInfo"></slot></span>
      <transition v-if="moreInfo" name="fade">
        <Tooltip :isMoreInfo="true">
          - Ultrasoon takelsensor anti-diefstalbeveiliging met afstandsbediening dmv een omgevingssensor <br />
          - Centrale deurvergrendeling met dievenklauwen
        </Tooltip>
      </transition>
    </div>
    <div v-if="item['isActive'] && item['range']" class="range-dropdown">
      <slot name="rangeDropdown"></slot>
    </div>
    <div v-if="item['isActive'] && item['isChargingMandatory']">
      <slot name="chargingMandatory"></slot>
    </div>
    <div class="mileage-duration" v-if="item['isActive'] && $slots['mileageDuration']">
      <slot name="mileageDuration"></slot>
    </div>
    <div class="wizard-info-wrap" v-if="$slots['wizardInfo']">
      <div class="wizard-info" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
        <slot name="wizardInfo"></slot>
      </div>
      <transition name="fade" v-if="activeOption">
        <Tooltip :alignRight="true">
          {{ item.desc }}
        </Tooltip>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, onUnmounted } from 'vue'
import Tooltip from '@/components/UI/Tooltip.vue'
export default defineComponent({
  emits: ['onCheck'],
  props: {
    item: {
      type: Object,
      default: () => ({} || '')
    },
    brand: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    isBrands: {
      type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    isFilter: {
      type: Boolean,
      default: false
    },
    forEmployee: {
      type: Boolean,
      default: false
    },
    forCarBrands: {
      type: Boolean,
      default: false
    },
    forHierarchyRow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tooltip
  },
  setup(props, { emit }) {
    const el = ref<HTMLDivElement>(document.createElement('div'))
    const moreInfo = ref(false)
    const activeOption = ref(false)
    const onCheck = (item, $event) => {
      if (!props.isBrands) {
        const checkBoxActive = item
        if ($event.target.checked) {
          checkBoxActive.isActive = true
        } else {
          checkBoxActive.isActive = false
        }
      }
      emit('onCheck', $event)
    }
    const closeMoreInfo = (e) => {
      const target = e.target
      if (el.value && el.value !== target && !el.value.contains(target)) {
        moreInfo.value = false
      }
    }
    onMounted(() => {
      document.addEventListener('click', closeMoreInfo)
    })
    onUnmounted(() => {
      document.removeEventListener('click', closeMoreInfo)
    })
    return { moreInfo, activeOption, onCheck, closeMoreInfo, el }
  }
})
</script>
<style lang="sass" scoped>
.orderSteps
  input[type="checkbox"]
    & + label:before
      width: 18px
      height: 18px
      border: 0
    &:checked + label:after
      top: 10px
      left: 8px
      width: 12px
      height: 11px
.checkbox-wrap
  display: flex
  flex: 1
  align-items: center
  position: relative
  border-radius: 5px
  &.active.dashboard
    background: none
  &.dashboard
    flex: unset
    input[type="checkbox"]
      & + label
        align-items: center
      & + label:before
        height: 20px
        width: 20px
        border: none
        left: 10px
      &:checked + label:before
        border: 1px solid $colorHubble
        background-color: $colorHubbleLightPurple
      &:checked + label:after
        top: unset
        left: 13px
        border-radius: 5px
  &.wizard
    .inner-block
      padding: 0
      width: 100%
    input[type="checkbox"]
      & + label:before
        height: 20px
        width: 20px
        background-color: $colorWhite
        border: none
        bottom: 8px
        left: 10px
      &:checked + label:before
        border: 1px solid $colorHubble
      &:checked + label:after
        top: unset
        left: 13px
        bottom: 12px
        border-radius: 5px
  &.disabled
    background: $colorHubbleBackgroundGrey
    pointer-events: none
    .value-wrapper, .inner-block
      color: $colorHubbleGreyIcons
    label:before
      display: none
    label:after
      display: none

.description
  align-items: flex-start
.inner-block
  padding-left: 2.4em
label
  width: 100%
  height: 100%
  box-sizing: border-box
span.price
  font-size: 14px
  color: $colorHubbleDarkGrey
  margin-left: 0.3em
  position: absolute
  right: 0.4em
.body-type
  height: 100%
  width: 100%
  display: flex
  flex-direction: column
  justify-content: flex-end
  box-sizing: border-box
  .icon-wrapper
    position: absolute
    top: 5px
    right: 5px
  .image-wrapper
    display: flex
    justify-content: center
  .value-wrapper
    margin: 1.8rem 0 0 0
    font-size: 1.5rem
    line-height: 1.8rem
    color: $colorHubble
    padding-left: 3.2rem
    padding-bottom: 0.5rem
.info
  margin-top: 0.3em
.more-info
  flex: 1
  @media screen and (max-width: 480px)
    padding-left: 1em
  span
    cursor: pointer
    color: $colorHubble
    font-size: 14px
.checkbox-wrap.active
  background-color: $colorHubbleLightPurple
  border-radius: 5px
input[type="checkbox"]
  position: absolute
  opacity: 0

  & + label
    position: relative
    cursor: pointer
    padding: 0
    display: flex
    font-size: 14px
    padding: 0.5rem
    flex: 1.3
  @media screen and (max-width: $mdBreakpoint)
    padding-left: 5px
  & + label.more-info
    flex: initial

  & + label:before
    content: ''
    width: 1.5em
    height: 1.5em
    margin-right: 0.6em
    border-radius: 3px
    display: inline-block
    vertical-align: text-top
    background-color: $colorHubbleLightPurple
    border: 1px solid $colorHubble
    box-sizing: border-box
    position: absolute

  &:checked + label .info-wrap
    background: $colorWhite

  &:checked + label:before
    background: $colorWhite

  &:disabled + label
    cursor: auto

  &:disabled + label:before
    box-shadow: none

  &:checked + label:after
    top: 19px
    left: 10px
    width: 14px
    height: 10px
    position: absolute
    content: ''
    @include backgroundImage('dark-checkmark.svg')
.filterCheckboxDiscount
  &.active
    background: unset
  input[type="checkbox"]
    &:checked + label:after
      top: 12px

.info-wrap
  background: $colorHubbleLightPurple
  width: fit-content
  border-radius: 3px
  height: 22px
  display: flex
  align-items: center
  span
    font-size: 12px
    padding: 0.4em 0.6em
    line-height: normal
    display: flex
    align-items: center
.wizards.brands
  input[type="checkbox"] + label
    font-family: 'Lato'
    display: flex
    align-items: center
  input[type="checkbox"]:checked + label:after
    top: 22px
.dropdown
  background-color: $colorHubbleLightPurple
  flex-direction: column
  align-items: flex-start
.range-dropdown-filter
  background-color: unset
.dropdownRow
  position: relative
  .range-dropdown
    position: absolute
    right: 0
    top: -11px
.checkbox-wrap.dropdownRow
  background: unset
  &.active
    background: unset
  &.disabled
    background: unset
    input[type="checkbox"]
      opacity: 0.4
      width: 17px
      height: 17px
      margin: 0
    input[type="checkbox"] + label:before
      border-color: $colorHubbleGreyIcons
  .inner-block
    display: flex
    width: 115px
    max-width: 115px
    padding-left: 2.7rem
  @media screen and (max-width: $xsBreakpoint)
    padding-right: 15px
  input[type="checkbox"] + label
    color: $colorHubble
    font-family: 'Lato-semibold'
    font-size: 1.5rem
    line-height: 1.8rem
    padding: 0
    margin-right: 33px
    max-width: 142px
  input[type="checkbox"] + label:before
    border: 1px solid $colorHubble
    background: $colorWhite
    width: 17px
    height: 17px
  input[type="checkbox"]
    &:checked + label:after
      left: 2px
      top: 4px
      @include backgroundImage('checkmarkWhite.svg')
    &:checked + label:before
      border: 1px solid $colorHubble
      background: $colorHubble
      margin-right: 0
.filterCheckboxBrands
  .inner-block
    display: flex
    padding-left: 2.7rem
    flex: 1
    align-items: center
    height: 37px
    .text
      width: 150px
    .logo
      flex: 1
      display: flex
      justify-content: center
  input[type="checkbox"] + label
    color: $colorHubble
    font-family: 'Lato-semibold'
    font-size: 1.5rem
    line-height: 1.8rem
    padding: 0
    margin-right: 33px
    align-items: center
  input[type="checkbox"] + label:before
    border: 1px solid $colorHubble
    background: $colorWhite
    width: 17px
    height: 17px
  input[type="checkbox"]
    &:checked + label:after
      left: 2px
      top: 14px
      @include backgroundImage('checkmarkWhite.svg')
    &:checked + label:before
      border: 1px solid $colorHubble
      background: $colorHubble
      margin-right: 0

.range-wrapper
  display: flex
.wizards
  background-color: $colorHubbleBackgroundGrey
  border-radius: 5px
  .inner-block
    display: flex
    align-items: center
  @media screen and (max-width: $xsBreakpoint)
    padding-right: 15px
  input[type="checkbox"] + label
    padding: 0.9em 0.8em
    color: $colorHubble
    font-family: 'Lato-semibold'
    font-size: 15px
  input[type="checkbox"] + label:before
    border: 0
    background: $colorWhite
    width: 20px
    height: 20px
  input[type="checkbox"]
    &:checked + label:after
      left: 15px
      top: 12x
    &:checked + label:before
      border: 1px solid $colorHubble
.wizard-info-wrap
  position: absolute
  right: 0.8em
  top: 13px
  .tooltip
    max-width: 28em
    @media screen and (max-width: $xxlBreakpoint)
      right: 0
      top: 2em
    @media screen and (max-width: $mdBreakpoint)
      max-width: 20em
.mileage-duration
  width: 70%
  position: absolute
  right: 0
  top: 5px
  @media screen and (max-width: $mdBreakpoint - 1)
    width: 90%
    position: relative
    margin-left: 15px
    margin-bottom: 2em
.employee
  input[type="checkbox"] + label
    width: auto
    margin-right: 0 !important
  .inner-block
    width: auto !important
.checkbox-wrap.dropdownRow.carBrands
  input[type="checkbox"] + label
    width: auto
    margin-right: 0 !important
    margin-top: -1em
  .inner-block
    width: auto !important
  input[type="checkbox"]
    &:checked + label:after
      @include backgroundImage('dark-checkmark.svg')
    &:checked + label:before
      background-color: $colorWhite
.hierarchyRow
  input[type="checkbox"]
    & + label
      padding: 0
      .inner-block
        padding-left: 1.8em
    & + label:before
      height: 18px
      width: 18px
      margin-top: 0.2em
      border: none
    &:checked + label:after
      top: 8px
      left: 3px
      @include backgroundImage('checkmarkWhite.svg')
    &:checked + label:before
      border: 1px solid $colorHubble
      background: $colorHubble
      margin-right: 0
</style>
