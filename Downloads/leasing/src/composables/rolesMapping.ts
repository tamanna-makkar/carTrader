export default function rolesMapping(roles: string[]) {
    const rolesValue = {
        'ROLE_COMPANY_ADMIN': 2,
        'ROLE_CLIENT': 3,
        'ROLE_EMPLOYEE': 4
    }
    const mappedRoles = roles.filter(e => e != 'ROLE_USER').map((e) => {
        return rolesValue[e]
    })
    return mappedRoles
}