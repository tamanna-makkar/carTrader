<template>
  <button :disabled="isDisabled" @click="$emit('onClick')" :class="buttonType">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Button',
  emits: ['onClick'],
  props: {
    buttonType: {
      type: String,
      default: ''
    },
    text: {
      type: String
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
button
  display: flex
  padding: 0.6em 1.4em
  border: none
  border-radius: 3.125em
  font-family: 'Lato-semibold'
  justify-content: center
  align-items: center
  span
    font-size: 1.5rem
  &.purple
    background: $colorHubbleLightPurple
    color: $colorHubble
  &.grey
    background: $colorHubbleButtonGrey
    color: $colorHubble
    transition: 300ms ease-out
    &:hover
      box-shadow: $shadowHubbleSmaller
      color: $colorHubbleHover
      background: $colorWhite
    &.close--left
      &:before
        content: url(~@/assets/close.svg)
        padding-right: 1.1rem
    &.arrow--rightDown
      &:after
        padding-left: 1.1rem
        content: url(~@/assets/arrow_down.svg)
  &.light
    background: $colorHubbleGreyLines
    color: $colorHubble
    transition: 300ms ease-out
    &:disabled
      opacity: 0.2
      pointer-events: none
    &:hover
      box-shadow: $shadowHubbleSmaller
      color: $colorHubbleHover
      background: $colorWhite
      &.filter
        &:before
          content: url(~@/assets/filter.svg)
      &.arrow--left
        &:before
          content: url(~@/assets/arrow_back_hover.svg)
      &.arrow--right
        &:after
          content: url(~@/assets/arrow_hover.svg)
    &.add--left
      &:before
        content: ""
        padding-right: 1.5rem
        width: 10px
        height: 10px
        background-repeat: no-repeat
        background-position: center center
        background-image: url(~@/assets/plus.svg)
        background-size: 10px
    &.filter
      &:before
        content: url(~@/assets/filter.svg)
        padding-right: 1.1rem
    &.delete-button
      background: $colorHubbleRed
      color: $colorWhite
    &.arrow--left
      &:before
        content: url(~@/assets/arrow_back.svg)
        padding-right: 1.1rem
    &.arrow--left--disabled
      pointer-events: none
      &:before
        content: url(~@/assets/arrow_back_white.svg)
        padding-right: 1.1rem
    &.arrow--right--disabled
      pointer-events: none
      &:before
        content: url(~@/assets/arrow_white.svg)
        padding-right: 1.1rem
    &.arrow--right
      &:after
        content: url(~@/assets/arrow.svg)
        padding-left: 1.1rem
    &.close--left
      &:before
        content: url(~@/assets/close.svg)
        padding-right: 1.3rem
    &.close--right
      &:after
        content: url(~@/assets/close.svg)
        padding-left: 1.1rem
    &.add--left
      &:before
        background-image: url(~@/assets/plus.svg)
        background-size: 10px
    &.add--left-dark
      &:before
        background-image: url(~@/assets/dark-plus.svg)
        background-size: 12px
    &:focus
      background: $colorHubbleBackgroundGrey
      box-shadow: none
    &.arrow--right.disabled
      opacity: 0.2
      pointer-events: none
    &.arrow--right.enabled
      opacity: 1
      pointer-events: all
  &.white
    background: $colorWhite
    color: $colorHubble
    &.arrow--right.disabled
      background-color: $colorHubbleGreyLines
      pointer-events: none
      color: $colorWhite
      &:after
       background-image: url(~@/assets/arrow_white.svg)
    &.arrow--left
      &:before
        content: url(~@/assets/arrow_back.svg)
        padding-right: 1.1rem
    &.arrow--right
      &:after
        content: ''
        background-image: url(~@/assets/arrow-right.svg)
        width: 10px
        height: 10px
        background-repeat: no-repeat
        background-position: center center
        padding-left: 1.2em
        background-size: 12px
    &:hover
      box-shadow: $shadowHubbleSmaller
      &.arrow--right
        &:after
          background-image: url(~@/assets/arrow_hover.svg)
  &.transparent
    background: transparent
    color: $colorHubble
    &.arrow--left
      &:before
        content: url(~@/assets/arrow_back.svg)
        padding-right: 1.1rem
    &.arrow--right
      &:after
        content: url(~@/assets/arrow.svg)
        padding-left: 1.1rem
    &.close--right
      &:after
        content: url(~@/assets/close.svg)
        padding-left: 1.1rem
  &.dark
    background: $colorHubble
    color: $colorWhite
    transition: 300ms ease-out
    &:disabled
      opacity: 0.2
      pointer-events: none
    &:hover
      background: $colorHubbleHover
      box-shadow: $shadowHubblePrimary
      &.filter
        &:before
          content: url(~@/assets/filter_white.svg)
    &.filter
      &:before
        content: url(~@/assets/filter_white.svg)
        padding-right: 1.1rem
    &.arrow--left
      &:before
        content: url(~@/assets/arrow_back_white.svg)
        padding-right: 1.1rem
    &.arrow
      &:before
        content: url(~@/assets/arrow_white.svg)
        padding-right: 1.1rem
    &.arrow--right
      &:after
        content: url(~@/assets/arrow_white.svg)
        padding-left: 1.1rem
    &.arrow--right.disabled
      opacity: 0.2
      pointer-events: none
    &.arrow--right.enabled
      opacity: 1
      pointer-events: all
    &.compare--left
      &:before
        content: url(~@/assets/compare.svg)
        padding-right: 1.1rem
    &.checked
      &:after
        content: url(~@/assets/checkmarkWhite.svg)
        padding-left: 1.1rem
    &:focus
      background: $colorHubble
    &.add--left
      &:before
        content: ""
        padding-right: 1.5rem
        width: 10px
        height: 10px
        background-repeat: no-repeat
        background-position: center center
        background-image: url(~@/assets/plus.svg)
        background-size: 10px
.save-employee, .save-policy
  button
    width: 11rem
</style>
