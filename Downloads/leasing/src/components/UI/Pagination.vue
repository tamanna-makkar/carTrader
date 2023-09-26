<template>
  <div class="pagination-wrapper" v-if="totalPages > 1">
    <v-pagination
      v-model="page"
      :pages="totalPages"
      :range-size="1"
      :page-count="totalPages"
      active-color="#DCEDFF"
      @update:modelValue="pageChanged"
      :hideFirstButton="true"
      :hideLastButton="true"
    />
  </div>
</template>

<script>
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { onMounted, ref, computed } from 'vue'
export default {
  props: {
    count: {
      type: Number,
      required: true
    },
    currentPage: {
      required: true
    },
    itemsPerPage: Number
  },
  components: {
    VPagination
  },
  setup(props, { emit }) {
    const page = ref(1)
    const pageChanged = (pageNum) => {
      emit('page-changed', pageNum)
    }
    const totalPages = computed(() => {
      return Math.ceil(props.count / props.itemsPerPage)
    })
    onMounted(() => {
      page.value = parseInt(props.currentPage)
    })
    return { pageChanged, totalPages, page }
  }
}
</script>

<style lang="sass">
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.pagination-wrapper
  display: flex
  justify-content: flex-end
  @media screen and (max-width: $xlBreakpoint)
    justify-content: center
.Pagination
  margin: 3em 0 4em
  li
    display: flex
    align-items: center
    text-align: center
    font-size: 0.8em
    font-weight: 700
    color: $colorHubbleText
    position: relative
    .Page.Page-active
      background-color: transparent !important
      border: none
      color: $colorHubbleDarkGrey
      text-decoration: underline
    .Page
      color: $colorHubble
      font-weight: 600
      margin: 0 4px
      font-family: 'Lato'
    .Control
      background-color: $colorHubbleBackgroundGrey
      border-radius: 100%
      fill: #fff
      margin: 0 3px
      padding: 3px
    .Control-active
      fill: $colorHubble
    &:focus
      outline: none
    &:first-of-type
      .Control

    &:last-of-type
  .active
    a
      color: $colorHubble
      text-decoration: underline
</style>
