import Settings from "../../constants/Settings";
import ApiEndpoints from "../../constants/ApiEndpoints";
import axios from "axios";
import axiosWithToken from "../axiosWithToken";

export const reqGetMe = () => {
    return new Promise((resolve, reject) => {

        axiosWithToken.get(Settings.API + ApiEndpoints.GET_USERS_ME)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqGetUsers = (limit, offset, searchTerm) => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                limit: limit,
                offset: offset,
                keywords: searchTerm
            }
        }

        axiosWithToken.get(Settings.API + ApiEndpoints.GET_USERS, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqGetOneUser = (userId) => {
    return new Promise((resolve, reject) => {

        axiosWithToken.get(Settings.API + `${ApiEndpoints.GET_USERS}/${userId}`, {})
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqPostChangeUserRole = (userId, roleId) => {
    return new Promise((resolve, reject) => {

        const data = {
            roleId: roleId
        }

        axiosWithToken.post(`${Settings.API}${ApiEndpoints.POST_CHANGE_USER_ROLE}/${userId}`, data)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqGetAuthHistory = (userId, limit, offset, type = '') => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                userId: userId,
                limit: limit,
                offset: offset,
                type: type
            }
        }

        axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_AUTH_HISTORY}`, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqPostChangePasswordUser = (userId, password) => {
    return new Promise((resolve, reject) => {

        const data = {
            password: password
        }

        axiosWithToken.post(`${Settings.API}${ApiEndpoints.POST_CHANGE_PASSWORD_USER}/${userId}`, data)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqDeleteUser = (userId) => {
    return new Promise((resolve, reject) => {

        axiosWithToken.delete(`${Settings.API}${ApiEndpoints.DELETE_USER}/${userId}`)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}