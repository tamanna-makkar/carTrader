<template>
  <div class="info-wrap">
    <div class="info-popup">
      <h3><slot name="header"></slot></h3>
      <p v-if="$slots.content"><slot></slot></p>
      <span class="close" @click="$emit('closePopup')"></span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'InfoPopup',
  emits: ['closePopup']
})
</script>
<style lang="sass" scoped>
.info-wrap
  position: absolute
  right: 2.1em
  top: 1.3em
  z-index: 1
.info-popup
  box-shadow: $shadowHubbleSmaller
  border-radius: 5px
  max-width: 26em
  width: 100%
  border-left: 5px solid $colorHubble
  padding: 1.3em 0.8em 1.6rem 1.8em
  position: relative
  background: $colorWhite
  h3
    font-family: 'Lato-semibold'
    margin-right: 4rem
  h3,p
    font-size: 1.4em
  p
    color: $colorHubbleText
    opacity: 0.7
    margin-top: 0.4em
    line-height: 2.1rem
    margin-right: 1px
  .close
    @include backgroundImage('close.svg')
    position: absolute
    width: 1.6em
    display: flex
    height: 1.6em
    background-color: $colorHubbleBackgroundGrey
    border-radius: 100%
    top: 0.6em
    right: 0.6em
    cursor: pointer
</style>