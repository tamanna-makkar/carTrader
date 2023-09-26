export type Options = {
  exteriorColour?: Array<OptionsConfigurationResponse>;
  interiorColour?: Array<OptionsConfigurationResponse>;
  audioAndEntertainment?: Array<OptionsConfigurationResponse>;
  drivingAndBraking?: Array<OptionsConfigurationResponse>;
  comfort?: Array<OptionsConfigurationResponse>;
  other?: Array<OptionsConfigurationResponse>;
  safety?: Array<OptionsConfigurationResponse>;
}

export type OptionsConfiguration = {
  option: Array<OptionsConfigurationResponse>;
  price: number;
}

export type OptionsConfigurationResponse = {
  category: string;
  code: string;
  conflictingWith: Array<string>;
  latestAction: string;
  newState: string;
  oldState: string;
  optionId: number;
  packMembers: Array<string>;
  price: number;
  priceExcludingVAT?: number;
  priority: string;
  required?: Array<string>;
  requiredChoices?: Array<Array<string>>;
  schemaIds: string;
  titleEn: string;
  titleNl: string;
  type: string;
  metallicEnabled?: boolean;
}

export type OptionsConfigurationBodyType = {
  vehicleId: number;
  selectedOptions: OptionsConfigurationRequest;
}

export type OptionsConfigurationRequest = {
  selectedOptions: Array<string>;
  requiredChoices: Array<string>;
  option: string;
  action: string;
}

export type requiredChoiceTitlesType = Array<requiredChoicesTitle>

export type requiredChoicesTitle = {
  titleEn: string;
  titleNl: string;
  code: string;
  optionId: number;
}

export type packMembersTitlesType = {
  titleEn: string;
  titleNl: string;
  code: string;
}

export type carBrandsModel = {
  cars: Array<carBrandModelLevelType>;
}

export type carBrandsModelType = {
  brand: string;
  models: Array<string>;
}
export type carBrandModelLevelType = {
  brand: string;
  brand_111: string;
  models: [{ model: string; model_112: string; levels: [{ level: string; level_402: string }] }];
}

export type chargingFacilityType = {
  chargingFacility: string;
  price: string;
  type?: string;
}

export type mandatoryAccessoriesType = {
  accessory: string;
  price: string;
  type?: string;
}

export type step1ErrorsType = {
  titleRequiredError?: string;
  titleLengthError?: string;
}

export type step2ErrorsType = {
  facilityRequired?: string;
  facilityError?: string;
  priceError?: string;
  priceRequired?: string;
}

export type fuelType = {
  title: string;
  distance: number;
  isChargingMandatory: number;
  setMileage: number;
  setDuration: number;
}

export type amountOfDoorsType = {
  min: number;
  max: number;
}

export type carPolicyAddRequest = {
  companyId: number;
  data: carPolicyAddType;
}

export type carPolicyUpdateRequest = {
  companyId: number;
  carPolicyId: number;
  data: carPolicyAddType;
}

export type carPolicyDeleteRequest = {
  companyId: number;
  carPolicyId: number;
}

export type carPolicyAddType = {
  id?: number;
  policyTitle: string;
  colorCode: string;
  fuelType: Array<fuelType>;
  carBodyType: Array<string>;
  amountOfDoors: amountOfDoorsType;
  carBrandsAndModels: carBrandsModel;
  mandatoryAccessories: Array<mandatoryAccessoriesType>;
  mandatoryFactoryOptions: Array<string>;
  document: string;
  chargingFacility: Array<string>;
  companyId: string;
  gearbox: Array<string>;
}

export type carPolicyAddResponse = {
  status: string;
  carPolicyResponse: string;
  documentResponse: string;
}

export type wizardStepsRequest = {
  budget?: Array<number>;
  fuel_type?: Array<string>;
  plug_in_hybrid?: boolean;
  hybrid?: boolean;
  electric_drive_range?: number;
  plug_in_hybrid_drive_range?: number;
  body_type?: Array<string>;
  transmission?: Array<string>;
  engine_power?: number;
  cargo_space?: number;
  towing_capacity?: number;
  seats?: number;
  doors?: number;
  equipments?: Array<string>;
  brands?: Array<string>;
}

