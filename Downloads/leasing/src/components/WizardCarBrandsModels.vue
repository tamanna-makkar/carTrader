<template>
  <div ref="el" class="wizard-inner-wrap side-padding" :class="{ 'filter-sidebar-brands': isFilter }">
    <h3 v-if="!isFilter">{{ $t('_wizard.step11.carBrandsPrefer') }}</h3>
    <div class="search-wrap" :class="{ 'active-search': isDropdownOpen }">
      <div class="search-brands">
        <Input
          :placeholder="$t('_wizard.step11.placeholder')"
          :fiterSidebarSearch="isFilter"
          :searchInput="true"
          :isSearch="isDropdownOpen"
          v-model:value="value"
          @onFocus="isDropdownOpen = true"
          @update:value="onInput"
        />
      </div>
      <div class="dropdown" v-if="isDropdownOpen">
        <div class="brand-main-wrap">
          <div>
            <div class="popular-brands">
              <div v-for="(item, index) in filteredBrands" :key="index" class="brand">
                <Checkbox
                  :brand="item['brand']"
                  @onCheck="onCheck($event)"
                  :isChecked="selectedBrands.includes(item['brand'])"
                  theme="wizards"
                  :isBrands="true"
                >
                  <span v-if="!value">{{ item['brand'] }}</span>
                  <span v-else v-html="boldString(item['brand'], value)"> </span>
                  <div class="logo">
                    <div class="brand-image" :class="getBrandImages(item['brand'])"></div>
                  </div>
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="selected-brands" v-else-if="selectedBrands.length">
        <h4>{{ $t('_wizard.step11.selectedBrands') }}</h4>
        <ul v-if="isAllBrandsSelected()">
          <li>
            {{ $t('_wizard.step11.allBrands') }}
          </li>
        </ul>
        <ul v-else>
          <li v-for="(brand, index) in selectedBrands" :key="index">
            {{ brand }}
            <span class="remove-icon" @click="removeBrand(brand)"></span>
          </li>
          <li class="remove-all" @click="removeAllBrands">
            {{ $t('_wizard.step11.removeAll') }}
            <span class="remove-icon"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import Input from '@/components/UI/Input.vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import { MutationTypes } from '@/store/options/mutations'
import { ActionTypes } from '@/store/options/actions'
import { useStore } from '@/store'
export default defineComponent({
  components: {
    Input,
    Checkbox
  },
  props: {
    isFilter: {
      type: Boolean,
      default: false
    },
    selectedBrands: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const el = ref<HTMLDivElement>(document.createElement('div'))
    const value = ref(store.state.options.searchString)
    const isDropdownOpen = ref(false)
    const filteredBrands = computed(() => store.getters.filteredBrands)
    const boldString = (str, find) => {
      return str.replace(new RegExp(find, 'gi'), (match) => {
        return '<b style="font-family: Lato-semibold">' + match + '</b>'
      })
    }
    const removeBrand = (brand) => {
      emit('removeBrand', brand)
    }
    const removeAllBrands = () => {
      emit('removeAllBrands')
    }
    const onCheck = ($event) => {
      emit('onCheck', $event)
    }
    const onInput = (value) => {
      store.commit(MutationTypes.SET_SEARCH_STRING, value)
    }
    const getBrandImages = (brand) => {
      const brandName = brand.toLowerCase().replace(/\s/g, '').replace(/ë/g, 'e').replace(/&/g, '').replace(/š/g, 's')
      return `${brandName}`
    }
    const closeDropdown = (e) => {
      const target = e.target
      if (el.value && el.value !== target && !el.value.contains(target)) {
        isDropdownOpen.value = false
      }
    }
    const initialize = async () => {
      await store.dispatch(ActionTypes.GET_CAR_BRANDS_MODELS)
    }
    const isAllBrandsSelected = () => {
      return sessionStorage.getItem('brands') == sessionStorage.getItem('car_policy_brands_models')
    }
    onMounted(async () => {
      document.addEventListener('click', closeDropdown)
      await initialize()
    })
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    return {
      value,
      onCheck,
      isDropdownOpen,
      removeBrand,
      removeAllBrands,
      closeDropdown,
      el,
      boldString,
      onInput,
      filteredBrands,
      getBrandImages,
      isAllBrandsSelected
    }
  }
})
</script>
<style lang="sass" scoped>
@each $selectorName, $actualSelector in $selectorMap
  #{$actualSelector}
    @include backgroundImage($selectorName+'.svg')
.brand-image
  width: 100%
  height: 40px
  background-repeat: no-repeat
  display: flex
  align-items: center
  background-size: initial
.wizards
  .logo
    position: absolute
    right: 8px
    width: 5em
    height: 100%
    display: flex
    align-items: center
    img
      transform: translateY(-50%)
      top: 50%
      position: absolute
      right: 0
      left: 0
      max-width: 100%
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
.filter-sidebar-brands
  .active-search
    .search-brands
      &:after
        content: none !important
  .dropdown
    .brand-main-wrap
      .popular-brands, .other-brand
        flex-direction: column
        div.brand
          &:nth-child(2n + 1)
            margin-right: 0
.search-wrap
  height: 40em
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
    .popular-brands
      display: flex
      flex-wrap: wrap
      margin: 2em 0 0
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
.filter-sidebar-brands
  .dropdown
    background-color: $colorWhite !important
    padding: 0 1em 0 2em
  .search-wrap
    height: auto
</style>       