<template>
  <wizard :key="componentKey" @clickPrev="clickPrev"></wizard>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import wizard from '../components/Step1/wizard.vue'
export default defineComponent({
  components: {
    wizard
  },
  setup() {
    const componentKey = ref(0)
    const clickPrev = () => {
      componentKey.value += 1
    }
    return { clickPrev, componentKey }
  }
})
</script>
<style></style>