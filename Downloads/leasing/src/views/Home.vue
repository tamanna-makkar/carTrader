<template>
  <transition name="fade">
    <info-popup v-if="showPopup" @closePopup="showPopup = false">
      <template v-slot:header> Toyota Yaris 2020 is saved! </template>
      {{ $t('_infoPopup.viewAndCompare') }}
    </info-popup>
  </transition>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import InfoPopup from '@/components/UI/InfoPopup.vue'
export default defineComponent({
  name: 'Home',
  setup() {
    const showPopup = ref(true)
    return { showPopup }
  },
  components: {
    InfoPopup
  }
})
</script>
<style lang="sass" scoped>
</style>
