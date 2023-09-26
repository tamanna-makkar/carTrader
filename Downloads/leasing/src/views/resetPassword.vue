<template>
  <div class="main-block" v-if="!loader">
    <div class="login-block white-block" @keyup.enter="resetPassword">
      <h1>{{ $t('_logIn.resetPassword') }}</h1>
      <div class="email-block">
        <InputElement type="password" :value="resetPasswordCred['newPassword']" @update:value="onInputNewPassword">{{
          $t('_logIn.newPassword')
        }}</InputElement>
        <span class="error-message" v-if="resetPasswordErrors['newPasswordError']">
          {{ $t('_errorCodes.requiredError') }}
        </span>
        <span v-else-if="resetPasswordErrors['invalidPasswordError']" class="error-message invalid-password">
          {{ $t('_errorCodes.invalidPassword') }}
        </span>
      </div>
      <div class="password-block">
        <InputElement type="password" :value="resetPasswordCred['confirmPassword']" @update:value="onInputRepeatNewPassword">{{
          $t('_logIn.repeatNewPassword')
        }}</InputElement>
        <span class="error-message" v-if="resetPasswordErrors['confirmPasswordError']">
          {{ $t('_errorCodes.requiredError') }}
        </span>
        <span v-else-if="resetPasswordErrors['confirmPasswordSameError']" class="error-message">
          {{ $t('_errorCodes.sameConfirmPassword') }}
        </span>
        <span v-else-if="resetPasswordError == 'User Not Found'" class="error-message">
          {{ $t(`_errorCodes.${resetPasswordError}`) }}
        </span>
        <span v-else-if="resetPasswordError == 'Token Expired'" class="error-message">
          {{ $t('_errorCodes.resetTokenExpired') }}
          <span @click="goToForgetPassword">{{ $t('_errorCodes.generateNewLink') }}</span>
        </span>
      </div>
      <div class="forget-block last-block">
        <Button :text="$t('_logIn.reset')" @onClick="resetPassword" buttonType="dark arrow--right" />
      </div>
    </div> 
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, reactive } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Button from '@/components/UI/Button.vue'
import { useStore } from '@/store'
import { AuthActionTypes } from '@/store/auth'
import { useRoute } from 'vue-router'
import Loader from '@/components/UI/Loader.vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Home',
  components: {
    InputElement,
    Button,
    Loader
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loader = computed(() => store.state.auth.loader)
    const resetPasswordError = computed(() => store.state.auth.resetPasswordError)
    const resetPasswordCred = ref({
      newPassword: '',
      confirmPassword: ''
    })
    const resetPasswordErrors = reactive({})
    const forgetPasswordEmail = ref({ email: '' })
    const onInputNewPassword = (value) => {
      resetPasswordCred.value['newPassword'] = value
    }
    const onInputRepeatNewPassword = (value) => {
      resetPasswordCred.value['confirmPassword'] = value
    }
    const validateInputs = () => {
      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      delete resetPasswordErrors['newPasswordError']
      delete resetPasswordErrors['confirmPasswordError']
      delete resetPasswordErrors['confirmPasswordSameError']
      delete resetPasswordErrors['invalidPasswordError']
      if (!resetPasswordCred.value.newPassword) {
        resetPasswordErrors['newPasswordError'] = 'required'
      }
      if (!regex.test(resetPasswordCred.value.newPassword)) {
        resetPasswordErrors['invalidPasswordError'] = true
      }
      if (!resetPasswordCred.value.confirmPassword) {
        resetPasswordErrors['confirmPasswordError'] = 'required'
      }
      if (resetPasswordCred.value.newPassword !== resetPasswordCred.value.confirmPassword) {
        resetPasswordErrors['confirmPasswordSameError'] = true
      }
      if (Object.getOwnPropertyNames(resetPasswordErrors).length === 0) {
        return true
      }
    }
    const resetPassword = () => {
      if (validateInputs()) {
        store.dispatch(AuthActionTypes.RESET_PASSWORD, {body: resetPasswordCred.value, email: route.params.email, activationKey: route.params.activationKey})
      }
    }
    const goToForgetPassword = () => {
      const query = Object.assign({}, route.query, { forgetPassword: true })
      router.push({name: 'login', query})
    }
    return {
      resetPasswordCred,
      onInputNewPassword,
      onInputRepeatNewPassword,
      forgetPasswordEmail,
      resetPassword,
      loader,
      resetPasswordErrors,
      resetPasswordError,
      goToForgetPassword
    }
  }
})
</script>
<style lang="sass" scoped>
.main-block
  @media screen and (max-width: $mdBreakpoint)
    padding: 0 15px  
  .error-msg
    color: $colorHubbleRed
    font-size: 14px
    display: flex
    display: flex
    margin: 0.5em 0
    line-height: normal
    margin-top: 8px
    @media screen and (min-width: $xsBreakpoint + 1)
      width: 70%
  .error-message
    line-height: normal
    margin-top: 8px
    span
     color: $colorHubbleRed
     font-size: 12px
     cursor: pointer   
.white-block
  display: flex
  flex-direction: column
  max-width: 436px
  background: $colorWhite
  padding: 0 3.1em 5em
  border-radius: 5px
  box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
  h1
    color: $colorHubble
    text-align: center
  .last-block
    display: flex
    align-items: center
    justify-content: flex-end
.login-block
  margin: 5em auto 0
  h1
    margin: 1.2em 0 1em
  .email-block, .password-block
    height: 52px
    position: relative
  .email-block
    margin: 0 0 4em
    @media screen and (max-width: $xsBreakpoint)
      margin: 0 0 6em
  .password-block
    margin: 0 0 3.2em
  .forget-block
    span
      color: $colorHubble
      font-family: 'Lato-semibold'
      margin-right: 3em
      cursor: pointer
      span
        font-size: 13px
        margin-right: 0
        button
          font-size: 13px
.password-reset-wrap
  display: flex
  justify-content: center
  margin: 5em 0 0
  @media only screen and (max-width: $lgBreakpoint)
    margin: 2.1em 0 0
  .inner-wrap
    margin: auto
    justify-content: center
    padding: 0
    @media screen and (min-width: $lgBreakpoint)
      max-width: 865px
      width: 100%
      position: relative
    @media only screen and (max-width: $lgBreakpoint)
      flex-direction: column
      flex: initial
      h1
        font-size: 22px
  button.white
    max-height: 40px
    margin: 0 2.1em 0 0
    max-width: 160px
    @media screen and (max-width: $lgBreakpoint)
      margin: 0 0 1.2em
    @media screen and (min-width: $lgBreakpoint)
      position: absolute
      left: 0
  .inner-block
    padding: 3em 3.1em 7em
    h1
      margin-bottom: 0.5em
    p
      color: $colorHubbleDarkGrey
      font-size: 14px
      text-align: center
      line-height: 22px
    .email-block
      height: 52px
      margin: 2.5em 0 3.2em
      position: relative
.reset-success-section
  .inner-block
    padding: 3em 3.1em 9em
    span.checked-icon
      @include backgroundImage('bg-checkmark.svg')
      width: 44px
      height: 44px
      margin: 1em auto 2em
</style>