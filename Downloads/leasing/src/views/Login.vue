<template>
  <div class="main-block" v-if="!loader">
    <div class="login-block white-block" @keyup.enter="logIn" v-if="!showForgetSection && !showResetSuccess">
      <h1>{{ $t('_logIn.logIn') }}</h1>
      <div class="email-block">
        <InputElement type="text" :value="loginCred['username']" @update:value="onInputEmail">{{
          $t('_logIn.email')
        }}</InputElement>
        <span class="error-message" v-if="loginErrors['emailError']">
          {{ $t('_errorCodes.requiredError') }}
        </span>
        <span class="error-message" v-if="loginErrors['emailValidationError']">
          {{ $t('_errorCodes.enterValidEmail') }}
        </span>
      </div>
      <div class="password-block">
        <InputElement type="password" :value="loginCred['password']" @update:value="onInputPassword">{{
          $t('_logIn.password')
        }}</InputElement>
        <span class="error-message" v-if="loginErrors['passwordError']">
          {{ $t('_errorCodes.requiredError') }}
        </span>
        <span v-if="isError == 'Invalid credentials.'" class="error-msg">
          {{ $t('_generalTerms.invalidCred') }}
        </span>
        <span v-else-if="isError == 'Your user account no longer exists.'" class="error-msg">
          {{ $t('_generalTerms.userNotExists') }}
        </span>
      </div>
      <div class="forget-block last-block">
        <span class="forget" @click="goToForgetSection"> {{ $t('_logIn.forgetPassword') }} </span>
        <Button :text="$t('_logIn.logIn')" @onClick="logIn" buttonType="dark arrow--right" />
      </div>
    </div>
    <div class="password-reset-wrap forget-section" @keyup.enter="resetPassword" v-if="showForgetSection && !showResetSuccess">
      <div class="inner-wrap">
        <Button :text="$t('_logIn.backToLogin')" @onClick="backToLogin" buttonType="white arrow--left" />
        <div class="white-block inner-block">
          <h1>{{ $t('_logIn.forgetPassword') }}</h1>
          <p>{{ $t('_logIn.resetPasswordLink') }}</p>
          <div class="email-block">
            <InputElement
              type="text"
              :value="forgetPasswordEmail['email']"
              @update:value="onInputforgetPasswordEmail"
              >{{ $t('_logIn.email') }}</InputElement
            >
            <span class="error-message" v-if="resetPasswordErrors['emailError']">
              {{ $t('_errorCodes.requiredError') }}
            </span>
            <span class="error-message" v-if="resetPasswordErrors['emailValidationError']">
              {{ $t('_errorCodes.enterValidEmail') }}
            </span>
          </div>
          <div class="reset-password last-block">
            <Button :text="$t('_logIn.resetPassword')" @onClick="resetPassword" buttonType="dark arrow--right" />
          </div>
        </div>
      </div>
    </div>
    <div class="password-reset-wrap reset-success-section" v-if="showResetSuccess">
      <div class="inner-wrap">
        <Button :text="$t('_logIn.backToLogin')" @onClick="backToLogin" buttonType="white arrow--left" />
        <div class="white-block inner-block">
          <h1>{{ $t('_logIn.checkInbox') }}</h1>
          <span class="checked-icon"></span>
          <p>{{ $t('_logIn.resetSuccess') }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed, reactive } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Button from '@/components/UI/Button.vue'
import { useStore } from '@/store'
import { MutationTypes } from '@/store/options/mutations'
import { AuthMutationTypes } from '@/store/auth/mutations'
import { AuthActionTypes } from '@/store/auth/actions'
import Loader from '@/components/UI/Loader.vue'
import { useRoute } from 'vue-router'
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
    const loader = computed(() => store.state.auth.loader)
    const isError = computed(() => store.state.auth.isError)
    const route = useRoute()
    const showResetSuccess = computed(() => store.state.auth.showResetSuccess)
    const loginErrors = reactive({})
    const resetPasswordErrors = reactive({})
    const showForgetSection = ref(route.query.forgetPassword == 'true' ? true : false)
    const loginCred = ref({
      username: '',
      password: ''
    })
    const forgetPasswordEmail = ref({ email: '' })
    const onInputEmail = (value) => {
      loginCred.value['username'] = value
    }
    const onInputPassword = (value) => {
      loginCred.value['password'] = value
    }
    const onInputforgetPasswordEmail = (value) => {
      forgetPasswordEmail.value['email'] = value
    }
    const postLogInCred = async () => {
      await store.dispatch(AuthActionTypes.USER_LOGIN, loginCred.value)
      store.commit(MutationTypes.SET_LOGGEDIN, true)
    }
    const validateEmail = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
      return regex.test(value) 
    }
    const validateInputs = () => {
      delete loginErrors['emailError']
      delete loginErrors['emailValidationError']
      delete loginErrors['passwordError']
      if (!loginCred.value.username) {
        loginErrors['emailError'] = 'required'
      }
      if (loginCred.value.username && !validateEmail(loginCred.value.username)) {
        loginErrors['emailValidationError'] = 'required'
      }
      if (!loginCred.value.password) {
        loginErrors['passwordError'] = 'required'
      }
      if (Object.getOwnPropertyNames(loginErrors).length === 0) {
        return true
      }
    }
    const validateResetPassword = () => {
      delete resetPasswordErrors['emailError']
      delete resetPasswordErrors['emailValidationError']
      if (!forgetPasswordEmail.value.email) {
        resetPasswordErrors['emailError'] = 'required'
      }
      if (forgetPasswordEmail.value.email && !validateEmail(forgetPasswordEmail.value.email)) {
        resetPasswordErrors['emailValidationError'] = 'required'
      }
      if (Object.getOwnPropertyNames(resetPasswordErrors).length === 0) {
        return true
      }
    }
    const logIn = () => {
      if (validateInputs()) {
        postLogInCred()
      }
    }
    const backToLogin = () => {
      showForgetSection.value = false
      const query = Object.assign({}, route.query, { forgetPassword: false })
      delete query.forgetPassword
      router.push({query})
      store.commit(AuthMutationTypes.SET_RESETSUCCESS, '')
    }
    const goToForgetSection = () => {
      showForgetSection.value = true
      const query = Object.assign({}, route.query, { forgetPassword: true })
      router.push({query})
    }
    const resetPassword = async () => {
      if (validateResetPassword()) {
        await store.dispatch(AuthActionTypes.FORGET_PASSWORD, { lang: localStorage.getItem('locale') || 'nl', body: forgetPasswordEmail.value })
      }
    }
    onMounted(() => {
      store.commit(MutationTypes.SET_LOGGEDIN, false)
      store.commit(AuthMutationTypes.SET_LOADER, false)
    })
    return {
      showForgetSection,
      loginCred,
      onInputEmail,
      onInputPassword,
      logIn,
      backToLogin,
      forgetPasswordEmail,
      onInputforgetPasswordEmail,
      resetPassword,
      showResetSuccess,
      loader,
      isError,
      validateEmail,
      loginErrors,
      resetPasswordErrors,
      goToForgetSection
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
    margin: 0 0 2.7em
  .password-block
    margin: 0 0 3.2em
  .forget-block
    span
      color: $colorHubble
      font-family: 'Lato-semibold'
      margin-right: 3em
      cursor: pointer
    @media screen and (max-width: $xsBreakpoint)
      justify-content: space-between
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
