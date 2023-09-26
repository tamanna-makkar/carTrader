<template>
  <div class="spinner"></div>
</template>
<style lang="sass" scoped>
.spinner
    @include backgroundImage('loader.svg')
    width: 10em
    height: 5em
    background-size: cover
</style>
