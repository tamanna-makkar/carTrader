<script setup>
const city = ref("");
const cityError = ref(false);
const checkIfValid = () => {
  cityError.value = false;
  if (!city.value) {
    cityError.value = true;
  }
  if (!cityError.value) {
    return true;
  }
};
const handleSearch = () => {
  if (checkIfValid()) {
    navigateTo(`/city/${city.value}/car`);
  }
};
</script>
<template>
  <div
    class="font-serif w-[1000px] text-2xl rounded-full bg-white flex justify-between overflow-hidden drop-shadow-2xl mx-auto"
  >
    <input
      type="text"
      :class="[
        'py-3 px-5 w-full text-2xl rounded-full focus:outline-none',
        { 'border-red-500 border': cityError },
      ]"
      placeholder="Search by city..."
      v-model="city"
    />
    <button class="bg-sky-500 px-10 text-white" @click="handleSearch">
      Search
    </button>
  </div>
  <p>{{ cityError }}</p>
</template>
