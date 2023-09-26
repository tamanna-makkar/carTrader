<script setup>
import InputBox from "~/components/Car/InputBox.vue";

const { capitalizeFirstLetter } = useUtilities();
const route = useRoute();
useHead({
  title: `${
    route.params.make ? capitalizeFirstLetter(route.params.make) : "Cars"
  } in ${route.params.city}`,
});
const name = ref("check");
</script>
<template>
  <div>
    <CarCard />
    <InputBox v-model="name" />
  </div>
</template>
