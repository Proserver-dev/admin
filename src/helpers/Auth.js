import axios from "axios";
import store from '../redux/store';
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import ApiEndpoints from "../constants/ApiEndpoints";
import LocalStorageKeys from "../constants/LocalStorageKeys";
import {setSnackBar} from "../redux/actions";
import axiosWithToken from "./axiosWithToken";

export const getLoginToken = () => {
    return localStorage.getItem(LocalStorageKeys.LOGIN_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
};

export const handleTokenRefreshError = (error) => {
    store.dispatch({ type: 'DISCONNECT_SOCKET' });
    store.dispatch({ type: 'LOGOUT_CURRENT_USER' });
};

export const reqAuthenticate = (data) => {
    const { email, password } = data;

    if (!email || !password) {
        return Promise.reject({
            response: { data: { error: "ERR_PROVIDE_LOGIN_DATA" }}
        });
    }

    if (!validateEmail(email)) {
        return Promise.reject({
            response: { data: { error: "ERR_INVALID_EMAIL_ADDRESS" }}
        });
    }

    return axios.post(`${Settings.API}${ApiEndpoints.POST_AUTH_LOGIN}`, data)
        .then(({ data: { user, token, refreshToken } }) => {
            if (user.role.short === "admin") {
                localStorage.setItem(LocalStorageKeys.LOGIN_TOKEN, token);
                localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
                return { token, refreshToken, user };
            } else {
                return Promise.reject({
                    response: { data: { error: "ERR_ADMIN_PRIVILEGES_REQUIRED" }}
                });
            }
        })
        .catch(err => Promise.reject(err));
};

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
                reject(err)
            });
    });
}