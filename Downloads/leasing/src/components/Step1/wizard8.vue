<template>
  <div class="wizard-inner-wrap">
    <h3 v-if="!isFilter">{{ $t('_wizard.step8.minAmountSeats') }}</h3>
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
            <span v-if="value == 2" class="first-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step8.seats') }}
            </span>
            <span v-else-if="value == 9" class="last-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step8.seats') }}
            </span>
            <span v-else class="vue-slider-dot-tooltip-text">{{ value }} {{ $t('_wizard.step8.seats') }}</span>
          </div>
        </template>
      </vue-slider>
      <div class="placeholders">
        <span class="t2">2 {{ $t('_wizard.step8.seats') }}</span>
        <span class="t2">9 {{ $t('_wizard.step8.seats') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
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
  setup(props) {
    const sliderValue = sessionStorage.getItem('seats')
      ? ref(JSON.parse(sessionStorage.getItem('seats') || ''))
      : ref(4)
    onMounted(() => {
      if (!props.isFilter) sessionStorage.setItem('seats', JSON.stringify(sliderValue.value))
    })
    const sliderData = reactive([9, 8, 7, 6, 5, 4, 3, 2])
    watch(
      () => sliderValue.value,
      (currentValue) => {
        sessionStorage.setItem('seats', JSON.stringify(currentValue))
      }
    )
    const { sliderDataOptions } = sliderOptions()
    return { sliderValue, sliderDataOptions, sliderData }
  }
})
</script>
<style lang="sass" scoped>
</style>