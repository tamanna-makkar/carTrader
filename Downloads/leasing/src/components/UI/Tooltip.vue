<template>
  <div class="tooltip" :class="{ 'more-info': isMoreInfo, bodyType: isBodyType, alignRight: alignRight, 'tax-info': type == 'TaxInfo' }">
    <p>
      <slot>{{ value }}</slot>
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    isMoreInfo: {
      type: Boolean,
      default: false
    },
    isBodyType: {
      type: Boolean,
      default: false
    },
    alignRight: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    },
    type: {
      type: String,
      default: ''
    }
  }
})
</script>
<style lang="sass" scoped>
.tooltip.tax-info
  max-width: 27em
  p
    font-size: 14px
    color: $colorHubbleText
    font-family: 'Lato'
    font-weight: 400
.tooltip
  max-width: 13em
  box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
  padding: 0.6em 1em
  border-radius: 5px
  background: $colorWhite
  position: ABSOLUTE
  z-index: 1
  margin-top: 0.5em
  width: max-content
  p
    font-size: 14px
    line-height: 24px
    margin: 0
.alignRight
  width: 20.2rem
  padding: 0.9rem 1.2rem 1rem 1rem
  margin-top: 0
.bodyType
  width: 85%
  padding: 0.9rem 1.2rem 1rem 1rem
  top: 2.8rem
  margin-top: 0
  right: 0
  p
    line-height: 2.2rem
.more-info
  max-width: 42em
  padding: 1.8em 2.1em
  left: 27px
  p
    color: $colorHubbleDarkGrey
  &:after
    content: ""
    position: absolute
    bottom: 100%
    left: 6%
    margin-left: -5px
    border-width: 10px
    border-style: solid
    border-color: transparent transparent #fff transparent

@media only screen and (min-width: $xlBreakpoint)
  .alignRight
    left: 4.1rem
  .bodyType
    width: 20.2rem
    left: 16.6rem
    right: unset
</style>