<template>
  <div class="add-facilities">
    <slot />
    <div v-for="(item, index) in facility" :key="index" class="wrap">
      <div class="column">
        <InputElement
          type="text"
          :isFacility="true"
          currencyPlaceholder="gr/km"
          currencyPlaceholderPosition="right"
          :value="item.column1"
          @update:value="$emit('onColumnInput', { item: $event, index: index, type: type, keyName: 'column1' })"
          >Column I</InputElement
        >
      </div>
      <div class="column">
        <InputElement
          type="text"
          :isFacility="true"
          currencyPlaceholder="gr/km"
          currencyPlaceholderPosition="right"
          :value="item.column2"
          @update:value="$emit('onColumnInput', { item: $event, index: index, type: type, keyName: 'column2' })"
          >Column II</InputElement
        >
      </div>
      <div class="column">
        <InputElement
          type="text"
          :isFacility="true"
          currencyPlaceholder="€"
          :value="ConvertToCommas(item.column3)"
          @update:value="$emit('onColumnInput', { item: $event, index: index, type: type, keyName: 'column3' })"
          >Column III</InputElement
        >
      </div>
      <div class="column">
        <InputElement
          type="text"
          :isFacility="true"
          currencyPlaceholder="€"
          :value="ConvertToCommas(item.column4)"
          @update:value="$emit('onColumnInput', { item: $event, index: index, type: type, keyName: 'column4' })"
          >Column IV</InputElement
        >
      </div>
      <div class="button-wrap">
        <Button
          v-if="item['type'] == 'add'"
          :text="$t('_generalTerms.add')"
          class="add-button active"
          buttonType="light add--left"
          @onClick="$emit('add', { index: index, type: type, typeOf: item['typeOf'] })"
        />
        <Button
          v-else
          :text="$t('_generalTerms.delete')"
          buttonType="light close--left"
          @onClick="$emit('delete', { index: index, type: type })"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Button from '@/components/UI/Button.vue'
import { taxSettingsType } from '@/types'
import ConvertToCommas from '@/filters/ConvertToCommas'
export default defineComponent({
  props: {
    facility: {
      type: Array as () => taxSettingsType[],
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    typeOf: {
      type: String,
      default: ''
    }
  },
  components: {
    InputElement,
    Button
  },
  setup(props) {
    const getFacilityProp = () => {
      let facilityType
      if (props.type == 'chargingFacility') {
        facilityType = 'chargingFacility'
      } else {
        facilityType = 'accessory'
      }
      return facilityType
    }
    return { getFacilityProp, ConvertToCommas }
  }
})
</script>
<style lang="sass" scoped>
.add-facilities
  display: flex
  flex-direction: column
  flex: 1
  margin: 2em 0 0 0
  .wrap
    display: flex
    margin: 0 0 3em 0
    align-items: flex-end
    @media screen and (max-width: $mdBreakpoint)
      flex-direction: column
    .column
      flex: 1.3
      margin-right: 4em
      position: relative
      @media screen and (max-width: $mdBreakpoint)
        width: 100%
        margin-right: 0
        margin-bottom: 2em
        flex: initial
    .button-wrap
      display: flex
      flex: 1
      justify-content: flex-end
    .column
      height: 52px
  .add-button
    color: $colorWhite
    pointer-events: none
  button
    height: 44px
    padding: 0.5em 1.5em
  .add-button.active
    pointer-events: visible
    color: $colorHubble
    &:before
      background-image: url(~@/assets/dark-plus.svg)
</style>
