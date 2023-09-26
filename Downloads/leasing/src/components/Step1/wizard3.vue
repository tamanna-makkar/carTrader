<template>
  <div class="wizard-inner-wrap side-padding">
    <h3 v-if="!isFilter">{{ $t('_wizard.step3.preferedBody') }}</h3>
    <CarBodyType
      :checkboxesValues="checkboxesValues"
      @onCarBodyCheck="onCarBodyCheck"
      :isFilter="isFilter"
    ></CarBodyType>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import CarBodyType from '@/components/CarBodyType.vue'
export default defineComponent({
  components: {
    CarBodyType
  },
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
    const carBodyTypeArray: Array<string> = sessionStorage.getItem('body_type')
      ? reactive(JSON.parse(sessionStorage.getItem('body_type') || '[]'))
      : reactive([])
    const onCarBodyCheck = ($event) => {
      const item = $event.target.value
      if (carBodyTypeArray.indexOf(item) === -1) {
        carBodyTypeArray.push(item)
      }
      if (!$event.target.checked) {
        carBodyTypeArray.splice(carBodyTypeArray.indexOf(item), 1)
      }
      if (!carBodyTypeArray.length) sessionStorage.removeItem('body_type')
      else sessionStorage.setItem('body_type', JSON.stringify(carBodyTypeArray))
    }
    return { onCarBodyCheck }
  }
})
</script>
<style lang="sass" scoped>
.content
  flex: 1
  display: flex
  flex-wrap: wrap
  .body-type
    display: flex
    height: 120px
    flex: 1 0 21%
    border-radius: 5px
    margin-bottom: 2.3rem
    background: $colorHubbleBackgroundGrey
    @media screen and (min-width: 577px)
      margin-right: 4%
      &:nth-child(4), &:nth-child(8)
        margin-right: 0
    @media screen and (max-width: $xsBreakpoint)
      flex: 1 0 48%
      &:nth-child(2n+1)
        margin-right: 4%
    .info-icon
      @include backgroundImage('info.svg')
      width: 1.8rem
      height: 1.8rem
      display: flex
      &:hover
        @include backgroundImage('info_dark.svg')
</style>