<template>
  <div class="error-page">
      <div class="center-block">
        <div class="not-found-image"></div>  
        <h1>{{ $t('_errorCodes.pageDoesnotExist') }}</h1>
        <Button
            :text="$t('_header.backToDashboard')"
            @onClick="goToDashboard"
            class="header_button"
            buttonType="dark arrow--left"
        />
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '@/components/UI/Button.vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter()  
    const goToDashboard = () => {
      router.push({ name: 'Dashboard' })
    }
    return { goToDashboard }
  },
  components: {
    Button  
  }
})
</script>
<style lang="sass" scoped>
.error-page
   display: flex
   align-items: center
   height: 70vh
   @media screen and (max-width: $mdBreakpoint)
     padding: 0 15px
   .center-block
      width: 100%
      text-align: center
      .not-found-image
        display: flex
        width: 226px
        height: 100px
        margin: auto
        background-repeat: no-repeat
        background-image: url(~@/assets/404.svg)
        margin-bottom: 3em
        background-size: 100%
        @media screen and (max-width: $mdBreakpoint)
          width: 100px
          height: 50px
          margin-bottom: 1em
      h1
        font-size: 50px
        color: $colorHubble
        margin-bottom: 1em
        @media screen and (max-width: $mdBreakpoint)
           font-size: 28px 
      button
        margin: auto   
</style>
