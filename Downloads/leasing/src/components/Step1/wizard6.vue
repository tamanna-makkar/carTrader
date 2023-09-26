<template>
  <div class="wizard-inner-wrap">
    <div class="titles side-padding">
      <h3>{{ $t('_wizard.step6.cargo') }}</h3>
      <span class="t2">{{ $t('_wizard.step6.amountSuitcases') }}</span>
    </div>
    <div class="content">
      <div class="rating">
        <div
          v-for="(item, index) in getSuitCases"
          :key="index"
          class="image-wrapper"
          :class="{ disabled: !item['isSelected'] }"
          @click="changeRating(item, 'click')"
          v-on:mouseover="changeRating(item, 'hover')"
          v-on:mouseout="changeRating(item, 'mouseout')"
        >
          <img v-if="item['isSelected']" :src="item.image" />
          <img v-if="!item['isSelected']" :src="item.imageDisabled" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
export default defineComponent({
  props: {
    checkboxesValues: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const cargoSpace = sessionStorage.getItem('cargo_space')
      ? ref(JSON.parse(sessionStorage.getItem('cargo_space') || ''))
      : ref(100)
    onMounted(() => {
      sessionStorage.setItem('cargo_space', JSON.stringify(cargoSpace.value))
    })
    const description = ref('_wizard.step6.description')
    const suitcases = reactive([
      {
        id: 1,
        image: require('@/assets/suitcase.svg'),
        isSelected: true,
        imageDisabled: require('@/assets/suitcase_disabled.svg'),
        cargoSpace: 100,
        description: '_wizard.step6.description'
      },
      {
        id: 2,
        image: require('@/assets/suitcase.svg'),
        isSelected: false,
        imageDisabled: require('@/assets/suitcase_disabled.svg'),
        cargoSpace: 200,
        description: '_wizard.step6.description'
      },
      {
        id: 3,
        image: require('@/assets/suitcase.svg'),
        isSelected: false,
        imageDisabled: require('@/assets/suitcase_disabled.svg'),
        cargoSpace: 300,
        description: '_wizard.step6.description'
      },
      {
        id: 4,
        image: require('@/assets/suitcase.svg'),
        isSelected: false,
        imageDisabled: require('@/assets/suitcase_disabled.svg'),
        cargoSpace: 400,
        description: '_wizard.step6.description'
      },
      {
        id: 5,
        image: require('@/assets/suitcase.svg'),
        isSelected: false,
        imageDisabled: require('@/assets/suitcase_disabled.svg'),
        cargoSpace: 500,
        description: '_wizard.step6.description'
      }
    ])
    const getSelectedValue = (storedStep) => {
      suitcases.forEach(function (item) {
        item.isSelected = false
      })
      const storedStepValue = JSON.parse(sessionStorage.getItem(`${storedStep}`) || '{}')
      for (let i = 0; i < suitcases.length; i++) {
        if (storedStepValue >= suitcases[i].cargoSpace) {
          suitcases[i].isSelected = true
        }
      }
      return suitcases
    }
    const getSuitCases = sessionStorage.getItem('cargo_space') ? getSelectedValue('cargo_space') : suitcases
    const changeRating = (item, type) => {
      suitcases.forEach(function (item) {
        item.isSelected = false
      })
      if (type === 'click') {
        cargoSpace.value = item.cargoSpace
        description.value = item.description
        for (let i = 0; i < suitcases.length; i++) {
          if (item.id >= suitcases[i].id) {
            suitcases[i].isSelected = true
            sessionStorage.setItem('cargo_space', JSON.stringify(item.cargoSpace))
          }
        }
      }
      if (type === 'hover') {
        for (let i = 0; i < suitcases.length; i++) {
          if (item.id >= suitcases[i].id) {
            suitcases[i].isSelected = true
          }
        }
      }
      if (type === 'mouseout') {
        for (let i = 0; i < suitcases.length; i++) {
          if (cargoSpace.value >= suitcases[i].cargoSpace) {
            suitcases[i].isSelected = true
          }
        }
      }
    }
    return { cargoSpace, description, suitcases, changeRating, getSuitCases }
  }
})
</script>
<style lang="sass" scoped>
.content
  display: flex
  flex-direction: column
  flex: 1
  width: 100%
  border-radius: 5px
  margin: 0
  padding: 3rem 0 5rem 0
  background: $colorHubbleLightBackground
  .rating
    display: flex
    flex: 1
    justify-content: center
    gap: 0.9rem
    .image-wrapper
      display: flex
      border-radius: 100%
      background-color: $colorHubbleDarkBlue
      width: 54px
      height: 54px
      &:hover
        cursor: pointer
      &.disabled
        background-color: $colorWhite
      img
        padding: 1.1rem 1rem

  .info
    display: flex
    flex-direction: column
    justify-content: center
    margin: 2.5rem 0 0 0
    text-align: center
    padding: 0 3rem
    .light
      color: $colorHubbleDarkGrey
</style>
