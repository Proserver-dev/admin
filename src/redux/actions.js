export const setLoginToken = (token) => ({
    type: 'SET_LOGIN_TOKEN',
    payload: token,
});

export const setCurrentUser = (user) => ({
    type: 'SET_CURRENT_USER',
    payload: user,
});

export const setSnackBar = (snackBar) => ({
    type: 'SET_SNACK_BAR',
    payload: snackBar,
});

export const showSpinner = () => ({
    type: 'SHOW_SPINNER',
    payload: true,
});

export const hideSpinner = () => ({
    type: 'HIDE_SPINNER',
    payload: false,
});

export const setSocket = (socket) => ({
    type: 'SET_SOCKET',
    payload: socket,
});

export const connectSocket = () => ({
    type: 'CONNECT_SOCKET',
});
export const disconnectSocket = () => ({
    type: 'DISCONNECT_SOCKET'
});

export const emitSocketEvent = (event, data) => ({
    type: 'EMIT_SOCKET_EVENT',
    payload: { event, data },
});