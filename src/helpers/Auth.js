import axios from "axios";
import store from '../redux/store';
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import ApiEndpoints from "../constants/ApiEndpoints";
import LocalStorageKeys from "../constants/LocalStorageKeys";
import prepareSnackBarErrorObj from "./prepareSnackBarErrorObj";
import {setSnackBar} from "../redux/actions";
import axiosWithToken from "./axiosWithToken";
import ApiResults from "../constants/ApiResults";

export const getLoginToken = () => {
    return localStorage.getItem(LocalStorageKeys.LOGIN_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
};

export const handleTokenRefreshError = (error) => {
    store.dispatch({ type: 'SHOW_SPINNER' });
    reqUserTryToLogout()
        .then(res => {
            store.dispatch(setSnackBar(prepareSnackBarErrorObj(error)));
        })
        .catch(err => {
            store.dispatch(setSnackBar(prepareSnackBarErrorObj(err)));
        })
        .finally(() => {
            store.dispatch({ type: 'DISCONNECT_SOCKET' });
            store.dispatch({ type: 'LOGOUT_CURRENT_USER' });
            localStorage.clear();
            store.dispatch({ type: 'HIDE_SPINNER' });
        })
};

export const reqAuthenticate = (data) => {

    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password)
            error = {message: "Musisz wprowadzić e-mail i hasło"};
        else if (!validateEmail(data.email))
            error = {message: "Wprowadzony adres e-mail jest nieprawidłowy"};


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
                reject({message: "Nie masz do tego uprawnień"});
            }
        }).catch(err => {
            reject(err);
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
            .catch(err => reject(err));
    });
}

export const reqUserLogout = () => {

    return new Promise((resolve, reject) => {
        axiosWithToken.post(Settings.API + ApiEndpoints.POST_AUTH_LOGOUT, {})
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err)
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
                reject(err)
            });
    });
}