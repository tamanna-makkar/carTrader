<template>
  <div class="wizard-inner-wrap">
    <h3 v-if="!isFilter">{{ $t('_wizard.step9.minAmountDoors') }}</h3>
    <div class="slider-wrapper">
      <div v-if="!isFilter" class="car-icon">
        <div :class="sliderImages[sliderValue]" class="doors"></div>
      </div>
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
            <span v-if="value == minValue" class="first-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step9.doors') }}</span
            >
            <span v-else-if="value == maxValue" class="last-index vue-slider-dot-tooltip-text"
              >{{ value }} {{ $t('_wizard.step9.doors') }}</span
            >
            <span v-else class="vue-slider-dot-tooltip-text">{{ value }} {{ $t('_wizard.step9.doors') }}</span>
          </div>
        </template>
      </vue-slider>
      <div class="placeholders">
        <span class="t2">{{ minValue }} {{ $t('_wizard.step9.doors') }}</span>
        <span class="t2">{{ maxValue }} {{ $t('_wizard.step9.doors') }}</span>
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
    const minValue = sessionStorage.getItem('car_policy_doors')
      ? ref(parseInt(JSON.parse(sessionStorage.getItem('car_policy_doors') || '')['min']))
      : ref(2)
    const maxValue = ref(5)
    const getArrayList = () => {
      const list: Array<number> = []
      for (let i = minValue.value; i <= maxValue.value; i++) {
        list.push(i)
      }
      return list.reverse()
    }
    const sliderData = sessionStorage.getItem('car_policy_doors') ? getArrayList() : reactive([5, 4, 3, 2])
    const sliderValue = sessionStorage.getItem('doors')
      ? ref(JSON.parse(sessionStorage.getItem('doors') || ''))
      : minValue
    onMounted(() => {
      if (!props.isFilter) sessionStorage.setItem('doors', JSON.stringify(sliderValue.value))
    })
    const { sliderDataOptions } = sliderOptions()
    const sliderImages = {
      2: 'two-doors',
      3: 'three-doors',
      4: 'four-doors',
      5: 'five-doors'
    }
    watch(
      () => sliderValue.value,
      (currentValue) => {
        sessionStorage.setItem('doors', JSON.stringify(currentValue))
      }
    )
    return { sliderValue, sliderDataOptions, sliderImages, sliderData, minValue, maxValue }
  }
})
</script>
<style lang="sass" scoped>
@import '~vue-slider-component/lib/theme/default.scss'
.slider-wrapper
  padding: 4em 6.3em 5em
.car-icon
  display: flex
  justify-content: center
  margin-bottom: 3em
.doors
  display: flex
  width: 7em
  height: 7em
.two-doors
  @include backgroundImage('2 doors.svg')
.three-doors
  @include backgroundImage('3 doors.svg')
.four-doors
  @include backgroundImage('4 doors.svg')
.five-doors
  @include backgroundImage('5 doors.svg')
</style>