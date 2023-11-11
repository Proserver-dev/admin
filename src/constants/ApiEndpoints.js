const ApiEndpoints = {
    POST_AUTH_LOGIN: '/auth/login',
    POST_AUTH_LOGOUT: '/auth/logout',
    GET_AUTH_REFRESH: '/auth/refresh',

    GET_USERS_ME: '/users/me',
    GET_USERS: '/users',

    GET_ROLES: '/roles',
    GET_ROLE: '/roles/', // :id
    POST_ROLE: '/roles',
    PUT_ROLE: '/roles/', // :id
    DELETE_ROLE: '/roles/', // :id

    GET_MESSAGES_TO_ALL: '/messages-to-all',

    GET_LOGS: '/logs/', // :name

    GET_API_RESULTS: '/api-results',
}

export default ApiEndpoints;