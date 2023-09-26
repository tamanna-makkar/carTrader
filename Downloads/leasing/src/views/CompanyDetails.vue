<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="company-details-wrap" v-if="!loader">
    <div class="left-area" v-if="role == 'ROLE_COMPANY_ADMIN' || role == 'ROLE_SUPER_ADMIN'">
      <h1>{{ $t('_companyDetails.companyDetails') }}</h1>
      <div class="save-employee">
        <Button :text="$t('_generalTerms.save')" buttonType="dark" @onClick="saveCompany" />
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardCompany" />
      </div>
    </div>
    <div class="center-area">
      <div class="details-inner-wrap">
        <h2>{{ $t('_companyDetails.companyDetails') }}</h2>
        <div class="company-info-wrap">
          <div class="left-block">
            <div
              v-if="
                roles.includes('ROLE_COMPANY_ADMIN') ||
                roles.includes('ROLE_SUPER_ADMIN') ||
                (roles.includes('ROLE_CLIENT') && file)
              "
              class="left-inner-wrap"
            >
              <div class="logo">
                <input
                  data-v-b16d5354=""
                  type="file"
                  name="logo"
                  @change="fileChange"
                  accept="image/png, image/jpeg, image/jpg"
                  class="input-file"
                  :class="{ 'not-clickable': !isAdmin }"
                />
                <div class="file">
                  <img v-if="file" :src="file" />
                  <span v-else-if="!file">{{ $t('_companyDetails.uploadLogo') }}</span>
                </div>
              </div>
              <div v-if="isAdmin" class="upload-logo">
                <label>
                  {{ $t('_companyDetails.uploadLogo') }}
                  <input type="file" name="upload-logo" @change="fileChange" accept="image/*" />
                </label>
                <label v-if="file" @click="removeImage">{{ $t('_companyDetails.removeLogo') }}</label>
              </div>
              <span class="error-message" v-if="logoError">
                {{ $t(`_errorCodes.${logoError}`) }}
              </span>
            </div>
            <div class="company-info">
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['name']"
                    :readonly="!isAdmin"
                    name="name"
                    @update:value="onInputCompanyDetails"
                    >{{ $t(`_companyDetails.companyName`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['nameError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
                <div class="half-width hide"></div>
              </div>
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['email']"
                    :readonly="!isAdmin"
                    name="email"
                    @update:value="onInputCompanyDetails"
                    >{{ $t(`_companyDetails.contactAddress`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['emailError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                  <span class="error-message" v-if="companyDetailsErrors['emailValidationError']">
                    {{ $t('_errorCodes.enterValidEmailAddress') }}
                  </span>
                </div>
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['phoneNumber']"
                    name="phoneNumber"
                    @update:value="onInputCompanyDetails"
                    :readonly="!isAdmin"
                    >{{ $t(`_companyDetails.phoneNumber`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['phoneNumberError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                  <span class="error-message" v-if="companyDetailsErrors['phoneNumberValidationError']">
                    {{ $t('_errorCodes.enterValidPhoneNumber') }}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['address']"
                    :readonly="!isAdmin"
                    name="address"
                    @update:value="onInputCompanyDetails"
                    >{{ $t(`_companyDetails.streetName`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['addressError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['postalCode']"
                    :readonly="!isAdmin"
                    name="postalCode"
                    @update:value="onInputCompanyDetails"
                    >{{ $t(`_companyDetails.postalCode`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['postalCodeError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    :value="companyDetails['city']"
                    :readonly="!isAdmin"
                    name="city"
                    @update:value="onInputCompanyDetails"
                    >{{ $t(`_companyDetails.city`) }}</InputElement
                  >
                  <span class="error-message" v-if="companyDetailsErrors['cityError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
                <div class="half-width hide"></div>
              </div>
            </div>
          </div>
          <div class="right-block">
            <div class="grey-area">
              <p>
                {{ $t('_companyDetails.companyDetailsInfo') }}
                <a href="#">info@hubblefleet.nl</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="details-inner-wrap">
        <h2>{{ $t('_companyDetails.emaiAddresses') }}</h2>
        <div class="company-info-wrap">
          <div class="left-block">
            <div class="company-info">
              <div class="heading-block">
                <h3>{{ $t('_companyDetails.copyUserAgreement') }}</h3>
                <span class="error-code-message" v-if="companyDetailsErrors['agreementEmailError']">
                  {{ $t('_errorCodes.enterValidEmailAddress') }}
                </span>
              </div>
              <div v-if="companyDetails['userAgreementCopyEmail'].length">
                <div class="row" v-for="(item, index) in companyDetails['userAgreementCopyEmail']" :key="index">
                  <div class="half-width">
                    <InputElement
                      type="text"
                      name="agreementEmail"
                      :value="item['email']"
                      @update:value="
                        onColumnInput({ item: $event, index: index, type: 'agreementMail', keyName: 'email' })
                      "
                    >
                      {{ $t('_companyDetails.emaiAddress') }}
                    </InputElement>
                  </div>
                  <div class="half-width button-wrap">
                    <Button
                      v-if="item['type'] == 'add'"
                      :text="$t('_generalTerms.add')"
                      class="add-button active"
                      buttonType="light add--left"
                      @onClick="addRow({ index: index, type: 'agreementMail' })"
                    />
                    <Button
                      v-else
                      :text="$t('_generalTerms.delete')"
                      class="add-button"
                      buttonType="light close--left"
                      @onClick="deleteRow({ index: index, type: 'agreementMail' })"
                    />
                  </div>
                </div>
              </div>

              <div class="heading-block">
                <h3>{{ $t('_companyDetails.quotationRequest') }}</h3>
                <span class="error-code-message" v-if="companyDetailsErrors['quotationEmailError']">
                  {{ $t('_errorCodes.enterValidEmailAddress') }}
                </span>
              </div>
              <div v-if="companyDetails['quotationRequestEmail'].length">
                <div class="row" v-for="(item, index) in companyDetails['quotationRequestEmail']" :key="index">
                  <div class="half-width">
                    <InputElement
                      type="text"
                      name="quotationEmail"
                      :value="item['email']"
                      @update:value="
                        onColumnInput({ item: $event, index: index, type: 'quotationEmail', keyName: 'email' })
                      "
                    >
                      {{ $t('_companyDetails.emaiAddress') }}
                    </InputElement>
                  </div>
                  <div class="half-width button-wrap">
                    <Button
                      v-if="item['type'] == 'add'"
                      :text="$t('_generalTerms.add')"
                      class="add-button active"
                      buttonType="light add--left"
                      @onClick="addRow({ index: index, type: 'quotationEmail' })"
                    />
                    <Button
                      v-else
                      :text="$t('_generalTerms.delete')"
                      class="add-button"
                      buttonType="light close--left"
                      @onClick="deleteRow({ index: index, type: 'quotationEmail' })"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-block"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
  <transition name="fade">
    <info-popup v-if="isCompanyUpdated" @closePopup="closePopup">
      <template v-slot:header>{{ $t('_companyDetails.companySaved') }}</template>
    </info-popup>
  </transition>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted, reactive, onUnmounted } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Loader from '@/components/UI/Loader.vue'
import { useStore } from '@/store'
import { CompanyActionTypes } from '@/store/company'
import Button from '@/components/UI/Button.vue'
import InfoPopup from '@/components/UI/InfoPopup.vue'
import { MutationTypes } from '@/store/company/mutations'
import { useRouter } from 'vue-router'
import MessageBar from '@/components/UI/MessageBar.vue'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore()
    const router = useRouter()
    const file = ref('')
    const selectedRow = ref()
    const role = computed(() =>
      store.state.auth.currentUser && store.state.auth.currentUser.roles ? store.state.auth.currentUser.roles[0] : ''
    )
    const roles = computed(() => store.state.auth.currentUser?.roles)
    const companyDetailsState = computed(() => store.state.company.getCompanyById)
    const loader = computed(() => store.state.company.loader)
    const isCompanyUpdated = computed(() => store.state.company.isCompanyUpdated)
    const logoError = computed(() => store.state.company.logoError)
    const companyDetailsErrors = reactive({})
    const companyDetails = reactive({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      postalCode: '',
      city: '',
      userAgreementCopyEmail: [],
      quotationRequestEmail: [],
      logo: {}
    })
    const { compId, companyDetailState } = getCompany()
    const initialize = async () => {
      await store.dispatch(CompanyActionTypes.GET_COMPANYBYID, { companyId: compId })
      companyDetails.name = companyDetailsState.value.name
      companyDetails.email = companyDetailsState.value.email
      companyDetails.phoneNumber = companyDetailsState.value.phoneNumber
      companyDetails.address = companyDetailsState.value.address
      companyDetails.postalCode = companyDetailsState.value.postalCode
      companyDetails.city = companyDetailsState.value.city
      if (
        companyDetailsState.value.userAgreementCopyEmail == null ||
        !companyDetailsState.value.userAgreementCopyEmail.length
      ) {
        companyDetails.userAgreementCopyEmail = [{ email: '', type: 'add' }]
      } else {
        companyDetails.userAgreementCopyEmail = companyDetailsState.value.userAgreementCopyEmail.map((item) => {
          return { email: item, type: 'delete' }
        })
        companyDetails.userAgreementCopyEmail.push({ email: '', type: 'add' })
      }

      if (
        companyDetailsState.value.quotationRequestEmail == null ||
        !companyDetailsState.value.quotationRequestEmail.length
      ) {
        companyDetails.quotationRequestEmail = [{ email: '', type: 'add' }]
      } else {
        companyDetails.quotationRequestEmail = companyDetailsState.value.quotationRequestEmail.map((item) => {
          return { email: item, type: 'delete' }
        })
        companyDetails.quotationRequestEmail.push({ email: '', type: 'add' })
      }

      if (companyDetailsState.value.logo)
        file.value = `data:${companyDetailsState.value.logoType};base64,${companyDetailsState.value.logo}`
    }
    onMounted(async () => {
      await initialize()
    })
    const fileChange = (event) => {
      const fileDetails = event.target.files
      companyDetails['logo'] = fileDetails[0]
      file.value = URL.createObjectURL(fileDetails[0])
    }
    const removeImage = () => {
      const blah = document.querySelector('#blah') as HTMLImageElement
      if (blah != null) {
        blah.src = ''
      }
      file.value = ''
      companyDetails['logo'] = {}
      store.dispatch(CompanyActionTypes.DELETE_COMPANYLOGOBYID, { companyId: compId })
      store.commit(MutationTypes.SET_LOGOERROR, '')
      store.state.auth.currentUser.company.logo = ''
      store.state.auth.currentUser.company.logoType = ''
    }
    const validateEmail = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
      return regex.test(value)
    }
    const validatePhoneNumber = (value) => {
      // validate dutch numbers
      const regex = new RegExp(
        '(^[+][0-9]{2}|^[+][0-9]{2}(0)|^([+][0-9]{2})(0)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9-s]{10}$)'
      )
      return regex.test(value)
    }
    const removeType = (type) => {
      const tempEmail = JSON.parse(JSON.stringify(type))
      const emailArr = []
      tempEmail.forEach((item) => {
        if (item.email) emailArr.push(item.email.toString())
      })
      return emailArr
    }
    const validateSections = () => {
      delete companyDetailsErrors['nameError']
      delete companyDetailsErrors['emailError']
      delete companyDetailsErrors['emailValidationError']
      delete companyDetailsErrors['phoneNumberError']
      delete companyDetailsErrors['phoneNumberValidationError']
      delete companyDetailsErrors['addressError']
      delete companyDetailsErrors['postalCodeError']
      delete companyDetailsErrors['cityError']
      delete companyDetailsErrors['agreementEmailError']
      delete companyDetailsErrors['quotationEmailError']

      if (!companyDetails.name) {
        companyDetailsErrors['nameError'] = 'required'
      }
      if (!companyDetails.email) {
        companyDetailsErrors['emailError'] = 'required'
      }
      if (companyDetails.email && !validateEmail(companyDetails.email)) {
        companyDetailsErrors['emailValidationError'] = 'required'
      }
      if (!companyDetails.phoneNumber) {
        companyDetailsErrors['phoneNumberError'] = 'required'
      }
      if (companyDetails.phoneNumber && !validatePhoneNumber(companyDetails.phoneNumber)) {
        companyDetailsErrors['phoneNumberValidationError'] = 'required'
      }
      if (!companyDetails.address) {
        companyDetailsErrors['addressError'] = 'required'
      }
      if (!companyDetails.postalCode) {
        companyDetailsErrors['postalCodeError'] = 'required'
      }
      if (!companyDetails.city) {
        companyDetailsErrors['cityError'] = 'required'
      }
      if (companyDetails.userAgreementCopyEmail.length) {
        const tmpCheck = removeType(companyDetails.userAgreementCopyEmail)
        tmpCheck.forEach((mail) => {
          if (!validateEmail(mail)) companyDetailsErrors['agreementEmailError'] = 'required'
        })
      }
      if (companyDetails.quotationRequestEmail.length) {
        const tmpCheck = removeType(companyDetails.quotationRequestEmail)
        tmpCheck.forEach((mail) => {
          if (!validateEmail(mail)) companyDetailsErrors['quotationEmailError'] = 'required'
        })
      }
      if (Object.getOwnPropertyNames(companyDetailsErrors).length === 0) {
        return true
      }
    }
    const onInputCompanyDetails = (value, key) => {
      companyDetails[key] = value
    }
    const onColumnInput = (option) => {
      if (option['type'] == 'agreementMail') {
        selectedRow.value = companyDetails.userAgreementCopyEmail
      } else if (option['type'] == 'quotationEmail') {
        selectedRow.value = companyDetails.quotationRequestEmail
      }
      selectedRow.value[option['index']][option.keyName] = option['item']
    }
    const saveCompany = async () => {
      if (validateSections()) {
        store.commit(MutationTypes.SET_LOGOERROR, '')
        const formData = new FormData()
        formData.append('name', JSON.stringify(companyDetails.name))
        formData.append('email', JSON.stringify(companyDetails.email))
        formData.append('phoneNumber', JSON.stringify(companyDetails.phoneNumber))
        formData.append('address', JSON.stringify(companyDetails.address))
        formData.append('postalCode', JSON.stringify(companyDetails.postalCode))
        formData.append('city', JSON.stringify(companyDetails.city))
        formData.append('logo', companyDetails.logo as File)
        formData.append('userAgreementCopyEmail', JSON.stringify(removeType(companyDetails.userAgreementCopyEmail)))
        formData.append('quotationRequestEmail', JSON.stringify(removeType(companyDetails.quotationRequestEmail)))
        formData.append('_method', 'PUT')
        await store.dispatch(CompanyActionTypes.UPDATE_COMPANYBYID, { companyId: compId, body: formData })
        await initialize()
        store.state.auth.currentUser.company.logo = companyDetailsState.value.logo
        store.state.auth.currentUser.company.logoType = companyDetailsState.value.logoType
      }
    }
    const discardCompany = () => {
      router.push({ name: 'Employees' })
    }
    const closePopup = () => {
      store.commit(MutationTypes.SET_ISCOMPANYUPDATED, false)
    }
    const isAdmin = computed(() => {
      return roles.value.includes('ROLE_COMPANY_ADMIN') || roles.value.includes('ROLE_SUPER_ADMIN')
    })
    const addRow = (item) => {
      if (item['type'] == 'agreementMail') {
        selectedRow.value = companyDetails.userAgreementCopyEmail
        selectedRow.value.push({
          email: '',
          type: 'add'
        })
      } else if (item['type'] == 'quotationEmail') {
        selectedRow.value = companyDetails.quotationRequestEmail
        selectedRow.value.push({
          email: '',
          type: 'add'
        })
      }
      selectedRow.value[item['index']]['type'] = 'delete'
    }
    const deleteRow = (item) => {
      if (item['type'] == 'agreementMail') {
        selectedRow.value = companyDetails.userAgreementCopyEmail
      } else if (item['type'] == 'quotationEmail') {
        selectedRow.value = companyDetails.quotationRequestEmail
      }
      selectedRow.value.splice(item['index'], 1)
    }
    onUnmounted(() => {
      store.commit(MutationTypes.SET_LOGOERROR, '')
    })
    return {
      file,
      fileChange,
      removeImage,
      role,
      companyDetails,
      loader,
      saveCompany,
      discardCompany,
      onInputCompanyDetails,
      companyDetailsErrors,
      isCompanyUpdated,
      closePopup,
      logoError,
      roles,
      isAdmin,
      companyDetailState,
      onColumnInput,
      addRow,
      deleteRow
    }
  },
  components: {
    InputElement,
    Loader,
    Button,
    InfoPopup,
    MessageBar
  }
})
</script>
<style lang="sass" scoped>
.company-details-wrap
  display: flex
  position: relative
  flex: 1
  @media screen and (max-width: $xxlBreakpoint)
    padding: 0 15px
    flex-direction: column
  h1
    margin: 0 0 0.7em
    @media screen and (max-width: $mdBreakpoint)
      margin: 0.8em
  h1, h2
    color: $colorHubble
  .center-area
    display: flex
    max-width: 968px
    margin: 5em auto 0 auto
    width: 100%
    flex-direction: column
    @media screen and (max-width: $xxlBreakpoint)
      margin: 3em auto 0 auto
  .left-area
    position: absolute
    left: 0
    @media screen and (max-width: $xxlBreakpoint)
      position: relative
      margin: 2em 0 0
    .save-employee
      margin: 2em 0 0
      @media screen and (max-width: $mdBreakpoint - 1)
        button
          font-size: 12px
      button.dark:not(.checked)
        padding: 0.9em 1.4em
      button.light
        padding: 0.9em 1.4em
        margin: 0.7em 0
  .details-inner-wrap
    max-width: 900px
    width: 100%
    margin: 0 auto 3em auto
    padding: 0 3em 2em
    .half-width
      position: relative
    .company-info-wrap
      display: flex
      @media screen and (max-width: $mdBreakpoint)
        flex-direction: column
      .left-block
        display: flex
        flex: 3
        flex-direction: column
        padding-right: 4em
        .left-inner-wrap
          display: flex
          position: relative
          margin: 0 0 4em 0
          @media screen and (max-width: $mdBreakpoint)
            flex-direction: column
            margin: 0 0 2em 0
          .logo
            position: relative
            border: 2px dashed $colorHubbleGreyIcons
            display: flex
            justify-content: center
            border-radius: 5px
            max-width: 320px
            height: 92px
            align-items: center
            width: 100%
            input
              position: absolute
              left: 0
              right: 0
              width: 100%
              height: 100%
              opacity: 0
              cursor: pointer
              top: 0
              &.not-clickable
                pointer-events: none
          .file
            width: 100%
            display: flex
            align-items: center
            justify-content: center
            height: 100%
            img
              object-fit: contain
              max-width: 100%
              max-height: 80px
            span
              font-size: 15px
              color: $colorHubble
              font-family: 'Lato-semibold'
          .upload-logo
            display: flex
            flex-direction: column
            justify-content: center
            margin-left: 3em
            height: 92px
            @media screen and (max-width: $mdBreakpoint)
              margin: 0
            input
              display: none
            label
              font-size: 15px
              color: $colorHubble
              font-family: 'Lato-semibold'
              cursor: pointer
              padding: 4px
        .heading-block
          margin-bottom: 1.5rem
          h3
            font-size: 16px
            line-height: 26px
      .right-block
        flex: 1
    .button-wrap
      .add-button
        margin-top: 10px
      button
        height: 46px
        padding: 0.5em 1.5em
      .add-button.active
        &:before
          background-image: url(~@/assets/dark-plus.svg)
.error-code-message
    color: $colorHubbleRed
    font-size: 12px
</style>