export type wizardStepsResponse = {
  response: {
    hits: wizardStepsResponseHits;
    timed_out: boolean;
    took: number;
    _shards: wizardStepsResponseShards;
  };
  status: string;
}

export type wizardStepsResponseHits = {
  hits: Array<wizardStepsResponseAllHits>;
  max_score: number;
  total: {
    relation: string;
    value: number;
  };
}

export type wizardStepsResponseAllHits = {
  fields: {
    auth_monthly_cost: Array<number>;
  };
  _id: string;
  _index: string;
  _score: number;
  _source: wizardStepsResponseSource;
  _type: string;
}

export type wizardStepsResponseSource = {
  adaptive_cruise_control: boolean;
  android_auto: boolean;
  apple_car_play: boolean;
  body_code: string;
  body_name: string;
  body_type: string;
  brand: string;
  budget: string;
  budget_monthly: string;
  budget_yearly: string;
  car_version: string;
  cargo_space: string;
  co2_emission: string;
  collision_warning_system: boolean;
  doors: string;
  electric_drive_range: string;
  engine_power: string;
  fiscal_tax: string;
  fuel_code: string;
  fuel_name: string;
  fuel_type: string;
  hp: string;
  model: string;
  price: string;
  rear_view_camera: boolean;
  seats: string;
  subwoofer: boolean;
  suitcase_limit: number;
  sunroof: boolean;
  towing_capacity: number;
  transmission_code: string;
  transmission_name: string;
  vat: string;
  vehicle_id: string;
  weight: string;
  year: string;
}

export type wizardStepsResponseShards = {
  failed: number;
  skipped: number;
  successful: number;
  total: number;
}

export type UserLogInRequest = {
  username: string;
  password: string;
}

export type resetPasswordBodyParams = {
  newPassword: string;
  confirmPassword: string;
}

export type resetPasswordResponse = {
  status: string;
  userResponse: string;
}

export type resetPasswordRequest = {
  body: resetPasswordBodyParams;
  email: string;
  activationKey: string;
}

export type UserLogInResponse = {
  token: string;
  refresh_token: string;
  companyId?: number;
  userRoles?: string;
}

export type UserForgetPasswordRequest = {
  email: string;
}

export type UserForgetPasswordResponse = {
  status: string;
  userResponse: string;
}

export type currentUserDetailsRequest = {
  companyId: number;
  userId: number;
}

export type currentUserDetailsResponse = {
  status: string;
  userResponse: currentUserResponseType[];
}

export type currentUserResponseType = {
  allowedFuelType: Array<string>;
  carOrders?: Array<string>;
  carPolicy: carPolicyResponseType;
  city: string;
  company: companyType;
  country: string;
  createdBy: number;
  deletedAt: number;
  email: string;
  employeeNumber: string;
  expectedMileage: number;
  houseNumber: string;
  id: number;
  incomeTax: incomeTaxSettingsType;
  isActive?: boolean;
  leaseCategory: leaseCategoryType;
  name: string;
  phoneNumber: string;
  postalCode: string;
  privateUse: boolean;
  roles: Array<string>;
  street: string;
  userStatus: string;
  licensePlate: string;
  leaseValidUntil: string;
}

export type companyType = {
  id: number;
  logo: string;
  logoType: string;
  name: string;
}

export type carPolicyType = {
  color: string;
  id: number;
  title: string;
}

export type leaseCategoryType = {
  amount: number;
  id: number;
  title: string;
}

export type idNameType = {
  id: number;
  name: string;
}

export type idTitleType = {
  id: number;
  title: string;
}

export type getCarPolicyRequest = {
  companyId: number;
  carPolicyId?: number;
  isWizards?: boolean;
}

export type carPolicyResponseType = {
  id?: number;
  policyTitle: string;
  colorCode: string;
  fuelType: Array<fuelType>;
  carBodyType: Array<string>;
  amountOfDoors: amountOfDoorsType;
  carBrandsAndModels: Array<carBrandsModelType>;
  mandatoryAccessories: Array<mandatoryAccessoriesType>;
  mandatoryFactoryOptions: Array<string>;
  document: string;
  excludedCarColors: Array<string>;
  chargingFacility: Array<string>;
  companyId: string;
  gearbox: Array<string>;
  createdBy?: number;
}

