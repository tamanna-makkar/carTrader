<template>
   <div v-if="selected"><slot></slot></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Tabs',
  props: {
    selected: {
        type: Boolean,
        default: false
    } 
  }
})
</script>
<style lang="sass" scoped></style>