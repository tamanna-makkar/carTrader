import { ref, onMounted } from "vue"

export default function () {
    const windowWidth = ref(window.innerWidth)
    onMounted(() => {
        window.onresize = () => {
            windowWidth.value = window.innerWidth
        }
    })
    return { windowWidth }
}