export type getCarPolicyResponse = {
  status: string;
  carPolicyResponse: carPolicyResponseType;
}

export type getAllCarPolicies = {
  status: string;
  carPolicyResponse: Array<carPolicyResponseType>;
}


export type vehicleDetails = {
  unique_identity_101: string;
  model_year_108: number;
  local_make_name_128: string;
  local_model_name_129: string;
  model_descriptor_130: string;
  local_version_name_131: string;
  model_generation_id_142: number;
  vid_143: number;
  number_of_doors_602: number;
  body_type_603: string;
  seating_capacity_702: number;
  retail_price_902: string;
  "rear_seat_up;_to_lower_window_(l)_6002": string;
  fuel_type_8702: string;
  'maximum_power_hp/ps_15304': string;
  transmission_type_20602: string;
  "gross_trailer_weight_braked_(kg)_24105": number;
  combined_62203: string;
  combined_km_62903: number;
}


export type vehicleOptions = {
  code: string;
  type: string;
  price: number;
  titleEn: string;
  titleNl: string;
  category: string;
  optionId: number;
  priceExcludingVAT?: number;
}
export type savedCarsType = {
  id: number;
  status: number;
  user: string;
  vehicleDetails: vehicleDetails;
  options: vehicleOptions[];
  exteriorColor: vehicleOptions[];
  interiorColor: vehicleOptions[];
  mandatoryAccessories: mandatoryAccessoriesType[];
  otherAccessories: mandatoryAccessoriesType[];
  chargingFacilities: mandatoryAccessoriesType[];
  totalOptionsPrice: number;
  totalAccessoriesPrice: number;
  fiscalValue: number;
  fiscalTax: number;
  totalLeaseRateWithoutFuelAdvance: number;
  fuelAdvance: number;
  totalLeaseRate: number;
  netMonthlyCost: number;
  personalContribution: number;
  co2Emission: number;
  imagePath: string;
}


export type allSavedCars = {
  status: string;
  carOrderResponse: savedCarsType[];
}

export type carOrderDetails = {
  status: string;
  carOrderResponse: savedCarsType;
}

export type generalCarOrderResponse = {
  status: string;
  carOrderResponse: string;
}

export type employeeHeadingsType = {
  label: string;
  key: string;
}
export type getAllLeaseCategoriesResponse = {
  status: string;
  leaseCategoryResponse: Array<leaseCategoryResponseType>;
}

export type getLeaseCategoryByIDResponse = {
  status: string;
  leaseCategoryResponse: leaseCategoryResponseType;
}

export type updateLeaseCategoryByIDResponse = {
  status: string;
  leaseCategoryResponse: Array<string>;
}

export type leaseCategoryResponseType = {
  id?: number;
  title: string;
  amount: number;
  overrun: number;
  overrunType: string;
  undershootPayoutPercentage?: number;
  personalContribution: number;
  maxPersonalContributionPercentage: number;
  co2Emission: number;
  createdBy?: number;
  multipleFuelTypesAmount: Array<multipleFuelTypesAmount>;
}

export type multipleFuelTypesAmount = {
  amount: string;
  fuelType: string;
}

export type employeeDetailsType = {
  employeeName: string;
  numberPlate: string;
  leaseValid: string;
  carPolicy: string;
  leaseCategory: string;
  status: string;
}

export type employeeResponseType = {
  status: string;
  totalPages: number;
  totalRecords: number;
  userResponse: Array<employeeUserResponseType>;
}

export type getCarsByIdType = {
  cars: carsDataType;
  path?: string;
}

export type carsDataType = {
  data: idTitleValueType[];
  path: string;
  count: number;
}

export type idTitleValueType = {
  id: number;
  title: string;
  value: string;
}


export type employeeUserResponseType = {
  id: string;
  email: string;
  name: string;
  userStatus: string;
  employeeNumber: string;
  incomeTax: incomeTaxSettingsType;
  houseNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  company: companyType;
  createdBy?: number;
  carPolicy: carPolicyResponseType;
  leaseCategory: idTitleType;
  deletedAt?: string;
  privateUse: boolean;
  roles: Array<string>;
  expectedMileage: number;
  allowedFuelType: Array<string>;
  carOrders?: orderedCarType;
  licensePlate: string;
  leaseValidUntil: string;
  sendInvite: number;
}

