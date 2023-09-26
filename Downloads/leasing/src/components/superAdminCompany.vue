<template>
  <div class="company-details-wrap" v-if="!loader">
    <div class="left-area">
      <div class="employee-text">
        <span>{{ $t('_companies.companies') }}</span> <span>/</span>
        <h1>{{ $t('_companies.newCompany') }}</h1>
      </div>
      <div class="save-employee">
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardCompany" />
      </div>
    </div>
    <div class="center-area">
      <div class="companies-steps">
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][0]"
          :sectionIndex="0"
          @toggleSection="toggleSection"
          id="companyDetails"
          :showError="Object.getOwnPropertyNames(companyDetailsErrors).length > 0 || companyError != ''"
        >
          <template v-slot:header> {{ $t('_companyDetails.companyDetails') }} </template>
          <div class="details-inner-wrap">
            <div v-if="companyError" class="user-errors">
              <span class="error-message">
                {{ $t(`_errorCodes.${companyError}`) }}
              </span>
            </div>
            <div class="company-info-wrap">
              <div class="left-block">
                <div class="left-inner-wrap">
                  <div class="logo">
                    <input
                      data-v-b16d5354=""
                      type="file"
                      name="logo"
                      @change="fileChange"
                      accept="image/png, image/jpeg, image/jpg"
                      class="input-file"
                    />
                    <div class="file">
                      <img v-if="file" :src="file" />
                      <span v-else-if="!file">{{ $t('_companyDetails.uploadLogo') }}</span>
                    </div>
                  </div>
                  <div class="upload-logo">
                    <label>
                      {{ $t('_companyDetails.uploadLogo') }}
                      <input type="file" name="upload-logo" @change="fileChange" accept="image/*" />
                    </label>
                    <label v-if="file" @click="removeImage">{{ $t('_companyDetails.removeLogo') }}</label>
                  </div>
                </div>
                <div class="company-info">
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['name']"
                        name="name"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.companyName`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['nameError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['email']"
                        name="email"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.emaiAddress`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['emailError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="companyDetailsErrors['emailValidationError']">
                        {{ $t('_errorCodes.enterValidEmailAddress') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['phoneNumber']"
                        name="phoneNumber"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.phoneNumber`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['phoneNumberError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="companyDetailsErrors['phoneNumberValidationError']">
                        {{ $t('_errorCodes.enterValidPhoneNumber') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['address']"
                        name="address"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.streetName`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['addressError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="companyDetailsErrors['addressValidationError']">
                        {{ $t('_errorCodes.enterValidAddress') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['postalCode']"
                        name="postalCode"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.postalCode`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['postalCodeError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="companyDetails['city']"
                        name="city"
                        @update:value="onInputCompanyDetails"
                        >{{ $t(`_companyDetails.city`) }}</InputElement
                      >
                      <span class="error-message" v-if="companyDetailsErrors['cityError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            </div>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step1', 0)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][1]"
          :sectionIndex="1"
          @toggleSection="toggleSection"
          id="adjustLeaseRateDetails"
          :disabled="!superAdminCompanyId"
          :showError="leaseRateError !== ''"
        >
          <template v-slot:header>{{ $t('_companies.adjustLeaseRates') }}</template>
          <div class="details-inner-wrap">
            <div v-if="leaseRateError" class="user-errors">
              <span class="error-message">
                {{ leaseRateError }}
              </span>
            </div>
            <div class="company-info-wrap">
              <div class="left-block">
                <div class="company-info">
                  <div class="row">
                    <div class="half-width lease-rate-block">
                      <label>{{ $t('_companies.leaseRateCorrection') }} </label>
                      <div class="dropdown-block">
                        <Dropdown
                          :items="operatorItems"
                          :selectedOption="leaseRateDetails['value']['leaserateOperator']"
                          @onChange="selectleaseRateOperator"
                        />
                      </div>
                      <div class="input-block">
                        <InputElement
                          type="text"
                          name="leaserateValue"
                          :value="leaseRateDetails['value']['leaserateValue']"
                          @update:value="onUpdateLeaseRateDetails"
                        >
                        </InputElement>
                        <span class="error-message" v-if="leaseRateErrors['leaserateValueError']">
                          {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                        </span>
                      </div>
                      <div class="dropdown-block">
                        <Dropdown
                          :items="typeItems"
                          :selectedOption="leaseRateDetails['value']['leaserateType']"
                          @onChange="selectLeaseRateType"
                        />
                      </div>
                    </div>
                    <div class="half-width lease-rate-block">
                      <label>{{ $t('_companies.fuelAdvanceCorrection') }} </label>
                      <div class="dropdown-block">
                        <Dropdown
                          :items="operatorItems"
                          :selectedOption="leaseRateDetails['value']['fuelOperator']"
                          @onChange="selectfuelOperator"
                        />
                      </div>
                      <div class="input-block">
                        <InputElement
                          type="text"
                          name="fuelValue"
                          :value="leaseRateDetails['value']['fuelValue']"
                          @update:value="onUpdateLeaseRateDetails"
                        >
                        </InputElement>
                        <span class="error-message" v-if="leaseRateErrors['fuelValueError']">
                          {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                        </span>
                      </div>
                      <div class="dropdown-block">
                        <Dropdown
                          :items="typeItems"
                          :selectedOption="leaseRateDetails['value']['fuelType']"
                          @onChange="selectfuelType"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width months-block">
                      <InputElement
                        type="text"
                        name="months36"
                        :value="leaseRateDetails['value']['months36']"
                        @update:value="onUpdateLeaseRateDetails"
                        currencyPlaceholder="%"
                        currencyPlaceholderPosition="right"
                      >
                        {{ $t('_companies.residualFactoryOptions1') }}
                      </InputElement>
                      <span class="error-message" v-if="leaseRateErrors['months36Error']">
                        {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                      </span>
                    </div>
                    <div class="half-width months-block">
                      <InputElement
                        type="text"
                        name="months48"
                        :value="leaseRateDetails['value']['months48']"
                        @update:value="onUpdateLeaseRateDetails"
                        currencyPlaceholder="%"
                        currencyPlaceholderPosition="right"
                      >
                        {{ $t('_companies.residualFactoryOptions2') }}
                      </InputElement>
                      <span class="error-message" v-if="leaseRateErrors['months48Error']">
                        {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width months-block">
                      <InputElement
                        type="text"
                        name="months60"
                        :value="leaseRateDetails['value']['months60']"
                        @update:value="onUpdateLeaseRateDetails"
                        currencyPlaceholder="%"
                        currencyPlaceholderPosition="right"
                      >
                        {{ $t('_companies.residualFactoryOptions3') }}
                      </InputElement>
                      <span class="error-message" v-if="leaseRateErrors['months60Error']">
                        {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                      </span>
                    </div>
                    <div class="half-width months-block">
                      <InputElement
                        type="text"
                        name="biggerTyres"
                        :value="leaseRateDetails['value']['biggerTyres']"
                        @update:value="onUpdateLeaseRateDetails"
                        currencyPlaceholder="€"
                      >
                        {{ $t('_companies.markUpBiggerTypres') }}
                      </InputElement>
                      <span class="error-message" v-if="leaseRateErrors['biggerTyresError']">
                        {{ $t('_errorCodes.onlyFloatAndNumbers') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step2', 1)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][2]"
          :sectionIndex="2"
          @toggleSection="toggleSection"
          id="firstAdminCompanyDetails"
          :showError="Object.getOwnPropertyNames(firstCompanyAdminDetailsErrors).length > 0 || userError != ''"
          :disabled="isCompanyAdminDisabled"
        >
          <template v-slot:header> {{ $t('_companyDetails.addFirstAdmin') }} </template>
          <div class="details-inner-wrap">
            <div v-if="userError" class="user-errors">
              <span class="error-message">
                {{ $t(`_errorCodes.${userError}`) }}
              </span>
            </div>
            <div class="company-info-wrap">
              <div class="left-block">
                <div class="company-info">
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['name']"
                        name="name"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.nameAndSurname`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['nameError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['email']"
                        name="email"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.emaiAddress`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['emailError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['emailValidationError']">
                        {{ $t('_errorCodes.enterValidEmailAddress') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['street']"
                        name="street"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.companyStreetName`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['streetError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['houseNumber']"
                        name="houseNumber"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.houseNumber`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['houseNumberError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['postalCode']"
                        name="postalCode"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.postalCode`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['postalCodeError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['city']"
                        name="city"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.city`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['cityError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement
                        type="text"
                        :value="firstCompanyAdminDetails['phoneNumber']"
                        name="phoneNumber"
                        @update:value="onInputFirstCompanyAdmin"
                        >{{ $t(`_companyDetails.phoneNumber`) }}</InputElement
                      >
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['phoneNumberError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="firstCompanyAdminDetailsErrors['phoneNumberValidationError']">
                        {{ $t('_errorCodes.enterValidPhoneNumber') }}
                      </span>
                    </div>
                    <div class="half-width send-invite-user">
                      <OptionsCheckboxes
                        :id="1"
                        @onCheck="onCheckSendInviteUser"
                        :checked="firstCompanyAdminDetails.sendInvite"
                        :isSuperAdminCheckbox="true"
                      >
                        {{ $t('_companies.sendInviteUser') }}
                      </OptionsCheckboxes>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="next-block">
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step3', 2)" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, onUnmounted, computed } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import OptionsCheckboxes from '@/components/UI/OptionsCheckboxes.vue'
import toggleableContent from '@/components/toggleableContent.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import ConvertToCommas from '@/filters/ConvertToCommas'
import Loader from '@/components/UI/Loader.vue'
import { superAdminCompanyActionTypes } from '@/store/superAdminCompany/actions'
import { useStore } from '@/store'
import Button from '@/components/UI/Button.vue'
import { MutationTypes } from '@/store/company/mutations'
import { superAdminMutationTypes } from '@/store/superAdminCompany/mutations'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore()
    const router = useRouter()
    const file = ref('')
    const selectedRow = ref()
    const loader = computed(() => store.state.superAdminCompany.loader)
    const companyError = computed(() => store.state.superAdminCompany.companyError)
    const userError = computed(() => store.state.superAdminCompany.userError)
    const leaseRateError = computed(() => store.state.superAdminCompany.leaseRateError)
    const superAdminCompanyId = computed(() => store.state.superAdminCompany.superAdminCompanyId)
    const sectionToggleValues = reactive({ value: [true, false, false] })
    const companyDetailsErrors = reactive({})
    const leaseRateErrors = reactive({})
    const isCompanyAdminDisabled = ref(true)
    const firstCompanyAdminDetailsErrors = reactive({})
    const companyDetails = reactive({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      postalCode: '',
      city: '',
      userAgreementCopyEmail: [{ email: '', type: 'add' }],
      quotationRequestEmail: [{ email: '', type: 'add' }],
      logo: {}
    })
    const firstCompanyAdminDetails = reactive({
      name: '',
      email: '',
      userStatus: 'selector available',
      employeeNumber: '',
      roles: [2] as Array<number>,
      street: '',
      postalCode: '',
      city: '',
      phoneNumber: '',
      country: 1,
      incomeTaxPercentage: null,
      houseNumber: '',
      privateUse: 0,
      expectedMileage: 0,
      carPolicy: 0,
      leaseCategory: 0,
      allowedFuelType: [] as Array<string>,
      licensePlate: null,
      leaseValidUntil: null,
      sendInvite: 0
    })
    const leaseRateDetails = reactive({
      value: {
        leaserateOperator: '+',
        leaserateValue: 0,
        leaserateType: '%',
        fuelOperator: '-',
        fuelValue: 0,
        fuelType: '$',
        months36: 0,
        months48: 0,
        months60: 0,
        biggerTyres: 0
      }
    })
    const typeItems = reactive(['%', '€'])
    const operatorItems = reactive(['+', '-'])
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
    }
    const validatePhoneNumber = (value) => {
      // validate dutch numbers
      const regex = new RegExp(
        '(^[+][0-9]{2}|^[+][0-9]{2}(0)|^([+][0-9]{2})(0)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9-s]{10}$)'
      )
      return regex.test(value)
    }
    const validateEmail = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
      return regex.test(value)
    }
    const validateAddress = (value) => {
      // validate address
      const regex = new RegExp('[a-z0-9]+[a-z0-9]')
      return regex.test(value)
    }
    const scrollToSection = (sectionId) => {
      const element = document.querySelector(`#${sectionId}`) as HTMLElement
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
    const onColumnInput = (option) => {
      if (option['type'] == 'agreementMail') {
        selectedRow.value = companyDetails.userAgreementCopyEmail
      } else if (option['type'] == 'quotationEmail') {
        selectedRow.value = companyDetails.quotationRequestEmail
      }
      selectedRow.value[option['index']][option.keyName] = option['item']
    }
    const removeType = (type) => {
      const tempEmail = JSON.parse(JSON.stringify(type))
      const emailArr = []
      tempEmail.forEach((item) => {
        if (item.email) emailArr.push(item.email.toString())
      })
      return emailArr
    }
    const validateFirstCompanyAdmin = () => {
      delete firstCompanyAdminDetailsErrors['nameError']
      delete firstCompanyAdminDetailsErrors['emailError']
      delete firstCompanyAdminDetailsErrors['emailValidationError']
      delete firstCompanyAdminDetailsErrors['streetError']
      delete firstCompanyAdminDetailsErrors['houseNumberError']
      delete firstCompanyAdminDetailsErrors['postalCodeError']
      delete firstCompanyAdminDetailsErrors['cityError']
      delete firstCompanyAdminDetailsErrors['phoneNumberError']
      delete firstCompanyAdminDetailsErrors['phoneNumberValidationError']
      if (!firstCompanyAdminDetails.name) {
        firstCompanyAdminDetailsErrors['nameError'] = 'required'
      }
      if (!firstCompanyAdminDetails.email) {
        firstCompanyAdminDetailsErrors['emailError'] = 'required'
      }
      if (firstCompanyAdminDetails.email && !validateEmail(firstCompanyAdminDetails.email)) {
        firstCompanyAdminDetailsErrors['emailValidationError'] = 'required'
      }
      if (!firstCompanyAdminDetails.street) {
        firstCompanyAdminDetailsErrors['streetError'] = 'required'
      }
      if (!firstCompanyAdminDetails.houseNumber) {
        firstCompanyAdminDetailsErrors['houseNumberError'] = 'required'
      }
      if (!firstCompanyAdminDetails.postalCode) {
        firstCompanyAdminDetailsErrors['postalCodeError'] = 'required'
      }
      if (!firstCompanyAdminDetails.city) {
        firstCompanyAdminDetailsErrors['cityError'] = 'required'
      }
      if (!firstCompanyAdminDetails.phoneNumber) {
        firstCompanyAdminDetailsErrors['phoneNumberError'] = 'required'
      }
      if (firstCompanyAdminDetails.phoneNumber && !validatePhoneNumber(firstCompanyAdminDetails.phoneNumber)) {
        firstCompanyAdminDetailsErrors['phoneNumberValidationError'] = 'required'
      }
      if (Object.getOwnPropertyNames(firstCompanyAdminDetailsErrors).length === 0) {
        return true
      }
    }
    const validateSections = () => {
      delete companyDetailsErrors['nameError']
      delete companyDetailsErrors['emailError']
      delete companyDetailsErrors['emailValidationError']
      delete companyDetailsErrors['phoneNumberError']
      delete companyDetailsErrors['phoneNumberValidationError']
      delete companyDetailsErrors['addressError']
      delete companyDetailsErrors['addressValidationError']
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
      if (companyDetails.address && !validateAddress(companyDetails.address)) {
        companyDetailsErrors['addressValidationError'] = 'required'
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
    const validateFloat = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regex = /^\d+([\,]\d+)*([\.]\d+)?$/gm
      return regex.test(value)
    }
    const validateLeaseRate = () => {
      delete leaseRateErrors['leaserateValueError']
      delete leaseRateErrors['fuelValueError']
      delete leaseRateErrors['months36Error']
      delete leaseRateErrors['months48Error']
      delete leaseRateErrors['months60Error']
      delete leaseRateErrors['biggerTyresError']
      if (leaseRateDetails.value.leaserateValue && !validateFloat(leaseRateDetails.value.leaserateValue)) {
        leaseRateErrors['leaserateValueError'] = 'required'
      }
      if (leaseRateDetails.value.fuelValue && !validateFloat(leaseRateDetails.value.fuelValue)) {
        leaseRateErrors['fuelValueError'] = 'required'
      }
      if (leaseRateDetails.value.months36 && !validateFloat(leaseRateDetails.value.months36)) {
        leaseRateErrors['months36Error'] = 'required'
      }
      if (leaseRateDetails.value.months48 && !validateFloat(leaseRateDetails.value.months48)) {
        leaseRateErrors['months48Error'] = 'required'
      }
      if (leaseRateDetails.value.months60 && !validateFloat(leaseRateDetails.value.months60)) {
        leaseRateErrors['months60Error'] = 'required'
      }
      if (leaseRateDetails.value.biggerTyres && !validateFloat(leaseRateDetails.value.biggerTyres)) {
        leaseRateErrors['biggerTyresError'] = 'required'
      }
      if (Object.getOwnPropertyNames(leaseRateErrors).length === 0) {
        return true
      }
    }
    const onInputCompanyDetails = (value, key) => {
      companyDetails[key] = value
    }
    const onInputFirstCompanyAdmin = (value, key) => {
      firstCompanyAdminDetails[key] = value
    }
    const selectleaseRateOperator = (value) => {
      leaseRateDetails.value['leaserateOperator'] = value
    }
    const selectLeaseRateType = (value) => {
      leaseRateDetails.value['leaserateType'] = value
    }
    const selectfuelOperator = (value) => {
      leaseRateDetails.value['fuelOperator'] = value
    }
    const selectfuelType = (value) => {
      leaseRateDetails.value['fuelType'] = value
    }
    const onUpdateLeaseRateDetails = (value, key) => {
      leaseRateDetails.value[key] = value
    }
    const convertToNumber = (selectedOption) => {
      return parseFloat(selectedOption)
    }
    const addLeaseRates = async () => {
      leaseRateDetails.value.leaserateValue = convertToNumber(leaseRateDetails.value.leaserateValue)
      leaseRateDetails.value.leaserateType =
        leaseRateDetails.value.leaserateType == '€' ? '$' : leaseRateDetails.value.leaserateType
      leaseRateDetails.value.fuelValue = convertToNumber(leaseRateDetails.value.fuelValue)
      leaseRateDetails.value.fuelType = leaseRateDetails.value.fuelType == '€' ? '$' : leaseRateDetails.value.fuelType
      leaseRateDetails.value.months36 = convertToNumber(leaseRateDetails.value.months36)
      leaseRateDetails.value.months48 = convertToNumber(leaseRateDetails.value.months48)
      leaseRateDetails.value.months60 = convertToNumber(leaseRateDetails.value.months60)
      leaseRateDetails.value.biggerTyres = convertToNumber(leaseRateDetails.value.biggerTyres)
      await store.dispatch(superAdminCompanyActionTypes.ADD_COMPANY_LEASERATE, {
        companyId: superAdminCompanyId.value,
        body: leaseRateDetails.value
      })
    }
    const addCompanyAdmin = async () => {
      await store.dispatch(superAdminCompanyActionTypes.ADD_COMPANY_USER, {
        companyId: superAdminCompanyId.value,
        body: firstCompanyAdminDetails,
        lang: localStorage.getItem('locale') || 'nl'
      })
    }
    const saveCompany = async () => {
      const formData = new FormData()
      formData.append('name', JSON.stringify(companyDetails.name))
      formData.append('email', JSON.stringify(companyDetails.email))
      formData.append('phoneNumber', JSON.stringify(companyDetails.phoneNumber))
      formData.append('address', JSON.stringify(companyDetails.address))
      formData.append('postalCode', JSON.stringify(companyDetails.postalCode))
      formData.append('city', JSON.stringify(companyDetails.city))
      formData.append('userAgreementCopyEmail', JSON.stringify(removeType(companyDetails.userAgreementCopyEmail)))
      formData.append('quotationRequestEmail', JSON.stringify(removeType(companyDetails.quotationRequestEmail)))
      formData.append('logo', companyDetails.logo as File)
      await store.dispatch(superAdminCompanyActionTypes.ADD_COMPANY, { body: formData })
    }
    const discardCompany = () => {
      router.push({ name: 'Dashboard' })
    }
    const closePopup = () => {
      store.commit(MutationTypes.SET_ISCOMPANYUPDATED, false)
    }
    onUnmounted(() => {
      store.commit(superAdminMutationTypes.SET_COMPANY_ERROR, '')
      store.commit(superAdminMutationTypes.SET_USER_ERROR, '')
      store.commit(superAdminMutationTypes.SET_SUPERADMIN_COMPANYID, null)
      store.commit(superAdminMutationTypes.SET_LEASE_RATE_ERROR, '')
    })
    const onCheckSendInviteUser = (value) => {
      firstCompanyAdminDetails.sendInvite = value.option.target.checked ? 1 : 0
    }
    const toggleSection = (index) => {
      const closeAllOther = sectionToggleValues.value.map(function (item, itemIndex) {
        if (itemIndex === index) {
          item = !item
        } else {
          item = false
        }
        return item
      })
      sectionToggleValues.value = closeAllOther
    }
    const goToNext = async (type, index) => {
      let sectionID = ''
      if (type === 'step1' && validateSections()) {
        await saveCompany()
        if (superAdminCompanyId.value) {
          sectionToggleValues['value'][index] = false
          sectionToggleValues['value'][index + 1] = true
          sectionID = 'adjustLeaseRateDetails'
        }
      } else if (type === 'step2' && validateLeaseRate()) {
        await addLeaseRates()
        if (leaseRateError.value == '') {
          sectionToggleValues['value'][index] = false
          sectionToggleValues['value'][index + 1] = true
          sectionID = 'firstAdminCompanyDetails'
          isCompanyAdminDisabled.value = false
        }
      } else if (type === 'step3' && validateFirstCompanyAdmin()) {
        await addCompanyAdmin()
      }
      if (sectionID !== '')
        setTimeout(() => {
          scrollToSection(sectionID)
        }, 300)
    }
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
    return {
      file,
      fileChange,
      removeImage,
      companyDetails,
      loader,
      discardCompany,
      onInputCompanyDetails,
      companyDetailsErrors,
      closePopup,
      firstCompanyAdminDetails,
      onInputFirstCompanyAdmin,
      firstCompanyAdminDetailsErrors,
      onCheckSendInviteUser,
      operatorItems,
      leaseRateDetails,
      selectleaseRateOperator,
      onUpdateLeaseRateDetails,
      ConvertToCommas,
      typeItems,
      selectLeaseRateType,
      selectfuelOperator,
      selectfuelType,
      companyError,
      userError,
      sectionToggleValues,
      toggleSection,
      goToNext,
      superAdminCompanyId,
      isCompanyAdminDisabled,
      leaseRateError,
      leaseRateErrors,
      addRow,
      deleteRow,
      onColumnInput
    }
  },
  components: {
    InputElement,
    Loader,
    Button,
    OptionsCheckboxes,
    Dropdown,
    toggleableContent
  }
})
</script>
<style lang="sass" scoped>
.details-inner-wrap .company-info .row .months-block
  @media screen and (max-width: $xsBreakpoint)
    height: 70px
.user-errors
  position: relative
  margin-bottom: 4em
.lease-rate-block
  display: flex
  position: relative
  label
    font-size: 16px
    color: $colorHubbleDarkGrey
    position: absolute
    left: 0
  .dropdown-block
    flex: 1
    align-self: flex-end
    &:last-child
      .dropdown
        margin-right: 0
    .dropdown
      margin-left: 0
  .input-block
    margin-right: 1.5em
    flex: 2
.send-invite-user
  display: flex
  align-items: flex-end
.company-details-wrap
  display: flex
  position: relative
  flex: 1
  @media screen and (max-width: $xxlBreakpoint)
    padding: 0 15px
    flex-direction: column
  h1, h2
    color: $colorHubble
  .center-area
    display: flex
    max-width: 970px
    margin: auto
    width: 100%
    position: relative
    @media screen and (max-width: $xxlBreakpoint)
      margin: 3em auto 0 auto
    .companies-steps
      display: flex
      flex: 1
      flex-direction: column
      background: $colorWhite
      box-shadow: 1px 1px 10px rgba(44, 0, 171, 0.2)
      position: relative
      @media screen and (min-width: $mdBreakpoint)
        margin: 7.5em 0 3em
  .left-area
    position: absolute
    left: 0
    @media screen and (max-width: $xxlBreakpoint)
      position: relative
      margin: 2em 0 0
    .employee-text
      display: flex
      align-items: center
      @media screen and (max-width: $mdBreakpoint - 1)
        h1
          font-size: 14px
      span
        font-family: 'Lato-semibold'
        font-size: 15px
        margin-right: 0.8em
      span, h1
        color: $colorHubble
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
    padding: 4em 12em 0
    background: none
    box-shadow: none
    border-radius: 0
    @media screen and (max-width: $mdBreakpoint)
      padding: 4em 15px 0
    h2
      margin: 1.2em 0 1em 0
    button
      padding: 0.6em 1.4em
    .half-width
      position: relative
    .next-block
      margin: 3.6em 0 5em
      display: flex
      justify-content: center
.company-info-wrap
  display: flex
  @media screen and (max-width: $mdBreakpoint)
    flex-direction: column
  .left-block
    display: flex
    flex: 3
    flex-direction: column
    @media screen and (min-width: $mdBreakpoint)
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
          height: 50px
        input
          display: none
        label
          font-size: 15px
          color: $colorHubble
          font-family: 'Lato-semibold'
          cursor: pointer
          padding: 4px 0
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
