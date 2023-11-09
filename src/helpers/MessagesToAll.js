import LocalStorageKeys from "../constants/LocalStorageKeys";
import {getLoginToken} from "./Auth";
import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";
import ApiResults from "../constants/ApiResults";

export const getMessagesToAll = (limit, offset) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            },
            params: {
                limit: limit,
                offset: offset
            }
        }

        axios.get(Settings.API + ApiEndpoints.MESSAGES_TO_ALL, config).then((response) => {
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