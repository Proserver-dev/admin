import validateEmail from "./validateEmail";
import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";
import LocalStorageKeys from "../constants/LocalStorageKeys";
import ApiResults from "../constants/ApiResults";
import {getLoginToken} from "./Auth";

export const getMe = () => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                [LocalStorageKeys.LOGIN_TOKEN]: getLoginToken()
            }
        }

        axios.get(Settings.API + ApiEndpoints.GET_ME, config).then((response) => {
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