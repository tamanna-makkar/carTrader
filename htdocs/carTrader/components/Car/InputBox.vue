<script setup>
const props = defineProps({
  modelValue: {
    type: String,
  },
});
const emit = defineEmits(["update:modelValue"]);
const model = computed({
  get() {
    return props.modelValue ?? [];
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
<template>
  <input
    :value="modelValue"
    class="border"
    type="text"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
