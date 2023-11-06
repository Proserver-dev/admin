import axios from "axios";
import Settings from "../constants/Settings";
import validateEmail from "./validateEmail";
import ApiEndpoints from "../constants/ApiEndpoints";
import ApiResults from "../constants/ApiResults";

export const getLoginToken = () => {
    return localStorage.getItem("loginToken");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

export const setLogOut = () => {
    localStorage.clear();
}

export const authenticate = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.email || !data.password)
            error = "Musisz wprowadzić e-mail i hasło";
        else if (!validateEmail(data.email))
            error = "Wprowadzony adres e-mail jest nieprawidłowy";


        if (error) {
            reject(error);
            return;
        }

        axios.post(Settings.API + ApiEndpoints.LOGIN, data).then((response) => {
            if(response.data.user.role.short === "admin") {
                localStorage.setItem("loginToken", response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                resolve(response.data);
            } else {
                reject("Nie masz do tego uprawnień");
            }
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
                if(ApiResults[message]) {
                    message = ApiResults[message]
                }
            }
            reject(message);
        });
    });
}