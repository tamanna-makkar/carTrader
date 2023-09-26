<template>
  <teleport to="body">
    <div class="popupWrapper">
      <slot />
      <!-- WarningPopup -->
      <div class="popup" v-if="$slots['warningPopup']">
        <slot name="warningPopup"></slot>
        <div class="gradient-line"></div>
        <button class="buttonExit" @click="$emit('onClick')">
          <img src="@/assets/close.svg" class="exit" />
        </button>
        <div class="warningPopup">
          <div class="popup-content">
            <div class="icon">
              <img src="@/assets/warning.svg" />
            </div>
            <div class="title h3">{{ $t('_warningPopup.title') }}</div>
            <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
            <div class="buttons">
              <Button :text="$t('_warningPopup.proceed')" @onClick="$emit('onClick')" buttonType="dark" />
              <Button :text="$t('_warningPopup.cancel')" @onClick="$emit('onClick')" buttonType="transparent" />
            </div>
          </div>
        </div>
      </div>
      <div class="popup">
        <div class="gradient-line"></div>
        <button class="buttonExit" @click="$emit('onClick')">
          <img src="@/assets/close.svg" class="exit" />
        </button>
        <slot name="selectionPopup"></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent } from 'vue'
import formatCurrency from '@/filters/CurrencyFormat'
import Button from '@/components/UI/Button.vue'
export default defineComponent({
  emits: ['onClick'],
  components: {
    Button
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    selections: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const calculatePercentage = (value, main) => {
      let percentage
      if (value > main) {
        percentage = Math.round((value / main) * 100 - 100)
        return percentage
      }
      if (value < main) {
        percentage = Math.round(100 - (value / main) * 100)
        return percentage
      }
    }
    const checkEquipment = (value, main) => {
      const originalItems = []
      const selectedItems = []
      for (let i = 0; i < main.length; i++) {
        originalItems.push(main[i])
      }
      for (let j = 0; j < value.length; j++) {
        selectedItems.push(value[j])
      }
      const result = originalItems
        .filter((x) => !selectedItems.includes(x))
        .concat(selectedItems.filter((x) => !originalItems.includes(x)))
      return result.join(', ')
    }
    return { formatCurrency, calculatePercentage, checkEquipment }
  }
})
</script>

<style lang="sass" scoped>
.popupWrapper
  display: flex
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: rgba(0,0,0,0.5)
  overflow: auto
  z-index: 10
  .popup
    position: relative
    box-sizing: border-box
    // top: 9rem
    max-width: 50rem
    width: 95%
    border-radius: 0.5em
    box-shadow: $shadowHubbleDashboard
    background: $colorWhite
    z-index: 11
    margin: 9rem auto auto auto
    left: 0
    right: 0
    .gradient-line
      height: 0.4em
      width: 100%
      background: $colorHubbleGradient
      border-top-left-radius: 0.5em
      border-top-right-radius: 0.5em
    .buttonExit
      display: flex
      position: absolute
      right: 0
      align-items: center
      justify-content: center
      margin-top: 1.4rem
      margin-right: 1rem
      height: 2.6rem
      width: 2.6rem
      border-radius: 100%
      background: $colorHubbleLightPurple
      border: none
    .warningPopup
      .popup-content
        display: flex
        flex-direction: column
        padding: 0 3.2rem
        .text
          padding: 2em 0 0 0
        .icon
          width: 4.5rem
          height: 4.5rem
          background: $colorHubbleLightPurple
          border-radius: 100%
          margin: 3rem auto 2rem auto
          img
            height: 100%
            width: 100%
        .title
          font-size: 1.8rem
          line-height: 2.2rem
          margin-bottom: 2.1rem
          text-align: center
        .text
          font-family: Lato-semibold
          color: $colorHubbleDarkGrey
          text-align: center
        .buttons
          display: flex
          flex-direction: column
          width: 20.2em
          margin: 4rem auto 2.5rem auto
          button
            padding: 1.3rem 0 1.4rem 0
          button:first-child
            margin-bottom: 0.5rem
    .selectionPopup
      .popup-content
        display: flex
        flex-direction: column
        padding: 0 3.2em
        .car-values
          display: flex
          flex-direction: column
          margin-bottom: 2rem
          .row
            display: flex
            justify-content: space-between
            margin-bottom: 1rem
            .label, .value
              width: 50%
            .label
              display: flex
              color: $colorHubbleDarkGrey
            .value
              position: relative
              padding-left: 2.4rem
              align-items: center
              img
                position: absolute
                top: 4px
                left: 0
              .equipment
                display: flex
                flex-wrap: wrap
                font-size: 1.4rem
                line-height: 2.2rem
        .match-wrapper
          display: flex
          justify-content: center
          margin-top: 3.8rem
          .match
            border-radius: 30px
            padding: 0.6rem 1rem
            color: $colorWhite
            border: none
            margin-bottom: 1.7rem
            &.green
              background-color: $colorHubbleGreen
            &.gradient
              background: $colorHubbleGradient
            &.grey
              background-color: $colorHubbleGreyIcons
      .title
        font-size: 1.8em
        line-height: 2.2rem
        margin-bottom: 3.1rem
        text-align: center
      .text
        font-family: Lato-semibold
        color: $colorHubbleDarkGrey
        text-align: center
      .buttons
        display: flex
        flex-direction: column
        width: 20.2em
        margin: 4rem auto 2.5rem auto
        button
          padding: 1.3rem 0 1.4rem 0
        button:first-child
          margin-bottom: 0.5rem
</style>