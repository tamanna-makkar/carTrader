<template>
  <div class="data-section">
    <div class="common-header" :class="{ 'not-active': !isSectionOpen, 'disabled': disabled }" @click="toggleSection">
      <h2><slot name="header"></slot></h2>
      <div class="right-block">
        <span v-if="showError" class="error-symbol"></span>
        <span v-if="$route.name == 'carPolicy' || $route.name == 'Company' || $route.name == 'superAdminCompanyDetails' ? isSectionOpen : isOpen" class="expand"></span>
        <span class="collapse" v-else>+</span>
      </div>
    </div>
    <transition name="slidedown">
      <div v-if="$route.name == 'carPolicy' || $route.name == 'Company' || $route.name == 'superAdminCompanyDetails' ? isSectionOpen : isOpen">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  emits: ['toggleSection'],
  props: {
    showError: {
      type: Boolean,
      default: false
    },
    isSectionOpen: {
      type: Boolean,
      default: true
    },
    sectionIndex: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const isOpen = ref(true)
    const route = useRoute()
    const toggleSection = () => {
      if (route.name == 'carPolicy' || route.name == 'Company' || route.name == 'superAdminCompanyDetails') {
        emit('toggleSection', props.sectionIndex)
      } else {
        isOpen.value = !isOpen.value
      }
    }
    return { isOpen, toggleSection }
  }
})
</script>
<style lang="sass" scoped>
.data-section .common-header.not-active.disabled
  background-color: $colorHubbleGreyLines
  pointer-events: none
  h2
    color: $colorWhite
  .collapse
    color: $colorWhite
.data-section .common-header.not-active
  background-color: $colorHubbleBackgroundGrey
  h2
    color: $colorHubble
  .collapse
    color: $colorHubble
.hidden
  display: none
.active
  display: block
.data-section
  background-color: $colorWhite
  box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
  padding: 0 0 1em 0
  .common-header
    background-color: $colorHubble
    color: $colorWhite
    display: flex
    justify-content: space-between
    align-items: center
    padding: 0 1em 0 3.3em
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 1em 0 15px
    h2
      font-size: 18px
      font-family: 'Lato-semibold'
      margin: 0.5em 0
      @media screen and (max-width: $mdBreakpoint)
        font-size: 16px
        flex: 1
    span
      font-size: 2.4em
      cursor: pointer
    .expand
      width: 10px
      border-bottom: 2px solid $colorWhite
    .right-block
      display: flex
      align-items: center
      .error-symbol
        width: 1em
        height: 1em
        display: flex
        background-color: $colorHubbleRed
        border-radius: 100%
        justify-content: center
        margin-right: 0.3em
        &:after
          content: ""
          @include backgroundImage('close-white.svg')
          width: 0.5em
</style>
