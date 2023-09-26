<script setup>
definePageMeta({
  layout: "custom",
});
</script>
<template>
  <div class="mt-32 flex">
    <NuxtErrorBoundary>
      <CarSideBar />
      <NuxtPage />
      <template #error="{ error }">
        <div class="text-center mx-auto flex flex-col">
          <h1 class="text-5xl text-red-600">Some error</h1>
          <code>{{ error }}</code>
          <button
            class="text-white bg-blue-400 px-10 py-3 rounded mt-3"
            @click="error.value = null"
          >
            Go back
          </button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>
