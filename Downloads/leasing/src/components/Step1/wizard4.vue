<template>
  <div class="wizard-inner-wrap side-padding">
    <h3 v-if="!isFilter">{{ $t('_wizard.step4.gearbox') }}</h3>
    <div v-for="(item, index) in checkboxesValues" :key="index">
      <Checkbox
        :item="item"
        @onCheck="onCheck($event, item['title'])"
        :isChecked="item.isActive"
        :isFilter="isFilter"
        theme="wizards"
      >
        {{ $t(item['value']) }}
        <template v-if="item.wizardInfo" v-slot:wizardInfo>
          <i class="info-icon" />
        </template>
      </Checkbox>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Checkbox from '@/components/UI/Checkbox.vue'
export default defineComponent({
  components: {
    Checkbox
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
    const gearBoxArray: Array<string> = sessionStorage.getItem('transmission')
      ? reactive(JSON.parse(sessionStorage.getItem('transmission') || '[]'))
      : reactive([])
    const onCheck = ($event, title) => {
      if (gearBoxArray.indexOf(title) === -1) {
        gearBoxArray.push(title)
      }
      if (!$event.target.checked) {
        gearBoxArray.splice(gearBoxArray.indexOf(title), 1)
      }
      if (!gearBoxArray.length) sessionStorage.removeItem('transmission')
      else sessionStorage.setItem('transmission', JSON.stringify(gearBoxArray))
    }
    return { onCheck }
  }
})
</script>
<style lang="sass" scoped>
.wizard-inner-wrap
  > div
    margin: 0 0 1em 0
  .info-icon
    @include backgroundImage('info.svg')
    cursor: pointer
    width: 18px
    height: 18px
    &:hover
      @include backgroundImage('info_dark.svg')
</style>