export type createEmployeeResponseType = {
  name: string;
  email: string;
  userStatus: string;
  employeeNumber: string;
  roles: Array<number>;
  street: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  country: number;
  incomeTax?: number;
  houseNumber: string;
  privateUse?: boolean;
  expectedMileage: number;
  carPolicy: number;
  leaseCategory: number;
  allowedFuelType: Array<string>;
  licensePlate?: string;
  leaseValidUntil?: string;
  sendInvite: number;
  deletedAt?: string;
}

export type employeeUserUpdateType = {
  id: string;
  email: string;
  name: string;
  userStatus: string;
  employeeNumber: string;
  incomeTax: incomeTaxSettingsType | number;
  houseNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  company: idNameType;
  createdBy?: number;
  carPolicy: string;
  leaseCategory: string;
  deletedAt?: string;
  privateUse: boolean;
  roles: Array<string>;
  expectedMileage: number;
  allowedFuelType: Array<string>;
  carOrders?: Array<number>;
}

export type userQuery = {
  companyId?: number;
  query: userQueryType;
}

export type userQueryType = {
  name: string;
  page: number;
  status?: number;
}

export type employeeDropdownsType = {
  id?: number;
  title: string;
  amount?: number;
}


export type selectedConfigOptionsType = {
  code: string;
  type: string;
  price: number;
  titleEn: string;
  titleNl: string;
  category: string;
  optionId: number;
  priceExcludingVAT: number;
}

export type carOrderAddType = {
  vehicleId: string;
  monthlyCost: number;
  carPrice: number;
  co2Emission: number;
  status: number;
  colors: selectedConfigOptionsType[];
  options: selectedConfigOptionsType[];
  mandatoryAccessories: mandatoryAccessoriesType[];
  otherAccessories: mandatoryAccessoriesType[];
  chargingFacilities: mandatoryAccessoriesType[];
}


export type colorsFlagType = { interior: boolean; exterior: boolean }
export type carOrderResponseType = {
  carOrderId: number;
  carOrderResponse: savedCarsType;
  complyCarResponse: { expensiveFlag: boolean; complyErrors: string[]; colorSelection: colorsFlagType };
  status: string;
}

export type deleteUserResponseType = {
  status: string;
  userResponse: string;
}

export type carOrderBody = {
  vehicleId: number;
  monthlyCost: number;
  carPrice: number;
  co2Emission: number;
  status: boolean;
  options?: vehicleOptions[];
  colors?: mandatoryAccessoriesType[];
  mandatoryAccessories?: mandatoryAccessoriesType;
  otherAccessories?: mandatoryAccessoriesType;
  chargingFacilities?: mandatoryAccessoriesType;
}

export type getAllCompaniesResponseType = {
  status: string;
  totalPages: number;
  totalRecords: number;
  companyResponse: companyResponseType[];
}

export type companyGetByIdResponseType = {
  status: string;
  companyResponse: companyResponseType;
}

export type companyResponseType = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  logo: string;
  logoType: string;
  benefitDriver: boolean;
  quotationRequestEmail: Array<string>;
  userAgreementCopyEmail: Array<string>;

}

export type deleteCompanyLogoById = {
  status: string;
  companyResponse: string;
  fileResponse: string;
}

export type netMonthlyCostAndFlagType = {
  expensiveFlag: boolean;
  netMonthlyCost: number;
}
export type passwordBody = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type updatePasswordResponse = {
  status: string;
  userResponse: string | string[];
}

export type companyAddRequest = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  logo: string;
  quotationRequestEmail: Array<string>;
  userAgreementCopyEmail: Array<string>;
}

export type companyAddResponse = {
  status: string;
  companyResponse: string;
  companyId: number;
  fileResponse: string;
}
export type getCompanyLeaseRateResponse = {
  companyLeaseRateResponse: companyLeaseRateAdd[];
}
export type companyLeaseRateAdd = {
  leaserateOperator: string;
  leaserateValue: number;
  leaserateType: string;
  fuelOperator: string;
  fuelValue: number;
  fuelType: string;
  months36: number;
  months48: number;
  months60: number;
  biggerTyres: number;
  id?: number;
}

