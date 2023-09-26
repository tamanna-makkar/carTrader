import { reactive } from 'vue'
export default function uploadDocument() {
    const fileDetails = reactive({
        file: {},
        fileName: ''
    })
    const fileChange = (fileList) => {
        if (fileList && fileList.length > 0) {
            fileDetails['file'] = fileList[0]
            fileDetails['fileName'] = fileList[0].name
        }
    }
    return {
        fileDetails, fileChange
    }
}