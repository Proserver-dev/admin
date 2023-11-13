import axiosWithToken from "./axiosWithToken";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

export const reqGetApiResults = () => {
    return axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_API_RESULTS}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}
export const reqGetAppConfigs = () => {
    return axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_APP_CONFIG}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}

export const reqPutAppConfigs = (data) => {
    const queryParams = new URLSearchParams(data);

    return axiosWithToken.put(`${Settings.API}${ApiEndpoints.GET_APP_CONFIG}?${queryParams.toString()}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}