export type companyLeaseRateResponse = {
  status: string;
  companyLeaseRateResponse: string;
}

export type uploadLeaseRateResponseType = {
  status: string;
  leaseRateResponse: Array<string>;
}

export type uploadLeaseRateBodyType = {
  file: File;
}

export type taxSettingsType = {
  column1: number;
  column2: number;
  column3: number;
  column4: number;
  type: string;
  typeOf: string;
}

export type orderedCarType = {
  id: number;
  netMonthlyCost: string;
  status: number;
  vehicleDetails: vehicleDetails;
}

export type taxSettingsAddResponse = {
  status: string;
  taxSettingsResponse: string | string[];
}
export type taxSettingsAddRequest = {
  year?: number;
  bpmTaxSettings: bpmTaxSettingsType[];
  dieselSurtaxSettings: dieselSurtaxSettingsType[];
  fiscalTaxSettings: fiscalTaxSettingsType[];
  incomeTaxSettings: incomeTaxSettingsType[];
}

export type bpmTaxSettingsType = {
  type: string;
  column1: number;
  column2: number;
  column3: number;
  column4: number;
  typeOf: string;
  year: number;
}

export type dieselSurtaxSettingsType = {
  co2: number;
  surtax: number;
}

export type fiscalTaxSettingsType = {
  co2Operator: string;
  co2: number;
  tax: number;
  priceOperator: string;
  price: number;
}

export type incomeTaxSettingsType = {
  id?: number;
  fromValue: number;
  incomeTaxPercent: number;
  incomeTaxPercentForCalculation: number;
}

export type carColorsResponse = {
  response: Array<string>;
  status: string;
}

export type notInLeaseDataResponseType = {
  leaseRateResponse: leaseRateResponseType;
  status: string;
}

export type leaseRateResponseType = {
  allVehicles: Array<allVehiclesResponseType>;
  jatoDbUpdatedAt: string;
  leaseRateDataUpdatedAt: string;
  totalPages: number;
  totalRecords: number;
}

export type allVehiclesResponseType = {
  foundCombinations: Array<string>;
  local_make_name_128: string;
  local_model_name_129: string;
  local_version_name_131: string;
  make_111: string;
  model_112: string;
  notFoundCombinations: Array<string>;
  retail_price_902: string;
  unique_identity_101: string;
}

export type carDiscountDetails = {
  status: string;
  carDiscountResponse: Array<carDiscountResponse>;
}
export type carDiscountModels = {
  id: number;
  name: string;
  discount: number;
  parent: number;
  levels: Array<carDiscountLevels>;
}
export type carDiscountLevels = {
  id: number;
  name: string;
  discount: number;
  parent: number;
  versions: Array<carDiscountVersions>;
}
export type carDiscountVersions = {
  id: number;
  name: string;
  discount: number;
}
export type carDiscountResponse = {
  id: number;
  discount: number;
  models: Array<carDiscountModels>;
  name: string;
  parent: number;
}
export type treeResponseType = {
  id: number;
  name: string;
  discount: number;
  expandable: boolean;
  isOpen: boolean;
  isChecked: boolean;
  parentDiscount?: number;
  nodes?: Array<treeResponseType>;
}
export type discountAddRequest = {
  percentage: number;
  carDiscountIds: Array<string>;
}
export type discountAddResponse = {
  carDiscountPercentageResponse: string;
  status: string;
  discountIdsSkipped?: Array<string>;
}
export type discountDeleteRequest = {
  carDiscountPercentageIds: Array<string>;
}
export type deleteResponseObj = {
  discountIdsSkipped?: Array<number>;
  discountIdsDeleted: Array<number>;
}
export type discountDeleteResponse = {
  status: string;
  carDiscountResponse: deleteResponseObj[];
}

export type getAllCompanyOrdersType = {
  status: string;
  totalPages: number;
  totalRecords: number;
  companyOrdersResponse: companyOrdersResponse[];
}
export type companyOrdersResponse = {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  carOrders: number;
}