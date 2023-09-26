<template>
  <div class="content" :class="{ 'filter-wrap': isFilter }">
    <div :class="{ 'body-type': !isFilter }" v-for="(item, index) in checkboxesValues" :key="index">
      <Checkbox :item="item" :isFilter="isFilter" :isChecked="item.isActive" @onCheck="onCarBodyCheck">
        <template v-slot:body-type>
          <i v-if="item['isInfo']" class="info-icon"></i>
        </template>
        <template v-if="!item['isDisabled'] && !isFilter" v-slot:image>
          <img :src="item.image" />
        </template>
        <template v-if="item['isDisabled']" v-slot:imageDisabled>
          <img :src="item.imageDisabled" />
        </template>
        <template v-slot:value>
          {{ $t(getTranslatedBodyType(item.value)) }}
        </template>
      </Checkbox>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import getTranslatedBodyType from '@/filters/getTranslatedBodyType'
export default defineComponent({
  emits: ['onCarBodyCheck'],
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
  setup(props, { emit }) {
    const onCarBodyCheck = ($event) => {
      emit('onCarBodyCheck', $event)
    }
    return { onCarBodyCheck, getTranslatedBodyType }
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
    flex: 0 0 22%
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
.filter-wrap
  display: block
  column-count: 2
  > div
    margin: 0 0 1em 0
</style>
