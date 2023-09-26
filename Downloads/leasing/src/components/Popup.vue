<template>
  <teleport to="body">
    <div
      class="warningPopupWrapper"
      id="popup"
      :class="[{ 'centered-popup': centerPopup }, { 'left-popup': setleaseRatePopup }]"
    >
      <div class="warningPopup">
        <div class="gradient"></div>
        <button class="buttonExit" @click="onClick">
          <img src="@/assets/close.svg" class="exit" />
        </button>
        <div class="popup-content">
          <div class="icon">
            <img src="@/assets/warning.svg" />
          </div>
          <slot></slot>
          <div v-if="setIncomeTaxPopup" class="buttons">
            <Button
              :text="$t('_warningPopup.goToMyAccount')"
              @onClick="$emit('goToAccount')"
              buttonType="dark"
            ></Button>
            <Button :text="$t('_warningPopup.skip')" @onClick="onClick" buttonType="transparent" />
          </div>
          <div v-else-if="setleaseRatePopup || discountWarningPopup" class="buttons">
            <Button
              v-if="!CloseButton && !isLoader"
              :text="$t('_step3.okayButton')"
              @onClick="onClick"
              buttonType="dark"
            />
          </div>
          <div v-else class="buttons">
            <Button
              v-if="!CloseButton && !isLoader"
              :text="isStateConflicted ? $t('_step3.okayButton') : $t('_warningPopup.proceed')"
              @onClick="isStateConflicted ? $emit('revertSelectedOptions') : $emit('onProceed')"
              buttonType="dark"
            />
            <Button
              v-if="!isRequiredPopup"
              :text="$t('_warningPopup.cancel')"
              @onClick="onClick"
              buttonType="transparent"
            />
            <Button
              v-if="CloseButton"
              :text="$t('_warningPopup.close')"
              @onClick="$emit('onClose')"
              buttonType="dark"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import Button from '@/components/UI/Button.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    Button
  },
  emits: ['onClick', 'onProceed', 'onClose', 'revertSelectedOptions', 'goToAccount'],
  props: {
    isRequiredPopup: {
      type: Boolean,
      default: false
    },
    CloseButton: {
      type: Boolean,
      default: false
    },
    centerPopup: {
      type: Boolean,
      default: false
    },
    isStateConflicted: {
      type: Boolean,
      default: false
    },
    isLoader: {
      type: Boolean,
      default: false
    },
    setIncomeTaxPopup: {
      type: Boolean,
      default: false
    },
    setleaseRatePopup: {
      type: Boolean,
      default: false
    },
    discountWarningPopup: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const onClick = () => {
      emit('onClick')
    }
    return { onClick }
  }
})
</script>

<style lang="sass" scoped>
.centered-popup
  .warningPopup
    top: auto !important
.warningPopupWrapper
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background-color: rgba(0, 0, 0, 0.4)
  display: flex
  justify-content: center
  align-items: center
  z-index: 4
.warningPopup
  position: absolute
  box-sizing: border-box
  top: 1em
  max-width: 50rem
  width: 95%
  border-radius: 0.5em
  box-shadow: $shadowHubbleDashboard
  background: $colorWhite
  z-index: 11
  margin: auto
  left: 0
  right: 0
  .gradient
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
  .popup-content
    display: flex
    flex-direction: column
    align-items: center
    padding: 0 3.2em
    .icon
      width: 4.5em
      height: 4.5em
      background: $colorHubbleLightPurple
      border-radius: 100%
      margin-bottom: 2em
      margin-top: 3em
      img
        height: 100%
        width: 100%
    .title
      font-size: 1.8em
      line-height: 2.2rem
      margin-bottom: 2.1rem
    .text
      font-family: Lato-semibold
      color: $colorHubbleDarkGrey
      text-align: center
    .buttons
      display: flex
      flex-direction: column
      width: 20.2em
      margin-top: 4em
      margin-bottom: 2.5em
      button
        padding-left: 0
        padding-right: 0
        padding-top: 1.3rem
        padding-bottom: 1.4rem
      button:first-child
        margin-bottom: 0.5rem
.left-popup
  .popup-content
    align-items: normal
    .icon
      margin: auto
      margin-bottom: 2em
      margin-top: 3em
    .buttons
      margin: auto
      margin-bottom: 2.5em
      margin-top: 4em
</style>
