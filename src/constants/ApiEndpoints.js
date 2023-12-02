const ApiEndpoints = {
    POST_AUTH_LOGIN: '/auth/login',
    POST_AUTH_LOGOUT: '/auth/logout',
    GET_AUTH_REFRESH: '/auth/refresh',

    GET_USERS_ME: '/users/me',
    GET_USERS: '/users',
    GET_AUTH_HISTORY: '/admin/users/get-auth-history',

    ROLES: '/roles', // GET, GET/:id, POST, PUT/:id, DELETE/:id

    GET_MESSAGES_TO_ALL: '/messages-to-all',

    GET_LOGS: '/logs/', // :name

    GET_API_RESULTS: '/api-results',
    GET_APP_CONFIG: '/admin/app-config',
    PUT_APP_CONFIG: '/admin/app-config',

    GET_SEND_EMAIL_HISTORY: '/admin/get-email-send-history',
    POST_CHANGE_USER_ROLE: '/admin/users/change-role', // POST/:userId
    POST_CHANGE_PASSWORD_USER: '/admin/users/change-password', // POST/:userId

    DELETE_USER: '/admin/users', // DELETE/:userId
    POST_CREATE_NEW_ACCOUNT: '/admin/users/create-new-account',
    PUT_CHANGE_USER_IS_ACTIVATED: '/admin/users/change-is-activated', // PUT/:userId

    GET_PRIVATE_MESSAGES: '/private-messages', // GET/:userId
    POST_PRIVATE_MESSAGE: '/private-messages', // POST/:userId
    GET_ACTIVE_CONTACTS: '/private-messages/get-active-contacts',
}

export default ApiEndpoints;