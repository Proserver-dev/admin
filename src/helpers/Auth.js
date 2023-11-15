import axios from "axios";
import store from '../redux/store';
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import ApiEndpoints from "../constants/ApiEndpoints";
import LocalStorageKeys from "../constants/LocalStorageKeys";
import {setSnackBar} from "../redux/actions";
import axiosWithToken from "./axiosWithToken";
import {translate} from "./i18n";

export const getLoginToken = () => {
    return localStorage.getItem(LocalStorageKeys.LOGIN_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
};

export const handleTokenRefreshError = (error) => {
    store.dispatch({ type: 'DISCONNECT_SOCKET' });
    store.dispatch({ type: 'LOGOUT_CURRENT_USER' });
    localStorage.clear();

    /*
    store.dispatch({ type: 'SHOW_SPINNER' });
    reqUserTryToLogout()
        .then(res => {
            const message = translate(error?.response?.data?.error) || error?.response?.data?.error || translate("ERR_UNKNOWN")
            store.dispatch(setSnackBar({ type: 'error', message: message, show: true }));
        })
        .catch(err => {
            const message = translate(err?.response?.data?.error) || err?.response?.data?.error || translate("ERR_UNKNOWN")
            store.dispatch(setSnackBar({ type: 'error', message: message, show: true }));
        })
        .finally(() => {
            store.dispatch({ type: 'DISCONNECT_SOCKET' });
            store.dispatch({ type: 'LOGOUT_CURRENT_USER' });
            localStorage.clear();
            store.dispatch({ type: 'HIDE_SPINNER' });
        })

     */
};

export const reqAuthenticate = (data) => {

    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password)
            error = { error: "ERR_PROVIDE_LOGIN_DATA" };
        else if (!validateEmail(data.email))
            error = { error: "ERR_INVALID_EMAIL_ADDRESS" };


        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.POST_AUTH_LOGIN, data).then(res => {
            if (res.data.user.role.short === "admin") {
                localStorage.setItem(LocalStorageKeys.LOGIN_TOKEN, res.data.token);
                localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, res.data.refreshToken);
                resolve(res.data);
            } else {
                reject({ error: "ERR_ADMIN_PRIVILEGES_REQUIRED"} );
            }
        }).catch(err => {
            reject(err.response.data);
        });
    });
}

export const reqRefreshLoginToken = () => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.REFRESH_TOKEN]: getRefreshToken(),
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            }
        }

        axios.get(Settings.API + ApiEndpoints.GET_AUTH_REFRESH, config)
            .then(res => {
                localStorage.setItem(LocalStorageKeys.LOGIN_TOKEN, res.data.token);
                resolve(res.data.token)
            })
            .catch(err => {
                reject(err)
            });
    });
}

export const reqUserLogout = () => {

    return new Promise((resolve, reject) => {
        axiosWithToken.post(Settings.API + ApiEndpoints.POST_AUTH_LOGOUT, {})
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response.data)
            });
    });
}

export const reqUserTryToLogout = () => {

    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            }
        }

        axios.post(Settings.API + ApiEndpoints.POST_AUTH_LOGOUT, {}, config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response.data)
            });
    });
}