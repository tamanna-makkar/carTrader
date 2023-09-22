<script setup>
const { capitalizeFirstLetter } = useUtilities();
const route = useRoute();
useHead({
  title: `${
    route.params.make ? capitalizeFirstLetter(route.params.make) : "Cars"
  } in ${route.params.city}`,
});
</script>
<template>
  <div>
    <CarCard />
  </div>
</template>
