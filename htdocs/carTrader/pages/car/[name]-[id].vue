<script setup>
const { capitalizeFirstLetter } = useUtilities();
const route = useRoute();
useHead({
  title: `${capitalizeFirstLetter(route.params.name)}`,
});
definePageMeta({
  layout: "custom",
});
</script>
<template>
  <div>
    <CarDetailsHero />
    <CarDetailsAttributes />
    <CarDetailsDescription />
    <CarDetailsContact />
  </div>
</template>
