<template>
  <div class="wizard-inner-wrap">
    <h3 v-if="!isFilter">{{ $t('_wizard.step5.enginePower') }}</h3>
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
            <span v-if="value == $t('_wizard.step5.notImportant')" class="first-index vue-slider-dot-tooltip-text">{{
              value
            }}</span>
            <span
              v-else-if="value == $t('_wizard.step5.mostImportant')"
              class="last-index vue-slider-dot-tooltip-text"
              >{{ value }}</span
            >
            <span v-else class="vue-slider-dot-tooltip-text">{{ value }}</span>
          </div>
        </template>
      </vue-slider>
      <div class="placeholders">
        <span class="t2">{{ $t('_wizard.step5.notImportant') }}</span>
        <span class="t2">{{ $t('_wizard.step5.mostImportant') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue'
import VueSlider from 'vue-slider-component'
import sliderOptions from '@/mixins/sliderOptions'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
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
    const { t, locale } = useI18n({ useScope: 'global' })
    const sliderData = reactive([
      t('_wizard.step5.mostImportant'),
      t('_wizard.step5.veryImportant'),
      t('_wizard.step5.quiteImportant'),
      t('_wizard.step5.somewhatImportant'),
      t('_wizard.step5.notImportant')
    ])
    const getSliderText = (value) => {
      let sliderText = ''
      if (value == 'all') {
        sliderText = t('_wizard.step5.notImportant')
      } else if (value == 14) {
        sliderText = t('_wizard.step5.somewhatImportant')
      } else if (value == 10) {
        sliderText = t('_wizard.step5.quiteImportant')
      } else if (value == 8) {
        sliderText = t('_wizard.step5.veryImportant')
      } else if (value == 6) {
        sliderText = t('_wizard.step5.mostImportant')
      }
      return sliderText
    }
    const sliderValue = sessionStorage.getItem('engine_power')
      ? ref(getSliderText(sessionStorage.getItem('engine_power') || ''))
      : ref(t('_wizard.step5.notImportant'))
    watch(
      () => _.cloneDeep(locale.value),
      () => {
        sliderValue.value = t('_wizard.step5.somewhatImportant')
        sliderData[0] = t('_wizard.step5.mostImportant')
        sliderData[1] = t('_wizard.step5.veryImportant')
        sliderData[2] = t('_wizard.step5.quiteImportant')
        sliderData[3] = t('_wizard.step5.somewhatImportant')
        sliderData[4] = t('_wizard.step5.notImportant')
      }
    )
    watch(
      () => sliderValue.value,
      (currentValue) => {
        let enginePower
        if (currentValue == 'The most important' || currentValue == 'Het meest belangrijk') {
          enginePower = 6
        } else if (currentValue == 'Very important' || currentValue == 'Heel belangrijk') {
          enginePower = 8
        } else if (currentValue == 'Quite important' || currentValue == 'Redelijk belangrijk') {
          enginePower = 10
        } else if (currentValue == 'Somewhat important' || currentValue == 'Enigszins belangrijk') {
          enginePower = 14
        }
        sessionStorage.setItem('engine_power', enginePower)
        if (currentValue == 'Not important' || currentValue == 'Niet belangrijk') {
          sessionStorage.removeItem('engine_power')
        }
      }
    )
    const { sliderDataOptions } = sliderOptions()
    return { sliderData, sliderValue, sliderDataOptions }
  }
})
</script>
<style lang="sass" scoped>
@import '~vue-slider-component/lib/theme/default.scss'
</style>