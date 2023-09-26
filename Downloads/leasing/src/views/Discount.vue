<template>
  <MessageBar v-if="roles.includes('ROLE_SUPER_ADMIN') && companyDetailState.name">
    <template v-slot:header>{{ $t('_infoPopup.adminMessage') }} {{ companyDetailState.name }}</template>
  </MessageBar>
  <div class="discount-wrap">
    <div class="discount-heading-wrap">
      <h1>{{ $t('_discounts.discount') }}</h1>
      <Button
        :text="$t('_discounts.resetAllDiscount')"
        @click="haveResetConfirmationPopup"
        buttonType="close--left light"
      />
    </div>
    <div class="discount-details-wrap">
      <div class="filters-main-wrap">
        <div class="search-filters-wrap">
          <div class="search-wrap">
            <Input
              :placeholder="$t('_discounts.searchBy')"
              :isEmployeeSearch="true"
              :searchInput="true"
              v-model:value="searchBy"
              @update:value="onInputSearch"
              @onEnter="onEnterSearch"
            />
          </div>
        </div>
        <div class="main-checkbox-wrap">
          <div>
            <Checkbox
              :item="filtersChecks[0]"
              @onCheck="onCheckDriverBenefit($event)"
              theme="discount"
              :isChecked="companyDetailState.benefitDriver ? true : false"
            >
              <span>{{ $t('_discounts.driverAppliedDiscounts') }} </span>
            </Checkbox>
          </div>
        </div>
        <div class="search-filters-wrap box-filters">
          <div class="add-filters">
            {{ $t('_discounts.filterBy') }}
          </div>
          <div class="filters-wrap">
            <div class="outer-wrap">
              <Dropdown
                :key="componentKey"
                :items="filteredBrands"
                :selectedOption="selectedBrand.name"
                @onChange="selectBrand"
                :isSearch="true"
                :isBrandsSearch="true"
                type="step1Search"
              />
            </div>
            <div class="outer-wrap">
              <Dropdown
                :key="componentKey"
                :class="{ enable: models && models.length }"
                class="model-dropdown"
                :items="filteredModels"
                :selectedOption="selectedModel"
                @onChange="selectModel"
                :isSearch="true"
                type="step1Search"
              />
            </div>
            <div class="outer-wrap">
              <Dropdown
                :key="componentKey"
                :class="{ enable: versions && versions.length }"
                class="model-dropdown"
                :items="filteredLevels"
                :selectedOption="selectedLevel"
                @onChange="selectLevel"
                :isSearch="true"
                :isLevelSearch="true"
                type="step1Search"
              />
            </div>
            <div class="outer-wrap">
              <Checkbox
                :item="filtersChecks[1]"
                @onCheck="filterWithoutDiscount($event)"
                theme="discount"
                :isChecked="filtersChecks[1].value"
              >
                <span>{{ $t('_discounts.filterVersionWithoutDiscount') }} </span>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
      <div class="listing-main-wrap">
        <div class="listing-wrap">
          <div class="sub-wrap">
            <div class="selection-wrap">
              <span>{{ $t('_discounts.withSelection') }}</span>
              <span class="editText" @click="showEditPopup" v-if="selectedNodes.length">
                {{ $t('_discounts.editDiscount') }}
              </span>
              <span class="disableEditText" v-else>{{ $t('_discounts.editDiscount') }}</span>
              <span class="divider"> | </span>
              <span class="editText" @click="haveConfirmationPopup" v-if="selectedNodes.length">
                {{ $t('_discounts.removeDiscount') }}
              </span>
              <span class="disableEditText" v-else>{{ $t('_discounts.removeDiscount') }}</span>
            </div>
            <div class="discount-listing" v-if="filterData.length && !loader">
              <div class="headings-wrap">
                <div class="heading" v-for="heading in carHeadings" :key="heading['key']" :class="heading['key']">
                  <Checkbox
                    v-if="heading['key'] == 'cars'"
                    :forCarBrands="true"
                    :item="heading"
                    @onCheck="selectAllCheckbox($event)"
                  />
                  <span class="sorting-icon" :class="sortIcon(heading['key'])" @click="sortBy(heading['key'])"></span>
                  {{ $t(`_discounts.${heading['key']}`) }}
                </div>
              </div>
              <div class="details-wrap">
                <div class="detail">
                  <HierarchyRow
                    v-for="item in filterData"
                    :key="item.id"
                    :data="item"
                    :indentSize="3"
                    :showInputBox="showInputBox"
                    @node-expand="onNodeExpand"
                    @toggle-checkbox="onToggleCheckbox"
                    @show-discount-input="onShowDiscountInput"
                    @discount-input-change="onDiscountInputChange"
                    @save-discount="saveDiscountInput"
                  />
                </div>
              </div>
            </div>
            <div
              v-else-if="
                (!filterData.length && !getCarBrandsDiscount.status) || getCarBrandsDiscount.status == 'success'
              "
              class="loader-block"
            >
              <loader />
            </div>
            <div
              v-else-if="!filterData.length && getCarBrandsDiscount.status == 'error'"
              class="content error-message-block"
            >
              <h3>{{ $t('_discounts.sorrySearchText') }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else class="loader-block">
      <loader />
    </div> -->
  </div>
  <Popup v-if="showPopUp" @onClick="showPopUp = false">
    <template v-slot:selectionPopup>
      <div class="selectionPopup">
        <div class="popup-content">
          <div class="popup-header">
            <div class="title h4">{{ $t('_discounts.editpopupTitle') }}</div>
          </div>
          <div class="popup-body">
            <InputElement
              type="text"
              name="applied_discount"
              currencyPlaceholder="%"
              currencyPlaceholderPosition="right"
              @update:value="onDiscountInputChange"
            >
              {{ $t('_discounts.editpopupField') }}
            </InputElement>
            <Button
              :text="$t('_generalTerms.delete')"
              buttonType="light close--left popup-light"
              @onClick="haveConfirmationPopup"
            />
          </div>
          <Button
            :text="$t('_generalTerms.save')"
            :isDisabled="!tmpDiscount"
            buttonType="dark discount-popup-buttons"
            @onClick="onEditDiscountSave"
          />
        </div>
      </div>
    </template>
  </Popup>
  <PopupElement
    v-if="showConfirmationPopup"
    @onClick="showConfirmationPopup = false"
    @onProceed="onRemoveDiscount"
    :centerPopup="true"
  >
    <div class="title h3">{{ $t('_warningPopup.confirmDelete') }}</div>
    <div class="text t2">{{ $t('_warningPopup.dataLost') }}</div>
  </PopupElement>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import Input from '@/components/UI/Input.vue'
import InputElement from '@/components/UI/Input.vue'
import Checkbox from '@/components/UI/Checkbox.vue'
import Button from '@/components/UI/Button.vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import Popup from '@/components/UI/Popup.vue'
import Loader from '@/components/UI/Loader.vue'
import MessageBar from '@/components/UI/MessageBar.vue'
import HierarchyRow from '@/components/UI/HierarchyRow.vue'
import { DiscountsActionTypes } from '@/store/discounts/actions'
import { ActionTypes } from '@/store/options/actions'
import PopupElement from '@/components/Popup.vue'
import { useStore } from '@/store'
import { CompanyActionTypes } from '@/store/company'
import getCompany from '@/mixins/getCompany'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { MutationTypes } from '@/store/options/mutations'
export default defineComponent({
  name: 'Discount',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const roles = computed(() => store.state.auth.currentUser?.roles)
    const loader = computed(() => store.state.discounts.loader)
    const componentKey = ref(0)
    const { compId, companyDetailState } = getCompany()
    const carBrandsModelsLevels = computed(() => store.state.options.carBrandsModelsLevels)
    const foundBrands = computed(() => {
      let filBrands = carBrandsModelsLevels.value
      if (store.state.options.searchString.length > 0) {
        filBrands = filBrands.filter(
          (brand) =>
            brand.brand
              .toLowerCase()
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '')
              .indexOf(store.state.options.searchString.toLowerCase()) !== -1
        )
      }
      return filBrands
    })
    const filteredBrands = computed(() =>
      foundBrands.value.map((item) => {
        return { label: item.brand, value: item.brand_111 }
      })
    )
    const filteredModels = computed(() => store.getters.filteredModels)
    const filteredLevels = computed(() => store.getters.filteredLevels)
    const getCarBrandsDiscount = computed(() => store.state.discounts.getCarBrandsDiscount)
    const setDiscountResponse = computed(() => store.state.discounts.setDiscountResponse)
    const sortOrder = ref('asc')
    const filterData = ref([])
    let updateData = reactive({})
    const tmpDiscount = ref()
    const selectedNodes = ref<Array<number>>([])
    const openedNodes = ref([])
    const showPopUp = ref(false)
    const showConfirmationPopup = ref(false)
    const resetDiscount = ref(false)
    const showInputBox = ref(0)
    const carHeadings = reactive([
      { id: 'car_heading1', value: 'car_heading1', key: 'cars' },
      { id: 'dis_heading2', value: 'dis_heading2', key: 'discount' }
    ])
    const filtersChecks = reactive([
      { id: 'driver_benefit', value: false },
      { id: 'without_discount', value: false }
    ])
    const searchBy = route.query.query ? ref(String(route.query.query)) : ref('')
    const models = ref([])
    const versions = ref([])
    const selectedBrand = ref({ name: '', val: '' })
    const selectedModel = ref('')
    const selectedLevel = ref('')

    const selectBrand = (data, onLoad) => {
      selectedModel.value = ''
      selectedLevel.value = ''
      selectedNodes.value = []
      models.value = []
      versions.value = []
      const label = onLoad ? data : data.value
      if (data) {
        const brandData = carBrandsModelsLevels.value.filter((item) => {
          if (item['brand_111'] == label) return item
        })
        brandData[0].models.map((e) => {
          models.value.push(e.model)
        })
        selectedBrand.value = { name: brandData[0].brand, val: brandData[0].brand_111 }
      } else {
        selectedBrand.value = { name: '', val: '' }
      }

      const query: { brand?: string } = Object.assign({}, route.query, { brand: label })
      if (!label) delete query.brand
      router.push({ query })
      store.commit(MutationTypes.SET_SELECTED_MODELS, models.value.sort())
      store.commit(MutationTypes.SET_SEARCH_STRING, selectedBrand.value.name)
      store.commit(MutationTypes.SET_SEARCH_MODELS, '')
      store.commit(MutationTypes.SET_SELECTED_LEVELS, versions.value)
      store.commit(MutationTypes.SET_SEARCH_LEVELS, '')
      componentKey.value += 1
    }
    const selectModel = (i, onLoad) => {
      selectedLevel.value = ''
      let searchVal = ''
      let label = ''
      versions.value = []
      selectedNodes.value = []
      if (i) {
        const brandData = carBrandsModelsLevels.value.filter((item) => {
          if (item['brand'] == selectedBrand.value.name) return item
        })
        brandData[0].models.map((e) => {
          const condlabel = onLoad ? e.model_112 : e.model
          if (condlabel == i) {
            searchVal = e.model_112
            label = e.model
            e.levels.map((ver) => {
              versions.value.push(ver.level)
            })
          }
        })
      }
      selectedModel.value = label
      const query: { model?: string } = Object.assign({}, route.query, { model: encodeURIComponent(label) })
      if (!searchVal) delete query.model
      router.push({ query })
      store.commit(MutationTypes.SET_SEARCH_MODELS, label)
      store.commit(MutationTypes.SET_SELECTED_LEVELS, versions.value.sort())
      store.commit(MutationTypes.SET_SEARCH_LEVELS, '')
      componentKey.value += 1
    }
    const selectLevel = (ver, onLoad) => {
      selectedNodes.value = []
      let value = ''
      let label = ''
      if (ver) {
        const brandData = carBrandsModelsLevels.value.filter((item) => {
          if (item['brand'] == selectedBrand.value.name) return item
        })
        brandData[0].models.map((m) => {
          if (m.model == selectedModel.value) {
            m.levels.map((v) => {
              const condlabel = onLoad ? v.level_402 : v.level
              if (condlabel == ver) {
                label = v.level
                value = v.level_402
              }
            })
          }
        })
      }
      selectedLevel.value = label
      store.commit(MutationTypes.SET_SEARCH_LEVELS, label)
      const query: { level?: string } = Object.assign({}, route.query, { level: value })
      if (!ver) delete query.level
      router.push({ query })
      componentKey.value += 1
    }
    const onEnterSearch = () => {
      selectedNodes.value = []
      const searchedTerm = (searchBy.value as string).trim().toLowerCase()
      const query: { query?: string } = Object.assign({}, route.query, { query: searchedTerm })
      if (!searchedTerm) {
        delete query.query
      }
      router.push({ query })
    }
    const onInputSearch = (value) => {
      searchBy.value = value
      if (!value) onEnterSearch()
    }
    const onCheckDriverBenefit = async (event) => {
      const formData = new FormData()
      formData.append('name', JSON.stringify(companyDetailState.value.name))
      formData.append('email', JSON.stringify(companyDetailState.value.email))
      formData.append('phoneNumber', JSON.stringify(companyDetailState.value.phoneNumber))
      formData.append('address', JSON.stringify(companyDetailState.value.address))
      formData.append('postalCode', JSON.stringify(companyDetailState.value.postalCode))
      formData.append('city', JSON.stringify(companyDetailState.value.city))
      formData.append('logo', companyDetailState.value.logo)
      formData.append('_method', 'PUT')
      if (event.target.checked) {
        formData.append('benefitDriver', 'true')
      } else {
        formData.append('benefitDriver', 'false')
      }
      await store.dispatch(CompanyActionTypes.UPDATE_COMPANYBYID, { companyId: compId, body: formData })
    }
    const filterWithoutDiscount = (event) => {
      if (event.target.checked) {
        const query: { discount?: string } = Object.assign({}, route.query, { discount: 'undefined' })
        router.push({ query })
      } else {
        const query: { discount?: string } = Object.assign({}, route.query, { discount: '' })
        delete query.discount
        router.push({ query })
      }
    }
    const filterDiscountData = async () => {
      if (getCarBrandsDiscount.value.status == 'success') {
        filterData.value = []
        for (const brandArr of Object.values(getCarBrandsDiscount.value.carDiscountResponse)) {
          const brandData = reactive({
            id: brandArr.id,
            name: brandArr.name,
            discount:
              updateData[brandArr.id] == '' || updateData[brandArr.id] >= 0
                ? updateData[brandArr.id]
                : brandArr.discount,
            expandable: false,
            isOpen: false,
            isChecked: selectedNodes.value.includes(brandArr.id) ? true : false,
            parentDiscount: null,
            nodes: []
          })

          // loop if models
          if (brandArr.models) {
            brandData.expandable = true
            brandData.isOpen =
              selectedBrand.value.val.toLowerCase() == brandData.name.toLowerCase()
                ? true
                : openedNodes.value.includes(brandArr.id)
                ? true
                : false
            for (const modelsArr of Object.values(brandArr.models)) {
              const modelData = reactive({
                id: modelsArr.id,
                name: modelsArr.name,
                discount:
                  updateData[modelsArr.id] == '' || updateData[modelsArr.id] >= 0
                    ? updateData[modelsArr.id]
                    : modelsArr.discount,
                expandable: false,
                isOpen: false,
                isChecked: selectedNodes.value.includes(modelsArr.id) ? true : false,
                parentDiscount: brandData.discount,
                nodes: []
              })

              // loop if levels
              if (modelsArr.levels) {
                modelData.expandable = true
                modelData.isOpen = openedNodes.value.includes(modelsArr.id)
                  ? true
                  : brandData.isOpen && selectedBrand.value.name
                  ? true
                  : false
                for (const levelsArr of Object.values(modelsArr.levels)) {
                  const levelData = reactive({
                    id: levelsArr.id,
                    name: levelsArr.name,
                    discount:
                      updateData[levelsArr.id] == '' || updateData[levelsArr.id] >= 0
                        ? updateData[levelsArr.id]
                        : levelsArr.discount,
                    expandable: false,
                    isOpen: false,
                    isChecked: selectedNodes.value.includes(levelsArr.id) ? true : false,
                    parentDiscount: modelData.discount ? modelData.discount : brandData.discount,
                    nodes: []
                  })

                  // loop if versions
                  if (levelsArr.versions) {
                    levelData.expandable = true
                    levelData.isOpen =
                      brandData.isOpen && selectedBrand.value.name
                        ? true
                        : openedNodes.value.includes(levelsArr.id)
                        ? true
                        : false
                    for (const versionArr of Object.values(levelsArr.versions)) {
                      const verData = reactive({
                        id: versionArr.id,
                        name: versionArr.name,
                        discount:
                          updateData[versionArr.id] == '' || updateData[versionArr.id] >= 0
                            ? updateData[versionArr.id]
                            : versionArr.discount,
                        isChecked: selectedNodes.value.includes(versionArr.id) ? true : false,
                        parentDiscount: levelData.discount
                          ? levelData.discount
                          : modelData.discount
                          ? modelData.discount
                          : brandData.discount
                      })

                      levelData.nodes.push(verData)
                    }
                  }
                  modelData.nodes.push(levelData)
                }
              }
              brandData.nodes.push(modelData)
            }
          }
          filterData.value.push(brandData)
        }
      } else {
        filterData.value = []
      }
    }
    const sortIcon = (value) => {
      let icon = 'default-icon '
      if (route.query.orderBy && route.query.order) {
        if (route.query.orderBy === value) {
          icon += route.query.order === 'asc' ? 'sort-asc' : 'sort-desc'
        }
      }
      return icon
    }
    const sortBy = (value) => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      const query = Object.assign({}, route.query, { orderBy: value, order: sortOrder.value })
      router.push({ query })
    }
    const selectAllCheckbox = ($event) => {
      selectedNodes.value = []
      if ($event.target.checked) {
        for (const data of Object.values(getCarBrandsDiscount.value.carDiscountResponse)) {
          selectedNodes.value.push(data.id)
        }
      }
      filterDiscountData()
    }
    const saveDiscount = async (data) => {
      await store.dispatch(DiscountsActionTypes.UPDATE_DISCOUNTS, { companyId: compId, data: data })
      if (setDiscountResponse.value.status == 'success') {
        filterDiscountData()
      }
    }
    const deleteDiscount = async (data) => {
      await store.dispatch(DiscountsActionTypes.DELETE_DISCOUNTS, { companyId: compId, data: data })
      if (setDiscountResponse.value.status == 'success') {
        filterDiscountData()
      }
    }
    const resetAllDiscount = async () => {
      await store.dispatch(DiscountsActionTypes.RESET_DISCOUNTS, { companyId: compId })
      if (setDiscountResponse.value.status == 'success') {
        updateData = {}
        filterDiscountData()
      }
    }
    const convertToNumberAndFloat = (selectedOption) => {
      return selectedOption.replace(/,/g, '.')
    }
    const onShowDiscountInput = (id) => {
      showInputBox.value = parseInt(id)
    }
    const onDiscountInputChange = (value) => {
      tmpDiscount.value = convertToNumberAndFloat(value)
    }
    const saveDiscountInput = (node) => {
      showInputBox.value = 0
      if (tmpDiscount.value) {
        const data = {
          percentage: tmpDiscount.value,
          carDiscountIds: [parseInt(node.id)]
        }
        updateData[node.id] = tmpDiscount.value
        saveDiscount(data)
      } else {
        updateData[node.id] = ''
        deleteDiscount({ carDiscountPercentageIds: [parseInt(node.id)] })
      }
    }
    const onNodeExpand = (node) => {
      if (node.expandable) node.isOpen = !node.isOpen
      if (openedNodes.value.indexOf(node.id) === -1) openedNodes.value.push(node.id)
      else openedNodes.value.splice(openedNodes.value.indexOf(node.id), 1)
    }
    const onToggleCheckbox = ($event, node) => {
      showInputBox.value = 0
      tmpDiscount.value = ''
      node.isChecked = !node.isChecked
      if ($event.target.checked && selectedNodes.value.indexOf(node.id) === -1) {
        selectedNodes.value.push(node.id)
      } else {
        selectedNodes.value.splice(selectedNodes.value.indexOf(node.id), 1)
      }
    }
    const showEditPopup = () => {
      showInputBox.value = 0
      tmpDiscount.value = ''
      showPopUp.value = true
    }
    const onEditDiscountSave = () => {
      if (tmpDiscount.value && selectedNodes.value.length) {
        const data = {
          percentage: tmpDiscount.value,
          carDiscountIds: selectedNodes.value
        }
        selectedNodes.value.map((id) => {
          updateData[id] = tmpDiscount.value
        })
        saveDiscount(data)
        showPopUp.value = false
      }
    }
    const haveConfirmationPopup = () => {
      showPopUp.value = false
      if (selectedNodes.value.length) {
        showConfirmationPopup.value = true
      }
    }
    const haveResetConfirmationPopup = () => {
      resetDiscount.value = true
      showPopUp.value = false
      showConfirmationPopup.value = true
    }
    const onRemoveDiscount = () => {
      showInputBox.value = 0
      if (resetDiscount.value) {
        resetAllDiscount()
        showConfirmationPopup.value = false
      } else if (selectedNodes.value.length) {
        selectedNodes.value.map((id) => {
          updateData[id] = ''
        })
        deleteDiscount({ carDiscountPercentageIds: selectedNodes.value })
        showConfirmationPopup.value = false
      }
    }
    const initializeRequest = async (query) => {
      store.dispatch(DiscountsActionTypes.GET_ALL_DISCOUNTCARS, { companyId: compId, query: query })
      await store.dispatch(ActionTypes.GET_CAR_BRANDS_MODELS)
    }
    const initializeFilters = async (query) => {
      if (query.brand) {
        selectBrand(query.brand, true)
        if (query.model) {
          selectModel(query.model, true)
          if (query.level) selectLevel(query.level, true)
        }
      }
      if (query.discount) {
        filtersChecks[1].value = true
      }
    }
    watch(
      () => store.state.options.searchString,
      () => {
        if (route.query.brand && !store.state.options.searchString) {
          selectBrand('', false)
          delete route.query.brand
        }
      }
    )
    watch(
      () => store.state.options.searchModels,
      () => {
        if (route.query.model && !store.state.options.searchModels) {
          selectModel('', false)
          delete route.query.model
        }
      }
    )
    watch(
      () => store.state.options.searchLevels,
      () => {
        if (route.query.level && !store.state.options.searchLevels) selectLevel('', false)
      }
    )

    watch(
      () => route.query,
      () => {
        if (route.name == 'Discount') {
          initializeRequest(route.query)
          if (route.query.discount == 'undefined') filtersChecks[1].value = true
          else filtersChecks[1].value = false
        }
      }
    )
    onMounted(async () => {
      await initializeRequest(route.query)
      await initializeFilters(route.query)
    })
    onUnmounted(() => {
      store.commit(MutationTypes.SET_SEARCH_STRING, '')
      store.commit(MutationTypes.SET_SEARCH_MODELS, '')
      store.commit(MutationTypes.SET_SEARCH_LEVELS, '')
    })
    watch(
      () => getCarBrandsDiscount.value,
      () => {
        filterDiscountData()
      }
    )

    return {
      searchBy,
      filterData,
      filtersChecks,
      componentKey,
      filteredBrands,
      filteredModels,
      filteredLevels,
      models,
      versions,
      selectedBrand,
      selectedModel,
      selectedLevel,
      selectModel,
      selectBrand,
      selectLevel,
      loader,
      carHeadings,
      getCarBrandsDiscount,
      companyDetailState,
      showInputBox,
      roles,
      selectedNodes,
      tmpDiscount,
      showPopUp,
      showConfirmationPopup,
      haveResetConfirmationPopup,
      onInputSearch,
      onEnterSearch,
      onCheckDriverBenefit,
      filterWithoutDiscount,
      sortIcon,
      sortBy,
      selectAllCheckbox,
      onNodeExpand,
      onToggleCheckbox,
      onShowDiscountInput,
      saveDiscountInput,
      onDiscountInputChange,
      haveConfirmationPopup,
      showEditPopup,
      onEditDiscountSave,
      deleteDiscount,
      saveDiscount,
      onRemoveDiscount
    }
  },
  components: {
    Input,
    InputElement,
    Loader,
    Checkbox,
    Dropdown,
    MessageBar,
    HierarchyRow,
    Popup,
    Button,
    PopupElement
  }
})
</script>
<style lang="sass" scoped>
@import 'sass/all.sass'
@import 'sass/mixins.sass'
.filters-wrap
  @media screen and (max-width: $xsBreakpoint)
    flex-direction: column
