<script setup>
const props = defineProps({
  features: {
    type: Array,
  },
});
</script>
<template>
  <div class="mr-10 mt-5 border-b pb-5">
    <div
      class="flex text-lg mt-2"
      v-for="(item, index) in features"
      :key="index"
    >
      <p class="rounded text-lime-800 mr-3">✔</p>
      <p>{{ item }}</p>
    </div>
  </div>
</template>
