import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import socketIOClient from 'socket.io-client';
import thunk from 'redux-thunk';
import { getLoginToken } from '../helpers/Auth';
import Settings from "../constants/Settings";
import LocalStorageKeys from "../constants/LocalStorageKeys";

const initialState = {
    currentUser: { id: null },
    snackBar: { type: 'error', message: '', show: false },
    showSpinner: false,
    socket: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return { ...state, currentUser: action.payload };
        case 'LOGOUT_CURRENT_USER':
            return { ...state, currentUser: { id: null }};
        case 'SET_SNACK_BAR':
            return { ...state, snackBar: action.payload };
        case 'SHOW_SPINNER':
            return { ...state, showSpinner: true };
        case 'HIDE_SPINNER':
            return { ...state, showSpinner: false };
        case 'SET_SOCKET':
            return { ...state, socket: action.payload };
        case 'CONNECT_SOCKET':
            if (!state.socket) {
                const socket = socketIOClient(Settings.SOCKET , {
                    extraHeaders: {
                        [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken(), // state.loginToken może być czasem nieaktualny
                    },
                });
                return { ...state, socket };
            }
            return state;
        case 'DISCONNECT_SOCKET':
            if (state.socket) {
                state.socket.disconnect();
                return { ...state, socket: null };
            }
            return state;
        case 'EMIT_SOCKET_EVENT':
            // TODO: to nie specjalnie chce działać, jeśli w czasie działania aplikacji nie ma połączenia z socketem, to przy próbie wykonania emitu i tak go nie nawiąże w ten sposób
            if (!state.socket) {
                store.dispatch({ type: 'CONNECT_SOCKET' });
            }
            return state;
        default:
            return state;
    }
};

const socketMiddleware = (store) => (next) => (action) => {
    if (action.type === 'EMIT_SOCKET_EVENT') {
        const { event, data } = action.payload;
        store.getState().socket.emit(event, data);
    }
    return next(action);
};

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk, socketMiddleware)),
);

export default store;