import { computed, onMounted } from "vue"
import { VueCookieNext } from 'vue-cookie-next'
import { CompanyActionTypes } from '@/store/company/actions'
import { useStore } from '@/store'

export default function () {
    const store = useStore()
    const roles = VueCookieNext.getCookie('roles')
    const companyDetailState = computed(() => store.state.company.getCompanyById)
    const compId = (roles.includes('ROLE_SUPER_ADMIN') && VueCookieNext.getCookie('adminCompanyId') ) ? VueCookieNext.getCookie('adminCompanyId') : VueCookieNext.getCookie('companyId')
    onMounted(async () => {
        await store.dispatch(CompanyActionTypes.GET_COMPANYBYID, {companyId: compId})
    })
    return { compId, companyDetailState }
}