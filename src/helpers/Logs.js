import axiosWithToken from "./axiosWithToken";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

export const reqGetLogs = (selectedDate) => {
    return new Promise((resolve, reject) => {

        axiosWithToken.get(`${Settings.API}/logs/${selectedDate}`)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}