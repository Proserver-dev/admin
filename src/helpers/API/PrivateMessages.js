import axiosWithToken from "../axiosWithToken";
import Settings from "../../constants/Settings";
import ApiEndpoints from "../../constants/ApiEndpoints";

export const reqGetPrivateMessages = (userId, limit, offset) => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                limit: limit,
                offset: offset,
            }
        }

        axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_PRIVATE_MESSAGES}/${userId}`, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqPostPrivateMessage = (userId, message, attachments = []) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();

        formData.append('message', message);

        attachments.forEach((attachment, index) => {
            formData.append(`attachments[${index}]`, attachment);
        });

        axiosWithToken.post(`${Settings.API}${ApiEndpoints.POST_PRIVATE_MESSAGE}/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}

export const reqGetActiveContacts = (limit, offset) => {
    return new Promise((resolve, reject) => {

        const config = {
            params: {
                limit: limit,
                offset: offset,
            }
        }

        axiosWithToken.get(`${Settings.API}${ApiEndpoints.GET_ACTIVE_CONTACTS}`, config)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    });
}