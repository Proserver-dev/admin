import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";
import axios from "axios";
import axiosWithToken from "./axiosWithToken";

export const reqGetRoles = () => {
    return axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_ROLES}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}

export const reqAddRole = (data) => {
    if (!data.name) {
        return Promise.reject({ message: "Musisz wprowadzić nazwę roli" });
    }

    return axiosWithToken.post(`${Settings.API}${ApiEndpoints.POST_ROLE}`, data)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}