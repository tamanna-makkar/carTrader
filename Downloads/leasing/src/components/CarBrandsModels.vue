<template>
  <div class="car-brands-models">
    <div class="dropdown-wrap">
      <div v-if="showPolicyBrandsModels" class="inner-dropdown-wrap">
        <div v-for="(item, index) in brandModelsArray" :key="index" class="main-wrap">
          <div class="wrap">
            <div class="brands-wrap">
              <label>{{ $t('_carPolicy.carBrand') }}</label>
              <div v-if="item['models'].length" class="selected-brand">
                <div>{{ item['brand'] }}</div>
              </div>
              <Dropdown
                v-else
                :items="getBrands"
                type="brandsModel-dropdown"
                :currentIndex="index"
                :selectedOption="item['brand'] ? item['brand'] : 'Car brand'"
                @onChange="selectCarPolicyBrand"
              />
            </div>
            <div class="models-wrap">
              <Dropdown
                class="model-dropdown"
                :class="{ enable: models[index] }"
                type="brandsModel-dropdown"
                :currentIndex="index"
                :items="models[index]"
                :selectedOption="selectedModel"
                :selectedModels="item['models']"
                @onChange="selectModel"
                :isMultiselect="true"
              />
              <Button
                :text="$t('_generalTerms.delete')"
                buttonType="light close--left"
                @onClick="deleteCarBrand(index)"
              />
            </div>
          </div>
          <div class="selected-models">
            <ul v-if="item['models'].length">
              <li v-for="(model, modelIndex) in item['models']" :key="modelIndex">
                {{ model }}
                <span class="remove-icon" @click="removeModel(model, index)"></span>
              </li>
              <li class="remove-all" @click="$emit('removeAllModels', index)">
                {{ $t('_carPolicy.deleteModels') }}
                <span class="remove-icon"></span>
              </li>
            </ul>
            <ul v-else>
              <li>
                {{ $t('_carPolicy.all') }} <i v-if="item['brand']">{{ item['brand'] }}</i> {{ $t('_carPolicy.models') }}
              </li>
            </ul>
          </div>
        </div>
        <div class="add-car-brand">
          <Button
            :text="$t('_carPolicy.addCarBrand')"
            buttonType="light add--left-dark"
            @onClick="$emit('addCarBrand')"
          />
        </div>
      </div>
      <div v-else>
        <div class="brands-wrap">
          <label>{{ $t('_carPolicy.carBrand') }}</label>
          <Dropdown
            :items="getBrands"
            type="brandsModel-dropdown"
            selectedOption="All"
            @onChange="selectCarPolicyBrand"
          />
        </div>
        <div class="info-wrap">
          <span class="info-icon"></span>
          <p>{{ $t('_carPolicy.brandsModelInfo') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import Dropdown from '@/components/UI/Dropdown.vue'
import Button from '@/components/UI/Button.vue'
export default defineComponent({
  emits: ['selectCarPolicyBrand', 'selectModel', 'removeModel', 'addCarBrand', 'removeAllModels', 'deleteCarBrand'],
  components: {
    Dropdown,
    Button
  },
  props: {
    models: {
      type: Array,
      default: () => []
    },
    brandModelsArray: {
      type: Array,
      default: () => []
    },
    showPolicyBrandsModels: {
      type: Boolean,
      default: false
    },
    getBrands: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const selectedModel = ref('Model')
    const selectModel = (model) => {
      emit('selectModel', model)
    }
    const selectCarPolicyBrand = (brandName) => {
      emit('selectCarPolicyBrand', brandName)
    }
    const removeModel = (model, index) => {
      emit('removeModel', { item: model, key: index })
    }
    const deleteCarBrand = (index) => {
      emit('deleteCarBrand', index)
    }
    return {
      selectModel,
      selectCarPolicyBrand,
      selectedModel,
      removeModel,
      deleteCarBrand
    }
  }
})
</script>
<style lang="sass" scoped>
.dropdown-wrap
  display: flex
  align-items: center
  .main-wrap
    margin-bottom: 4em
    border-bottom: 2px solid $colorHubbleGreyLines
    padding-bottom: 2em
  .add-car-brand
    width: 100%
    display: flex
    justify-content: center
    padding-bottom: 18em
    border-bottom: 2px solid $colorHubbleGreyLines
    button
      padding: 0.95em 1.5em
  .model-dropdown
    opacity: 0.3
    pointer-events: none
  .enable
    opacity: 1
    pointer-events: visible
  .inner-dropdown-wrap, .main-wrap
    display: flex
    flex-direction: column
    width: 100%
  .wrap
    display: flex
    flex: 1
    align-items: center
    @media screen and (max-width: $xsBreakpoint)
      flex-direction: column
  > div
    display: flex
    align-items: center
    flex: 1
    @media screen and (max-width: $xsBreakpoint)
      flex-direction: column
    .brands-wrap
      flex: 1.7
      margin-right: 2em
      position: relative
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
        margin-right: 0
        margin-bottom: 3em
      label
        font-size: 14px
        color: $colorHubbleDarkGrey
        position: absolute
        top: -24px
      .selected-brand
        position: relative
        div
          font-size: 15px
          background-color: $colorHubbleLightBackground
          padding: 0.45em
          border-radius: 5px
          text-transform: capitalize
    .models-wrap
      align-items: center
      @media screen and (max-width: $xsBreakpoint)
        width: 100%
    .models-wrap, .info-wrap
      display: flex
      flex: 3
    .info-wrap
      background: $colorHubbleLightBackground
      border-radius: 5px
      padding: 0.5em
      p
        font-size: 14px
        line-height: 22px
      span.info-icon
        @include backgroundImage('info-grey.svg')
        width: 2em
        height: 1.5em
        margin-right: 0.4em
        @media screen and (max-width: $xsBreakpoint)
          width: 3em
  ul
    display: flex
    flex-wrap: wrap
    padding: 0
    margin: 0.5em 0 0
    li
    &.remove-all
      background-color: $colorHubbleLightBackground
      border: none
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
      i
        text-transform: capitalize
        font-style: normal
        margin: 0 0.2em
</style>
