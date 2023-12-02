import Settings from "../../constants/Settings";
import ApiEndpoints from "../../constants/ApiEndpoints";
import axios from "axios";
import axiosWithToken from "../axiosWithToken";

export const reqGetRoles = () => {
    return axiosWithToken.get(`${Settings.API}${ApiEndpoints.ROLES}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}

export const reqAddRole = (name) => {
    if (!name) {
        return Promise.reject({ response: { data: { error: "APP_ERR_PROVIDE_NAME_ROLE" }}});
    }

    return axiosWithToken.post(`${Settings.API}${ApiEndpoints.ROLES}`, { name: name })
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}

export const reqUpdateRole = (roleId, name) => {
    if (!roleId || !name) {
        return Promise.reject({ response: { data: { error: "APP_ERR_PROVIDE_ID_AND_NEW_NAME_ROLE" }}});
    }

    const queryParams = new URLSearchParams({ name: name });

    return axiosWithToken.put(`${Settings.API}${ApiEndpoints.ROLES}/${roleId}?${queryParams.toString()}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}

export const reqDeleteRole = (roleId) => {
    if (!roleId) {
        return Promise.reject({ response: { data: { error: "APP_ERR_PROVIDE_ID_ROLE_TO_DELETE" }}});
    }

    return axiosWithToken.delete(`${Settings.API}${ApiEndpoints.ROLES}/${roleId}`)
        .then(res => res.data)
        .catch(err => Promise.reject(err));
}