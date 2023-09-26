<template>
  <div class="company-details-wrap" v-if="!loader">
    <div class="left-area">
      <div class="employee-text">
        <span>{{ $t('_companies.companies') }}</span> <span>/</span>
        <h1>{{ $t('_companies.editCompany') }}</h1>
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
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step1')" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][1]"
          :sectionIndex="1"
          @toggleSection="toggleSection"
          id="adjustLeaseRateDetails"
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
              <Button :text="$t('_generalTerms.next')" @onClick="goToNext('step2')" buttonType="dark arrow--right" />
            </div>
          </div>
        </toggleableContent>
        <toggleableContent
          :isSectionOpen="sectionToggleValues['value'][2]"
          :sectionIndex="2"
          @toggleSection="toggleSection"
          id="firstAdminCompanyDetails"
        >
          <template v-slot:header> {{ $t('_companies.contactInfoCompanyAdmin') }} </template>
          <div class="details-inner-wrap">
            <div v-if="Array.isArray(getAllUsers)">
              <div v-for="(user, index) in getAllUsers" :key="index" class="contact-wrap">
                <div>
                  <p>{{ user.name }}</p>
                </div>
                <div>
                  <p>{{ user.email }}</p>
                </div>
                <div>
                  <p>{{ user.phoneNumber }}</p>
                </div>
              </div>
            </div>
            <div class="not-found-section" v-else-if="getAllUsers == 'User was not found in specified company'">
              <h3>{{ $t('_companies.userNotFound') }}</h3>
            </div>
          </div>
        </toggleableContent>
        <!-- <div class="details-inner-wrap" id="companyDetails">
            <h2>{{ $t('_companyDetails.companyDetails') }}</h2>
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
                      <InputElement type="text" :value="companyDetails['name']" name="name" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.companyName`)
                      }}</InputElement>
                      <span class="error-message" v-if="companyDetailsErrors['nameError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement type="text" :value="companyDetails['email']" name="email" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.emaiAddress`)
                      }}</InputElement>
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
                      <InputElement type="text" :value="companyDetails['phoneNumber']" name="phoneNumber" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.phoneNumber`)
                      }}</InputElement>
                      <span class="error-message" v-if="companyDetailsErrors['phoneNumberError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                      <span class="error-message" v-if="companyDetailsErrors['phoneNumberValidationError']">
                        {{ $t('_errorCodes.enterValidPhoneNumber') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement type="text" :value="companyDetails['address']" name="address" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.streetName`)
                      }}</InputElement>
                      <span class="error-message" v-if="companyDetailsErrors['addressError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="half-width">
                      <InputElement type="text" :value="companyDetails['postalCode']" name="postalCode" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.postalCode`)
                      }}</InputElement>
                      <span class="error-message" v-if="companyDetailsErrors['postalCodeError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                    <div class="half-width">
                      <InputElement type="text" :value="companyDetails['city']" name="city" @update:value="onInputCompanyDetails">{{
                        $t(`_companyDetails.city`)
                      }}</InputElement>
                      <span class="error-message" v-if="companyDetailsErrors['cityError']">
                        {{ $t('_errorCodes.requiredError') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="details-inner-wrap">
            <h2>{{ $t('_companies.contactInfoCompanyAdmin') }} </h2>
            <div v-if="Array.isArray(getAllUsers)">
              <div v-for="(user, index) in getAllUsers" :key="index" class="contact-wrap">
                <div>
                  <p>{{ user.name }}</p>
                </div>
                <div>
                  <p>{{ user.email }}</p>
                </div>
                <div>
                  <p>{{ user.phoneNumber }}</p>
                </div>
              </div>
            </div>
            <div class="not-found-section" v-else-if="getAllUsers == 'User was not found in specified company'">
                <h3>{{ $t('_companies.userNotFound') }}</h3>
            </div>
          </div>
          <div class="details-inner-wrap">
            <h2>{{ $t('_companies.adjustLeaseRates') }}</h2>
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
                    </div>
                </div>
                </div>
            </div>    
            </div>
          </div> -->
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
  <!-- <transition name="fade">
    <info-popup v-if="isCompanyUpdated" @closePopup="closePopup">
      <template v-slot:header>{{ $t('_companyDetails.companySaved') }}</template>
    </info-popup>
  </transition> -->
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, reactive, onUnmounted, computed } from 'vue'
import InputElement from '@/components/UI/Input.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import toggleableContent from '@/components/toggleableContent.vue'
import ConvertToCommas from '@/filters/ConvertToCommas'
import Loader from '@/components/UI/Loader.vue'
import { superAdminCompanyActionTypes } from '@/store/superAdminCompany/actions'
import { CompanyActionTypes } from '@/store/company/actions'
import { UsersActionTypes } from '@/store/users/actions'
import { useStore } from '@/store'
import Button from '@/components/UI/Button.vue'
import { MutationTypes } from '@/store/company/mutations'
import { superAdminMutationTypes } from '@/store/superAdminCompany/mutations'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'Home',
  setup() {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const file = ref('')
    const selectedRow = ref()
    const loader = computed(() => store.state.superAdminCompany.loader)
    const companyError = computed(() => store.state.superAdminCompany.companyError)
    const superAdminCompanyId = computed(() => store.state.superAdminCompany.superAdminCompanyId)
    const companyDetailsState = computed(() => store.state.company.getCompanyById)
    const companyLeaseRate = computed(() => store.state.superAdminCompany.companyLeaseRate)
    const getAllUsers = computed(() => store.state.users.getAllUsers)
    const leaseRateError = computed(() => store.state.superAdminCompany.leaseRateError)
    const sectionToggleValues = reactive({ value: [true, true, true] })
    const companyDetailsErrors = reactive({})
    const leaseRateErrors = reactive({})
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
    const getCompanyById = async () => {
      await store.dispatch(CompanyActionTypes.GET_COMPANYBYID, { companyId: route.params.id })
      companyDetails.name = companyDetailsState.value.name
      companyDetails.email = companyDetailsState.value.email
      companyDetails.phoneNumber = companyDetailsState.value.phoneNumber
      companyDetails.address = companyDetailsState.value.address
      companyDetails.postalCode = companyDetailsState.value.postalCode
      companyDetails.city = companyDetailsState.value.city
      if (companyDetailsState.value.logo)
        file.value = `data:${companyDetailsState.value.logoType};base64,${companyDetailsState.value.logo}`
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
    }
    const onColumnInput = (option) => {
      if (option['type'] == 'agreementMail') {
        selectedRow.value = companyDetails.userAgreementCopyEmail
      } else if (option['type'] == 'quotationEmail') {
        selectedRow.value = companyDetails.quotationRequestEmail
      }
      selectedRow.value[option['index']][option.keyName] = option['item']
    }
    const getUserById = async () => {
      await store.dispatch(UsersActionTypes.GET_ALLUSERS, {
        companyId: route.params.id,
        query: { page: 1, withRoles: 2 }
      })
    }
    const getLeaseRate = async () => {
      await store.dispatch(superAdminCompanyActionTypes.GET_COMPANY_LEASERATE, { companyId: route.params.id })
      if (Object.keys(companyLeaseRate.value).length) {
        leaseRateDetails.value.leaserateOperator = companyLeaseRate.value.leaserateOperator
        leaseRateDetails.value.leaserateValue = companyLeaseRate.value.leaserateValue
        leaseRateDetails.value.leaserateType =
          companyLeaseRate.value.leaserateType == '$' ? '€' : companyLeaseRate.value.leaserateType
        leaseRateDetails.value.fuelOperator = companyLeaseRate.value.fuelOperator
        leaseRateDetails.value.fuelValue = companyLeaseRate.value.fuelValue
        leaseRateDetails.value.fuelType = companyLeaseRate.value.fuelType == '$' ? '€' : companyLeaseRate.value.fuelType
        leaseRateDetails.value.months36 = companyLeaseRate.value.months36
        leaseRateDetails.value.months48 = companyLeaseRate.value.months48
        leaseRateDetails.value.months60 = companyLeaseRate.value.months60
        leaseRateDetails.value.biggerTyres = companyLeaseRate.value.biggerTyres
      }
    }
    onMounted(async () => {
      if (route.params.id) {
        await getCompanyById()
        await getUserById()
        await getLeaseRate()
      }
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
      store.dispatch(superAdminCompanyActionTypes.DELETE_COMPANY_LOGO, { companyId: route.params.id })
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
    const scrollToSection = (sectionId) => {
      const element = document.querySelector(`#${sectionId}`) as HTMLElement
      element.scrollIntoView({
        behavior: 'smooth'
      })
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
      let sectionId = ''
      if (!companyDetails.name) {
        companyDetailsErrors['nameError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (!companyDetails.email) {
        companyDetailsErrors['emailError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (companyDetails.email && !validateEmail(companyDetails.email)) {
        companyDetailsErrors['emailValidationError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (!companyDetails.phoneNumber) {
        companyDetailsErrors['phoneNumberError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (companyDetails.phoneNumber && !validatePhoneNumber(companyDetails.phoneNumber)) {
        companyDetailsErrors['phoneNumberValidationError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (!companyDetails.address) {
        companyDetailsErrors['addressError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (!companyDetails.postalCode) {
        companyDetailsErrors['postalCodeError'] = 'required'
        sectionId = 'companyDetails'
      }
      if (!companyDetails.city) {
        companyDetailsErrors['cityError'] = 'required'
        sectionId = 'companyDetails'
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
      } else {
        scrollToSection(sectionId)
      }
    }
    const onInputCompanyDetails = (value, key) => {
      companyDetails[key] = value
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
      return parseFloat(selectedOption.replace(',', '.'))
    }
    const updateLeaseRate = async () => {
      leaseRateDetails.value.leaserateValue = convertToNumber(leaseRateDetails.value.leaserateValue.toString())
      leaseRateDetails.value.leaserateType =
        leaseRateDetails.value.leaserateType == '€' ? '$' : leaseRateDetails.value.leaserateType
      leaseRateDetails.value.fuelValue = convertToNumber(leaseRateDetails.value.fuelValue.toString())
      leaseRateDetails.value.fuelType = leaseRateDetails.value.fuelType == '€' ? '$' : leaseRateDetails.value.fuelType
      leaseRateDetails.value.months36 = convertToNumber(leaseRateDetails.value.months36.toString())
      leaseRateDetails.value.months48 = convertToNumber(leaseRateDetails.value.months48.toString())
      leaseRateDetails.value.months60 = convertToNumber(leaseRateDetails.value.months60.toString())
      leaseRateDetails.value.biggerTyres = convertToNumber(leaseRateDetails.value.biggerTyres.toString())
      store.dispatch(superAdminCompanyActionTypes.UPDATE_COMPANY_LEASERATE, {
        companyId: route.params.id,
        leaseRateId: companyLeaseRate.value.id,
        body: leaseRateDetails.value
      })
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
    const saveCompany = async () => {
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
      await store.dispatch(superAdminCompanyActionTypes.UPDATE_COMPANY, { companyId: route.params.id, body: formData })
    }
    const discardCompany = () => {
      router.push({ name: 'Dashboard' })
    }
    const closePopup = () => {
      store.commit(MutationTypes.SET_ISCOMPANYUPDATED, false)
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
    const goToNext = async (type) => {
      let sectionID = ''
      if (type === 'step1' && validateSections()) {
        await saveCompany()
        if (companyError.value == '') {
          sectionID = 'adjustLeaseRateDetails'
        }
      } else if (type === 'step2' && validateLeaseRate()) {
        await updateLeaseRate()
        if (leaseRateError.value == '') {
          sectionID = 'firstAdminCompanyDetails'
        }
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
    onUnmounted(() => {
      store.commit(superAdminMutationTypes.SET_COMPANY_ERROR, '')
      store.commit(superAdminMutationTypes.SET_USER_ERROR, '')
      store.commit(superAdminMutationTypes.SET_SUPERADMIN_COMPANYID, null)
      store.commit(superAdminMutationTypes.SET_LEASE_RATE_ERROR, '')
      store.commit(superAdminMutationTypes.SET_COMPANY_LEASE_RATE, {})
    })
    return {
      file,
      fileChange,
      removeImage,
      companyDetails,
      loader,
      saveCompany,
      discardCompany,
      onInputCompanyDetails,
      companyDetailsErrors,
      closePopup,
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
      superAdminCompanyId,
      getAllUsers,
      toggleSection,
      sectionToggleValues,
      goToNext,
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
    Dropdown,
    toggleableContent
  }
})
</script>
<style lang="sass" scoped>
.contact-wrap
  display: flex
  flex: 1
  width: 100%
  margin: 0 0 2em 0
  @media screen and (max-width: $mdBreakpoint)
    flex-direction: column
  &:last-child
    margin: 0 0 3em 0
  > div
    flex: 1
    &:nth-child(2)
      flex: 2
    p
      font-size: 16px
.not-found-section
  display: flex
  padding: 0.5em 0 3em
  h3
    font-size: 16px
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
    max-width: 765px
    margin: auto
    width: 100%
    position: relative
    @media screen and (max-width: $xxlBreakpoint)
      margin: 3em auto 0 auto
    .details-inner-wrap
        flex: 1
        margin: 0 0 3em 0
        @media screen and (max-width: $mdBreakpoint)
          padding: 0 2em 3em
    .companies-steps
      display: flex
      flex: 1
      flex-direction: column
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
    padding: 0 3em
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
    .contact-wrap
      display: flex
      flex: 1
      width: 100%
      margin: 0 0 2em 0
      @media screen and (max-width: $mdBreakpoint)
        flex-direction: column
      &:last-child
        margin: 0 0 3em 0
      > div
        flex: 1
        &:nth-child(2)
          flex: 2
        p
          font-size: 16px
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
