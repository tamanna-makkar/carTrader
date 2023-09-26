<template>
  <Equipments :checkboxesValues="checkboxesValues" :isFilter="isFilter" @onEquipmentCheck="onEquipmentCheck" />
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Equipments from '@/components/Equipments.vue'
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
    const equipmentArray: Array<string> = sessionStorage.getItem('equipments')
      ? reactive(JSON.parse(sessionStorage.getItem('equipments') || '[]'))
      : reactive([])
    const onEquipmentCheck = (option) => {
      const item = option.title
      if (equipmentArray.indexOf(item) === -1) {
        equipmentArray.push(item)
      }
      if (!option.$event.target.checked) {
        equipmentArray.splice(equipmentArray.indexOf(item), 1)
      }
      if (!equipmentArray.length) sessionStorage.removeItem('equipments')
      else sessionStorage.setItem('equipments', JSON.stringify(equipmentArray))
    }
    return {
      onEquipmentCheck
    }
  },
  components: {
    Equipments
  }
})
</script>
<style lang="sass" scoped>
.wizard-inner-wrap
  div.checkboxes-wrap
    margin: 0 0 1em 0
  .full-width
    display: flex
    @media screen and (max-width: $xsBreakpoint)
      flex-direction: column
    .half-width
      flex: 1
      &:first-child
        margin: 0 3.3em 0 0
        @media screen and (max-width: $xsBreakpoint)
          margin: 0
  .info-icon
    @include backgroundImage('info.svg')
    cursor: pointer
    width: 18px
    height: 18px
    &:hover
      @include backgroundImage('info_dark.svg')
</style>