.discount-wrap
   height: 100%
   @media screen and (max-width: $xlBreakpoint)
     width: 92vw
   .listing-wrap
    @media screen and (max-width: $xlBreakpoint)
      overflow-x: scroll
      padding-bottom: 3em
      &::-webkit-scrollbar
        width: 1px
        height: 5px
      &::-webkit-scrollbar-thumb
        background: $colorHubble
        border-radius: 5px
      &::-webkit-scrollbar-track
        background: $colorHubbleGreyLines
        border-radius: 5px
      .sub-wrap
        width: 1500px
   @media screen and (max-width: $mdBreakpoint)
     padding: 15px 15px 0 15px
   .discount-heading-wrap
    display: flex
    justify-content: space-between
    @media screen and (max-width: $mdBreakpoint)
      align-items: center
    h1
      color: $colorHubble
      margin: 0
      @media screen and (max-width: $mdBreakpoint)
        font-size: 20px
    button
      padding: 0.9em 1.5em 0.9em 1em
      @media screen and (max-width: $mdBreakpoint)
        padding: 0.7em 1em 0.7em 0.5em
    .toggle-down
      @include backgroundImage('toggle-down.svg')
      width: 29px
      height: 29px
      background-color: $colorHubbleButtonGrey
      border-radius: 100%
      margin-right: 9px
      background-size: 10px
    .toggle-up
      @include backgroundImage('toggle-up.svg')
      background-color: $colorHubbleButtonGrey
   .discount-details-wrap
      background: #fff
      box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
      border-radius: 10px
      padding: 3.3em 2em 4em
      margin: 1.5em 0
      @media screen and (max-width: $mdBreakpoint)
        background: none
        box-shadow: none
        border-radius: 0
        padding: 0
      .filters-main-wrap, .listing-main-wrap
        @media screen and (max-width: $mdBreakpoint)
          background: #fff
          box-shadow: 10px 10px 30px rgba(44, 0, 171, 0.07)
          border-radius: 10px
      .filters-main-wrap
        @media screen and (max-width: $mdBreakpoint)
          margin: 2em 0 3em
          padding: 3.3em 2em 4em
      .search-filters-wrap
        display: flex
        align-items: flex-end
        @media screen and (max-width: $xlBreakpoint)
          flex-direction: column
          align-items: flex-start
        .search-wrap
          width: 50%
          margin-right: 3em
          position: relative
          @media screen and (max-width: $xlBreakpoint)
            width: 100%
        .filters-wrap
           flex: 1
           display: flex
           align-items: flex-end
           margin-right: 7em
           margin-top: 10px
           @media screen and (max-width: $xlBreakpoint)
              margin: 2em 0 0
              width: 100%
              flex-wrap: wrap
           .dropdown
             margin-right: 3em
             @media screen and (max-width: $xsBreakpoint)
              width: 100%
              margin: 0 0 1.5em 0
             &:first-child
                margin-right: 3em
                @media screen and (max-width: $xsBreakpoint)
                  margin-right: 0
             &:last-child
                margin-left: 0
      .box-filters
        margin: 1em 0.7em
        .add-filters
          margin-right: 2rem
          font-size: 14px
        .outer-wrap
          width: 21%
          &:last-child
            width: 25%
            span
              font-size: 14px
          .model-dropdown
            opacity: 0.3
            pointer-events: none
          .enable
            opacity: 1
            pointer-events: visible
          @media screen and (max-width: $xsBreakpoint)
            width: 100%
      .main-checkbox-wrap
        padding: 2.3em 0
        border-bottom: 1px solid $colorHubbleGreyLines
        div
          display: inline-block
        span
          font-size: 14px
      .selection-wrap
        font-size: 14px
        margin: 2em 0 0
        display: flex
        align-items: center
        @media screen and (max-width: $mdBreakpoint)
          padding: 0 1em 0
        span
          font-size: 14px
          margin: 0 0.4em
          &:last-child
            margin-right: 0
        span.editText
          color: $colorHubble
          cursor: pointer
        span.disableEditText
          color: $colorHubbleGreyIcons
        span.divider
          margin: 0
          color: $colorHubbleGreyLines
        &:after
          content: ''
          border-bottom: 1px solid $colorHubbleGreyLines
          width: 73%
          margin-left: 1em
