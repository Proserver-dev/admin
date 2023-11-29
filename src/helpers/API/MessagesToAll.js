import Settings from "../../constants/Settings";
import ApiEndpoints from "../../constants/ApiEndpoints";
import axios from "axios";
import axiosWithToken from "../axiosWithToken";

export const getMessagesToAll = (limit, offset) => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                limit: limit,
                offset: offset
            }
        }

        axiosWithToken.get(Settings.API + ApiEndpoints.GET_MESSAGES_TO_ALL, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}