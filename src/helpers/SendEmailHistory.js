import axiosWithToken from "./axiosWithToken";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

export const getSendEmailHistory = (limit, offset) => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                limit: limit,
                offset: offset
            }
        }

        axiosWithToken.get(Settings.API + ApiEndpoints.GET_SEND_EMAIL_HISTORY, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}