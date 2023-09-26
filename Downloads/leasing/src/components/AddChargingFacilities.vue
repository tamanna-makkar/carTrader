<template>
  <div class="add-facilities">
    <slot />
    <div v-for="(item, index) in getFacilityArray()" :key="index" class="wrap">
      <div class="name">
        <InputElement
          type="text"
          :isFacility = "true"
          :value="type == 'chargingFacility' ? item.chargingFacility : item.accessory"
          @update:value="$emit('onNameInput', { item: $event, index: index, type: type })"
          >{{ $t(`_carPolicy.${type}`) }}</InputElement
        >
        <span class="error-message" v-if="step2Errors[index] && step2Errors[index]['facilityError']">
          {{ $t('_errorCodes.facilityLengthError') }}
        </span>
        <span class="error-message" v-if="step2Errors[index] && step2Errors[index].facilityRequired">
          {{ $t('_errorCodes.facilityRequiredError') }}
        </span>
      </div>
      <div class="price">
        <InputElement
          type="text"
          :isFacility = "true"
          currencyPlaceholder="€"
          :value="item['price'] ? item['price'] : null"
          @update:value="$emit('onPriceInput', { item: $event, index: index, type: type })"
          >{{ $t('_carPolicy.price') }}</InputElement
        >
        <span class="error-message" v-if="step2Errors[index] && step2Errors[index].priceError">
          {{ $t('_errorCodes.priceIntegerError') }}
        </span>
        <span class="error-message" v-if="step2Errors[index] && step2Errors[index].priceRequired">
          {{ $t('_errorCodes.priceRequiredError') }}
        </span>
      </div>
      <div class="button-wrap">
        <Button
          v-if="item['type'] == 'add'"
          :text="$t('_generalTerms.add')"
          class="add-button"
          :class="{ active: item[getFacilityProp()] && item['price'] }"
          buttonType="light add--left"
          @onClick="$emit('add', { index: index, type: type })"
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
import { chargingFacilityType, mandatoryAccessoriesType, step2ErrorsType } from '@/types'
export default defineComponent({
  props: {
    facility: {
      type: Array as () => chargingFacilityType[],
      default: () => []
    },
    mandatoryAccessories: {
      type: Array as () => mandatoryAccessoriesType[],
      default: () => []
    },
    step2Errors: {
      type: Array as () => step2ErrorsType,
      default: () => [
        {
          facilityError: '',
          priceError: ''
        }
      ]
    },
    othersAccessories: {
      type: Array as () => mandatoryAccessoriesType[]
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    InputElement,
    Button
  },
  setup(props) {
    const getFacilityArray = () => {
      let facilityArray
      if (props.type == 'chargingFacility') {
        facilityArray = props.facility
      } else if (props.type == 'mandatoryAccessories') {
        facilityArray = props.mandatoryAccessories
      } else if (props.type == 'others') {
        facilityArray = props.othersAccessories
      }
      return facilityArray
    }
    const getFacilityProp = () => {
      let facilityType
      if (props.type == 'chargingFacility') {
        facilityType = 'chargingFacility'
      } else {
        facilityType = 'accessory'
      } 
      return facilityType
    }
    return { getFacilityArray, getFacilityProp }
  }
})
</script>
<style lang="sass" scoped>
.add-facilities
  display: flex
  flex-direction: column
  flex: 1
  margin: 4em 0 0 0
  .wrap
    display: flex
    margin: 0 0 3em 0
    align-items: center
    @media screen and (max-width: $xsBreakpoint)
      flex-direction: column
    .name
      flex: 2
      margin-right: 4em
      position: relative
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
        margin-right: 0
        margin-bottom: 2em
    .price
      flex: 1
      position: relative
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
        margin-bottom: 2em
    .button-wrap
      display: flex
      flex: 1
      justify-content: flex-end
    .name, .price
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