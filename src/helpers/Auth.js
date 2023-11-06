import axios from "axios";
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import ApiEndpoints from "../constants/ApiEndpoints";
import ApiResults from "../constants/ApiResults";
import LocalStorageKeys from "../constants/LocalStorageKeys";

export const getLoginToken = () => {
    return localStorage.getItem(LocalStorageKeys.LOGIN_TOKEN);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
};

export const setLogOut = () => {
    localStorage.clear();
}

export const authenticate = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password)
            error = { message: "Musisz wprowadzić e-mail i hasło" };
        else if (!validateEmail(data.email))
            error = { message: "Wprowadzony adres e-mail jest nieprawidłowy" };


        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.LOGIN, data).then((response) => {
            if(response.data.user.role.short === "admin") {
                localStorage.setItem(LocalStorageKeys.LOGIN_TOKEN, response.data.token);
                localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, response.data.refreshToken);
                resolve(response.data);
            } else {
                reject({ message: "Nie masz do tego uprawnień" });
            }
        }).catch((error) => {
            let err = { message: "Nie udało się połączyć z serwerem" };
            if (error.response && error.response.data.error) {
                if(ApiResults[error.response.data.error]) {
                    err = ApiResults[error.response.data.error]
                } else {
                    err = {
                        ...err,
                        code: error.response.data.error
                    }
                }
            }
            reject(err);
        });
    });
}

export const refreshLoginToken = () => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.REFRESH_TOKEN]: getRefreshToken()
            }
        }

        axios.get(Settings.API + ApiEndpoints.REFRESH_TOKEN, config).then((response) => {
            localStorage.setItem(LocalStorageKeys.LOGIN_TOKEN, response.data.token);
            resolve(response.data);
        }).catch((error) => {
            let err = { message: "Nie udało się połączyć z serwerem" };
            if (error.response && error.response.data.error) {
                if(ApiResults[error.response.data.error]) {
                    err = ApiResults[error.response.data.error]
                } else {
                    err = {
                        ...err,
                        code: error.response.data.error
                    }
                }
            }
            reject(err);
        });
    });

}