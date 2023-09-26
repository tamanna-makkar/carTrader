<script setup>
const { getCars } = useCars();
</script>
<template>
  <div class="w-full">
    <CarCards v-for="(car, index) in getCars()" :key="index" :car="car" />
  </div>
</template>
