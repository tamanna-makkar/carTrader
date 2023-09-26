<template>
  <div
    ref="el"
    class="checkbox-wrap"
    :class="{ active: checked, disabled: disabled, disableifRequired: disableifRequired, 'super-admin-checkbox': isSuperAdminCheckbox }"
  >
    <input type="checkbox" :id="id" @input="onCheck($event, packMembers, required)" :checked="checked" />
    <label :for="id">
      <div class="inner-block">
        <div class="block">
          <slot />
          <div class="info" v-if="$slots['info']">
            <div class="info-wrap" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
              <slot name="info"></slot>
            </div>
            <transition name="fade" v-if="activeOption">
              <Tooltip> Here comes extra information about this car type </Tooltip>
            </transition>
          </div>
          <div class="info" v-if="$slots['mandatory']">
            <div class="info-wrap" v-on:mouseover="activeOption = true" v-on:mouseout="activeOption = false">
              <slot name="mandatory"></slot>
            </div>
            <transition name="fade" v-if="activeOption">
              <Tooltip> Mandatory fields </Tooltip>
            </transition>
          </div>
        </div>
        <span class="price" v-if="$slots['price']">
          <slot name="price"></slot>
        </span>
      </div>
    </label>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue'
import Tooltip from '@/components/UI/Tooltip.vue'
export default defineComponent({
  emits: ['onCheck'],
  props: {
    id: {
      type: Number,
      default: 0
    },
    checked: {
      type: [Boolean, Number],
      default: false || 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableifRequired: {
      type: Boolean,
      default: false
    },
    packMembers: {
      type: Array,
      default: () => []
    },
    required: {
      type: Array,
      default: () => []
    },
    isSuperAdminCheckbox: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tooltip
  },
  setup(props, { emit }) {
    const activeOption = ref(false)
    const onCheck = (item, packMembers, required) => {
      emit('onCheck', { option: item, packMembers: packMembers, required: required })
    }
    return { activeOption, onCheck }
  }
})
</script>
<style lang="sass" scoped>
.active.super-admin-checkbox
  padding-bottom: 0
  background: none
.block
  display: flex
  flex-direction: column
  flex: 1
.info
  margin-top: 0.3em
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
.checkbox-wrap
  display: flex
  flex: 1
  align-items: center
  position: relative
  border-radius: 5px
  &.disabled
    opacity: 0.5
    pointer-events: none
    input[type="checkbox"] + label:before
      border-color: $colorHubbleDarkGrey
      background-color: $colorHubbleLightBackground
  &.disableifRequired
    pointer-events: none
    input[type="checkbox"] + label:before
      border-color: $colorHubbleDarkGrey
      background-color: $colorHubbleLightBackground
      opacity: 0.5
    input[type="checkbox"]:checked + label:after
      @include backgroundImage('checked.svg')
      opacity: 0.4
.inner-block
  display: flex
  align-items: flex-start
  justify-content: space-between
  flex: 1
  padding-left: 2.4em
label
  width: 100%
  height: 100%
  box-sizing: border-box
span.price
  font-size: 14px
  color: $colorHubbleDarkGrey
  margin-left: 0.3em
.active
  background-color: $colorHubbleLightPurple
  border-radius: 5px
  padding-bottom: 0.5em

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

  &:checked + label:before
    background: $colorWhite

  &:checked + label .info-wrap
    background: $colorWhite

  &:checked + label:after
    top: 14px
    left: 10px
    width: 14px
    height: 10px
    content: ''
    position: absolute
    @include backgroundImage('dark-checkmark.svg')
</style>