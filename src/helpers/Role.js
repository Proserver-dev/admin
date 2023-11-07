import LocalStorageKeys from "../constants/LocalStorageKeys";
import {getLoginToken} from "./Auth";
import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";
import ApiResults from "../constants/ApiResults";

export const getRoles = () => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            }
        }

        axios.get(Settings.API + ApiEndpoints.ROLES, config).then((response) => {
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

export const addRole = (data) => {
    return new Promise((resolve, reject) => {

        let error = null;
        if (!data.name)
            error = { message: "Musisz wprowadzić nazwę roli" };

        if (error) {
            reject(error);
            return;
        }

        const config = {
            headers: {
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            }
        }

        axios.post(Settings.API + ApiEndpoints.ROLES, data, config).then((response) => {
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