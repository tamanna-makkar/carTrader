<template>
  <div class="wizard-inner-wrap side-padding">
    <h3 v-if="!isFilter">{{ $t('_wizard.step2.preferedFuel') }}</h3>
    <fuel-type
      :checkboxesValues="checkboxesValues"
      :selectedElectricOption="selectedElectricOption"
      :selectedHybridOption="selectedHybridOption"
      @onCheck="onCheck"
      @selectElectricOption="selectElectricOption"
      @selectHybridOption="selectHybridOption"
      :isFilter="isFilter"
    >
    </fuel-type>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import FuelType from '@/components/FuelType.vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { reactive } from 'vue'
export default defineComponent({
  props: {
    checkboxesValues: {
      type: Object,
      default: () => ({})
    },
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { t, locale } = useI18n({ useScope: 'global' })
    const getElectricRange = (range) => {
      let electricRange = range
      if (range == '0 km') {
        electricRange = '< 100 km'
      }
      return electricRange
    }
    const getHybridRange = (range) => {
      let hybridRange = range
      if (range == '0 km') {
        hybridRange = '< 50 km'
      }
      return hybridRange
    }
    const selectedElectricOption = sessionStorage.getItem('electric_drive_range')
      ? ref(getElectricRange(JSON.parse(sessionStorage.getItem('electric_drive_range') || '') + ' km'))
      : ref(t('_wizard.step2.selectRange'))
    const selectedHybridOption = sessionStorage.getItem('plug_in_hybrid_drive_range')
      ? ref(getHybridRange(JSON.parse(sessionStorage.getItem('plug_in_hybrid_drive_range') || '') + ' km'))
      : ref(t('_wizard.step2.selectRange'))
    const fuelTypeArray: Array<string> = sessionStorage.getItem('fuel_type')
      ? reactive(JSON.parse(sessionStorage.getItem('fuel_type') || '[]'))
      : reactive([])
    watch(
      () => _.cloneDeep(locale.value),
      () => {
        if (selectedElectricOption.value === 'range' || selectedElectricOption.value == 'Actieradius') {
          selectedElectricOption.value = t('_wizard.step2.selectRange')
        }
        if (selectedHybridOption.value === 'range' || selectedHybridOption.value == 'Actieradius') {
          selectedHybridOption.value = t('_wizard.step2.selectRange')
        }
      }
    )
    const onCheck = ($event) => {
      const item = $event.title
      if (item !== 'plug_in_hybrid' && item !== 'hybrid') {
        if (fuelTypeArray.indexOf(item) === -1) {
          fuelTypeArray.push(item)
        }
        if (!$event.item.target.checked) {
          fuelTypeArray.splice(fuelTypeArray.indexOf(item), 1)
        }
        if (item === 'electric' && !$event.item.target.checked) {
          sessionStorage.removeItem('electric_drive_range')
          selectedElectricOption.value = t('_wizard.step2.selectRange')
        }
        if (!fuelTypeArray.length) sessionStorage.removeItem('fuel_type')
        else sessionStorage.setItem('fuel_type', JSON.stringify(fuelTypeArray))
      } else {
        sessionStorage.setItem(item, JSON.stringify(true))
        if (!$event.item.target.checked) {
          sessionStorage.removeItem(item)
        }
        if (item === 'plug_in_hybrid' && !$event.item.target.checked) {
          sessionStorage.removeItem('plug_in_hybrid_drive_range')
          selectedHybridOption.value = t('_wizard.step2.selectRange')
        }
      }
    }
    const convertToNumber = (selectedOption) => {
      return parseInt(selectedOption.replace(/[kmmonths<>]/g, ''))
    }
    const selectElectricOption = (option) => {
      selectedElectricOption.value = option['item']
      if (option['item'] == '< 100 km') {
        option['item'] = '0 km'
      }
      sessionStorage.setItem('electric_drive_range', JSON.stringify(convertToNumber(option['item'])))
    }
    const selectHybridOption = (option) => {
      selectedHybridOption.value = option['item']
      if (option['item'] == '< 50 km') {
        option['item'] = '0 km'
      }
      sessionStorage.setItem('plug_in_hybrid_drive_range', JSON.stringify(convertToNumber(option['item'])))
    }
    return {
      selectedElectricOption,
      selectedHybridOption,
      onCheck,
      selectElectricOption,
      selectHybridOption
    }
  },
  components: {
    FuelType
  }
})
</script>
