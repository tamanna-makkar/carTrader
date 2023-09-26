<template>
  <MessageBar v-if="savedRoles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="employee-wrap" v-if="!userByIdLoader">
    <div class="left-area">
      <div class="employee-text">
        <span>{{ $t('_employees.employee') }}</span> <span>/</span>
        <h1>{{ getBreadCrumbTitle() }}</h1>
      </div>
      <div class="save-employee">
        <Button :text="$t('_generalTerms.save')" buttonType="dark" @onClick="saveUser" />
        <Button :text="$t('_generalTerms.cancel')" buttonType="light" @onClick="discardUser" />
        <Button
          v-if="route.params.id && !employeeDetails.deletedAt"
          :text="$t('_generalTerms.delete')"
          buttonType="light delete-button"
          @onClick="deleteUser"
        />
        <Button
          v-if="route.params.id && employeeDetails.deletedAt"
          :text="$t('_generalTerms.restore')"
          buttonType="light delete-button"
          @onClick="restoreUser"
        />
      </div>
      <div class="left-message" v-if="route.params.id && employeeDetails.deletedAt">
        <div>{{ $t('_employees.deleteMsg') }} :</div>
        <div>{{ dateFormat(employeeDetails.deletedAt['date']) }}</div>
      </div>
    </div>
    <div class="center-area">
      <div class="details-inner-wrap" id="accountDetails">
        <div class="error-block" v-if="deleteUserResponse">
          <span>{{ $t(`_employees.${deleteUserResponse}`) }}*</span>
        </div>
        <h2>
          {{ $t('_employees.accountDetails') }}
        </h2>
        <div v-if="userError" class="user-errors">
          <span v-if="userError == 'Not a valid user'" class="error-message">
            {{ employeeDetails['name'] }} {{ $t(`_errorCodes.notValidUser`) }}
          </span>
          <span v-else class="error-message">
            {{ $t(`_errorCodes.${userError}`) }}
          </span>
        </div>
        <div class="employee-sub-wrap">
          <div class="row">
            <div class="employee-sub-wrap">
              <div class="row">
                <div class="half-width">
                  <InputElement
                    type="text"
                    name="name"
                    :value="employeeDetails['name']"
                    @update:value="onInputEmployeeDetails"
                    >{{ $t(`_employees.nameAndSurname`) }}</InputElement
                  >
                  <span class="error-message" v-if="employeeDetailsErrors['nameError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
                <div class="half-width">
                  <InputElement
                    type="text"
                    name="email"
                    :value="employeeDetails['email']"
                    @update:value="onInputEmployeeDetails"
                    >{{ $t(`_employees.emailAddress`) }}</InputElement
                  >
                  <span class="error-message" v-if="employeeDetailsErrors['emailError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                  <span class="error-message" v-if="employeeDetailsErrors['emailValidationError']">
                    {{ $t('_errorCodes.enterValidEmailAddress') }}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="half-width">
                  <label>{{ $t('_employees.userStatus') }}</label>
                  <Dropdown
                    type="employee status-dropdown"
                    :items="statusItems"
                    :selectedOption="$t(`_employees.${employeeDetails['userStatus']}`)"
                    @onChange="selectStatus"
                  />
                </div>
                <div class="half-width">
                  <InputElement
                    type="text"
                    name="employeeNumber"
                    :value="employeeDetails['employeeNumber']"
                    @update:value="onInputEmployeeDetails"
                    >{{ $t(`_employees.employeeNumber`) }}</InputElement
                  >
                </div>
              </div>
              <div class="row user-roles">
                <div class="half-width">
                  <label>{{ $t('_employees.userRole') }}</label>
                  <Dropdown
                    type="employee roles-dropdown"
                    :employeesItems="getUserRoles()"
                    :selectedOption="$t('_employees.selectRole')"
                    @onChange="selectRole"
                  />
                  <span class="error-message" v-if="employeeDetailsErrors['rolesError']">
                    {{ $t('_errorCodes.requiredError') }}
                  </span>
                </div>
                <div class="half-width send-invite-user" v-if="!route.params.id">
                  <OptionsCheckboxes
                    :id="1"
                    @onCheck="onCheckSendInviteUser"
                    :checked="employeeDetails.sendInvite"
                    :isSuperAdminCheckbox="true"
                  >
                    {{ $t('_companies.sendInviteUser') }}
                  </OptionsCheckboxes>
                </div>
              </div>
              <div class="row">
                <div class="selected-dropdown-items">
                  <ul>
                    <li v-for="(item, index) in userRolesArray.value" :key="index">
                      {{ $t(`_employees.${item['title']}`) }}
                      <span class="remove-icon" @click="removeUserRole(item, index)"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-inner-wrap contact-info" id="contactDetails">
        <h2>{{ $t('_DriverAccount.contactInfo') }}</h2>
        <div class="employee-sub-wrap">
          <div class="row">
            <div class="half-width">
              <InputElement
                type="text"
                name="street"
                :value="employeeDetails['street']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.streetName`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['streetError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
            <div class="half-width">
              <InputElement
                type="text"
                name="houseNumber"
                :value="employeeDetails['houseNumber']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.houseNumber`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['houseNumberError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
          </div>
          <div class="row">
            <div class="half-width">
              <InputElement
                type="text"
                name="postalCode"
                :value="employeeDetails['postalCode']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.postalCode`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['postalCodeError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
            <div class="half-width">
              <InputElement
                type="text"
                name="city"
                :value="employeeDetails['city']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.city`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['cityError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
          </div>
          <div class="row">
            <div class="half-width">
              <InputElement
                type="text"
                name="phoneNumber"
                :value="employeeDetails['phoneNumber']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.phoneNumber`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['phoneNumberError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
              <span class="error-message" v-if="employeeDetailsErrors['phoneNumberValidationError']">
                {{ $t('_errorCodes.enterValidPhoneNumber') }}
              </span>
            </div>
            <div class="half-width hide"></div>
          </div>
        </div>
      </div>
      <div
        class="details-inner-wrap car-policy-section"
        id="carPolicyDetails"
        v-if="employeeDetails['roles'].includes(4)"
      >
        <h2>{{ $t('_DriverAccount.carPolicy') }}</h2>
        <div class="employee-sub-wrap">
          <div class="row">
            <div class="half-width" v-if="typeof carPolicies !== 'string' && carPolicies.length">
              <Dropdown
                type="employee car-policy-dropdown"
                :employeesItems="getAllCarPolicies"
                :selectedOption="selectedCarPolicy"
                @onChange="selectCarPolicy"
              />
              <span class="error-message" v-if="employeeDetailsErrors['carPolicyError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
            <div class="half-width" v-else>
              <InputElement
                type="text"
                name="carPolicy"
                :value="$t('_employees.noCarPolicyFound')"
                :readonly="true"
              ></InputElement>
            </div>
            <div class="half-width" v-if="typeof leaseCategories !== 'string' && leaseCategories.length">
              <Dropdown
                type="employee lease-category-dropdown"
                :employeesItems="getAllLeaseCategories"
                :selectedOption="selectedLeaseCategory"
                @onChange="selectLeaseCategory"
              />
              <span class="error-message" v-if="employeeDetailsErrors['leaseCategoryError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
            <div class="half-width" v-else>
              <InputElement
                type="text"
                name="leaseCategory"
                :value="$t('_employees.noLeaseCategorieFound')"
                :readonly="true"
              ></InputElement>
            </div>
          </div>
          <div class="row">
            <div class="half-width">
              <label>{{ $t('_DriverAccount.expectedMileage') }}</label>
              <Dropdown
                type="employee mileage-dropdown"
                :items="MileageRange"
                :selectedOption="
                  employeeDetails['expectedMileage']
                    ? employeeDetails['expectedMileage'] + ' km'
                    : employeeDetails['expectedMileage']
                "
                @onChange="selectMileageRange"
              />
            </div>
            <div class="half-width hide"></div>
          </div>
          <div v-if="employeeDetails['carPolicy'] && getFuelTypes" class="row allowed-fuel-type">
            <label>
              {{ $t('_employees.allowedFuelTypes') }}
            </label>
            <div class="checkboxes-block">
              <div v-for="(item, index) in fuelTypeCheckboxes" :key="index">
                <Checkbox
                  :item="item"
                  :isChecked="item.isActive"
                  @onCheck="onCheck($event, item['title'])"
                  :forEmployee="true"
                >
                  {{ $t(item['value']) }}
                </Checkbox>
              </div>
              <span class="error-message" v-if="employeeDetailsErrors['allowedFuelTypeError']">
                {{ $t('_errorCodes.requiredError') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="details-inner-wrap" id="leaseCarDetails">
        <h2>{{ $t('_DriverAccount.leaseCar') }}</h2>
        <div class="employee-sub-wrap">
          <div class="row">
            <div class="half-width">
              <InputElement
                type="date"
                name="leaseValidUntil"
                :value="employeeDetails['leaseValidUntil']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.currentLeaseEndDate`) }}</InputElement
              >
            </div>
            <div class="half-width">
              <InputElement
                type="text"
                name="licensePlate"
                :value="employeeDetails['licensePlate']"
                @update:value="onInputEmployeeDetails"
                >{{ $t(`_DriverAccount.numberPlate`) }}</InputElement
              >
              <span class="error-message" v-if="employeeDetailsErrors['licensePlateError']">
                {{ $t('_errorCodes.licenceError') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="details-inner-wrap" v-if="Object.keys(currentCar).length > 0">
        <h2>{{ $t('_DriverAccount.orderedCar') }}</h2>
        <div class="inner-details" v-if="currentCar['netMonthlyCost'] || employeeDetails['leaseValidUntil']">
          <div v-if="currentCar['vehicleDetails']" class="col">
            <h3>{{ currentCar['vehicleDetails']['local_make_name_128'] }}</h3>
            <p>
              {{ currentCar['vehicleDetails']['local_model_name_129'] }}
              {{ currentCar['vehicleDetails']['local_version_name_131'] }}
            </p>
          </div>
          <div class="col">
            <label>{{ $t('_userDashboard.netCostPerMonth') }}</label>
            <span>{{ currentCar['netMonthlyCost'] ? formatCurrency(currentCar['netMonthlyCost']) : '-' }}</span>
          </div>
          <div class="col">
            <label>{{ $t('_userDashboard.leaseValid') }}</label>
            <span>{{ employeeDetails['leaseValidUntil'] ? employeeDetails['leaseValidUntil'] : '-' }}</span>
          </div>
        </div>
        <span class="view-ordered-car" @click="downloadCarOrderedPdf">
          {{ $t('_DriverAccount.downloadCarOrdered') }}
        </span>
      </div>
    </div>
  </div>
  <div v-else class="loader-block">
    <Loader />
  </div>
  <Popup v-if="showPopup" @onClick="closePopup" @onProceed="onProceed">
    <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
    <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
  </Popup>
  <Popup v-if="restore" @onClick="closePopup" @onProceed="onProceedRestore">
    <div class="title h3">{{ $t('_warningPopup.confirmRestore') }}</div>
  </Popup>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { MutationTypes } from '@/store/users/mutations'
import Button from '@/components/UI/Button.vue'
import InputElement from '@/components/UI/Input.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Dropdown from '@/components/UI/Dropdown.vue'
import MessageBar from '@/components/UI/MessageBar.vue'
import Popup from '@/components/Popup.vue'
import { carPolicyActionTypes } from '@/store/carPolicy/actions'
import { AuthActionTypes } from '@/store/auth/actions'
import { leaseActionTypes } from '@/store/leaseCategories/actions'
import { UsersActionTypes } from '@/store/users/actions'
import { ActionTypes } from '@/store/options/actions'
import { VueCookieNext } from 'vue-cookie-next'
import Checkbox from '@/components/UI/Checkbox.vue'
import { useStore } from '@/store'
import CurrencyFormat from '@/filters/CurrencyFormat'
import Loader from '@/components/UI/Loader.vue'
import router from '@/router'
import { createEmployeeResponseType } from '@/types'
import formatCurrency from '@/filters/CurrencyFormat'
import _ from 'lodash'
import { USER_STATUS } from '@/composables/staticValues'
import OptionsCheckboxes from '@/components/UI/OptionsCheckboxes.vue'
import getCompany from '@/mixins/getCompany'
export default defineComponent({
  components: {
    Button,
    InputElement,
    Dropdown,
    MessageBar,
    Checkbox,
    Loader,
    Popup,
    OptionsCheckboxes
  },
  name: 'Employee',
  setup() {
    const route = useRoute()
    const store = useStore()
    const showPopup = ref(false)
    const restore = ref(false)
    const { t, locale } = useI18n({ useScope: 'global' })
    const carPolicies = computed(() => store.state.carPolicy.getAllCarPolicies)
    const leaseCategories = computed(() => store.state.leaseCategories.allLeaseCategories)
    const userByIdLoader = computed(() => store.state.users.userByIdLoader)
    const deleteUserResponse = computed(() => store.state.users.deleteUserResponse)
    const userError = computed(() => store.state.users.userError)
    const isUserUpdated = computed(() => store.state.users.isUserUpdated)
    const currentCar = computed(() => store.state.users.orderedCar)
    const { compId, companyDetailState } = getCompany()
    const getAllCarPolicies = computed(() =>
      store.state.carPolicy.getAllCarPolicies.map((item) => {
        return { title: item.policyTitle, id: item.id }
      })
    )
    const getAllLeaseCategories = computed(() =>
      store.state.leaseCategories.allLeaseCategories.map((item) => {
        return { title: item.title, amount: item.amount, id: item.id }
      })
    )
    const getFuelTypes = computed(() => store.state.auth.carPolicyByID.fuelType?.map((item) => item.title))
    const userById = computed(() => store.state.users.userById)
    const currentUserName = computed(() => store.state.auth.currentUser.name)
    const selectedCarPolicy = ref(t('_employees.carPolicy'))
    const userRolesArray: { value: { title: string; id: number }[] } = reactive({ value: [] })
    const savedRoles = ref(JSON.parse(VueCookieNext.getCookie('roles')))
    const getUserRoles = () => {
      let userRoles
      if (savedRoles.value.includes('ROLE_COMPANY_ADMIN')) {
        userRoles = [
          {
            title: 'Company admin',
            id: 2
          },
          {
            title: 'Client',
            id: 3
          },
          {
            title: 'Employee',
            id: 4
          }
        ]
      } else if (savedRoles.value.includes('ROLE_CLIENT')) {
        userRoles = [
          {
            title: 'Client',
            id: 3
          },
          {
            title: 'Employee',
            id: 4
          }
        ]
      } else if (savedRoles.value.includes('ROLE_SUPER_ADMIN')) {
        userRoles = [
          {
            title: 'Company admin',
            id: 2
          },
          {
            title: 'Client',
            id: 3
          },
          {
            title: 'Employee',
            id: 4
          }
        ]
      }
      if (savedRoles.value.includes('ROLE_EMPLOYEE')) {
        userRoles = [
          {
            title: 'Company admin',
            id: 2
          },
          {
            title: 'Client',
            id: 3
          },
          {
            title: 'Employee',
            id: 4
          }
        ]
      }
      return userRoles
    }
    const employeeDetails: createEmployeeResponseType = reactive({
      name: '',
      email: '',
      userStatus: 'selector available',
      employeeNumber: '',
      roles: [] as Array<number>,
      street: '',
      postalCode: '',
      city: '',
      phoneNumber: '',
      country: 1,
      incomeTax: null,
      houseNumber: '',
      privateUse: false,
      expectedMileage: 30000,
      carPolicy: 0,
      leaseCategory: 0,
      allowedFuelType: [] as Array<string>,
      licensePlate: null,
      leaseValidUntil: null,
      sendInvite: 0,
      deletedAt: null
    })
    const employeeDetailsErrors = reactive({})
    const initializeDropdownsRequests = async () => {
      await store.dispatch(carPolicyActionTypes.GET_ALLPOLICIES, { companyId: compId })
      await store.dispatch(leaseActionTypes.GET_ALLCATEGORIES, { companyId: compId })
    }
    const getBreadCrumbTitle = () => {
      let title = t('_employees.newEmployee')
      if (route.params.id) {
        title = t('_employees.editEmployee')
      }
      return title
    }
    const fuelTypeCheckboxes = reactive([
      {
        id: 'step2-styled-checkbox1',
        value: '_wizard.step2.Petrol',
        isActive: false,
        range: false,
        wizardInfo: false,
        title: 'petrol',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox2',
        value: '_wizard.step2.Diesel',
        isActive: false,
        range: false,
        wizardInfo: false,
        title: 'diesel',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox3',
        value: '_wizard.step2.Electric',
        desc: 'An electric vehicle',
        isActive: false,
        range: true,
        wizardInfo: false,
        sidebarFilter: true,
        title: 'electric',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox4',
        value: '_wizard.step2.PlugInHybrid',
        desc:
          'A plug-in hybrid electric vehicle is a hybrid electric vehicle whose battery can be recharged by plugging it into an external source of electric power, as well as by its on-board engine and generator.',
        isActive: false,
        range: true,
        wizardInfo: false,
        sidebarFilter: true,
        title: 'plug_in_hybrid',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox5',
        value: '_wizard.step2.Hybrid',
        desc: 'A hybrid vehicle',
        isActive: false,
        range: false,
        wizardInfo: false,
        title: 'hybrid',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox6',
        value: '_wizard.step2.Hydrogen',
        desc: 'A Hydrogen vehicle',
        isActive: false,
        range: false,
        wizardInfo: false,
        title: 'hydrogen',
        isDisabled: false
      },
      {
        id: 'step2-styled-checkbox7',
        value: '_wizard.step2.Other',
        desc: 'Other vehicle',
        isActive: false,
        range: false,
        wizardInfo: false,
        title: 'other',
        isDisabled: false
      }
    ])
    const checkAndDisableFuelTypes = () => {
      fuelTypeCheckboxes.forEach((item) => {
        item.isActive = false
        item.isDisabled = false
        if (getFuelTypes.value.includes(item.title)) {
          item.isActive = true
        } else {
          item.isDisabled = true
        }
      })
    }
    const getCarPolicyByID = async (carPolicyId) => {
      await store.dispatch(AuthActionTypes.GET_CARPOLICY_BY_ID, {
        companyId: compId,
        carPolicyId: carPolicyId
      })
      checkAndDisableFuelTypes()
    }
    const convertToNumber = (selectedOption) => {
      return parseInt(selectedOption.replace(/[kmmonths<>]/g, ''))
    }
    const selectedLeaseCategory = ref(t('_employees.leaseCategory'))
    watch(
      () => _.cloneDeep(locale.value),
      () => {
        if (selectedCarPolicy.value === 'Car policy' || selectedCarPolicy.value == 'Autobeleid') {
          selectedCarPolicy.value = t('_employees.carPolicy')
        }
        if (selectedLeaseCategory.value === 'Lease category' || selectedLeaseCategory.value == 'Lease categorie') {
          selectedLeaseCategory.value = t('_employees.leaseCategory')
        }
      }
    )
    const selectedRole = ref('Select a role')
    const onInputEmployeeDetails = (value, key) => {
      employeeDetails[key] = value
      if (key == 'licensePlate') {
        employeeDetails[key] = value.replace(/-|\s/g, '')
      }
    }
    const MileageRange = reactive([
      '5000 km',
      '10000 km',
      '15000 km',
      '20000 km',
      '25000 km',
      '30000 km',
      '35000 km',
      '40000 km',
      '45000 km',
      '50000 km',
      '55000 km',
      '60000 km',
      '65000 km',
      '70000 km',
      '75000 km',
      '80000 km'
    ])
    const selectMileageRange = (value) => {
      employeeDetails['expectedMileage'] = convertToNumber(value)
    }
    const statusItems = reactive([
      USER_STATUS.SELECTOR_AVAILABLE,
      USER_STATUS.CAR_ORDERED,
      USER_STATUS.ACTIVE_LEASE,
      USER_STATUS.DEACTIVATED_ACCOUNT,
      USER_STATUS.NO_LEASE_CAR
    ])
    const selectStatus = (item) => {
      employeeDetails['userStatus'] = item
    }
    const selectCarPolicy = async (item) => {
      selectedCarPolicy.value = item['title']
      employeeDetails['carPolicy'] = item.id
      await getCarPolicyByID(item.id)
      employeeDetails['allowedFuelType'] = getFuelTypes.value
    }
    const selectLeaseCategory = (item) => {
      if (item.amount) selectedLeaseCategory.value = `${item['title']} (${CurrencyFormat(item.amount)})`
      else selectedLeaseCategory.value = `${item['title']}`
      employeeDetails['leaseCategory'] = item.id
    }
    const onCheck = (event, item) => {
      if (employeeDetails['allowedFuelType'].indexOf(item) === -1) {
        employeeDetails['allowedFuelType'].push(item)
      }
      if (!event.target.checked) {
        employeeDetails['allowedFuelType'].splice(employeeDetails['allowedFuelType'].indexOf(item), 1)
      }
    }
    const selectRole = (role) => {
      const findIndex = userRolesArray.value.findIndex((item) => item['id'] === role['id'])
      if (findIndex === -1) {
        userRolesArray.value.push(role)
        employeeDetails['roles'].push(role.id)
      }
    }
    const removeUserRole = (role, index) => {
      if (userRolesArray.value.indexOf(role) !== -1) {
        userRolesArray.value.splice(index, 1)
        employeeDetails['roles'].splice(index, 1)
      }
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
    const scrollToSection = (sectionId) => {
      const element = document.querySelector(`#${sectionId}`) as HTMLElement
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
    const validateSections = () => {
      delete employeeDetailsErrors['nameError']
      delete employeeDetailsErrors['emailError']
      delete employeeDetailsErrors['emailValidationError']
      delete employeeDetailsErrors['rolesError']
      delete employeeDetailsErrors['streetError']
      delete employeeDetailsErrors['houseNumberError']
      delete employeeDetailsErrors['postalCodeError']
      delete employeeDetailsErrors['cityError']
      delete employeeDetailsErrors['phoneNumberError']
      delete employeeDetailsErrors['phoneNumberValidationError']
      delete employeeDetailsErrors['carPolicyError']
      delete employeeDetailsErrors['leaseCategoryError']
      delete employeeDetailsErrors['allowedFuelTypeError']
      delete employeeDetailsErrors['licensePlateError']
      let sectionId = ''
      if (employeeDetails.licensePlate && employeeDetails.licensePlate.length !== 6) {
        employeeDetailsErrors['licensePlateError'] = 'required'
        sectionId = 'leaseCarDetails'
      }
      if (employeeDetails.roles.includes(4)) {
        if (!employeeDetails.carPolicy) {
          employeeDetailsErrors['carPolicyError'] = 'required'
          sectionId = 'carPolicyDetails'
        }
        if (!employeeDetails.leaseCategory) {
          employeeDetailsErrors['leaseCategoryError'] = 'required'
          sectionId = 'carPolicyDetails'
        }
        if (getFuelTypes.value && !employeeDetails.allowedFuelType.length) {
          employeeDetailsErrors['allowedFuelTypeError'] = 'required'
          sectionId = 'carPolicyDetails'
        }
      }
      if (!employeeDetails.street) {
        employeeDetailsErrors['streetError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (!employeeDetails.houseNumber) {
        employeeDetailsErrors['houseNumberError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (!employeeDetails.postalCode) {
        employeeDetailsErrors['postalCodeError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (!employeeDetails.city) {
        employeeDetailsErrors['cityError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (!employeeDetails.phoneNumber) {
        employeeDetailsErrors['phoneNumberError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (employeeDetails.phoneNumber && !validatePhoneNumber(employeeDetails.phoneNumber)) {
        employeeDetailsErrors['phoneNumberValidationError'] = 'required'
        sectionId = 'contactDetails'
      }
      if (!employeeDetails.name) {
        employeeDetailsErrors['nameError'] = 'required'
        sectionId = 'accountDetails'
      }
      if (!employeeDetails.email) {
        employeeDetailsErrors['emailError'] = 'required'
        sectionId = 'accountDetails'
      }
      if (employeeDetails.email && !validateEmail(employeeDetails.email)) {
        employeeDetailsErrors['emailValidationError'] = 'required'
        sectionId = 'accountDetails'
      }
      if (!employeeDetails.roles.length) {
        employeeDetailsErrors['rolesError'] = 'required'
        sectionId = 'accountDetails'
      }
      if (Object.getOwnPropertyNames(employeeDetailsErrors).length === 0) {
        return true
      } else {
        scrollToSection(sectionId)
      }
    }
    const saveUser = async () => {
      if (validateSections()) {
        if (!employeeDetails.licensePlate) {
          employeeDetails['licensePlate'] = null
        }
        if (!employeeDetails.leaseValidUntil) {
          employeeDetails['leaseValidUntil'] = null
        }
        if (route.params.id) {
          delete employeeDetails['sendInvite']
          await store.dispatch(UsersActionTypes.UPDATE_USERBYID, {
            companyId: compId,
            userId: route.params.id,
            body: employeeDetails
          })
          const rolesArray = ['ROLE_USER']
          if (employeeDetails['roles'].includes(2)) {
            rolesArray.push('ROLE_COMPANY_ADMIN')
          }
          if (employeeDetails['roles'].includes(3)) {
            rolesArray.push('ROLE_CLIENT')
          }
          if (employeeDetails['roles'].includes(4)) {
            rolesArray.push('ROLE_EMPLOYEE')
          }
          if (isUserUpdated.value && currentUserName.value == employeeDetails.name) {
            VueCookieNext.setCookie('roles', JSON.stringify(rolesArray), {
              expire: '24h',
              path: '/',
              domain: '',
              secure: '',
              sameSite: ''
            })
          }
        } else {
          store.dispatch(UsersActionTypes.ADD_USER, {
            companyId: compId,
            body: employeeDetails,
            lang: localStorage.getItem('locale') || 'nl'
          })
        }
      }
    }
    const getRolesByID = (roles) => {
      const userRoles = roles.filter((value) => value !== 'ROLE_USER')
      const selectedRoles: { title: string; id: number }[] = []
      if (userRoles.includes('ROLE_COMPANY_ADMIN')) {
        selectedRoles.push({
          title: 'Company admin',
          id: 2
        })
      }
      if (userRoles.includes('ROLE_EMPLOYEE')) {
        selectedRoles.push({
          title: 'Employee',
          id: 4
        })
      }
      if (userRoles.includes('ROLE_CLIENT')) {
        selectedRoles.push({
          title: 'Client',
          id: 3
        })
      }
      return selectedRoles
    }
    const getUserById = async () => {
      await store.dispatch(UsersActionTypes.GET_USERBYID, {
        companyId: compId,
        userId: route.params.id
      })
      employeeDetails.name = userById.value.name
      employeeDetails.email = userById.value.email
      if (userById.value.userStatus) employeeDetails.userStatus = userById.value.userStatus
      employeeDetails.employeeNumber = userById.value.employeeNumber
      if (userById.value.roles) userRolesArray.value = getRolesByID(userById.value.roles)
      employeeDetails.roles = userRolesArray.value.map((item) => item['id'])
      employeeDetails.street = userById.value.street
      employeeDetails.houseNumber = userById.value.houseNumber
      employeeDetails.postalCode = userById.value.postalCode
      employeeDetails.city = userById.value.city
      employeeDetails.phoneNumber = userById.value.phoneNumber
      if (userById.value.carPolicy) {
        selectedCarPolicy.value = userById.value.carPolicy.policyTitle
        employeeDetails.carPolicy = userById.value.carPolicy.id ?? 0
        employeeDetails.allowedFuelType = userById.value.allowedFuelType
        await getCarPolicyByID(employeeDetails.carPolicy)
        fuelTypeCheckboxes.forEach((item) => {
          item.isActive = false
          if (employeeDetails.allowedFuelType.includes(item.title)) {
            item.isActive = true
          }
        })
      }
      if (userById.value.leaseCategory) {
        const leaseItem = userById.value.leaseCategory
        if (leaseItem['amount'])
          selectedLeaseCategory.value = `${leaseItem['title']} (${CurrencyFormat(leaseItem['amount'])})`
        else selectedLeaseCategory.value = `${leaseItem['title']}`

        employeeDetails.leaseCategory = userById.value.leaseCategory.id
      }
      if (userById.value.expectedMileage) {
        employeeDetails.expectedMileage = userById.value.expectedMileage
      }
      employeeDetails.licensePlate = userById.value.licensePlate
      employeeDetails.leaseValidUntil = userById.value.leaseValidUntil
      employeeDetails.incomeTax = userById.value.incomeTax.id
      employeeDetails.privateUse = userById.value.privateUse
      employeeDetails.sendInvite = userById.value.sendInvite
      employeeDetails.deletedAt = userById.value.deletedAt
    }
    const dateFormat = (date) => {
      const dateArr = date.split(' ')
      return dateArr[0].split('-').reverse().join('-') + ' ' + dateArr[1].split(':').slice(0, -1).join(':')
    }
    const closePopup = () => {
      showPopup.value = false
    }
    const discardUser = () => {
      router.push({ name: 'Employees', query: { page: 1 } })
    }
    const onProceed = () => {
      store.dispatch(UsersActionTypes.DELETE_USERBYID, {
        companyId: compId,
        userId: route.params.id
      })
      showPopup.value = false
    }
    const onProceedRestore = () => {
      store.dispatch(UsersActionTypes.RESTORE_USERBYID, {
        companyId: compId,
        userId: route.params.id
      })
      restore.value = false
    }
    const deleteUser = () => {
      showPopup.value = true
    }
    const restoreUser = () => {
      restore.value = true
    }
    const onCheckSendInviteUser = (value) => {
      employeeDetails.sendInvite = value.option.target.checked ? 1 : 0
    }
    const downloadCarOrderedPdf = () => {
      store.dispatch(ActionTypes.DOWNLOAD_CARORDERPDF, {
        lang: localStorage.getItem('locale') || 'nl',
        carOrderId: currentCar.value.id
      })
    }
    onMounted(async () => {
      if (route.params.id) {
        await getUserById()
      }
      await initializeDropdownsRequests()
    })
    onUnmounted(() => {
      store.commit(MutationTypes.SET_DELETEUSERBYIDRESPONSE, '')
      store.commit(MutationTypes.SET_USER_ERROR, '')
      store.commit(MutationTypes.SET_ISUSERUPDATED, false)
      store.commit(MutationTypes.SET_ORDERED_CAR, {})
    })
    return {
      getBreadCrumbTitle,
      statusItems,
      selectStatus,
      selectedRole,
      selectRole,
      getAllCarPolicies,
      getAllLeaseCategories,
      selectedCarPolicy,
      selectedLeaseCategory,
      selectCarPolicy,
      selectLeaseCategory,
      fuelTypeCheckboxes,
      onCheck,
      getUserRoles,
      userRolesArray,
      removeUserRole,
      MileageRange,
      selectMileageRange,
      employeeDetails,
      onInputEmployeeDetails,
      getFuelTypes,
      saveUser,
      employeeDetailsErrors,
      validateEmail,
      userById,
      userByIdLoader,
      route,
      discardUser,
      deleteUser,
      deleteUserResponse,
      showPopup,
      closePopup,
      onProceed,
      restoreUser,
      restore,
      onProceedRestore,
      userError,
      carPolicies,
      leaseCategories,
      onCheckSendInviteUser,
      currentCar,
      formatCurrency,
      downloadCarOrderedPdf,
      savedRoles,
      dateFormat,
      companyDetailState
    }
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/variables.sass'
@import 'sass/mixins.sass'
.send-invite-user
  display: flex
  align-items: flex-end
.user-errors
  position: relative
  margin-bottom: 4em
.employee-wrap
  display: flex
  flex: 1
  position: relative
  .contact-info, .car-policy-section
    padding-bottom: 3em
  @media screen and (max-width: $xxlBreakpoint)
    flex-direction: column
    padding: 0 15px
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
  .center-area
    display: flex
    max-width: 765px
    margin: 5em auto 0 auto
    width: 100%
    flex-direction: column
    .car-policy-section
      .half-width
        height: auto !important
    @media screen and (max-width: $xxlBreakpoint)
      margin: 3em auto 0 auto
    .details-inner-wrap
        flex: 1
        margin: 0 0 3em 0
        .error-block
          margin: 2em 0 0
        h2
          margin: 1.2em 0 1em 0
        .employee-sub-wrap
            display: flex
            flex: 1
            position: relative
            flex-direction: column
            .user-roles
              margin: 0 !important
            .row
                display: flex
                flex: 1
                margin: 0 0 3.1em 0
                @media screen and (max-width: $mdBreakpoint)
                  flex-direction: column
                @media screen and (max-width: $mdBreakpoint)
                  margin: 0
                .selected-dropdown-items
                  margin: 2.6em 0 0 0
                  ul
                    display: flex
                    flex-wrap: wrap
                    padding: 0
                    margin: 0.5em 0 0
                    li
                      display: flex
                      align-items: center
                      border: 1px solid $colorHubble
                      color: $colorHubble
                      line-height: 18px
                      font-size: 15px
                      font-family: 'Lato-semibold'
                      align-items: center
                      padding: 0.6em 1em
                      border-radius: 5px
                      margin: 0 0.6em 0.6em 0
                      span.remove-icon
                        cursor: pointer
                        @include backgroundImage('close.svg')
                        width: 11px
                        height: 12px
                        margin-left: 6px
                label
                  font-size: 14px
                  color: $colorHubbleDarkGrey
                  display: flex
                  margin-bottom: 0.4em
                .half-width
                    width: 50%
                    height: 54px
                    position: relative
                    @media screen and (max-width: $mdBreakpoint)
                      width: 100%
                      margin-bottom: 1.5em
                    &:first-child
                        margin-right: 5%
            .allowed-fuel-type
                display: flex
                flex-direction: column
                position: relative
                .checkboxes-block
                  display: flex
                  margin: 0.8em 0
                  @media screen and (max-width: $mdBreakpoint)
                    flex-direction: column
                  > div
                    margin-right: 2em
                    @media screen and (max-width: $mdBreakpoint)
                      margin-bottom: 1em
div.text
  text-align: center
  padding: 2em 0 0 0
.inner-details
  display: flex
  margin: 1.5em 0 2em
  @media screen and (max-width: $xsBreakpoint)
    flex-direction: column
  .col
    display: flex
    flex-direction: column
    flex: 1
    @media screen and (max-width: $xsBreakpoint)
      margin: 0 0 1em 0
    h3, span
      font-size: 16px
    h3, label
      line-height: 23px
    label, p
      color: $colorHubbleDarkGrey
      font-size: 14px
    h3
      font-weight: 400
      font-family: 'Lato'
    p
      flex-wrap: wrap
.view-ordered-car
  font-size: 15px
  color: $colorHubbleDarkBlue
  font-family: 'Lato-semibold'
  margin: 0 0 2em 0
  cursor: pointer
.left-message
  font-size: 14px
  line-height: 2.5rem
</style>
