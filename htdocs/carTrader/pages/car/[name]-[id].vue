<script setup>
const { capitalizeFirstLetter } = useUtilities();
const route = useRoute();
const { getCars } = useCars();
useHead({
  title: `${capitalizeFirstLetter(route.params.name)}`,
});
const getCarById = computed(() => {
  return getCars().find((item) => item.id == route.params.id);
});
// server side error
if (!getCarById.value) {
  throw createError({
    statusCode: 404,
    message: `Car with this ${route.params.id} doesnt exist`,
  });
}
definePageMeta({
  layout: "custom",
});
</script>
<template>
  <div v-if="getCarById">
    <CarDetailsHero :car="getCarById" />
    <CarDetailsAttributes :features="getCarById.features" />
    <CarDetailsDescription :description="getCarById.description" />
    <CarDetailsContact />
  </div>
</template>
