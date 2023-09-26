<template>
  <Button :text="textToShow ? textToShow : $t('_generalTerms.Back')" @onClick="$emit('onBack')" class="header_button" buttonType="light arrow--left" />
</template>
<script lang="ts">
import Button from '@/components/UI/Button.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    Button
  },
  props: {
    textToShow: {
      type: String,
    }
  }
})
</script>
<style lang="sass" scoped></style>