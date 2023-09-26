<template>
  <div class="main-wrap">
    <Header />
    <div
      class="inner-wrap main-container"
      :class="{ 'outer-container': $route.name == 'UserProfile', mobile: toggleOpen }"
    >
      <div class="left-section">
        <div class="main-view"><router-view /></div>
        <Footer />
      </div>
      <div v-if="$route.name == 'Step3' || $route.name == 'Step4'" class="right-section"><Sidebar /></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
export default defineComponent({
  name: 'carconfigurator',
  components: {
    Header,
    Footer,
    Sidebar
  },
  setup() {
    const store = useStore()
    const toggleOpen = computed(() => store.state.options.toggleOpen)
    return { toggleOpen }
  }
})
</script>
<style lang="sass">
.main-wrap
  display: flex
  flex-direction: column
  flex: 1
  .inner-wrap.outer-container
    justify-content: flex-end
    .left-section
      width: 84.5%
      flex: initial
      @media screen and (max-width: $xlBreakpoint)
        width: 100%
        flex: 1
  .inner-wrap
    display: flex
    flex-direction: column
    flex: 1
    &.mobile
      overflow: hidden
    .left-section
      display: flex
      flex-direction: column
      flex: 3.5
      justify-content: space-between
      .main-view
        flex: 1
        margin-top: 2.4em
        margin-bottom: 4em
        @media screen and (max-width: $mdBreakpoint - 1px)
          margin: 0
    .right-section
      margin-left: 3.2em
      flex: 1
      justify-content: space-between
      @media screen and (min-width: $mdBreakpoint) and (max-width: $xlBreakpoint)
        flex: 2
      @media screen and (max-width: $mdBreakpoint)
        margin-left: 0
      @media (min-width: $mdBreakpoint) and (max-width: $xlBreakpoint)
        margin-left: 2.3em

@media only screen and (min-width: $mdBreakpoint)
  .main-wrap
    .inner-wrap
      flex-direction: row
      padding: 0 3.4em
      .right-section
        display: flex
        position: relative
</style>