.discount-listing
  display: flex
  flex-direction: column
  margin: 1.6em 0 0
  .headings-wrap
     display: flex
     color: $colorWhite
     .heading
       font-size: 14px
       display: flex
       align-items: center
       background-color: $colorHubbleDarkBlue
       padding: 0.8em 2.5em
       width: 40%
       &:first-child
          width: 60%
          padding-left: 3.5em
       &:first-of-type
        position: sticky
        left: 0
        @media screen and (max-width: $xlBreakpoint)
          max-width: 130px
          border-right: 1px solid $colorHubbleGreyLines
        .checkbox-wrap
          flex: 0
          .inner-block
            padding: 0
            input[type="checkbox"] + label:before
              padding: 0
              position: relative
       .sorting-icon
          display: flex
          cursor: pointer
          &:after
            content: ""
            width: 10px
            height: 19px
            margin-right: 5px
          &.default-icon
            &:after
              @include backgroundImage('sort-table.svg')
          &.sort-asc
            &:after
              @include backgroundImage('sort-asc.svg')
          &.sort-desc
            &:after
              @include backgroundImage('sort-desc.svg')
  .details-wrap
    display: flex
    flex-direction: column
    text-transform: capitalize
    .not-found-block
      display: flex
      justify-content: center
      h2
        font-weight: normal
        font-size: 18px
        margin: 3em
    .detail
      @media screen and (min-width: $xlBreakpoint)
        padding: 0.4em 0
.loader-block, .error-message-block
  display: flex
  justify-content: center
.error-message-block
  height: 50vh
  padding: 0 15px !important
  text-align: center
  h3
    font-size: 18px
    margin: auto
.selectionPopup
  .popup-content
    display: flex
    flex-direction: column
    padding: 3.2em
    .popup-header
      margin-top: 2.5rem
      .title
        color: $colorHubble
        font-weight: 700
        padding: 0.5em 0
        border-bottom: 1px solid $colorHubbleGreyLines
    .popup-body
      display: flex
      padding-top: 3em
      padding-bottom: 5em
      .popup-light
        margin-left: 15px
    .discount-popup-buttons
      width: 45%
      margin: auto
      padding: 0.8em 1.4em
</style>
