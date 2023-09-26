<template>
  <div class="wizard-inner-wrap step7">
    <h3 v-if="!isFilter">{{ $t('_wizard.step7.minTowingCapacity') }}</h3>
    <p v-if="!isFilter" class="sub-heading">{{ $t('_wizard.step7.subTitle') }}</p>
    <div class="slider-wrapper">
      <vue-slider
        ref="slider"
        v-model="sliderValue"
        :vData="sliderData"
        v-bind="sliderDataOptions"
        tooltip="always"
        direction="rtl"
      >
        <template v-slot:tooltip="{ value }">
          <div class="vue-slider-dot-tooltip-inner">
            <span v-if="value == 0" class="first-index vue-slider-dot-tooltip-text">{{ value }} kg</span>
            <span v-else-if="value == 3500" class="last-index vue-slider-dot-tooltip-text">{{ value }} kg</span>
            <span v-else class="vue-slider-dot-tooltip-text">{{ value }} kg</span>
          </div>
        </template>
      </vue-slider>
      <div class="placeholders">
        <span class="t2">0 kg</span>
        <span class="t2">3500 kg</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue'
import VueSlider from 'vue-slider-component'
import sliderOptions from '@/mixins/sliderOptions'
export default defineComponent({
  components: {
    VueSlider
  },
  props: {
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const sliderValue = sessionStorage.getItem('towing_capacity')
      ? ref(JSON.parse(sessionStorage.getItem('towing_capacity') || ''))
      : ref([0])
    const sliderData = reactive([
      3500, 3400, 3300, 3200, 3100, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000, 1900, 1800, 1700,
      1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 0
    ])
    watch(
      () => sliderValue.value,
      (currentValue) => {
        sessionStorage.setItem('towing_capacity', JSON.stringify(currentValue))
        if (currentValue == 0) {
          sessionStorage.removeItem('towing_capacity')
        }
      }
    )
    const { sliderDataOptions } = sliderOptions()
    return { sliderValue, sliderDataOptions, sliderData }
  }
})
</script>
<style lang="sass" scoped>
.step7
  h3
    padding-bottom: 0.55em
  p
    text-align: center
    font-size: 1.4em
    margin-bottom: 2em
</style>