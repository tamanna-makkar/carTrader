<template>
  <div class="progress-wrap">
    <div class="progressBar">
      <div class="progress" :style="`width: ${(step / 10) * 100}%`"></div>
    </div>
    <span class="t2" v-if="step <= 9">0{{ step }}/10</span>
    <span class="t2" v-else>{{ step }}/10</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'RangeSlider',
  props: {
    step: {
      type: Number,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
.progress-wrap
  display: flex
  align-items: center
.progressBar
  display: flex
  width: 100%
  height: 5px
  background: $colorHubbleGreyLines
  border-radius: 5px
  margin-right: 2rem
  @media screen and (max-width: $mdBreakpoint)
    margin: 0
.progress
  background: $colorHubbleGradient
  border-radius: 5px
.t2
  color: $colorHubbleDarkGrey
  @media screen and (max-width: $mdBreakpoint)
    position: absolute
    right: 15px
    top: -35px
</style>