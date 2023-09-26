<template>
  <div class="wizard-inner-wrap">
    <div class="slider-wrapper">
      <vue-slider
        ref="slider"
        v-model="sliderValue"
        :vData="sliderData"
        v-bind="sliderDataOptions"
        direction="rtl"
        tooltip="always"
      >
        <template v-slot:tooltip="{ value }">
          <div class="vue-slider-dot-tooltip-inner">
            <span v-if="value === 1" class="first-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step6.suitcases') }}
            </span>
            <span v-else-if="value === 5" class="last-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step6.suitcases') }}
            </span>
            <span v-else class="vue-slider-dot-tooltip-text">{{ value }} {{ $t('_wizard.step6.suitcases') }} </span>
          </div>
        </template>
      </vue-slider>
      <div class="placeholders">
        <span class="t2">1</span>
        <span class="t2">5</span>
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
  setup() {
    const sliderData = reactive([5, 4, 3, 2, 1])
    const sliderValue = sessionStorage.getItem('cargo_space')
      ? ref(JSON.parse(sessionStorage.getItem('cargo_space') || '') / 100)
      : ref(3)
    const { sliderDataOptions } = sliderOptions()
    watch(
      () => sliderValue.value,
      (currentValue) => {
        sessionStorage.setItem('cargo_space', JSON.stringify(currentValue * 100))
      }
    )
    return { sliderData, sliderValue, sliderDataOptions }
  }
})
</script>
<style lang="sass" scoped>
@import '~vue-slider-component/lib/theme/default.scss'
</style>