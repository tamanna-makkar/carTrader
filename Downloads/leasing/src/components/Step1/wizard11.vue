<template>
  <WizardCarBrandsModel
    :isFilter="isFilter"
    :selectedBrands="selectedBrands['value']"
    @onCheck="AddBrands"
    @removeBrand="removeBrand"
    @removeAllBrands="removeAllBrands"
  />
</template>
<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import WizardCarBrandsModel from '@/components/WizardCarBrandsModels.vue'
import { carBrandsModelType } from '@/types'
import _ from 'lodash'
export default defineComponent({
  emits: ['selectedBrands'],
  props: {
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  components: {
    WizardCarBrandsModel
  },
  setup(props, { emit }) {
    const getBrandsOnly = (brandModelsArray) => {
      return brandModelsArray.map((item) => {
        return item.brand
      })
    }
    const selectedBrands = sessionStorage.getItem('brands')
      ? reactive({ value: getBrandsOnly(JSON.parse(sessionStorage.getItem('brands') || '[]')) })
      : reactive({ value: [] })
    const removeBrand = (brand) => {
      if (selectedBrands.value.indexOf(brand) !== -1) {
        selectedBrands.value.splice(selectedBrands.value.indexOf(brand), 1)
      }
    }
    const removeAllBrands = () => {
      selectedBrands.value.splice(0, selectedBrands.value.length)
    }
    const getFilteredBrands = (selectedBrands) => {
      let filteredBrandsModel: carBrandsModelType[] = []
      if (sessionStorage.getItem('car_policy_brands_models')) {
        const brandsModelsArray = JSON.parse(sessionStorage.getItem('car_policy_brands_models') || '')
        const filteredArray = brandsModelsArray.filter((item) => {
          return selectedBrands.includes(item.brand)
        })
        filteredBrandsModel = filteredArray
      } else {
        selectedBrands.forEach((item) => {
          filteredBrandsModel.push({ brand: item, models: [] })
        })
      }
      return filteredBrandsModel
    }
    watch(
      () => _.cloneDeep(selectedBrands.value),
      (currentValue) => {
        emit('selectedBrands', selectedBrands.value)
        if (!currentValue.length) sessionStorage.removeItem('brands')
        else sessionStorage.setItem('brands', JSON.stringify(getFilteredBrands(currentValue)))
      }
    )
    const AddBrands = ($event) => {
      const value = $event.target.value
      if ($event.target.checked) {
        if (selectedBrands.value.indexOf(value) === -1) {
          selectedBrands.value.push(value)
        }
      } else {
        removeBrand(value)
      }
    }
    return { AddBrands, removeBrand, removeAllBrands, selectedBrands }
  }
})
</script>
<style lang="sass" scoped>
.wizards
  .logo
    position: absolute
    right: 8px
    width: 4em
    height: 100%
    img
      transform: translateY(-50%)
      top: 50%
      position: absolute
      left: 0
      right: 0
      margin: auto
.active-search
  box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
  border-radius: 5px
  .search-brands
    &:after
      content: ""
      border-bottom: 1px solid $borderColor
      content: ""
      width: 93%
      position: absolute
      bottom: 0
      margin: auto
      left: 0
      right: 0
    input[type="text"]
      background-color: $colorWhite
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0
.search-wrap
  height: 42em
.search-brands
  display: flex
  position: relative
.dropdown
  display: flex
  flex-direction: column
  padding: 0 1em 0 2.3em
  @media screen and (max-width: $xsBreakpoint)
    padding-left: 1.3em
  h4
    color: $colorHubbleDarkGrey
    font-weight: normal
    font-size: 1.4em
    margin: 0.5em 0
  .brand-main-wrap
    display: flex
    max-height: 33em
    overflow-y: scroll
    padding: 0 1.2em 0 0
    flex-direction: column
    &::-webkit-scrollbar
      width: 6px
    &::-webkit-scrollbar-thumb
      background: $colorHubble
      border-radius: 10px
    &::-webkit-scrollbar-track
      background: $colorHubbleGreyLines
      border-radius: 10px
    .popular-brands, .other-brand
      display: flex
      flex-wrap: wrap
      div.brand
        flex-basis: 47.2%
        margin-bottom: 1em
        &:nth-child(2n + 1)
          margin-right: 5.5%
        @media screen and (max-width: $xsBreakpoint)
          flex-basis: 100%
          &:nth-child(2n + 1)
            margin-right: 0
          .wizards
            padding-right: 0
.selected-brands
  display: flex
  flex-direction: column
  h4
    display: flex
    align-items: center
    margin: 1.7em 0 0
    font-size: 15px
    font-family: 'Lato-semibold'
    color: $colorHubbleText
    overflow: hidden
    &:after
      content: ""
      border-bottom: 1px solid $colorHubbleGreyLines
      flex: 1
      position: relative
      left: 8px
  ul
    display: flex
    flex-wrap: wrap
    padding: 0
    margin: 0.5em 0 0
    li
    &.remove-all
      background-color: $colorHubbleLightBackground
      border: none
    li
      display: flex
      align-items: center
      border: 1px solid $colorHubble
      color: $colorHubble
      line-height: 18px
      font-size: 15px
      font-family: 'Lato-semibold'
      align-items: center
      padding: 0.6em 1em
      border-radius: 5px
      margin: 0 0.6em 0.6em 0
      span.remove-icon
        cursor: pointer
        @include backgroundImage('close.svg')
        width: 11px
        height: 12px
        margin-left: 6px
</style>       