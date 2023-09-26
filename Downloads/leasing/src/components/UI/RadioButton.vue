<template>
  <input
    type="radio"
    :id="`radio-${optionId}`"
    :checked="checked"
    :disabled="disabled"
    name="name"
    @input="onRadioClick(optionId, packMembers)"
  />
  <label :for="`radio-${optionId}`">
    <div class="inner-block">
      <slot />
      <span class="price">
        <slot name="price"></slot>
      </span>
    </div>
  </label>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['onRadioClick'],
  props: {
    optionId: {
      type: Number,
      default: 0
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    packMembers: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const onRadioClick = (optionId, packMembers) => {
      emit('onRadioClick', { optionId: optionId, packMembers: packMembers })
    }
    return { onRadioClick }
  }
})
</script>
<style lang="sass" scoped>
.inner-block
  padding-left: 2.4em
  width: 100%
  display: flex
span.price
  font-size: 14px
  color: $colorHubbleDarkGrey
  margin-left: 0.3em
  position: absolute
  right: 0.4em
  @media screen and (max-width: 480px)
    position: static
input[type="radio"]
  position: absolute
  opacity: 0

  & + label
    position: relative
    cursor: pointer
    padding: 0
    display: flex
    align-items: center
    font-size: 14px
    padding: 0.4em
    width: 100%
    @media screen and (max-width: $mdBreakpoint)
      padding-left: 5px

  & + label:before
    content: ''
    width: 1.5em
    height: 1.5em
    margin-right: 0.6em
    border-radius: 100%
    display: inline-block
    vertical-align: text-top
    background-color: $colorHubbleLightPurple
    border: 1px solid $colorHubble
    box-sizing: border-box
    position: absolute

  &:checked + label
    background-color: $colorHubbleLightPurple
    border-radius: 6px

  &:checked + label:before
    background: $colorWhite

  &:disabled + label
    cursor: auto
    opacity: 0.5

  &:disabled + label:before
    box-shadow: none
    border-color: $colorHubbleDarkGrey

  &:checked + label:after
    top: 50%
    left: 13px
    width: 9px
    height: 9px
    content: ''
    position: absolute
    background-color: $colorHubble
    transform: translate(0, -50%)
    border-radius: 100%
</style>