<template>
  <div class="slider-component">
    <vue-slider
      ref="slider"
      v-model="sliderValue"
      :vData="sliderData"
      v-bind="sliderDataOptions"
      :tooltip="showMergeTooltip(sliderValue) ? 'none' : 'always'"
    >
      <template v-slot:process="{ style }">
        <div class="vue-slider-process" :style="style">
          <div
            v-if="showMergeTooltip(sliderValue)"
            :class="['merge-tooltip', 'vue-slider-dot-tooltip-inner', 'vue-slider-dot-tooltip-inner-top']"
          >
            €{{ sliderValue[0] }} - €{{ sliderValue[1] }}
          </div>
        </div>
      </template>
      <template v-slot:tooltip="{ value }">
        <div class="vue-slider-dot-tooltip-inner">
          <span v-if="value == 0" class="first-index vue-slider-dot-tooltip-text">€{{ value }}</span>
          <span v-else-if="value == 2500" class="last-index vue-slider-dot-tooltip-text">€{{ value }}</span>
          <span v-else class="vue-slider-dot-tooltip-text">€{{ value }}</span>
        </div>
      </template>
    </vue-slider>
    <div class="placeholders">
      <span class="t2">€ 0</span>
      <span class="t2">{{ $t('_wizard.step1.any') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { useStore } from '@/store'
import VueSlider from 'vue-slider-component'
import sliderOptions from '@/mixins/sliderOptions'
export default defineComponent({
  name: 'CustomSlider',
  components: {
    VueSlider
  },
  props: {
    filter: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeFilterSlider', 'selectedBudget'],
  setup(props, { emit }) {
    const store = useStore()
    const { sliderDataOptions } = sliderOptions()
    const sliderValue = sessionStorage.getItem('budget')
      ? ref(JSON.parse(sessionStorage.getItem('budget') || ''))
      : ref([0, 2500])
    onMounted(() => {
      // sessionStorage.setItem('budget', JSON.stringify(sliderValue.value))
    })
    const sliderData = reactive([
      0,
      50,
      100,
      150,
      200,
      250,
      300,
      350,
      400,
      450,
      500,
      600,
      700,
      800,
      900,
      1000,
      1250,
      1500,
      1750,
      2000,
      2250,
      2500
    ])
    watch(
      () => [...sliderValue.value],
      (currentValue) => {
        sessionStorage.setItem('budget', JSON.stringify(currentValue))
        emit('selectedBudget', currentValue)
      }
    )
    const showMergeTooltip = (value) => {
      let isMerged = false
      if (value[1] <= 500) {
        isMerged = value[1] - value[0] === 50
      } else if (value[1] > 500 && value[1] <= 1000) {
        isMerged = value[1] - value[0] === 100
      } else if (value[1] > 1000) {
        isMerged = value[1] - value[0] === 250
      }
      return isMerged
    }
    const changeFilterSlider = ($event) => {
      emit('changeFilterSlider', $event)
    }
    return {
      store,
      showMergeTooltip,
      sliderValue,
      sliderDataOptions,
      sliderData,
      changeFilterSlider
    }
  }
})
</script>

<style lang="sass">
@import '~vue-slider-component/lib/theme/default.scss'
.merge-tooltip
  top: -18px
  left: 50%
  -webkit-transform: translate(-50%,-100%)
  transform: translate(-50%,-100%)
  position: absolute
</style>
