import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { VueCookieNext } from 'vue-cookie-next'
import { store } from '@/store'
import { AuthActionTypes } from '@/store/auth/actions'
import { USER_STATUS } from '@/composables/staticValues'
import toLowerCase from '@/filters/toLowerCase'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/employees',
        name: 'Employees',
        meta: { auth: true, companyAdmin: true },
        component: () => import(/* webpackChunkName: "Employees" */ '@/views/Employees.vue'),
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({
                    name: 'Employees',
                    query: { page: 1 }
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/companies',
        name: 'Companies',
        meta: { auth: true, superAdmin: true },
        component: () => import(/* webpackChunkName: "Companies" */ '@/views/SuperAdmin/Companies.vue'),
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({
                    name: 'Companies',
                    query: { page: 1 }
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/company',
        name: 'Company',
        component: () => import(/* webpackChunkName: "Company" */ '@/components/superAdminCompany.vue'),
        meta: { auth: true, superAdmin: true },
    },
    {
        path: '/company/:id',
        name: 'superAdminCompanyDetails',
        component: () => import(/* webpackChunkName: "Company" */ '@/components/superAdminUpdate.vue'),
        meta: { auth: true, superAdmin: true },
    },
    {
        path: '/external-data',
        name: 'externalData',
        component: () => import(/* webpackChunkName: "ExternalData" */ '@/views/SuperAdmin/ExternalData.vue'),
        meta: { auth: true, superAdmin: true },
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({
                    name: 'externalData',
                    query: { page: 1 }
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/tax-settings',
        name: 'taxSettings',
        component: () => import(/* webpackChunkName: "TaxSettings" */ '@/views/SuperAdmin/TaxSettings.vue'),
        meta: { auth: true, superAdmin: true },
        beforeEnter: (to, from, next) => {
            if (!to.query.year) {
                next({
                    name: 'taxSettings',
                    query: { year: new Date().getFullYear() }
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/orders',
        name: 'Orders',
        meta: { auth: true, superAdmin: true },
        component: () => import(/* webpackChunkName: "Orders" */ '@/views/SuperAdmin/Orders.vue'),
        beforeEnter: (to, from, next) => {
            if (!to.query.page) {
                next({
                    name: 'Orders',
                    query: { page: 1 }
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/carselector/step1',
        name: 'Step1',
        meta: { auth: true, carPolicy: true, companyAdmin: false },
        component: () => import(/* webpackChunkName: "Step1" */ '@/views/Step1.vue')
    },
    {
        path: '/carselector/step1/wizard',
        name: 'step1Wizard',
        meta: { auth: true, carPolicy: true, companyAdmin: false },
        component: () => import(/* webpackChunkName: "Step1Wizards" */ '@/views/wizards.vue')
    },
    {
        path: '/carselector/step2',
        name: 'Step2',
        props: true,
        meta: { auth: true, carPolicy: true, companyAdmin: false, scrollBehavior: true },
        component: () => import(/* webpackChunkName: "Step2" */ '@/views/Step2.vue')
    },
    {
        path: '/carselector/step3/:vehicleId/:carOrderId?',
        name: 'Step3',
        meta: { auth: true, carPolicy: true, carOrderedStatus: true, companyAdmin: false },
        component: () => import(/* webpackChunkName: "Step3" */ '@/views/Step3.vue')
    },
    {
        path: '/carselector/step4/:vehicleId',
        name: 'Step4',
        meta: { auth: true, carPolicy: true, companyAdmin: false },
        component: () => import(/* webpackChunkName: "Step4" */ '@/views/Step4.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: { auth: false },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue')
    },
    {
        path: '/reset/password/:email/:activationKey',
        name: 'resetPassword',
        meta: { auth: false },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/resetPassword.vue')
    },
    {
        path: '/company-details',
        name: 'companyDetails',
        meta: { auth: true, companyAdmin: true },
        component: () => import(/* webpackChunkName: "CompanyDetails" */ '@/views/CompanyDetails.vue')
    },
    {
        path: '/profile/:tab?',
        name: 'UserProfile',
        meta: { auth: true },
        component: () => import(/* webpackChunkName: "UserProfile" */ '@/views/UserProfile.vue')
    },
    {
        path: '/lease-categories',
        name: 'LeaseCategoryOverview',
        meta: { auth: true, companyAdmin: true },
        component: () => import(/* webpackChunkName: "LeaseCategoryOverview" */ '@/views/LeaseCategoryOverview.vue')
    },
    {
        path: '/lease-category/:id?',
        name: 'LeaseCategory',
        meta: { auth: true, companyAdmin: true, client: true },
        component: () => import(/* webpackChunkName: "LeaseCategory" */ '@/components/LeaseCategory.vue')
    },
    {
        path: '/car-policies',
        name: 'CarPolicyOverview',
        meta: { auth: true, companyAdmin: true },
        component: () => import(/* webpackChunkName: "CarPolicyOverview" */ '@/components/CarPolicyOverview.vue')
    },
    {
        path: '/car-policy/:id?',
        name: 'carPolicy',
        meta: { auth: true, companyAdmin: true, client: true },
        component: () => import(/* webpackChunkName: "CarPolicy" */ '@/views/CarPolicy.vue')
    },
    {
        path: '/',
        name: 'Dashboard',
        meta: { auth: true, companyAdmin: false, superAdmin: false },
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/UserDashboard.vue')
    },
    {
        path: '/employee/:id?',
        name: 'Employee',
        component: () => import(/* webpackChunkName: "Employee" */ '@/components/employee.vue'),
        meta: { auth: true, companyAdmin: true }
    },
    {
        path: '/compare-cars',
        name: 'CompareCars',
        component: () => import(/* webpackChunkName: "CompareCars" */ '@/views/CompareCars.vue'),
        meta: { auth: true, companyAdmin: false },
        beforeEnter: (to, from, next) => {
            if (to.query.id) {
                next()
            } else {
                next({
                    name: 'Dashboard'
                })
            }
        }
    },
    {
        path: '/discount',
        name: 'Discount',
        meta: { auth: true, companyAdmin: true, client: true },
        component: () => import(/* webpackChunkName: "LeaseCategory" */ '@/views/Discount.vue'),
    },
    {
        path: '/error',
        name: 'ErrorPage',
        component: () => import(/* webpackChunkName: "ErrorPage" */ '@/views/ErrorPage.vue'),
    },
    {
        path: '/:catchAll(.*)',
        component: () => import(/* webpackChunkName: "NotFoundPage" */ '@/components/NotFoundPage.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve) => {
            if (savedPosition && to.meta.scrollBehavior && from.params.vehicleId) {
                store.state.wizardSteps.backButtonPressed = true
            } else {
                store.state.wizardSteps.backButtonPressed = false
                resolve({ left: 0, top: 0, behavior: 'smooth' })
            }
        })
    }
})

router.beforeEach(async (to, from, next) => {
    const isAccessToken = store.state.auth.accessToken
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    const carPolicy = VueCookieNext.isCookieAvailable('employeeCarPolicyId')
    if (to.meta.auth) {
        if (isLoggedIn) {
            if (!isAccessToken) {
                await store.dispatch(AuthActionTypes.REFRESH_TOKEN)
            }
            const roles = VueCookieNext.getCookie('roles')
            const userStatus = VueCookieNext.getCookie('status')
            const comboRoles = (roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_CLIENT')) && roles.includes('ROLE_EMPLOYEE') ? true : false
            if (to.meta.companyAdmin === false && (roles.includes('ROLE_COMPANY_ADMIN') || roles.includes('ROLE_CLIENT')) && !comboRoles) {
                next({ name: 'Employees' })
            } if (to.meta.client === true && roles.includes('ROLE_CLIENT') && !roles.includes('ROLE_COMPANY_ADMIN')) {
                next({ name: 'Employees' })
            } if (to.meta.superAdmin == true && !roles.includes('ROLE_SUPER_ADMIN') && !comboRoles) {
                next({ name: 'Dashboard' })
            } else if (to.meta.superAdmin == false && roles.includes('ROLE_SUPER_ADMIN') && !comboRoles) {
                next({ name: 'Companies' })
            } else if (to.meta.companyAdmin == true && roles.includes('ROLE_EMPLOYEE') && !comboRoles) {
                next({ name: 'Dashboard' })
            } else if (to.meta.carPolicy == true && to.meta.carOrderedStatus == true && toLowerCase(userStatus) == USER_STATUS.CAR_ORDERED && roles.includes('ROLE_EMPLOYEE') && !comboRoles) {
                next()
            } else if (to.meta.carPolicy == true && toLowerCase(userStatus) != USER_STATUS.SELECTOR_AVAILABLE && roles.includes('ROLE_EMPLOYEE') && !comboRoles) {
                next({ name: 'Dashboard' })
            } else if (to.meta.carPolicy && !carPolicy) {
                next({ path: "/" })
            } else {
                next()
            }
        }
        else {
            next({ path: "/login" });
        }
    }
    else {
        next()
    }
});

export default router
