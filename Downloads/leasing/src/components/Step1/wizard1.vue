<template>
  <div class="wizard-inner-wrap middle-section">
    <h3>{{ $t('_wizard.step1.monthlyBudget') }}</h3>
    <span class="t2">{{ $t('_wizard.step1.subText') }}</span>
    <span v-if="getSelectedBudget.value[0] == getSelectedBudget.value[1]" class="error-message">
        {{ $t('_wizard.step1.minMaxCannotBeSame') }}
    </span>
    <div class="content">
      <div class="slider-wrapper">
        <CustomSlider @selectedBudget="selectedBudget" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import CustomSlider from '@/components/UI/CustomSlider.vue'
export default defineComponent({
  components: {
    CustomSlider
  },
  setup(props, { emit }) {
    const getSelectedBudget = reactive({value: sessionStorage.getItem('budget')
      ? JSON.parse(sessionStorage.getItem('budget') || '')
      : [0, 2500] })
    const selectedBudget = (budget) => {
      getSelectedBudget.value = budget
      emit('selectedBudget', budget)
    }
    return { selectedBudget, getSelectedBudget }
  }
})
</script>
<style lang="sass" scoped>
.middle-section
  display: flex
  flex-direction: column
  position: relative
  .t2
    margin: 2rem 0 4rem 0
  h3
    padding: 0 0 1rem 0
  span
    text-align: center
    margin: 0 0 4rem 0
    @media screen and (max-width: $mdBreakpoint)
      padding: 0 15px
  .error-message
    top: 22px
    left: 0
    right: 0
    margin: auto
    text-align: CENTER  
</style>