<template>
  <div class="wizard-inner-wrap" :class="{ 'side-padding': !isFilter }">
    <h3 v-if="!isFilter">{{ $t('_wizard.step10.equipment') }}</h3>
    <div class="full-width">
      <div class="half-width" :class="{ 'filter-half-width': isFilter }">
        <div v-for="(item, index) in checkboxesValues.slice(0, 4)" :key="index" class="checkboxes-wrap">
          <Checkbox
            :item="item"
            @onCheck="onCheck($event, item['title'])"
            :isFilter="isFilter"
            :isChecked="item.isActive"
            theme="wizards"
          >
            {{ $t(item['value']) }}
            <template v-if="item.wizardInfo" v-slot:wizardInfo>
              <i class="info-icon" />
            </template>
          </Checkbox>
        </div>
      </div>
      <div class="half-width">
        <div v-for="(item, index) in checkboxesValues.slice(4)" :key="index" class="checkboxes-wrap">
          <Checkbox
            :item="item"
            @onCheck="onCheck($event, item['title'])"
            :isFilter="isFilter"
            :isChecked="item.isActive"
            theme="wizards"
          >
            {{ $t(item['value']) }}
            <template v-if="item.wizardInfo" v-slot:wizardInfo>
              <i class="info-icon" />
            </template>
          </Checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Checkbox from '@/components/UI/Checkbox.vue'
export default defineComponent({
  emits: ['onEquipmentCheck'],
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
  setup(props, { emit }) {
    const onCheck = ($event, title) => {
      emit('onEquipmentCheck', { $event: $event, title: title })
    }
    return {
      onCheck
    }
  },
  components: {
    Checkbox
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
      &.filter-half-width
        margin: 0
  .info-icon
    @include backgroundImage('info.svg')
    cursor: pointer
    width: 18px
    height: 18px
    &:hover
      @include backgroundImage('info_dark.svg')
</style>