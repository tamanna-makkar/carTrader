<template>
  <div
    :class="{
      right: currencyPlaceholderPosition,
      'input-element-wrap': !searchInput,
      'brands-wrap': searchInput,
      'filter-sidebar-search': fiterSidebarSearch,
      'facility-input': isFacility,
      'brands-models-search': isBrandsAndModelsSearch,
      'hierarchy-input': isHierarchyInput,
      'bg-colored': backgroundType
    }"
  >
    <input
      v-if="isphone"
      :class="{ readonly: readonly }"
      class="phone-code"
      :readonly="readonly"
      :type="type"
      :value="prefix"
      :placeholder="placeholder"
      @input="$emit('update:phoneCode', $event.target.value)"
    />
    <input
      :class="{
        'active-search': isSearch,
        searchInput: searchInput,
        'currency-input': currencyPlaceholder,
        readonly: readonly,
        'phone-code-suffix': isphone
      }"
      :readonly="readonly"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      ref="inputRef"
      @input="$emit('update:value', $event.target.value, name)"
      @focus="$emit('onFocus')"
      @keyup.enter="$emit('onEnter')"
      @change="$emit('onChange', $event.target.value, name)"
    />
    <label v-if="!searchInput" class="floating-label" :class="{ 'no-float': value || prefix }">
      <slot />
    </label>
    <span v-if="currencyPlaceholder" class="currency">{{ currencyPlaceholder }}</span>
  </div>
  <span
    v-if="searchInput"
    class="search-icon"
    :class="{ 'employee-search': isEmployeeSearch }"
    @click="$emit('onEnter')"
  ></span>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  emits: ['update:value', 'onFocus', 'update:phoneCode', 'onEnter', 'onChange'],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    isFacility: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    searchInput: {
      type: Boolean,
      default: false
    },
    currencyPlaceholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    fiterSidebarSearch: {
      type: Boolean,
      default: false
    },
    isphone: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    isEmployeeSearch: {
      type: Boolean,
      default: false
    },
    isBrandsAndModelsSearch: {
      type: Boolean,
      default: false
    },
    currencyPlaceholderPosition: {
      type: String,
      default: ''
    },
    isHierarchyInput: {
      type: Boolean,
      default: false
    },
    backgroundType: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const inputRef = ref(null)
    onMounted(() => {
      if (props.isHierarchyInput) inputRef.value.focus()
    })
    return { inputRef }
  }
})
</script>
<style lang="sass" scoped>
.right.input-element-wrap
  input[type="text"].currency-input
    padding-left: 0
    padding-right: 2.7em
  .currency
    right: 0
    left: auto
.right.input-element-wrap.hierarchy-input
  width: 45%
  input[type="text"].currency-input
    font-size: 14px
    ~.floating-label
      display: none
    ~.currency
      color: $colorHubbleDarkGrey
.right.input-element-wrap.hierarchy-input.bg-colored
    input[type="text"].currency-input
      background-color: $colorHubbleLightPurple
.brands-models-search
  input
    padding-left: 0
    background: none
    height: 35px
div.facility-input
  label
    font-size: 14px
.brands-wrap
  display: flex
  flex: 1
div
  label
    font-size: 14px
    color: $colorHubbleDarkGrey
.co2-emissions
  .input-element-wrap
    input[type="text"].currency-input
      padding-left: 0
      ~.floating-label
        left: 0
    .currency
      right: 0
      left: auto
.input-element-wrap
  display: flex
  flex: 1
  flex-direction: column
  justify-content: flex-end
  position: relative
  height: 100%
  .floating-label
    margin-bottom: 9px
    order: 1
    transition: all 0.1s ease
    pointer-events: none
  input
    border: none
    text-overflow: ellipsis
    border-bottom: 2px solid
    border-color: $colorHubble
    font-size: 1.6em
    font-family: 'lato'
    padding: 0
    line-height: 26px
    color: $colorHubbleText
    width: 100%
    box-sizing: border-box
    order: 2
    &:focus, &:not(:focus):valid ~ .floating-label
      outline: none
      ~.floating-label
        top: 0
        opacity: 1
        left: 0
  input.readonly
    background: $colorHubbleLightBackground
    border-radius: 5px
    border-bottom: none
    padding: 0 12px
    height: 30px
  .phone-code, .phone-code-suffix
    position: absolute
  .readonly.phone-code
    border-radius: 5px 0 0 5px
  .readonly.phone-code-suffix
    border-radius: 0 5px 5px 0
  input.phone-code
    width: 15%
    margin: 0 0.9em 0 0
    padding-left: 10px
    padding-right: 0
    color: $colorHubbleDarkGrey
    left: 0
  input.phone-code-suffix
    width: 85%
    right: 0
  input[type="text"].currency-input
    padding-left: 1em
    ~.no-float
      left: 0
  .currency
    position: absolute
    left: 0
    bottom: 2px
.searchInput
  height: 40px
  flex: 1
  background-color: $colorHubbleBackgroundGrey
  border: none
  border-radius: 5px
  padding-left: 1.4em
  font-size: 1.6em
  font-family: 'lato'
  box-sizing: border-box
  @media screen and (max-width: $xsBreakpoint)
    padding-left: 1em
  &:focus
    outline: none
  &::placeholder
    @media screen and (max-width: $xsBreakpoint)
      font-size: 15px
input.active-search
  background-color: $colorWhite
  border-bottom-left-radius: 0
  border-bottom-right-radius: 0
.search-icon
  @include backgroundImage('search.svg')
  width: 28px
  height: 22px
  top: 50%
  transform: translate(0, -50%)
  position: absolute
  right: 0em
  cursor: pointer
.filter-sidebar-search + .search-icon
  @media screen and (max-width: $xsBreakpoint)
    display: none
  input
    background-color: $colorWhite
.employee-search
  @include backgroundImage('search-white.svg')
  background-color: $colorHubbleDarkBlue
  width: 41px
  height: 100%
  border-radius: 5px
  right: 0
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active
  -webkit-box-shadow: 0 0 0 30px white inset !important
</style>
