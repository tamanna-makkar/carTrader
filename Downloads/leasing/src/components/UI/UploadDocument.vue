<template>
  <div class="main-wrap">
    <div v-if="!fileDetails['fileName']" class="upload-document-wrap">
      <input
        data-v-b16d5354=""
        type="file"
        name="document"
        @change="fileChange"
        accept=".pdf,.csv,.xls,.xlsx"
        class="input-file"
      />
      <div class="text-section">
        <p> {{ $t('_carPolicy.DragFilesToUpload') }} </p>
        <p>or</p>
        <Button :text="$t('_generalTerms.selectFile')" buttonType="dark" />
      </div>
    </div>
    <div v-else class="uploaded-document">
      <div class="file-name">
        <span class="file-icon"></span>
        <p>{{ fileDetails['fileName'] }}</p>
      </div>
      <Button :text="$t('_generalTerms.delete')" buttonType="light close--left" @onClick="deleteFile" />
    </div>
  </div>
</template>
<script lang="ts">
import Button from '@/components/UI/Button.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    Button
  },
  props: {
    fileDetails: {
      type: Object,
      default: () => ({
        file: {},
        fileName: ''
      })
    }
  },
  emits: ['fileChange', 'deleteFile'],
  setup(props, { emit }) {
    const fileChange = (event) => {
      const fileList = event.target.files
      emit('fileChange', fileList)
    }
    const deleteFile = () => {
      emit('deleteFile')
    }
    return { fileChange, deleteFile }
  }
})
</script>
<style lang="sass" scoped>
.upload-document-wrap
   background: $colorHubbleLightBackground
   border: 2px dashed $colorHubbleGreyIcons
   position: relative
   border-radius: 5px
   input
      position: absolute
      width: 100%
      left: 0
      right: 0
      height: 100%
      opacity: 0
      cursor: pointer
   .text-section
      display: flex
      flex-direction: column
      align-items: center
      padding: 3em 0
   p
      color: $colorHubbleDarkGrey
      font-size: 16px
      margin-bottom: 0.6em
      line-height: normal
      @media screen and (max-width: $xsBreakpoint)
         font-size: 14px
.uploaded-document
   background: $colorHubbleLightBackground
   display: flex
   justify-content: space-between
   padding: 3.1em
   border-radius: 5px
   @media screen and (max-width: $xsBreakpoint)
      padding: 15px
      flex-direction: column
   .file-name
      display: flex
      align-items: center
      @media screen and (max-width: $xsBreakpoint)
         margin-bottom: 15px
      .file-icon
         @include backgroundImage('document.svg')
         width: 32px
         height: 35px
         background-size: contain
      p
         margin-left: 1em
         color: $colorHubbleDarkGrey
</style>