const ApiEndpoints = {
    POST_AUTH_LOGIN: '/auth/login',
    POST_AUTH_LOGOUT: '/auth/logout',
    GET_AUTH_REFRESH: '/auth/refresh',

    GET_USERS_ME: '/users/me',
    GET_USERS: '/users',
    GET_AUTH_HISTORY: '/admin/users/get-auth-history',

    GET_ROLES: '/roles',
    GET_ROLE: '/roles/', // :id
    POST_ROLE: '/roles',
    PUT_ROLE: '/roles/', // :id
    DELETE_ROLE: '/roles/', // :id

    GET_MESSAGES_TO_ALL: '/messages-to-all',

    GET_LOGS: '/logs/', // :name

    GET_API_RESULTS: '/api-results',
    GET_APP_CONFIG: '/admin/app-config',
    PUT_APP_CONFIG: '/admin/app-config',

    GET_SEND_EMAIL_HISTORY: '/admin/get-email-send-history',
}

export default ApiEndpoints;