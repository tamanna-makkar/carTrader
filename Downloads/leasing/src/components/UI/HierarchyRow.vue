<template>
  <div class="item-main-wrap">
    <div class="items-wrap" :class="{ 'checked-row': data.isChecked }">
      <div class="item" :style="{ 'padding-left': indentSize + 'em' }">
        <span class="arrow-block" v-if="data.nodes" @click="onNodeExpand(data)">
          <img src="@/assets/dropdown_arrow.svg" :class="{ close: !data.isOpen }" />
        </span>
        <Checkbox
          :item="data"
          :isChecked="data.isChecked"
          @onCheck="onToggleCheckbox($event, data)"
          :forHierarchyRow="true"
        >
          <span>{{ data.name }} </span>
        </Checkbox>
      </div>
      <div class="item">
        <span v-if="showInputBox == data.id">
          <InputElement
            type="text"
            :name="'discount_' + data.id"
            :value="ConvertToCommas(data.discount)"
            currencyPlaceholder="%"
            currencyPlaceholderPosition="right"
            @update:value="onDiscountInputChange"
            @onEnter="saveDiscountInput(data)"
            :isHierarchyInput="true"
            :backgroundType="data.isChecked"
          />
        </span>
        <span v-else @click="onShowDiscountInput(data.id)" class="show-discount-block">
          <span v-if="!data.discount && !data.parentDiscount" class="parent-discount">-</span>
          <span v-else-if="data.discount">{{ ConvertToCommas(data.discount) }}%</span>
          <span v-else-if="data.parentDiscount" class="parent-discount">{{ ConvertToCommas(data.parentDiscount) }}%</span>
        </span>
      </div>
    </div>
  </div>
  <div v-if="Array.isArray(data.nodes)" class="childNodes" :class="{ hidden: !data.isOpen }">
    <HierarchyRow
      v-for="item in data.nodes"
      :key="item.id"
      :data="item"
      :indentSize="item.nodes ? indentSize + 2 : indentSize + 5"
      :showInputBox="showInputBox"
      @node-expand = "onNodeExpand"
      @toggle-checkbox="onToggleCheckbox"
      @show-discount-input="onShowDiscountInput"
      @discount-input-change="onDiscountInputChange"
      @save-discount="saveDiscountInput"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { treeResponseType } from '@/types'
import Checkbox from '@/components/UI/Checkbox.vue'
import InputElement from '@/components/UI/Input.vue'
import ConvertToCommas from '@/filters/ConvertToCommas'
export default defineComponent({
  name: 'HierarchyRow',
  components: {
    Checkbox,
    InputElement
  },
  props: {
    data: {
      type: [Object as () => treeResponseType]
    },
    indentSize: {
      type: Number
    },
    showInputBox: {
      type: Number
    }
  },
  emits: ['nodeExpand', 'toggleCheckbox', 'showDiscountInput', 'discountInputChange', 'saveDiscount'],
  setup(props, { emit }) {
    const onNodeExpand = (item) => {
      emit('nodeExpand', item)
    }
    const onToggleCheckbox = ($event, node) => {
      emit('toggleCheckbox', $event, node)
    }
    const onShowDiscountInput = (id) => {
      emit('showDiscountInput', id)
    }
    const onDiscountInputChange = (value, name) => {
      emit('discountInputChange', value, name)
    }
    const saveDiscountInput = (node) => {
      emit('saveDiscount', node)
    }
    return {
      onNodeExpand,
      onToggleCheckbox,
      onDiscountInputChange,
      onShowDiscountInput,
      saveDiscountInput,
      ConvertToCommas
    }
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
div.item-main-wrap
  border-bottom: 1px solid $colorHubbleGreyLines
  padding: 3px
  div.items-wrap
    display: flex
    border-radius: 5px
    div.item
      padding: 0.2em 1.2em
      flex: 1
      display: flex
      max-width: 36%
      &:first-child
        max-width: 64%
      .arrow-block
        line-height: 2.1rem
        img
          width: 10px
          margin-right: 0.5em
          cursor: pointer
        img.close
          transform: rotate(270deg)
      .show-discount-block
        cursor: pointer
        span
          color: $colorHubble
        span.parent-discount
          color: $colorHubbleDarkGrey
    @media screen and (max-width: $xlBreakpoint)
      background: $colorWhite
      border-bottom: 1px solid $colorHubbleGreyLines
    span
      color: $colorHubbleText
      font-size: 14px
      font-family: 'Lato'
div.checked-row
  background-color: $colorHubbleLightPurple
.active
  display: block
.hidden
  display: none
</style>
